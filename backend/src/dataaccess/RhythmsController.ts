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
import { Rhythms } from "ame-api";
import { DatabaseController } from "./DatabaseController";

@Injectable
export class RhythmsController
{
    constructor(private dbController: DatabaseController)
    {
    }

    //Public methods
    public async QueryRhythm(rhythmId: number)
    {
        let query = `
        SELECT *
        FROM amedb.rhythms
        `;

        const conn = await this.dbController.GetFreeConnection();
        const row = await conn.SelectOne<Rhythms.Rhythm>(query);
        conn.Release();

        return row;
    }

    public async QueryRhythms(): Promise<Rhythms.RhythmOverviewData[]>
    {
        let query = "SELECT id, name, timeSigNum, timeSigDen FROM amedb.rhythms";

        const conn = await this.dbController.GetFreeConnection();
        const rows = await conn.Select<Rhythms.RhythmOverviewData>(query);
        conn.Release();

        return rows;
    }
}