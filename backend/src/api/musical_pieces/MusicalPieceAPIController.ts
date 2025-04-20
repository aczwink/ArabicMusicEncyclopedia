/**
 * ArabicMusicEncyclopedia
 * Copyright (C) 2021-2025 Amir Czwink (amir130@hotmail.de)
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
import { APIController, Get, NotFound, Ok, Path } from "acts-util-apilib";
import { MusicalPiecesController } from "../../dataaccess/MusicalPiecesController";
import { PersonsController } from "../../dataaccess/PersonsController";
import { LyricsRendererService } from "../../services/LyricsRendererService";

@APIController("musicalpieces/{pieceId}")
class MusicalPieceAPIController
{
    constructor(private musicalPiecesController: MusicalPiecesController, private lyricsRendererService: LyricsRendererService, private personsController: PersonsController)
    {
    }

    @Get()
    public async QueryPiece(
        @Path pieceId: string
    )
    {
        const piece = await this.musicalPiecesController.QueryMusicalPiece(pieceId);
        if(piece === undefined)
            return NotFound("piece not found");
        return piece;
    }

    @Get("renderedtext")
    public async RenderPieceLyrics(
        @Path pieceId: string
    )
    {
        const piece = await this.musicalPiecesController.QueryMusicalPiece(pieceId);
        if(piece === undefined)
            return NotFound("piece not found");
        if(piece.lyrics === undefined)
            return NotFound("piece has no lyrics");

        const composer = await this.personsController.QueryPerson(piece.composerId);

        const fileName = encodeURI(piece.name + "_lyrics.pdf");
        const result = await this.lyricsRendererService.Render(piece.name, composer!.name, piece.lyrics.lyricsText);
        return Ok(result, {
            "Content-Disposition": 'attachment; filename="' + fileName + '"'
        });
    }
}