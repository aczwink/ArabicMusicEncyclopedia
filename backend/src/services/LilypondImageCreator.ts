/**
 * ArabicMusicEncyclopedia
 * Copyright (C) 2021 Amir Czwink (amir130@hotmail.de)
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
import child_process from "child_process";
import fs from "fs";
import os from "os";
import path from "path";

import { Injectable } from "acts-util-node";
import { Accidental, NaturalNote, OctavePitch, OctavePitchToString } from "ame-api";
import { ChordType } from "./ChordDetectionService";

@Injectable
export class LilypondImageCreator
{
    //Public methods
    public async CreateChordImage(chords: (ChordType | undefined)[], pitches: OctavePitch[])
    {
        const dir = await fs.promises.mkdtemp(`${os.tmpdir()}${path.sep}ame`, "utf-8");

        const inputPath = path.join(dir, "_input");
        await fs.promises.writeFile(inputPath, this.ChordsToLilypondText(chords, pitches), "utf-8");
        await this.CallLilypond(dir, inputPath);

        const outputPath = path.join(dir, "_output.png");
        const data = await fs.promises.readFile(outputPath);

        await fs.promises.rmdir(dir, { recursive: true});

        return data;
    }

    //Private methods
    private async CallLilypond(inputDir: string, inputPath: string)
    {
        const child = child_process.exec("lilypond --png " + inputPath, {
            cwd: inputDir,
        });

        await new Promise( (resolve, reject) => {
            child.on("exit", resolve);
            child.on("error", reject);
        });

        const child2 = child_process.exec("convert -trim " + inputPath + ".png" + " _output.png", {
            cwd: inputDir,
        });

        await new Promise( (resolve, reject) => {
            child2.on("exit", resolve);
            child2.on("error", reject);
        });
    }

    private ChordsToLilypondText(chords: (ChordType | undefined)[], pitches: OctavePitch[])
    {
        const lilyChordsAsNotes = [];
        const lilyChords = [];
        for (let index = 0; index < chords.length; index++)
        {
            const chord = chords[index];
            if(chord === undefined)
                continue;
            const notes = this.NotesFromChord(chord, pitches.slice(index));
            const lilypondNotes = notes.map(this.ToLilypondNote.bind(this));
            lilyChordsAsNotes.push("<" + lilypondNotes.join(" ") + ">1");
            lilyChords.push(this.ToLilypondChord(pitches[index], chord));
        }

        const lilymusic = lilyChordsAsNotes.join(" ");
        const lilychordmusic = lilyChords.join(" ");

        return `
        \\include "arabic.ly"
        \\header { tagline = ""}
        #(set-global-staff-size 32)

        <<
        \\override Score.BarLine.stencil = ##f
            \\relative do'
            {
                \\override Staff.TimeSignature #'stencil = ##f
                ${lilymusic}
            }
            \\new ChordNames {
                \\chordmode {
                ${lilychordmusic}
                }
            }
        >>
        `;
    }

    private NotesFromChord(chord: ChordType, pitches: OctavePitch[]): OctavePitch[]
    {
        switch(chord)
        {
            case ChordType.DiminishedTriad:
            case ChordType.MajorTriad:
            case ChordType.MinorTriad:
                return [pitches[0], pitches[2], pitches[4]];
            case ChordType.PowerChord:
                return [pitches[0], pitches[4]];
        }
    }

    private ToLilypondChord(pitch: OctavePitch, chord: ChordType)
    {
        function ChordTypeToString(chord: ChordType)
        {
            switch(chord)
            {
                case ChordType.DiminishedTriad:
                    return ":dim";
                case ChordType.MajorTriad:
                    return "";
                case ChordType.MinorTriad:
                    return ":m";
                case ChordType.PowerChord:
                    return ":5";
            }
        }

        let prefix = "";
        switch(chord)
        {
            case ChordType.PowerChord:
            case ChordType.DiminishedTriad: //displays for example Am^b5 instead of A^o
                prefix = "\\powerChords ";
                break;
        }

        return prefix + this.ToLilypondNote(pitch) + "1" + ChordTypeToString(chord);
    }

    private ToLilypondNote(pitch: OctavePitch)
    {
        function AccidentalToString(acc: Accidental)
        {
            switch(acc)
            {
                case Accidental.Flat:
                    return "b";
                case Accidental.HalfFlat:
                    return "sb";
                case Accidental.Natural:
                    return "";
                case Accidental.HalfSharp:
                    return "sd";
                case Accidental.Sharp:
                    return "d";
                default:
                    throw new Error("NOT IMPLEMENTED: " + acc);
            }
        }

        function NoteNameToString(note: NaturalNote)
        {
            switch(note)
            {
                case NaturalNote.A:
                    return "la";
                case NaturalNote.B:
                    return "si";
                case NaturalNote.C:
                    return "do";
                case NaturalNote.D:
                    return "re";
                case NaturalNote.E:
                    return "mi";
                case NaturalNote.F:
                    return "fa";
                case NaturalNote.G:
                    return "sol";
            }
        }

        return NoteNameToString(pitch.baseNote) + AccidentalToString(pitch.accidental);
    }
}