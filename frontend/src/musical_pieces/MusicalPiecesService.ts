/**
 * ArabicMusicEncyclopedia
 * Copyright (C) 2021-2026 Amir Czwink (amir130@hotmail.de)
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
import { PieceAttachmentAssociation } from "../../dist/api";
import { APIService } from "../shared/APIService";

interface PieceFilterCriteria
{
    titleFilter: string;

    formId: string | null;
    composerId: string | null;
    lyricistId: string | null;
    singerId: string | null;
    maqamId: string | null;
    rhythmId: string | null
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
    deleted: string[];
}

@Injectable
export class MusicalPiecesService
{
    constructor(private apiService: APIService)
    {
    }

    //Public methods
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

    public async QueryPiece(pieceId: string)
    {
        const result = await this.apiService.musicalpieces._any_.get(pieceId);
        if(result.statusCode === 404)
            return undefined;
        return result.data;
    }
}