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
import { Ajnas, OctavePitch, ParseOctavePitch } from "ame-api";
import { Interval } from "../model/Interval";
import { DatabaseController } from "./DatabaseController";

export interface JinsData
{
    name: string;
    basePitch: OctavePitch;
    intervals: Interval[];
}

@Injectable
export class AjnasController
{
    constructor(private dbController: DatabaseController)
    {
    }

    //Public methods
    public async QueryJins(jinsId: number): Promise<JinsData | undefined>
    {
        const conn = await this.dbController.CreateAnyConnectionQueryExecutor();

        const row = await conn.SelectOne("SELECT name, basePitch, intervals FROM amedb.ajnas WHERE id = ?", jinsId);

        if(row === undefined)
            return undefined;
        return {
            name: row.name,
            basePitch: ParseOctavePitch(row.basePitch),
            intervals: row.intervals.split(",")
        };
    }

    public async QueryAjnas(): Promise<Ajnas.Jins[]>
    {
        const conn = await this.dbController.CreateAnyConnectionQueryExecutor();

        const rows = await conn.Select("SELECT id, name, basePitch, text FROM amedb.ajnas");

        return rows.map(row => ({
            id: row.id,
            name: row.name,
            basePitch: ParseOctavePitch(row.basePitch),
            text: row.text,
        }));
    }
}