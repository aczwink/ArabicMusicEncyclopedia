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

import { Injectable } from "acfrontend";
import { MusicalPieces } from "ame-api";
import { APIService } from "../shared/APIService";

@Injectable
export class MusicalPiecesService
{
    constructor(private apiService: APIService)
    {
    }

    //Public methods
    public AddPiece(routeParams: MusicalPieces.API.RouteParams, data: MusicalPieces.API.Add.RequestData)
    {
        return this.apiService.Request<MusicalPieces.API.Add.ResultData>(MusicalPieces.API.route, MusicalPieces.API.Add.method, data, routeParams);
    }

    public async AddPieceAttachment(pieceId: number, comment: string, file: File)
    {
        const fd = new FormData();
        fd.append("comment", comment);
        fd.append("data", file);

        const routeParams: MusicalPieces.API.PieceAPI.RouteParams = {
            pieceId
        };        
        await this.apiService.Request(MusicalPieces.API.PieceAPI.AttachmentsAPI.route, MusicalPieces.API.PieceAPI.AttachmentsAPI.Add.method, fd, routeParams);
    }

    public ListPieces(data: MusicalPieces.API.List.RequestData)
    {
        return this.apiService.Request<MusicalPieces.API.List.ResultData>(MusicalPieces.API.route, MusicalPieces.API.List.method, data);
    }

    public QueryPiece(routeParams: MusicalPieces.API.PieceAPI.RouteParams, data: MusicalPieces.API.PieceAPI.Query.RequestData)
    {
        return this.apiService.Request<MusicalPieces.API.PieceAPI.Query.ResultData>(MusicalPieces.API.PieceAPI.route, MusicalPieces.API.PieceAPI.Query.method, data, routeParams);
    }

    public SetPiece(routeParams: MusicalPieces.API.PieceAPI.RouteParams, data: MusicalPieces.API.PieceAPI.Set.RequestData)
    {
        return this.apiService.Request<MusicalPieces.API.PieceAPI.Set.ResultData>(MusicalPieces.API.PieceAPI.route, MusicalPieces.API.PieceAPI.Set.method, data, routeParams);
    }
}