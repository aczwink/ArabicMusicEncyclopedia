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

import { HTTPEndPoint, HTTPRequest, HTTPResultData, Injectable } from "acts-util-node";
import { MusicalPieces } from "ame-api";
import { MusicalController } from "../../dataaccess/MusicalController";
import { MusicalPiecesController } from "../../dataaccess/MusicalPiecesController";

@Injectable
class _api_
{
    constructor(private musicalPiecesController: MusicalPiecesController, private musicalController: MusicalController)
    {
    }

    @HTTPEndPoint({ method: MusicalPieces.API.Add.method, route: MusicalPieces.API.route })
    public async AddPiece(request: HTTPRequest<MusicalPieces.API.Add.RequestData>): Promise<HTTPResultData<MusicalPieces.API.Add.ResultData>>
    {
        const form = await this.musicalController.QueryForm(request.data.piece.formId);

        const pieceId = await this.musicalPiecesController.AddMusicalPiece(request.data.piece);
        if(form!.hasLyrics)
            await this.musicalPiecesController.AddMusicalPieceLyrics(pieceId, request.data.piece.lyrics!);

        return {
            data: {
                pieceId
            }
        };
    }

    @HTTPEndPoint({ method: MusicalPieces.API.List.method, route: MusicalPieces.API.route })
    public async ListPieces(request: HTTPRequest<MusicalPieces.API.List.RequestData>): Promise<HTTPResultData<MusicalPieces.API.List.ResultData>>
    {
        const mp = await this.musicalPiecesController.QueryMusicalPieces(request.data.offset, request.data.limit);
        const count = await this.musicalPiecesController.QueryMusicalPiecesCount();

        return {
            data: {
                pieces: mp,
                totalCount: count
            }
        };
    }
}

export default _api_;