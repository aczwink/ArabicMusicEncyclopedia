/**
 * ArabicMusicEncyclopedia
 * Copyright (C) 2021-2022 Amir Czwink (amir130@hotmail.de)
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
import { DatabaseController } from "./DatabaseController";

interface Form
{
    id: number;
    name: string;
    hasLyrics: boolean;
}

interface Language
{
    id: number;
    name: string;
}

@Injectable
export class MusicalController
{
    constructor(private dbController: DatabaseController)
    {
    }

    //Public methods
    public async QueryLanguages()
    {
        const conn = await this.dbController.CreateAnyConnectionQueryExecutor();
        const rows= await conn.Select<Language>("SELECT * FROM amedb.musical_pieces_languages");

        return rows;
    }

    public async QueryForm(formId: number)
    {
        const conn = await this.dbController.CreateAnyConnectionQueryExecutor();
        const row = await conn.SelectOne<Form>("SELECT * FROM amedb.musical_pieces_forms WHERE id = ?", formId);

        return row;
    }

    public async QueryForms() : Promise<Form[]>
    {
        const conn = await this.dbController.CreateAnyConnectionQueryExecutor();
        const rows = await conn.Select<Form>("SELECT * FROM amedb.musical_pieces_forms");

        return rows;
    }
}