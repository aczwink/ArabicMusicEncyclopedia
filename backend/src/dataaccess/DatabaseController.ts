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
import { DBFactory, Injectable } from "acts-util-node";
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
    public async CreateAnyConnectionQueryExecutor()
    {
        throw new Error("TODO: replace me");
        const instance = await this.GetPoolInstance();
        return instance.value.CreateAnyConnectionQueryExecutor();
    }

    public async GetDocumentDB()
    {
        if(this.documentDB === null)
        {
            const filePath = ENV.database.documentDBPath;
            const data = await fs.promises.readFile(filePath, "utf-8");
            this.documentDB = JSON.parse(data);
        }
        return this.documentDB!;
    }

    //Private methods
    private async GetPoolInstance()
    {
        const factory = new DBFactory;

        const dbPw = await fs.promises.readFile("/run/secrets/dbpw", "utf-8");
        
        const pool = await factory.CreateConnectionPool({
            type: "mysql",
            host: ENV.database.host,
            username: ENV.database.user,
            password: dbPw
        });
        return pool;
    }

    //Private state
    private documentDB: OpenArabicMusicDBDocument | null;
}