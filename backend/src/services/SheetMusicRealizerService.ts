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
import { LilypondRendererService } from "./LilypondRendererService";
import { DatabaseController } from "../dataaccess/DatabaseController";
import { OAMDB_SheetMusic_LilyPondMusic, OAMDB_SheetMusic_MelodyEntryType, OAMDB_SheetMusic_MelodyEvent, OpenArabicMusicDBMusicalPiece } from "@aczwink/openarabicmusicdb-domain";
import { RhythmsController } from "../dataaccess/RhythmsController";
import { RhythmRealizerService } from "./RhythmRealizerService";

interface RealizationState
{
    unfoldRepeats: boolean;
}

@Injectable
export class SheetMusicRealizerService
{
    constructor(private lilypondService: LilypondRendererService, private dbController: DatabaseController, private rhythmsController: RhythmsController, private rhythmRealizerService: RhythmRealizerService)
    {
    }

    //Public methods
    public async RenderAsMIDI(pieceId: string, pitch: OctavePitch)
    {
        const document = await this.dbController.GetDocumentDB();
        const piece = document.musicalPieces.find(x => x.id === pieceId)!;
        const composer = document.persons.find(x => x.id === piece.composerId)!;

        const code = await this.GenerateLilyPondCodeFromSheetMusic(piece, composer.name, {
            unfoldRepeats: true
        });

        return await this.lilypondService.Render(code, "midi");
    }

    public async RenderAsPDF(pieceId: string, pitch: OctavePitch)
    {
        const document = await this.dbController.GetDocumentDB();
        const piece = document.musicalPieces.find(x => x.id === pieceId)!;
        const composer = document.persons.find(x => x.id === piece.composerId)!;

        const code = await this.GenerateLilyPondCodeFromSheetMusic(piece, composer.name, {
            unfoldRepeats: false
        });

        return await this.lilypondService.Render(code, "pdf");
    }

    //Private methods
    private async GenerateCode(melody: OAMDB_SheetMusic_MelodyEvent | OAMDB_SheetMusic_MelodyEvent[], state: RealizationState): Promise<string>
    {
        if(Array.isArray(melody))
        {
            const parts = await melody.Values().Map(x => this.GenerateCode(x, state)).PromiseAll();
            return parts.join("\n");
        }

        switch(melody.type)
        {
            case OAMDB_SheetMusic_MelodyEntryType.LilyPondMusic:
                const lang = this.MapNoteLanguage(melody);
                return `\\language "${lang}" ` + melody.notes;
            case OAMDB_SheetMusic_MelodyEntryType.Repeat:
                const nested = await this.GenerateCode(melody.music, state);
                const repeatType = state.unfoldRepeats ? "unfold" : "volta";
                return `\\repeat ${repeatType} 2 { ${nested} }`;
            case OAMDB_SheetMusic_MelodyEntryType.UpdateMaqam:
                return `\\language "english" \\key ` + melody.octavePitch + " " + this.MapMaqamId(melody.maqamId);
            case OAMDB_SheetMusic_MelodyEntryType.UpdateRelativePitch:
                throw new Error("TODO");
            case OAMDB_SheetMusic_MelodyEntryType.UpdateRhythm:
                const timeSig = await this.QueryRhythmTimeSig(melody.rhythmId);
                return `\\time ${timeSig.num}/${timeSig.den}`;
            case OAMDB_SheetMusic_MelodyEntryType.UpdateTimeSignature:
                return `\\time ${melody.numerator}/${melody.denominator}`;
        }
    }

    private async GenerateLilyPondCodeFromSheetMusic(piece: OpenArabicMusicDBMusicalPiece, composerName: string, state: RealizationState)
    {
        const fontSize = 20;

        const melody = await this.GenerateCode(piece.sheetMusic!.sections[0].melody, state);

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
    title = \\markup \\naskh_bold "${piece.name}"
    composer = \\markup \\naskh_composer "${composerName}"
    tagline = ${this.lilypondService.GenerateTagLine()}
}

melody = \\relative do' { ${melody} }

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

    private MapNoteLanguage(melody: OAMDB_SheetMusic_LilyPondMusic)
    {
        switch(melody.noteLanguage)
        {
            case "english":
                return melody.noteLanguage;
            case "italian":
                return "italiano";
        }
    }

    private async QueryRhythmTimeSig(rhythmId: string)
    {
        const rhythm = await this.rhythmsController.QueryRhythmDefinition(rhythmId);
        if(rhythm === undefined)
            throw new Error("Rhythm has no definition: " + rhythmId);

        const result = this.rhythmRealizerService.ComputeTimeSig(rhythm);

        return result;
    }
}