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
import { APIController, Delete, FormField, Get, NotFound, Path, Post } from "acts-util-apilib";
import { UploadedFile } from "acts-util-node/dist/http/UploadedFile";
import { MusicalPiecesController } from "../../dataaccess/MusicalPiecesController";

@APIController("attachments")
class AttachmentsAPIController
{
    constructor(private musicalPiecesController: MusicalPiecesController)
    {
    }

    @Post()
    public async AddAttachment(
        @FormField pieceId: number,
        @FormField comment: string,
        @FormField file: UploadedFile
    )
    {
        await this.musicalPiecesController.AddAttachment(pieceId, comment, file.buffer);
    }

    @Delete("{attachmentId}")
    public async DeleteAttachment(
        @Path attachmentId: number
    )
    {
        await this.musicalPiecesController.DeleteAttachment(attachmentId);
    }

    @Get("{attachmentId}")
    public async QueryAttachment(
        @Path attachmentId: number
    )
    {
        const data = await this.musicalPiecesController.QueryAttachment(attachmentId);
        if(data === undefined)
            return NotFound("attachment not found");
        return data;
    }
}