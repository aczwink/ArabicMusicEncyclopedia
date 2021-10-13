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

import { Injectable } from "acts-util-node";
import { DBQueryExecutor } from "acts-util-node/dist/db/DBQueryExecutor";
import { MusicalPieces } from "ame-api";
import { DatabaseController } from "./DatabaseController";

@Injectable
export class MusicalPiecesController
{
    constructor(private dbController: DatabaseController)
    {
    }

    //Public methods
    public async AddMusicalPiece(piece: MusicalPieces.Piece)
    {
        const conn = await this.dbController.GetFreeConnection();

        const result = await conn.value.InsertRow("amedb.musical_pieces", {
            name: piece.name,
            formId: piece.formId,
            composerId: piece.composerId,
            releaseDate: piece.releaseDate,
        });
        const pieceId = result.insertId;

        await this.SetPieceMaqamatAndRhythms(pieceId, piece.maqamat, piece.rhythms, conn.value);

        conn.Close();

        return pieceId;
    }

    public async DeleteMusicalPieceLyrics(pieceId: number)
    {
        const conn = await this.dbController.CreateAnyConnectionQueryExecutor();

        await conn.DeleteRows("amedb.musical_pieces_lyrics", "pieceId = ?", pieceId);
    }

    public async QueryMusicalPiece(pieceId: number): Promise<MusicalPieces.Piece | undefined>
    {
        const query = `
        SELECT mp.name, mp.formId, mp.composerId, mp.releaseDate
        FROM amedb.musical_pieces mp
        WHERE mp.id = ?
        `;

        const conn = await this.dbController.CreateAnyConnectionQueryExecutor();
        const row = await conn.SelectOne(query, pieceId);

        if(row === undefined)
            return undefined;
        return {
            composerId: row.composerId,
            formId: row.formId,
            lyrics: await this.QueryPieceLyrics(pieceId),
            maqamat: await this.QueryPieceMaqamat(pieceId),
            name: row.name,
            releaseDate: row.releaseDate,
            rhythms: await this.QueryPieceRhythms(pieceId),
        };
    }

    public async QueryMusicalPieces(offset: number, limit: number)
    {
        const query = `
        SELECT
            mp.id, mp.name, mp.composerId, mpl.singerId, mpf.name AS formName, pc.name AS composerName, mp.releaseDate, ps.name AS singerName
        FROM amedb.musical_pieces mp
        INNER JOIN amedb.musical_pieces_forms mpf
            ON mpf.id = mp.formId
        INNER JOIN amedb.persons pc
            ON pc.id = mp.composerId
        LEFT JOIN amedb.musical_pieces_lyrics mpl
            ON mpl.pieceId = mp.id
        LEFT JOIN amedb.persons ps
            ON ps.id = mpl.singerId
        LIMIT ?
        OFFSET ?
        `;

        const conn = await this.dbController.CreateAnyConnectionQueryExecutor();
        const rows = await conn.Select<MusicalPieces.API.List.Piece>(query, limit, offset);

        return rows;
    }

    public async QueryMusicalPiecesCount()
    {
        const query = `
        SELECT COUNT(*) AS cnt
        FROM amedb.musical_pieces mp
        `;

        const conn = await this.dbController.CreateAnyConnectionQueryExecutor();
        const row = await conn.SelectOne(query);

        if(row === undefined)
            return 0;
        return row.cnt as number;
    }

    public async UpdateMusicalPiece(pieceId: number, piece: MusicalPieces.Piece)
    {
        const conn = await this.dbController.GetFreeConnection();

        await conn.value.UpdateRows("amedb.musical_pieces", {
            name: piece.name,
            formId: piece.formId,
            composerId: piece.composerId,
            releaseDate: piece.releaseDate,
        }, "id = ?", pieceId);

        await this.SetPieceMaqamatAndRhythms(pieceId, piece.maqamat, piece.rhythms, conn.value);

        conn.Close();

        return pieceId;
    }

    public async UpdateMusicalPieceLyrics(pieceId: number, data: MusicalPieces.PieceLyrics)
    {
        const conn = await this.dbController.CreateAnyConnectionQueryExecutor();

        const result = await conn.UpdateRows("amedb.musical_pieces_lyrics", {
            lyricistId: data.lyricistId,
            singerId: data.singerId,
            languageId: data.languageId,
            lyrics: data.lyricsText,
        }, "pieceId = ?", pieceId);

        if(result.affectedRows === 0)
        {
            await conn.InsertRow("amedb.musical_pieces_lyrics", {
                pieceId,
                lyricistId: data.lyricistId,
                singerId: data.singerId,
                languageId: data.languageId,
                lyrics: data.lyricsText,
            });
        }
    }

    //Private methods
    private async QueryPieceLyrics(pieceId: number): Promise<MusicalPieces.PieceLyrics | undefined>
    {
        const query = `
        SELECT mpl.languageId, mpl.lyricistId, mpl.singerId, mpl.lyrics
        FROM amedb.musical_pieces_lyrics mpl
        WHERE mpl.pieceId = ?
        `;

        const conn = await this.dbController.CreateAnyConnectionQueryExecutor();
        const row = await conn.SelectOne(query, pieceId);

        if(row === undefined)
            return undefined;
        return {
            languageId: row.languageId,
            lyricistId: row.lyricistId,
            lyricsText: row.lyrics,
            singerId: row.singerId,
        };
    }

    private async QueryPieceMaqamat(pieceId: number): Promise<MusicalPieces.PieceMaqamAssociation[]>
    {
        const query = `
        SELECT mpm.maqamId, mpm.explanation
        FROM amedb.musical_pieces_maqamat mpm
        WHERE mpm.pieceId = ?
        `;

        const conn = await this.dbController.CreateAnyConnectionQueryExecutor();
        const rows = await conn.Select<MusicalPieces.PieceMaqamAssociation>(query, pieceId);

        return rows;
    }

    private async QueryPieceRhythms(pieceId: number): Promise<MusicalPieces.PieceRhythmAssociation[]>
    {
        const query = `
        SELECT mpr.rhythmId, mpr.explanation
        FROM amedb.musical_pieces_rhythms mpr
        WHERE mpr.pieceId = ?
        `;

        const conn = await this.dbController.CreateAnyConnectionQueryExecutor();
        const rows = await conn.Select<MusicalPieces.PieceRhythmAssociation>(query, pieceId);

        return rows;
    }

    private async SetPieceMaqamatAndRhythms(pieceId: number, maqamat: MusicalPieces.PieceMaqamAssociation[], rhythms: MusicalPieces.PieceRhythmAssociation[], conn: DBQueryExecutor)
    {
        await conn.DeleteRows("amedb.musical_pieces_maqamat", "pieceId = ?", pieceId);
        await conn.DeleteRows("amedb.musical_pieces_rhythms", "pieceId = ?", pieceId);

        await maqamat.Values().Map(assoc => conn.InsertRow("amedb.musical_pieces_maqamat", {
            pieceId,
            maqamId: assoc.maqamId,
            explanation: assoc.explanation
        })).PromiseAll();

        await rhythms.Values().Map(assoc => conn.InsertRow("amedb.musical_pieces_rhythms", {
            pieceId,
            rhythmId: assoc.rhythmId,
            explanation: assoc.explanation
        })).PromiseAll();
    }
}