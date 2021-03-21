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
import { MusicalPiecesController } from "../../../dataaccess/MusicalPiecesController";

@Injectable
class _api_
{
    constructor(private musicalPiecesController: MusicalPiecesController)
    {
    }

    @HTTPEndPoint({ method: MusicalPieces.API.PieceAPI.Query.method, route: MusicalPieces.API.PieceAPI.route })
    public async QueryPiece(request: HTTPRequest<MusicalPieces.API.PieceAPI.Query.RequestData, MusicalPieces.API.PieceAPI.RouteParams>): Promise<HTTPResultData<MusicalPieces.API.PieceAPI.Query.ResultData>>
    {
        const piece = await this.musicalPiecesController.QueryMusicalPiece(request.routeParams.pieceId);

        return {
            data: piece === undefined ? undefined : {
                piece: piece
            }
        };
    }

    @HTTPEndPoint({ method: MusicalPieces.API.PieceAPI.Set.method, route: MusicalPieces.API.PieceAPI.route })
    public async SetPiece(request: HTTPRequest<MusicalPieces.API.PieceAPI.Set.RequestData, MusicalPieces.API.PieceAPI.RouteParams>): Promise<HTTPResultData<MusicalPieces.API.PieceAPI.Set.ResultData>>
    {
        return {
            data: {
            }
        };
    }
}

export default _api_;