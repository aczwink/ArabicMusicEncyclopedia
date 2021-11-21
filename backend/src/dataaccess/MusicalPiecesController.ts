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

interface MusicalPiecesFilterCriteria
{
    formId: number | null;
    titleFilter: string;
    composerId: number | null;
    lyricistId: number | null;
    singerId: number | null;
    maqamId: number | null;
    rhythmId: number | null;
}

@Injectable
export class MusicalPiecesController
{
    constructor(private dbController: DatabaseController)
    {
    }

    //Public methods
    public async AddAttachment(pieceId: number, comment: string, data: Buffer)
    {
        const conn = await this.dbController.CreateAnyConnectionQueryExecutor();

        await conn.InsertRow("amedb.musical_pieces_attachments", {
            pieceId,
            comment,
            content: data
        });
    }

    public async AddMusicalPiece(piece: MusicalPieces.Piece)
    {
        const conn = await this.dbController.GetFreeConnection();

        const result = await conn.value.InsertRow("amedb.musical_pieces", {
            name: piece.name,
            formId: piece.formId,
            composerId: piece.composerId,
            releaseDate: piece.releaseDate,
            text: piece.text
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

    public async QueryAttachment(attachmentId: number)
    {
        const conn = await this.dbController.CreateAnyConnectionQueryExecutor();
        const row = await conn.SelectOne("SELECT content FROM amedb.musical_pieces_attachments WHERE attachmentId = ?", attachmentId);

        if(row === undefined)
            return undefined;
        return row.content as Buffer;
    }

    public async QueryMusicalPiece(pieceId: number): Promise<MusicalPieces.Piece | undefined>
    {
        const query = `
        SELECT mp.name, mp.formId, mp.composerId, mp.releaseDate, mp.text
        FROM amedb.musical_pieces mp
        WHERE mp.id = ?
        `;

        const conn = await this.dbController.CreateAnyConnectionQueryExecutor();
        const row = await conn.SelectOne(query, pieceId);

        if(row === undefined)
            return undefined;
        return {
            attachments: await this.QueryPieceAttachments(pieceId),
            composerId: row.composerId,
            formId: row.formId,
            lyrics: await this.QueryPieceLyrics(pieceId),
            maqamat: await this.QueryPieceMaqamat(pieceId),
            name: row.name,
            releaseDate: row.releaseDate,
            rhythms: await this.QueryPieceRhythms(pieceId),
            text: row.text,
        };
    }

    public async QueryMusicalPieces(filterCriteria: MusicalPiecesFilterCriteria, offset: number, limit: number)
    {
        const builder = this.CreateQueryBuilder(filterCriteria);
        builder.offset = offset;
        builder.limit = limit;

        const conn = await this.dbController.CreateAnyConnectionQueryExecutor();
        const rows = await conn.Select<MusicalPieces.API.List.Piece>(builder.CreateSQLQuery(), limit, offset);

        return rows;
    }

    public async QueryMusicalPiecesCount(filterCriteria: MusicalPiecesFilterCriteria)
    {
        const builder = this.CreateQueryBuilder(filterCriteria);
        builder.SetColumns(
            {
                special: "count"
            }
        );

        const conn = await this.dbController.CreateAnyConnectionQueryExecutor();
        const row = await conn.SelectOne(builder.CreateSQLQuery());

        if(row === undefined)
            return 0;
        return row.count as number;
    }

    public async UpdateMusicalPiece(pieceId: number, piece: MusicalPieces.Piece)
    {
        const conn = await this.dbController.GetFreeConnection();

        await conn.value.UpdateRows("amedb.musical_pieces", {
            name: piece.name,
            formId: piece.formId,
            composerId: piece.composerId,
            releaseDate: piece.releaseDate,
            text: piece.text
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
    private CreateQueryBuilder(filterCriteria: MusicalPiecesFilterCriteria)
    {
        const builder = this.dbController.CreateQueryBuilder();
        const mp = builder.SetPrimaryTable("amedb.musical_pieces");

        const mpf = builder.AddJoin({
            type: "INNER",
            tableName: "amedb.musical_pieces_forms",
            conditions: [{
                column: "id",
                operator: "=",
                joinTable: mp,
                joinTableColumn: "formId"
            }]
        });

        const pc = builder.AddJoin({
            type: "INNER",
            tableName: "amedb.persons",
            conditions: [{
                column: "id",
                operator: "=",
                joinTable: mp,
                joinTableColumn: "composerId"
            }]
        });

        const mpl = builder.AddJoin({
            type: "LEFT",
            tableName: "amedb.musical_pieces_lyrics",
            conditions: [{
                column: "pieceId",
                operator: "=",
                joinTable: mp,
                joinTableColumn: "id"
            }]
        });

        const ps = builder.AddJoin({
            type: "LEFT",
            tableName: "amedb.persons",
            conditions: [{
                column: "id",
                operator: "=",
                joinTable: mpl,
                joinTableColumn: "singerId"
            }]
        });

        builder.SetColumns([
            { table: mp, column: "id"},
            { table: mp, column: "name"},
            { table: mp, column: "composerId"},
            { table: mp, column: "releaseDate"},
            { table: mpf, column: "name AS formName"},
            { table: pc, column: "name AS composerName"},
            { table: mpl, column: "singerId"},
            { table: ps, column: "name AS singerName"}
        ]);

        builder.AddCondition({
            table: mp,
            column: "name",
            operator: "LIKE",
            constant: "%" + filterCriteria.titleFilter + "%"
        });

        if(filterCriteria.formId !== null)
        {
            builder.AddCondition({
                table: mp,
                column: "formId",
                operator: "=",
                constant: filterCriteria.formId
            });
        }

        if(filterCriteria.composerId !== null)
        {
            builder.AddCondition({
                table: mp,
                column: "composerId",
                operator: "=",
                constant: filterCriteria.composerId
            });
        }

        if(filterCriteria.lyricistId !== null)
        {
            builder.AddCondition({
                table: mpl,
                column: "lyricistId",
                operator: "=",
                constant: filterCriteria.lyricistId
            });
        }

        if(filterCriteria.singerId !== null)
        {
            builder.AddCondition({
                table: mpl,
                column: "singerId",
                operator: "=",
                constant: filterCriteria.singerId
            });
        }

        if(filterCriteria.maqamId !== null)
        {
            builder.AddJoin({
                type: "INNER",
                tableName: "amedb.musical_pieces_maqamat",
                conditions: [
                    {
                        column: "pieceId",
                        operator: "=",
                        joinTable: mp,
                        joinTableColumn: "id"
                    },
                    {
                        column: "maqamId",
                        operator: "=",
                        joinValue: filterCriteria.maqamId
                    }
                ]
            });
        }

        if(filterCriteria.rhythmId !== null)
        {
            builder.AddJoin({
                type: "INNER",
                tableName: "amedb.musical_pieces_rhythms",
                conditions: [
                    {
                        column: "pieceId",
                        operator: "=",
                        joinTable: mp,
                        joinTableColumn: "id"
                    },
                    {
                        column: "rhythmId",
                        operator: "=",
                        joinValue: filterCriteria.rhythmId
                    }
                ]
            });
        }

        builder.AddGrouping({
            table: mp,
            columnName: "id"
        });

        return builder;
    }

    private async QueryPieceAttachments(pieceId: number)
    {
        const query = `
        SELECT mpa.attachmentId, mpa.comment
        FROM amedb.musical_pieces_attachments mpa
        WHERE mpa.pieceId = ?
        `;

        const conn = await this.dbController.CreateAnyConnectionQueryExecutor();
        const rows = await conn.Select<MusicalPieces.PieceAttachmentAssociation>(query, pieceId);

        return rows;
    }

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