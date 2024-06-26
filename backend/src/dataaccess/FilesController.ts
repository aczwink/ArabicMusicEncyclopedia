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
import { DatabaseController } from "./DatabaseController";

@Injectable
export class FilesController
{
    constructor(private dbController: DatabaseController)
    {
    }

    //Public methods
    public async QueryFile(title: string)
    {
        const conn = await this.dbController.CreateAnyConnectionQueryExecutor();

        const row = await conn.SelectOne("SELECT data FROM amedb.files WHERE title = ?", title);
        if(row === undefined)
            return null;
        return row.data as Buffer;
    }

    public async UpdateFile(fileName: string, buffer: Buffer)
    {
        const conn = await this.dbController.CreateAnyConnectionQueryExecutor();

        const result = await conn.UpdateRows("amedb.files", { data: buffer}, "title = ?", fileName);
        if(result.affectedRows === 0)
        {
            await conn.InsertRow("amedb.files", { title: fileName, data: buffer});
        }
    }
}