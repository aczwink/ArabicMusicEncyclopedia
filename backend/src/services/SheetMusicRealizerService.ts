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
import { OAMDB_SheetMusic_MelodyEntry, OAMDB_SheetMusic_MelodyEntryType, OpenArabicMusicDBMusicalPiece } from "@aczwink/openarabicmusicdb-domain";

@Injectable
export class SheetMusicRealizerService
{
    constructor(private lilypondService: LilypondRendererService, private dbController: DatabaseController)
    {
    }

    public async RenderAsPDF(pieceId: string, pitch: OctavePitch)
    {
        const document = await this.dbController.GetDocumentDB();
        const piece = document.musicalPieces.find(x => x.id === pieceId)!;
        const composer = document.persons.find(x => x.id === piece.composerId)!;

        const code = this.GenerateLilyPondCodeFromSheetMusic(piece, composer.name);

        return await this.lilypondService.Render(code, "pdf");
    }

    //Private methods
    private GenerateCode(melody: OAMDB_SheetMusic_MelodyEntry | OAMDB_SheetMusic_MelodyEntry[]): string
    {
        if(Array.isArray(melody))
            return melody.map(this.GenerateCode.bind(this)).join("\n");

        switch(melody.type)
        {
            case OAMDB_SheetMusic_MelodyEntryType.LilyPondMusic:
                return melody.notes;
            case OAMDB_SheetMusic_MelodyEntryType.Repeat:
                return `\\repeat volta 2 { ${this.GenerateCode(melody.music)} }`;
        }
        return ""; //TODO
    }

    private GenerateLilyPondCodeFromSheetMusic(piece: OpenArabicMusicDBMusicalPiece, composerName: string)
    {
        const fontSize = 20;

        const melody = this.GenerateCode(piece.sheetMusic!.sections[0].melody);

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
}
`;
    }
}