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
import { APIController, Body, Get, NotFound, Path, Put } from "acts-util-apilib";
import { MusicalController } from "../../dataaccess/MusicalController";
import { MusicalPiecesController, PieceDetailsData } from "../../dataaccess/MusicalPiecesController";

@APIController("musicalpieces/{pieceId}")
class MusicalPieceAPIController
{
    constructor(private musicalPiecesController: MusicalPiecesController, private musicalController: MusicalController)
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