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
import { APIController, BadRequest, Delete, FormField, Get, NotFound, Ok, Path, Post, Query } from "acts-util-apilib";
import { UploadedFile } from "acts-util-node/dist/http/UploadedFile";
import { ParseOctavePitch } from "ame-api";
import { MusicalPiecesController } from "../../dataaccess/MusicalPiecesController";
import { AttachmentTypeService } from "../../services/AttachmentTypeService";
import { LilypondRendererService } from "../../services/LilypondRendererService";
import { LilypondTransposer } from "../../services/LilypondTransposer";

@APIController("attachments")
class AttachmentsAPIController
{
    constructor(private musicalPiecesController: MusicalPiecesController, private attachmentTypeService: AttachmentTypeService,
        private lilypondService: LilypondRendererService, private lilypondTransposer: LilypondTransposer)
    {
    }

    @Post()
    public async AddAttachment(
        @FormField pieceId: number,
        @FormField comment: string,
        @FormField file: UploadedFile
    )
    {
        const contentType = await this.attachmentTypeService.FindContentType(file);
        if(contentType === undefined)
            return BadRequest("Illegal attachment type");

        await this.musicalPiecesController.AddAttachment(pieceId, comment, contentType, file.buffer);
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

        const fileName = data.comment + "." + this.attachmentTypeService.TypeToFileExtension(data.contentType);
        return Ok(data.content, {
            "Content-Disposition": 'attachment; filename="' + fileName + '"'
        });
    }

    @Get("{attachmentId}/rendered")
    public async DownloadRenderedAttachment(
        @Path attachmentId: number,
        @Query basePitch?: string
    )
    {
        const data = await this.musicalPiecesController.QueryAttachment(attachmentId);
        if(data === undefined)
            return NotFound("attachment not found");
        if(data.contentType !== "text/x-lilypond")
            return BadRequest("attachment is not renderable");

        const source = data.content.toString("utf-8");
        const transposed = basePitch === undefined ? source : this.lilypondTransposer.TransposeTo(source, ParseOctavePitch(basePitch));

        const fileName = data.comment + ".pdf";
        const result = await this.lilypondService.Render(transposed, "pdf");
        return Ok(result, {
            "Content-Disposition": 'attachment; filename="' + fileName + '"'
        });
    }
}