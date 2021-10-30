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
import { MusicalController } from "../../../dataaccess/MusicalController";
import { MusicalPiecesController } from "../../../dataaccess/MusicalPiecesController";

@Injectable
class _api_
{
    constructor(private musicalPiecesController: MusicalPiecesController)
    {
    }

    @HTTPEndPoint({ method: MusicalPieces.API.PieceAPI.AttachmentsAPI.Add.method, route: MusicalPieces.API.PieceAPI.AttachmentsAPI.route, files: [{name: "data", maxCount: 1}] })
    public async AddAttachment(request: HTTPRequest<MusicalPieces.API.PieceAPI.AttachmentsAPI.Add.RequestData, MusicalPieces.API.PieceAPI.RouteParams>): Promise<HTTPResultData<MusicalPieces.API.PieceAPI.AttachmentsAPI.Add.ResultData>>
    {
        await this.musicalPiecesController.AddAttachment(request.routeParams.pieceId, request.data.comment, request.files.data![0].buffer);
        return {
            data: {}
        };
    }

    @HTTPEndPoint({ method: MusicalPieces.API.PieceAPI.AttachmentsAPI.AttachmentAPI.Query.method, route: MusicalPieces.API.PieceAPI.AttachmentsAPI.AttachmentAPI.route })
    public async QueryAttachment(request: HTTPRequest<MusicalPieces.API.PieceAPI.AttachmentsAPI.AttachmentAPI.Query.RequestData, MusicalPieces.API.PieceAPI.AttachmentsAPI.AttachmentAPI.RouteParams>): Promise<HTTPResultData<MusicalPieces.API.PieceAPI.AttachmentsAPI.AttachmentAPI.Query.ResultData>>
    {
        const data = await this.musicalPiecesController.QueryAttachment(request.routeParams.attachmentId);

        return {
            data
        };
    }
}

export default _api_;