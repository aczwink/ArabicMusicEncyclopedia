/**
 * ArabicMusicEncyclopedia
 * Copyright (C) 2026 Amir Czwink (amir130@hotmail.de)
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 * */

import { Injectable } from "@aczwink/acts-util-node";
import { NaturalNote, OctavePitch } from "@aczwink/openarabicmusicdb-domain/dist/OctavePitch";
import { MelodyEvent, MelodyEventType, SingleSectionSheetMusic } from "../model/SheetMusic";
import { NoteOrRest } from "../model/Note";
import { IntervalsService } from "./IntervalsService";
import { MaqamatController } from "../dataaccess/MaqamatController";
import { FullPitch } from "../model/FullPitch";
import { TimedChord } from "../model/Chord";

interface PitchMap
{
    sourcePitch: OctavePitch;
    targetPitch: OctavePitch;
}

interface TranspositionState
{
    pitchMap: PitchMap[];
    sourceKey: OctavePitch
    targetKey: OctavePitch;
}

@Injectable
export class SheetMusicTransposer
{
    constructor(private intervalsService: IntervalsService, private maqamatController: MaqamatController)
    {
    }

    //Public methods
    public async TransposeTo(data: SingleSectionSheetMusic, targetKey: OctavePitch): Promise<SingleSectionSheetMusic>
    {
        const state = {
            pitchMap: [],
            sourceKey: targetKey,
            targetKey
        };
        const melody = await this.TransposeEvents(data.melody, state);
        return {
            chords: this.TransposeChords(data.chords, state),
            melody,
            pieceInfo: data.pieceInfo,
        };
    }

    //Private methods
    private async BuildMapping(maqamId: string, state: TranspositionState)
    {
        const maqamDetails = await this.maqamatController.QueryMaqamInfo(maqamId);
        if(maqamDetails === undefined)
            throw new Error("1");

        const maqamIntervals = await this.intervalsService.QueryMaqamIntervals(maqamId, maqamDetails.branchingJinsIds[0]);
        if(maqamIntervals === undefined)
            throw new Error("2");
        const sourcePitches = this.intervalsService.ResolveScalePitches(state.sourceKey, maqamIntervals);
        const targetPitches = this.intervalsService.ResolveScalePitches(state.targetKey, maqamIntervals);

        const pitchMap: PitchMap[] = [];
        for(let i = 0; i < sourcePitches.length; i++)
        {
            pitchMap.push({
                sourcePitch: sourcePitches[i],
                targetPitch: targetPitches[i]
            });
        }
        state.pitchMap = pitchMap;
    }

    private TransposeChord(state: TranspositionState, chord: TimedChord): TimedChord
    {
        return {
            duration: chord.duration,
            root: this.TransposePitch({ octave: 4, ...chord.root }, state),
            type: chord.type
        };
    }

    private TransposeChords(chords: TimedChord[], state: TranspositionState)
    {
        const mapped = [];
        for (const chord of chords)
        {
            mapped.push(this.TransposeChord(state, chord));
        }

        return mapped;
    }

    private TransposeChromatic(pitch: FullPitch, state: TranspositionState)
    {
        const map = state.pitchMap.find(x => x.sourcePitch.baseNote === pitch.baseNote);
        if(map === undefined)
            throw new Error("3");

        const derivation = this.intervalsService.AccidentalTo24TET(pitch.accidental) - this.intervalsService.AccidentalTo24TET(map.sourcePitch.accidental);
        const mapped = this.intervalsService.AccidentalTo24TET(map.targetPitch.accidental) + derivation;

        return this.intervalsService.AccidentalFrom24TET(mapped);
    }

    private TransposeDiatonic(basePitch: NaturalNote, octave: number, diatonicSteps: number)
    {
        if(diatonicSteps >= 0)
        {
            while(diatonicSteps--)
            {
                switch(basePitch)
                {
                    case NaturalNote.B:
                        basePitch++;
                        octave++;
                        break;
                    case NaturalNote.G:
                        basePitch = NaturalNote.A;
                        break;
                    default:
                        basePitch++;
                        break;
                }
            }
        }
        else
        {
            throw new Error("transpose down not implemented yet");
        }

        return {
            basePitch,
            octave
        };
    }

    private async TransposeEvent(state: TranspositionState, event: MelodyEvent): Promise<MelodyEvent>
    {
        switch(event.type)
        {
            case MelodyEventType.NotesOrRests:
                return {
                    type: MelodyEventType.NotesOrRests,
                    notesOrRests: event.notesOrRests.map(this.TransposeNoteOrRest.bind(this, state))
                };

            case MelodyEventType.Repeat:
                return {
                    type: MelodyEventType.Repeat,
                    nestedEvents: await this.TransposeEvents(event.nestedEvents, state)
                };

            case MelodyEventType.UpdateMaqam:
                state.sourceKey = event.pitch;
                await this.BuildMapping(event.maqamId, state);
                return {
                    type: MelodyEventType.UpdateMaqam,
                    maqamId: event.maqamId,
                    pitch: state.targetKey
                };
        }

        return event;
    }

    private async TransposeEvents(events: MelodyEvent[], state: TranspositionState)
    {
        const mapped = [];
        for (const event of events)
        {
            mapped.push(await this.TransposeEvent(state, event));
        }

        return mapped;
    }

    private TransposeNoteOrRest(state: TranspositionState, noteOrRest: NoteOrRest): NoteOrRest
    {
        if("octave" in noteOrRest)
        {
            const transposed = this.TransposePitch(noteOrRest, state);

            return {
                accidental: transposed.accidental,
                baseNote: transposed.baseNote,
                duration: noteOrRest.duration,
                octave: transposed.octave
            };
        }

        return noteOrRest;
    }

    private TransposePitch(pitch: FullPitch, state: TranspositionState): FullPitch
    {
        const diatonicSteps = state.targetKey.baseNote - state.sourceKey.baseNote;

        const chromaticTransposition = this.TransposeChromatic(pitch, state);
        const diatonicTransposed = this.TransposeDiatonic(pitch.baseNote, pitch.octave, diatonicSteps);

        return {
            accidental: chromaticTransposition,
            baseNote: diatonicTransposed.basePitch,
            octave: diatonicTransposed.octave
        };
    }
}