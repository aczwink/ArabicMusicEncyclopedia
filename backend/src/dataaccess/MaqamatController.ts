/**
 * ArabicMusicEncyclopedia
 * Copyright (C) 2021-2024 Amir Czwink (amir130@hotmail.de)
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
import { OctavePitch, ParseOctavePitch } from "ame-api";
import { CountryCode } from "ame-api/dist/Locale";
import { Interval } from "../model/Interval";
import { DatabaseController } from "./DatabaseController";

interface MaqamCountryUsage
{
    countryCode: CountryCode | null;
    usage: number;
}

export interface MaqamData
{
    rootJinsId: number;
    dominant: number;
    additionalIntervals: Interval[];
}

export interface MaqamOverviewData
{
    id: number;
    name: string;
    popularity: number;
}

interface Maqam extends MaqamOverviewData
{
    text: string;
    basePitch: OctavePitch;
    branchingJinsIds: number[];
    usage: MaqamCountryUsage[];
}

@Injectable
export class MaqamatController
{
    constructor(private dbController: DatabaseController)
    {
    }

    //Public methods
    public async QueryMaqam(maqamId: number): Promise<MaqamData | undefined>
    {
        const query = `
        SELECT m.rootJinsId, m.dominant, m.additionalIntervals
        FROM amedb.maqamat m
        WHERE m.id = ?
        `;

        const conn = await this.dbController.CreateAnyConnectionQueryExecutor();
        const row = await conn.SelectOne(query, maqamId);

        if(row === undefined)
            return undefined;
        return{
            additionalIntervals: row.additionalIntervals.split(","),
            dominant: row.dominant,
            rootJinsId: row.rootJinsId
        };
    }

    public async QueryMaqamInfo(maqamId: number): Promise<Maqam | undefined>
    {
        const query = `
        SELECT m.id, m.name, m.text, IFNULL(m.basePitchOverride, j.basePitch) AS basePitch
        FROM amedb.maqamat m
        INNER JOIN amedb.ajnas j
            ON j.id = m.rootJinsId
        WHERE m.id = ?
        `;

        const conn = await this.dbController.CreateAnyConnectionQueryExecutor();
        const row = await conn.SelectOne(query, maqamId);
        const rows = await conn.Select("SELECT branchingJinsId FROM amedb.maqamat_forms WHERE maqamId = ?", maqamId);

        if(row === undefined)
            return undefined;

        const usageData = await this.QueryMaqamUsage(maqamId);
        return {
            id: row.id,
            name: row.name,
            text: row.text,
            basePitch: ParseOctavePitch(row.basePitch),
            branchingJinsIds: rows.map(row => row.branchingJinsId),

            popularity: usageData.popularity,
            usage: usageData.usage
        };
    }

    public async QueryMaqamat(rootJinsId?: number): Promise<MaqamOverviewData[]>
    {
        const args = [];
        let query = "SELECT id, name FROM amedb.maqamat";
        if(rootJinsId !== undefined)
        {
            query += " WHERE rootJinsId = ?";
            args.push(rootJinsId);
        }

        const conn = await this.dbController.CreateAnyConnectionQueryExecutor();
        const rows = await conn.Select(query, ...args);

        return await rows.Values().Map(async row => {
            const usageData = await this.QueryMaqamUsage(row.id);

            const mod: MaqamOverviewData = {
                id: row.id,
                name: row.name,
                popularity: usageData.popularity
            };
            return mod;
        }).PromiseAll();
    }

    //Private methods
    private async QueryMaqamUsage(maqamId: number): Promise<{ usage: MaqamCountryUsage[]; popularity: number }>
    {
        let query = `
        SELECT pl.location, COUNT(*) AS count
        FROM amedb.musical_pieces_maqamat mpm
        INNER JOIN amedb.musical_pieces mp
            ON mp.id = mpm.pieceId
        LEFT JOIN amedb.persons_locations pl
            ON pl.personId = mp.composerId
        WHERE mpm.maqamId = ?
        GROUP BY pl.location
        `;

        const conn = await this.dbController.CreateAnyConnectionQueryExecutor();
        const rows = await conn.Select(query, maqamId);

        const maxLocalCount = Math.max(...rows.map(x => x.count as number));

        const maqamGlobalCount = rows.Values().Map(x => x.count as number).Sum();
        const maxGlobalCount = await this.QueryMaxMaqamUsage();
        const globalScale = maqamGlobalCount / maxGlobalCount;

        return {
            popularity: globalScale,
            usage: rows.map(row => ({
                countryCode: row.location,
                usage: (row.count / maxLocalCount)// * globalScale
            })),
        };
    }

    private async QueryMaxMaqamUsage(): Promise<number>
    {
        let query = `
        SELECT MAX(maqamUsageCounts.count) AS maxCount
        FROM (
            SELECT mpm.maqamId, COUNT(mpm.pieceId) AS count
            FROM amedb.musical_pieces_maqamat mpm
            GROUP BY mpm.maqamId
        ) AS maqamUsageCounts
        `;

        const conn = await this.dbController.CreateAnyConnectionQueryExecutor();
        const row = await conn.SelectOne(query);

        if(row === undefined)
            return 1;
        return row.maxCount;
    }
}