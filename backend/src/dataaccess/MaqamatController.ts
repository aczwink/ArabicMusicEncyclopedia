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
import { Maqamat, ParseOctavePitch } from "ame-api";
import { Interval } from "../model/Interval";
import { DatabaseController } from "./DatabaseController";

export interface MaqamData
{
    rootJinsId: number;
    dominant: number;
    additionalIntervals: Interval[];
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

    public async QueryMaqamInfo(maqamId: number): Promise<Maqamat.Maqam | undefined>
    {
        const query = `
        SELECT m.name, j.basePitch
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
        return {
            name: row.name,
            basePitch: ParseOctavePitch(row.basePitch),
            branchingJinsIds: rows.map(row => row.branchingJinsId)
        };
    }

    public async QueryMaqamat(rootJinsId?: number): Promise<Maqamat.API.List.MaqamOverviewData[]>
    {
        const args = [];
        let query = "SELECT id, name FROM amedb.maqamat";
        if(rootJinsId !== undefined)
        {
            query += " WHERE rootJinsId = ?";
            args.push(rootJinsId);
        }

        const conn = await this.dbController.CreateAnyConnectionQueryExecutor();
        const rows = await conn.Select<Maqamat.API.List.MaqamOverviewData>(query, ...args);

        return rows;
    }
}