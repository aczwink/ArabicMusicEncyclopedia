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
import { MelodyEvent, MelodyEventType, SheetMusic } from "../model/SheetMusic";
import { NoteOrRest } from "../model/Note";
import { IntervalsService } from "./IntervalsService";
import { MaqamatController } from "../dataaccess/MaqamatController";
import { FullPitch } from "../model/FullPitch";

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
    public async TransposeTo(data: SheetMusic, targetKey: OctavePitch): Promise<SheetMusic>
    {
        return {
            composerName: data.composerName,
            melody: await this.TransposeEvents(data.melody, {
                pitchMap: [],
                sourceKey: targetKey,
                targetKey
            }),
            pieceTitle: data.pieceTitle
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
            const diatonicSteps = state.targetKey.baseNote - state.sourceKey.baseNote;

            const diatonicTransposed = this.TransposeDiatonic(noteOrRest.baseNote, noteOrRest.octave, diatonicSteps);
            const chromaticTransposition = this.TransposeChromatic(noteOrRest, state);

            return {
                accidental: chromaticTransposition,
                baseNote: diatonicTransposed.basePitch,
                duration: noteOrRest.duration,
                octave: diatonicTransposed.octave
            };
        }

        return noteOrRest;
    }
}