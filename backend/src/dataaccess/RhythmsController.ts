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
import { CountryCode } from "ame-api/dist/Locale";
import { DatabaseController } from "./DatabaseController";

interface RhythmOverviewData
{
    id: number;
    name: string;
    timeSigNum: number;
}

interface RhythmCountryUsage
{
    countryCode: CountryCode;
    usage: number;
}

interface Rhythm extends RhythmOverviewData
{
    alternativeNames: string;
    popularity: number;
    category: string;
    usage: RhythmCountryUsage[];
    usageText: string;
    text: string;
}

@Injectable
export class RhythmsController
{
    constructor(private dbController: DatabaseController)
    {
    }

    //Public methods
    public async QueryRhythm(rhythmId: number): Promise<Rhythm | undefined>
    {
        let query = `
        SELECT *
        FROM amedb.rhythms
        WHERE id = ?
        `;

        const conn = await this.dbController.CreateAnyConnectionQueryExecutor();
        const row = await conn.SelectOne(query, rhythmId);

        if(row === undefined)
            return undefined;

        const usage = await this.QueryRhythmUsage(rhythmId);
        return {
            alternativeNames: row.alternativeNames,
            category: row.category,
            id: row.id,
            name: row.name,
            text: row.text,
            usageText: row.usageText,
            timeSigNum: 0,

            popularity: usage.Values().Map(x => x.usage).Sum() / usage.length,
            usage
        };
    }

    public async QueryRhythms(): Promise<RhythmOverviewData[]>
    {
        let query = `
        SELECT
            r.id, r.name, rts.numerator AS timeSigNum
        FROM amedb.rhythms r
        INNER JOIN amedb.rhythms_timeSigs rts
            ON r.id = rts.rhythmId
        ORDER BY rts.numerator, r.name
        `;

        const conn = await this.dbController.CreateAnyConnectionQueryExecutor();
        const rows = await conn.Select<RhythmOverviewData>(query);

        return rows;
    }

    //Private methods
    private async QueryMaxRhythmUsage(): Promise<number>
    {
        let query = `
        SELECT MAX(rhythmUsageCounts.count) AS maxCount
        FROM (
            SELECT mpr.rhythmId, COUNT(mpr.pieceId) AS count
            FROM amedb.musical_pieces_rhythms mpr
            GROUP BY mpr.rhythmId
        ) AS rhythmUsageCounts
        `;

        const conn = await this.dbController.CreateAnyConnectionQueryExecutor();
        const row = await conn.SelectOne(query);

        if(row === undefined)
            return 1;
        return row.maxCount;
    }

    private async QueryRhythmUsage(rhythmId: number): Promise<RhythmCountryUsage[]>
    {
        let query = `
        SELECT pl.location, COUNT(*) AS count
        FROM amedb.musical_pieces_rhythms mpr
        INNER JOIN amedb.musical_pieces mp
            ON mp.id = mpr.pieceId
        INNER JOIN amedb.persons_locations pl
            ON pl.personId = mp.composerId
        WHERE mpr.rhythmId = ?
        GROUP BY pl.location
        `;

        const conn = await this.dbController.CreateAnyConnectionQueryExecutor();
        const rows = await conn.Select(query, rhythmId);

        const maxCount = await this.QueryMaxRhythmUsage();
        return rows.map(row => ({
            countryCode: row.location,
            usage: row.count / maxCount
        }));
    }
}