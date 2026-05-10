/**
 * ArabicMusicEncyclopedia
 * Copyright (C) 2021-2026 Amir Czwink (amir130@hotmail.de)
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

import { Injectable } from "@aczwink/acts-util-node";
import { ChordType } from "./ChordDetectionService";
import { LilypondNoteService } from "./LilypondNoteService";
import { OctavePitch } from "@aczwink/openarabicmusicdb-domain/dist/OctavePitch";
import { IntervalsService } from "./IntervalsService";

@Injectable
export class LilypondRendererService
{
    constructor(private lilypondNoteService: LilypondNoteService, private intervalsService: IntervalsService)
    {
    }

    //Public methods
    public async CreateChordImage(chords: ChordType[][], pitches: OctavePitch[])
    {
        return this.Render(this.ChordsToLilypondText(chords, pitches), "png");
    }

    public async Render(text: string, outputFormat: "pdf" | "png")
    {
        const dir = await fs.promises.mkdtemp(`${os.tmpdir()}${path.sep}ame`, "utf-8");

        const inputPath = path.join(dir, "_input");
        await fs.promises.writeFile(inputPath, text, "utf-8");
        await this.CallLilypond(dir, inputPath, outputFormat);

        const outputPath = path.join(dir, "_output." + outputFormat);
        const data = await fs.promises.readFile(outputPath);

        await fs.promises.rm(dir, { recursive: true });

        return data;
    }

    //Private methods
    private async CallLilypond(inputDir: string, inputPath: string, outputFormat: "pdf" | "png")
    {
        const promise = new Promise<void>( (resolve, reject) => {
            child_process.exec("lilypond --" + outputFormat + " " + inputPath, {
                cwd: inputDir,
            }, (err, _stdout, _stderr) => {
                if(err)
                    reject(err.message + _stdout + _stderr);
                else
                    resolve();
            });
        });
        await promise;

        if(outputFormat === "pdf")
        {
            await fs.promises.rename(inputPath + ".pdf", path.join(inputDir, "_output.pdf"));
        }
        else if(outputFormat === "png")
        {
            const child2 = child_process.exec("convert -trim " + inputPath + ".png" + " _output.png", {
                cwd: inputDir,
            });
    
            await new Promise( (resolve, reject) => {
                child2.on("exit", resolve);
                child2.on("error", reject);
            });
        }
    }

    private ChordsToLilypondText(chords: ChordType[][], pitches: OctavePitch[])
    {
        const lilyChordsAsNotes = [];
        const lilyChords = [];
        for (let index = 0; index < chords.length; index++)
        {
            const stepChords = chords[index];
            if(stepChords.length === 0)
                continue;

            for (const chord of stepChords)
            {
                const notes = this.NotesFromChord(chord, pitches.slice(index));
                const lilypondNotes = this.GenerateLilypondNotesFromChord(notes);
                lilyChordsAsNotes.push("<" + lilypondNotes.join(" ") + ">1");
                lilyChords.push(this.ToLilypondChord(pitches[index], chord));
            }

            lilyChordsAsNotes.push(' \\bar "|" ');
        }

        const lilymusic = lilyChordsAsNotes.join(" ");
        const lilychordmusic = lilyChords.join(" ");

        return `
        \\include "arabic.ly"
        \\language "english"
        \\header { tagline = ""}
        #(set-global-staff-size 32)

        chExceptionMusic = {
            <c g>1-\\markup { \\super "5" }
            <c ef gf>1-\\markup { "dim" }
            <c e gs>1-\\markup { "aug" }
            <c e g b>1-\\markup { "M7" }
            <c e g df'>1-\\markup { \\concat { "(add" \\musicglyph "accidentals.flat" "9)" } }
        }
        chExceptions = #( append
            ( sequential-music-to-chord-exceptions chExceptionMusic #t)
            ignatzekExceptions)

        \\layout {
            indent = 0
        }
          

        <<
        \\override Score.NonMusicalPaperColumn.padding = #1.5
            \\relative c'
            {
                \\override Staff.TimeSignature.stencil = ##f
                \\time 128/4
                \\accidentalStyle forget
                ${lilymusic}
            }
            \\new ChordNames {
                \\chordmode {
                    \\set chordNameExceptions = #chExceptions
                    ${lilychordmusic}
                }
            }
        >>
        `;
    }

    private GenerateLilypondNotesFromChord(pitches: OctavePitch[])
    {
        let reference = pitches[0];

        const result = [];
        for (const pitch of pitches)
        {
            const d = this.intervalsService.ComputeIntervalBetweenUpwards(reference, pitch);

            const lilypondNote = this.lilypondNoteService.ToLilypondNote(pitch, "english");
            const octavedLilypondNote = (d.Eval() >= 3) ? (lilypondNote + "'") : lilypondNote;
            result.push(octavedLilypondNote);

            reference = pitch;
        }

        return result;
    }

    private NotesFromChord(chord: ChordType, pitches: OctavePitch[]): OctavePitch[]
    {
        switch(chord)
        {
            case ChordType.AugmentedTriad:
            case ChordType.DiminishedTriad:
            case ChordType.MajorTriad:
            case ChordType.MinorTriad:
                return [pitches[0], pitches[2], pitches[4]];
            case ChordType.DominantSeventh:
            case ChordType.MajorSeventh:
            case ChordType.MinorSeventh:
                return [pitches[0], pitches[2], pitches[4], pitches[6]];
            case ChordType.PowerChord:
                return [pitches[0], pitches[4], pitches[0]];
            case ChordType.MajorAddFlatNine:
                return [pitches[0], pitches[2], pitches[4], pitches[1]];
        }
    }

    private ToLilypondChord(pitch: OctavePitch, chord: ChordType)
    {
        function ChordTypeToString(chord: ChordType): string
        {
            switch(chord)
            {
                case ChordType.AugmentedTriad:
                    return ":aug";
                case ChordType.DiminishedTriad:
                    return ":dim";
                case ChordType.DominantSeventh:
                    return ":7";
                case ChordType.MajorSeventh:
                    return ":maj7";
                case ChordType.MajorTriad:
                    return "";
                case ChordType.MinorSeventh:
                    return ":m7";
                case ChordType.MinorTriad:
                    return ":m";
                case ChordType.PowerChord:
                    return ":5.8";
                case ChordType.MajorAddFlatNine:
                    return ":3.5.9-";
            }
        }

        return this.lilypondNoteService.ToLilypondNote(pitch, "english") + "1" + ChordTypeToString(chord);
    }
}