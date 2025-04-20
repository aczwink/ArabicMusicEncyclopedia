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
import { APIController, Get, Query } from "acts-util-apilib";
import { MusicalController } from "../../dataaccess/MusicalController";
import { MusicalPiecesController, MusicalPiecesFilterCriteria, PieceOverviewData } from "../../dataaccess/MusicalPiecesController";

interface PiecesResultData
{
    pieces: PieceOverviewData[];
    totalCount: number;
}

@APIController("musicalpieces")
class MusicalPiecesAPIController
{
    constructor(private musicalPiecesController: MusicalPiecesController, private musicalController: MusicalController)
    {
    }

    @Get()
    public async ListPieces(
        @Query titleFilter: string,
        @Query offset: number,
        @Query limit: number,

        @Query formId?: string,
        @Query composerId?: string,
        @Query lyricistId?: string,
        @Query singerId?: string,
        @Query maqamId?: string,
        @Query rhythmId?: string,
    ): Promise<PiecesResultData>
    {
        const fc: MusicalPiecesFilterCriteria = {
            titleFilter,
            composerId: composerId === undefined ? null : composerId,
            formId: formId === undefined ? null : formId,
            lyricistId: lyricistId === undefined ? null : lyricistId,
            maqamId: maqamId === undefined ? null : maqamId,
            rhythmId: rhythmId === undefined ? null : rhythmId,
            singerId: singerId === undefined ? null : singerId,
        };
        const mp = await this.musicalPiecesController.QueryMusicalPieces(fc, offset, limit);
        const count = await this.musicalPiecesController.QueryMusicalPiecesCount(fc);

        return {
            pieces: mp,
            totalCount: count
        };
    }
}