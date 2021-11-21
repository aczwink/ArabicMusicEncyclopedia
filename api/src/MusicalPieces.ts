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

export interface PieceLyrics
{
    lyricistId: number;
    singerId: number;
    languageId: number;
    lyricsText: string;
}

export interface PieceMaqamAssociation
{
    maqamId: number;
    explanation: string;
}

export interface PieceRhythmAssociation
{
    rhythmId: number;
    explanation: string;
}

export interface PieceAttachmentAssociation
{
    attachmentId: number;
    comment: string;
}

export interface Piece
{
    name: string;
    formId: number;
    composerId: number;
    releaseDate: string;
    text: string;

    lyrics?: PieceLyrics;
    maqamat: PieceMaqamAssociation[];
    rhythms: PieceRhythmAssociation[];
    attachments: PieceAttachmentAssociation[];
}

const mainRoute = "/musicalpieces";
const objectRoute = mainRoute + "/:pieceId";

export namespace API
{
    export const route = mainRoute;

    export interface RouteParams
    {
    }

    export namespace Add
    {
        export const method = "POST";

        export interface RequestData
        {
            piece: Piece;
        }

        export interface ResultData
        {
            pieceId: number;
        }
    }

    export namespace List
    {
        export const method = "GET";

        export interface RequestData
        {
            formId: number | null;
            titleFilter: string;
            composerId: number | null;
            lyricistId: number | null;
            singerId: number | null;
            maqamId: number | null;
            rhythmId: number | null;
            offset: number;
            limit: number;
        }

        export interface ResultData
        {
            pieces: API.List.Piece[];
            totalCount: number;
        }

        export interface Piece
        {
            id: number;
            name: string;
            formName: string;
            composerId: number;
            composerName: string;
            releaseDate: string;
            singerId?: number;
            singerName: string;
        }
    }

    export namespace PieceAPI
    {
        export const route = objectRoute;

        export interface RouteParams
        {
            pieceId: number;
        }

        export namespace Query
        {
            export const method = "GET";

            export interface RequestData
            {
            }

            export interface ResultData
            {
                piece: Piece;
            }
        }

        export namespace Set
        {
            export const method = "PUT";
        
            export interface RequestData
            {
                piece: Piece;
            }
        
            export interface ResultData
            {
            }
        }

        export namespace AttachmentsAPI
        {
            export const route = objectRoute + "/attachments";

            export namespace Add
            {
                export const method = "POST";

                export interface RequestData
                {
                    comment: string;
                }
            
                export interface ResultData
                {
                }
            }

            export namespace AttachmentAPI
            {
                export const route = objectRoute + "/attachments/:attachmentId";

                export interface RouteParams
                {
                    attachmentId: number;
                    pieceId: number;
                }

                export namespace Query
                {
                    export const method = "GET";

                    export interface RequestData
                    {
                    }
                
                    export interface ResultData
                    {
                    }
                }
            }
        }
    }
}