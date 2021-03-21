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
import { Musical } from "ame-api";
import { DatabaseController } from "./DatabaseController";

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
        const rows= await conn.Select<Musical.API.LanguagesAPI.List.Language>("SELECT * FROM amedb.musical_pieces_languages");

        return rows;
    }

    public async QueryForm(formId: number)
    {
        const conn = await this.dbController.CreateAnyConnectionQueryExecutor();
        const row = await conn.SelectOne<Musical.API.FormsAPI.List.Form>("SELECT * FROM amedb.musical_pieces_forms WHERE id = ?", formId);

        return row;
    }

    public async QueryForms() : Promise<Musical.API.FormsAPI.List.Form[]>
    {
        const conn = await this.dbController.CreateAnyConnectionQueryExecutor();
        const rows = await conn.Select<Musical.API.FormsAPI.List.Form>("SELECT * FROM amedb.musical_pieces_forms");

        return rows;
    }
}