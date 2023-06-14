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

import { Injectable } from "acfrontend";
import { PieceAttachmentAssociation, PieceDetailsData } from "../../dist/api";
import { APIService } from "../shared/APIService";

interface PieceFilterCriteria
{
    titleFilter: string;

    formId: number | null;
    composerId: number | null;
    lyricistId: number | null;
    singerId: number | null;
    maqamId: number | null;
    rhythmId: number | null
}

export interface Attachment
{
    comment: string;
    file: File;
}

export interface AttachmentChangesCollection
{
    new: Attachment[];
    existing: PieceAttachmentAssociation[];
    deleted: number[];
}

@Injectable
export class MusicalPiecesService
{
    constructor(private apiService: APIService)
    {
    }

    //Public methods
    public async AddPiece(piece: PieceDetailsData)
    {
        return (await this.apiService.musicalpieces.post(piece)).data;
    }

    public async AddPieceAttachment(pieceId: number, comment: string, file: File)
    {
        const result = await this.apiService.attachments.post({ pieceId, comment, file });
        if(result.statusCode !== 204)
            alert("Upload of attachment with comment '" + comment + "' failed");
    }

    public async ApplyAttachmentChanges(pieceId: number, attachments: AttachmentChangesCollection)
    {
        for (const attachmentId of attachments.deleted)
        {
            await this.apiService.attachments._any_.delete(attachmentId);
        }
        for (const newAttach of attachments.new)
        {
            await this.AddPieceAttachment(pieceId, newAttach.comment, newAttach.file);
        }
    }

    public async ListPieces(fc: PieceFilterCriteria, offset: number, limit: number)
    {
        return (await this.apiService.musicalpieces.get({
            titleFilter: fc.titleFilter,

            formId: fc.formId === null ? undefined : fc.formId,
            composerId: fc.composerId === null ? undefined : fc.composerId,
            lyricistId: fc.lyricistId === null ? undefined : fc.lyricistId,
            singerId: fc.singerId === null ? undefined : fc.singerId,
            maqamId: fc.maqamId === null ? undefined : fc.maqamId,
            rhythmId: fc.rhythmId === null ? undefined : fc.rhythmId,

            offset,
            limit
        })).data;
    }

    public async QueryPiece(pieceId: number)
    {
        const result = await this.apiService.musicalpieces._any_.get(pieceId);
        if(result.statusCode === 404)
            throw new Error("todo implement me");
        return result.data;
    }

    public async SetPiece(pieceId: number, piece: PieceDetailsData)
    {
        await this.apiService.musicalpieces._any_.put(pieceId, piece);
    }
}