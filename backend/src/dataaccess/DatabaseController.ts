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
import fs from "fs";
import { Injectable } from "acts-util-node";
import { OpenArabicMusicDBDocument } from "openarabicmusicdb-domain";
import ENV from "../env";

@Injectable
export class DatabaseController
{
    constructor()
    {
        this.documentDB = null;
    }

    //Public methods
    public async GetDocumentDB()
    {
        if(this.documentDB === null)
        {
            const filePath = ENV.documentDBPath;
            const data = await fs.promises.readFile(filePath, "utf-8");
            this.documentDB = JSON.parse(data);
        }
        return this.documentDB!;
    }

    //Private state
    private documentDB: OpenArabicMusicDBDocument | null;
}