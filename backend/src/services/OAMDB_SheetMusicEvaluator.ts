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
import { Accidental, NaturalNote, OctavePitch } from "@aczwink/openarabicmusicdb-domain/dist/OctavePitch";
import { DatabaseController } from "../dataaccess/DatabaseController";
import { OAMDB_SheetMusic_Document, OAMDB_SheetMusic_LilyPondMusic, OAMDB_SheetMusic_MelodyEntryType, OAMDB_SheetMusic_MelodyEvent, OpenArabicMusicDBMusicalPiece } from "@aczwink/openarabicmusicdb-domain";
import { RhythmsController } from "../dataaccess/RhythmsController";
import { RhythmRealizerService } from "./RhythmRealizerService";
import { LilyPondNoteLanguage, LilyPondNoteService } from "./LilypondNoteService";
import { Note, NoteOrRest } from "../model/Note";
import { Fraction } from "../model/Fraction";
import { IntervalsService } from "./IntervalsService";
import { FullPitch } from "../model/FullPitch";
import { MelodyEvent, MelodyEventType, Section, SheetMusic } from "../model/SheetMusic";
import { ChordType, TimedChord } from "../model/Chord";

interface EvaluationState
{
    currentDuration: Fraction;
    relativePitch: FullPitch;
}

@Injectable
export class OAMDB_SheetMusicEvaluator
{
    constructor(private dbController: DatabaseController, private rhythmsController: RhythmsController, private rhythmRealizerService: RhythmRealizerService,
        private lilyPondNoteService: LilyPondNoteService, private intervalsService: IntervalsService
    )
    {
    }

    //Public methods
    public async Evaluate(pieceId: string)
    {
        const document = await this.dbController.GetDocumentDB();
        const piece = document.musicalPieces.find(x => x.id === pieceId)!;
        const composer = document.persons.find(x => x.id === piece.composerId)!;

        const evaled = await this.EvaluateSheetMusic(piece, composer.name, {
            currentDuration: new Fraction(1, 4),
            relativePitch: {
                accidental: Accidental.Natural,
                baseNote: NaturalNote.C,
                octave: 4
            }
        });

        return evaled;
    }

    //Private methods
    private EvaluateChordEvent(event: OAMDB_SheetMusic_LilyPondMusic)
    {
        switch(event.type)
        {
            case OAMDB_SheetMusic_MelodyEntryType.LilyPondMusic:
            {
                return this.ParseLilyPondChords(event);
            }
        }
    }

    private EvaluateChordEvents(events: OAMDB_SheetMusic_LilyPondMusic[])
    {
        const result = [];
        for (const event of events)
        {
            result.push(...this.EvaluateChordEvent(event));
        }
        return result;
    }

    private async EvaluateMelody(melody: OAMDB_SheetMusic_MelodyEvent, state: EvaluationState): Promise<MelodyEvent | undefined>
    {
        switch(melody.type)
        {
            case OAMDB_SheetMusic_MelodyEntryType.LilyPondMusic:
                return {
                    type: MelodyEventType.NotesOrRests,
                    notesOrRests: this.ParseLilyPondNotes(melody.noteLanguage, melody.notes, state)
                };
            case OAMDB_SheetMusic_MelodyEntryType.Repeat:
                return {
                    type: MelodyEventType.Repeat,
                    nestedEvents: await this.EvaluateMelodyEvents(melody.music, state)
                };
            case OAMDB_SheetMusic_MelodyEntryType.UpdateMaqam:
                return {
                    type: MelodyEventType.UpdateMaqam,
                    pitch: this.lilyPondNoteService.ParseLilypondPitch(melody.octavePitch, "english"),
                    maqamId: melody.maqamId
                };
            case OAMDB_SheetMusic_MelodyEntryType.UpdateRelativePitch:
                {
                    const pitch = this.lilyPondNoteService.ParseLilypondPitch(melody.pitch.substring(0, melody.pitch.length - 1), "english");
                    state.relativePitch = {
                        accidental: pitch.accidental,
                        baseNote: pitch.baseNote,
                        octave: parseInt(melody.pitch[melody.pitch.length - 1])
                    };
                }
                break;
            case OAMDB_SheetMusic_MelodyEntryType.UpdateRhythm:
                const timeSig = await this.QueryRhythmTimeSig(melody.rhythmId);
                return {
                    type: MelodyEventType.UpdateTimeSignature,
                    num: timeSig.num,
                    den: timeSig.den
                };
            case OAMDB_SheetMusic_MelodyEntryType.UpdateTimeSignature:
                return {
                    type: MelodyEventType.UpdateTimeSignature,
                    num: melody.numerator,
                    den: melody.denominator
                };
        }
    }

    private async EvaluateMelodyEvents(events: OAMDB_SheetMusic_MelodyEvent[], state: EvaluationState)
    {
        const parts = await events.Values().Map(x => this.EvaluateMelody(x, state)).Async().NotUndefined().ToArray();
        return parts;
    }

    private async EvaluateSections(sheetMusic: OAMDB_SheetMusic_Document, state: EvaluationState)
    {
        const result: Section[] = [];
        for (const section of sheetMusic.sections)
        {
            result.push({
                chords: this.EvaluateChordEvents(section.chords),
                melody: await this.EvaluateMelodyEvents(section.melody, state)
            });
        }

        return result;
    }

    private async EvaluateSheetMusic(piece: OpenArabicMusicDBMusicalPiece, composerName: string, state: EvaluationState): Promise<SheetMusic>
    {
        return {
            pieceTitle: piece.name,
            composerName,
            sections: await this.EvaluateSections(piece.sheetMusic!, state),
            sectionSequence: piece.sheetMusic!.sectionsSequence,
        };
    }

    private ParseDuration(dur: string): Fraction
    {
        if(dur.endsWith("."))
        {
            const den = parseInt(dur.substring(0, dur.length - 1));
            return new Fraction(1, den).Add(new Fraction(1, den * 2));
        }
        return new Fraction(1, parseInt(dur));
    }

    private ParseLilyPondChords(event: OAMDB_SheetMusic_LilyPondMusic)
    {
        const split = event.notes.trim().split(/[ \n]+/);

        const result: TimedChord[] = [];
        let currentDuration = new Fraction(1, 4);
        for (const element of split)
        {
            const parts = element.split(":");

            const parsed = this.ParseLilyPondNote(event.noteLanguage, parts[0]);
            if(parsed.duration !== undefined)
                currentDuration = parsed.duration;

            const createdChord: TimedChord = {
                root: parsed.pitch,
                type: this.ParseLilyPondChordType(parts[1]),
                duration: currentDuration
            };
            result.push(createdChord);
        }

        return result;
    }

    private ParseLilyPondChordType(text?: string)
    {
        switch(text)
        {
            case undefined:
                return ChordType.MajorTriad;
            case "5.8":
                return ChordType.PowerChord;
            case "min":
                return ChordType.MinorTriad;
        }

        throw new Error("ParseLilyPondChordType: " + text);
    }

    private ParseLilyPondNote(noteLanguage: LilyPondNoteLanguage, note: string)
    {
        function ParseOctaveDelta(octavePart: string)
        {
            let delta = 0;

            for (const c of octavePart)
            {
                switch(c)
                {
                    case ",":
                        delta--;
                        break;
                    case "'":
                        delta++;
                        break;
                }
            }

            return delta;
        }

        const match = note.match(/([a-z]+)([,']+)?([0-9]+\.*)?$/);
        if(match === null)
            throw new Error("Couldn't parse note: " + note);

        const pitchPart = match[1];
        const octavePart = match[2] as string | undefined;
        const durationPart = match[3] as string | undefined;

        return {
            pitch: this.lilyPondNoteService.ParseLilypondPitch(pitchPart, noteLanguage),
            duration: (durationPart === undefined) ? undefined : this.ParseDuration(durationPart),
            octaveDerivation: (octavePart === undefined) ? 0 : ParseOctaveDelta(octavePart)
        };
    }

    private ParseLilyPondNotes(noteLanguage: LilyPondNoteLanguage, notes: string, state: EvaluationState)
    {
        const split = notes.trim().split(/[ \n]+/);

        const result: NoteOrRest[] = [];
        for (const element of split)
        {
            switch(element)
            {
                case "|":
                    continue;
            }

            const restMatch = element.match(/^r([0-9]+\.*)?$/);
            if(restMatch !== null)
            {
                result.push({
                    duration: this.ParseDuration(restMatch[1])
                });
                continue;
            }

            const parsed = this.ParseLilyPondNote(noteLanguage, element);
            if(parsed.duration !== undefined)
                state.currentDuration = parsed.duration;

            const resolved = this.ResolveCorrectOctave(parsed.pitch, state.relativePitch);
            resolved.octave += parsed.octaveDerivation;
            const createdNote: Note = {
                ...resolved,
                duration: state.currentDuration
            };
            result.push(createdNote);

            state.relativePitch = createdNote;
        }

        return result;
    }

    private async QueryRhythmTimeSig(rhythmId: string)
    {
        const rhythm = await this.rhythmsController.QueryRhythmDefinition(rhythmId);
        if(rhythm === undefined)
            throw new Error("Rhythm has no definition: " + rhythmId);

        const result = this.rhythmRealizerService.ComputeTimeSig(rhythm);

        return result;
    }

    private ResolveCorrectOctave(pitch: OctavePitch, relativeNote: FullPitch)
    {
        const notes: FullPitch[] = [
            {
                ...pitch,
                octave: relativeNote.octave
            },
            {
                ...pitch,
                octave: relativeNote.octave + 1
            },
            {
                ...pitch,
                octave: relativeNote.octave - 1,
            }
        ];

        let best_d = Number.MAX_SAFE_INTEGER;
        let best = notes[0];

        for (const octaveNote of notes)
        {
            const real_d = this.intervalsService.ComputeIntervalBetween24TET(octaveNote, relativeNote);
            const d = Math.abs(real_d);
            if(d < best_d)
            {
                best_d = d;
                best = octaveNote;
            }
        }

        return best;
    }
}