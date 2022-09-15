/**
 * ArabicMusicEncyclopedia
 * Copyright (C) 2021-2022 Amir Czwink (amir130@hotmail.de)
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
import { APIController, Body, Get, NotFound, Ok, Path, Put } from "acts-util-apilib";
import { MusicalController } from "../../dataaccess/MusicalController";
import { MusicalPiecesController, PieceDetailsData } from "../../dataaccess/MusicalPiecesController";
import { PersonsController } from "../../dataaccess/PersonsController";
import { LyricsRendererService } from "../../services/LyricsRendererService";

@APIController("musicalpieces/{pieceId}")
class MusicalPieceAPIController
{
    constructor(private musicalPiecesController: MusicalPiecesController, private musicalController: MusicalController,
        private lyricsRendererService: LyricsRendererService, private personsController: PersonsController)
    {
    }

    @Get()
    public async QueryPiece(
        @Path pieceId: number
    )
    {
        const piece = await this.musicalPiecesController.QueryMusicalPiece(pieceId);
        if(piece === undefined)
            return NotFound("piece not found");
        return piece;
    }

    @Get("renderedtext")
    public async RenderPieceLyrics(
        @Path pieceId: number
    )
    {
        const piece = await this.musicalPiecesController.QueryMusicalPiece(pieceId);
        if(piece === undefined)
            return NotFound("piece not found");
        if(piece.lyrics === undefined)
            return NotFound("piece has no lyrics");

        const composer = await this.personsController.QueryPerson(piece.composerId);

        const fileName = piece.name + "_lyrics.pdf";
        const result = await this.lyricsRendererService.Render(piece.name, composer!.name, piece.lyrics.lyricsText);
        return Ok(result, {
            "Content-Disposition": 'attachment; filename="' + fileName + '"'
        });
    }

    @Put()
    public async UpdatePiece(
        @Path pieceId: number,
        @Body piece: PieceDetailsData
    )
    {
        const form = await this.musicalController.QueryForm(piece.formId);

        await this.musicalPiecesController.UpdateMusicalPiece(pieceId, piece);
        if(form!.hasLyrics)
            await this.musicalPiecesController.UpdateMusicalPieceLyrics(pieceId, piece.lyrics!);
        else
            await this.musicalPiecesController.DeleteMusicalPieceLyrics(pieceId);
    }
}