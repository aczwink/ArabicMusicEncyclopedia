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
import { APIController, BadRequest, Get, NotFound, Ok, Path, Query } from "acts-util-apilib";
import { MusicalPiecesController } from "../../dataaccess/MusicalPiecesController";
import { AttachmentTypeService } from "../../services/AttachmentTypeService";
import { LilypondRendererService } from "../../services/LilypondRendererService";
import { LilypondTransposer } from "../../services/LilypondTransposer";
import { ParseOctavePitch } from "openarabicmusicdb-domain/dist/OctavePitch";

@APIController("attachments")
class AttachmentsAPIController
{
    constructor(private musicalPiecesController: MusicalPiecesController, private attachmentTypeService: AttachmentTypeService,
        private lilypondService: LilypondRendererService, private lilypondTransposer: LilypondTransposer)
    {
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