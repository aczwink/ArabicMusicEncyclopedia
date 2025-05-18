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

import { Injectable } from "acts-util-node";
import { AttachmentContentType } from "../services/AttachmentTypeService";
import { DatabaseController } from "./DatabaseController";
import { OpenArabicMusicDBAttachment, OpenArabicMusicDBMusicalPiece } from "openarabicmusicdb-domain";

interface FullAttachmentData
{
    comment: string;
    contentType: AttachmentContentType;
    content: Buffer;
}

export interface MusicalPiecesFilterCriteria
{
    formId: string | null;
    titleFilter: string;
    composerId: string | null;
    lyricistId: string | null;
    singerId: string | null;
    maqamId: string | null;
    rhythmId: string | null;
}

export interface PieceOverviewData
{
    id: string;
    name: string;
    formName: string;
    composerId: string;
    composerName: string;
    releaseDate: string;
    singerId?: string;
    singerName: string;
}

interface PieceLyrics
{
    lyricistId: string;
    singerIds: string[];
    languageId: string;
    lyricsText: string;
}

interface PieceMaqamAssociation
{
    maqamId: string;
    explanation: string;
}

interface PieceRhythmAssociation
{
    rhythmId: string;
    explanation: string;
}

interface PieceAttachmentAssociation extends OpenArabicMusicDBAttachment
{
    isRenderable: boolean;
}

export interface PieceDetailsData
{
    name: string;
    formId: string;
    composerId: string;
    releaseDate: string;
    text: string;

    lyrics?: PieceLyrics;
    maqamat: PieceMaqamAssociation[];
    rhythms: PieceRhythmAssociation[];
    attachments: PieceAttachmentAssociation[];
}

@Injectable
export class MusicalPiecesController
{
    constructor(private dbController: DatabaseController)
    {
    }

    //Public methods
    public async QueryMusicalPiece(pieceId: string): Promise<PieceDetailsData | undefined>
    {
        const document = await this.dbController.GetDocumentDB();
        const piece = document.musicalPieces.find(x => x.id === pieceId);

        if(piece === undefined)
            return undefined;
        return {
            attachments: this.QueryPieceAttachments(piece),
            composerId: piece.composerId,
            formId: piece.formId,
            lyrics: this.QueryPieceLyrics(piece),
            maqamat: piece.maqamat,
            name: piece.name,
            releaseDate: piece.releaseDate,
            rhythms: piece.rhythms,
            text: piece.text,
        };
    }

    public async QueryMusicalPieces(filterCriteria: MusicalPiecesFilterCriteria, offset: number, limit: number)
    {
        const filtered = await this.FilterPieces(filterCriteria);

        return filtered.Skip(offset).Take(limit).Map(this.QueryOverviewData.bind(this)).PromiseAll();
    }

    public async QueryMusicalPiecesCount(filterCriteria: MusicalPiecesFilterCriteria)
    {
        const filtered = await this.FilterPieces(filterCriteria);

        return filtered.Count();
    }

    //Private methods
    private DoesPieceMatchFilterCriteria(filterCriteria: MusicalPiecesFilterCriteria, piece: OpenArabicMusicDBMusicalPiece)
    {
        if(!piece.name.toLowerCase().includes(filterCriteria.titleFilter))
            return false;

        if(filterCriteria.formId !== null)
        {
            if(piece.formId !== filterCriteria.formId)
                return false;
        }

        if(filterCriteria.composerId !== null)
        {
            if(piece.composerId !== filterCriteria.composerId)
                return false;
        }

        if(filterCriteria.lyricistId !== null)
        {
            if(piece.lyrics?.songWriterId !== filterCriteria.lyricistId)
                return false;
        }

        if(filterCriteria.singerId !== null)
        {
            if(!piece.lyrics?.singerIds.includes(filterCriteria.singerId))
                return false;
        }

        if(filterCriteria.maqamId !== null)
        {
            const found = piece.maqamat.find(x => x.maqamId === filterCriteria.maqamId);
            if(found === undefined)
                return false;
        }

        if(filterCriteria.rhythmId !== null)
        {
            const found = piece.rhythms.find(x => x.rhythmId === filterCriteria.rhythmId);
            if(found === undefined)
                return false;
        }

        return true;
    }

    private async FilterPieces(filterCriteria: MusicalPiecesFilterCriteria)
    {
        filterCriteria.titleFilter = filterCriteria.titleFilter.toLowerCase();
        const document = await this.dbController.GetDocumentDB();
        return document.musicalPieces.Values().Filter(this.DoesPieceMatchFilterCriteria.bind(this, filterCriteria));
    }

    private async QueryOverviewData(piece: OpenArabicMusicDBMusicalPiece): Promise<PieceOverviewData>
    {
        const document = await this.dbController.GetDocumentDB();

        const form = document.forms.find(x => x.id === piece.formId)!;
        const composer = document.persons.find(x => x.id === piece.composerId)!;
        const firstSinger = document.persons.find(x => x.id === piece.lyrics?.singerIds[0]);
        
        return {
            composerId: piece.composerId,
            composerName: composer.name,
            formName: form.name,
            id: piece.id,
            name: piece.name,
            releaseDate: piece.releaseDate,
            singerName: firstSinger?.name ?? "",
            singerId: piece.lyrics?.singerIds[0]
        };
    }

    private QueryPieceAttachments(piece: OpenArabicMusicDBMusicalPiece)
    {
        return piece.attachments.map<PieceAttachmentAssociation>(x => ({
            contentType: x.contentType,
            type: x.type,
            uri: x.uri,
            comment: x.comment,
            isRenderable: x.contentType === "text/x-lilypond"
        }));
    }

    private QueryPieceLyrics(piece: OpenArabicMusicDBMusicalPiece): PieceLyrics | undefined
    {
        if(piece.lyrics === undefined)
            return undefined;
        return {
            languageId: piece.lyrics.dialectId,
            lyricistId: piece.lyrics.songWriterId,
            lyricsText: piece.lyrics.text,
            singerIds: piece.lyrics.singerIds
        };
    }
}