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
import { OctavePitch } from "@aczwink/openarabicmusicdb-domain/dist/OctavePitch";
import { LilyPondRendererService } from "./LilyPondRendererService";
import { LilyPondNoteService } from "./LilyPondNoteService";
import { NoteOrRest } from "../model/Note";
import { Fraction } from "../model/Fraction";
import { OAMDB_SheetMusicEvaluator } from "./OAMDB_SheetMusicEvaluator";
import { MelodyEvent, MelodyEventType, RepeatEvent, SheetMusic } from "../model/SheetMusic";
import { SheetMusicTransposer } from "./SheetMusicTransposer";

interface RealizationOptions
{
    unfoldRepeats: boolean;
}

@Injectable
export class SheetMusicRealizerService
{
    constructor(private lilypondService: LilyPondRendererService, private lilyPondNoteService: LilyPondNoteService, private oamdbSheetMusicEvaluator: OAMDB_SheetMusicEvaluator, private sheetMusicTransposer: SheetMusicTransposer)
    {
    }

    //Public methods
    public async RenderAsMIDI(pieceId: string, pitch: OctavePitch)
    {
        const data = await this.oamdbSheetMusicEvaluator.Evaluate(pieceId);
        const tranposed = await this.sheetMusicTransposer.TransposeTo(data, pitch);

        const code = await this.GenerateLilyPondCodeFromSheetMusic(tranposed, {
            unfoldRepeats: true
        });

        return await this.lilypondService.Render(code, "midi");
    }

    public async RenderAsPDF(pieceId: string, pitch: OctavePitch)
    {
        const data = await this.oamdbSheetMusicEvaluator.Evaluate(pieceId);
        const tranposed = await this.sheetMusicTransposer.TransposeTo(data, pitch);

        const code = await this.GenerateLilyPondCodeFromSheetMusic(tranposed, {
            unfoldRepeats: false
        });
        
        return await this.lilypondService.Render(code, "pdf");
    }

    //Private methods
    private ComputeDurationOfEvent(event: MelodyEvent): Fraction
    {
        switch(event.type)
        {
            case MelodyEventType.NotesOrRests:
                return event.notesOrRests.Values().Map(x => x.duration).Accumulate( (a, b) => a.Add(b) );
            case MelodyEventType.Repeat:
                const inner = this.ComputeDurationOfEvents(event.nestedEvents);
                return inner.Scale(2);
        }

        return new Fraction(0, 1);
    }

    private ComputeDurationOfEvents(events: MelodyEvent[])
    {
        return events.Values().Map(this.ComputeDurationOfEvent.bind(this)).Accumulate( (a, b) => a.Add(b) );
    }

    private DurationToLilyPond(duration: Fraction)
    {
        switch(duration.num)
        {
            case 1:
                return duration.den;
            case 3:
                return (duration.den / 2) + ".";
        }

        throw new Error("Illegal duration value: " + duration.ToString());
    }

    private async GenerateCode(event: MelodyEvent | MelodyEvent[], state: RealizationOptions): Promise<string>
    {
        if(Array.isArray(event))
        {
            const parts = await event.Values().Map(x => this.GenerateCode(x, state)).PromiseAll();
            return parts.join("\n");
        }

        switch(event.type)
        {
            case MelodyEventType.NotesOrRests:
                return event.notesOrRests.map(x => this.GenerateCodeForNote(x)).join(" ");
            case MelodyEventType.Repeat:
                return this.GenerateCodeForRepeat(event, state);
            case MelodyEventType.UpdateMaqam:
                const keyPitch = this.lilyPondNoteService.ToLilypondNote(event.pitch, "italian");
                return `\\key ` + keyPitch + " " + this.MapMaqamId(event.maqamId);
            case MelodyEventType.UpdateTimeSignature:
                return `\\time ${event.num}/${event.den}`;
        }
    }

    private GenerateCodeForNote(note: NoteOrRest): string
    {
        function Times(char: string, count: number)
        {
            let result = "";
            while(count--)
                result += char;

            return result;
        }
        function OctaveToString(octave: number)
        {
            const d = octave - 3; //3 is default octave in lilypond absolute mode
            if(d > 0)
                return Times("'", d);
            return Times(",", Math.abs(d));
        }

        if("octave" in note)
        {
            return this.lilyPondNoteService.ToLilypondNote(note, "italian") + OctaveToString(note.octave) + this.DurationToLilyPond(note.duration);
        }

        return "r" + this.DurationToLilyPond(note.duration);
    }

    private async GenerateCodeForRepeat(event: RepeatEvent, state: RealizationOptions)
    {
        const nested = await this.GenerateCode(event.nestedEvents, state);

        let repeatType = "volta";

        if(state.unfoldRepeats)
            repeatType = "unfold";
        else
        {
            const duration = this.ComputeDurationOfEvents(event.nestedEvents);
            if(duration.Eval() === 1)
                repeatType = "percent";
        }

        return `\\repeat ${repeatType} 2 { ${nested} }`;
    }

    private async GenerateLilyPondCodeFromSheetMusic(data: SheetMusic, state: RealizationOptions)
    {
        const fontSize = 20;

        const melody = await this.GenerateCode(data.melody, state);

        return `
\\version "2.24.4"
\\include "arabic.ly"

\\paper
{
    myStaffSize = #20
    #(define fonts
      (make-pango-font-tree "Noto Naskh Arabic"
                            "Noto Sans Arabic"
                            "Noto Kufi Arabic"
                             (/ myStaffSize 20)))
}

#(set-global-staff-size ${fontSize})


\\markup naskh_bold = \\markup \\override #'((font-name . "Noto Naskh Arabic Bold") (font-size . 6)) \\etc
\\markup naskh_composer = \\markup \\override #'((font-name . "Noto Naskh Arabic") (font-size . 0.5)) \\etc

\\header
{
    title = \\markup \\naskh_bold "${data.pieceTitle}"
    composer = \\markup \\naskh_composer "${data.composerName}"
    tagline = ${this.lilypondService.GenerateTagLine()}
}

melody = { ${melody} }

\\score {
 <<
  \\new Staff \\melody
 >>
  \\layout { }
  \\midi { }
}
`;
    }

    private MapMaqamId(maqamId: string)
    {
        switch(maqamId)
        {
            case "kurdi":
                return "\\kurd";
            default:
                throw new Error("Can't map maqam: " + maqamId);
        }
    }
}