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
import { DBConnectionPool, DBFactory, DBResource, Injectable } from "acts-util-node";
import ENV from "../env";

@Injectable
export class DatabaseController
{
    constructor()
    {
        this.pool = null;
    }

    //Public methods
    public Close()
    {
        if(this.pool === null)
            return;
        this.pool.Close();
        this.pool = null;
    }

    public async CreateAnyConnectionQueryExecutor()
    {
        const instance = await this.GetPoolInstance();
        return instance.value.CreateAnyConnectionQueryExecutor();
    }

    public CreateQueryBuilder()
    {
        const factory = new DBFactory;
        return factory.CreateQueryBuilder("mysql");
    }

    public async GetFreeConnection()
    {
        const instance = await this.GetPoolInstance();
        return instance.value.GetFreeConnection();
    }

    //Private members
    private pool: DBResource<DBConnectionPool> | null;

    //Private methods
    private async GetPoolInstance()
    {
        if(this.pool === null)
        {
            const factory = new DBFactory;

            const dbPw = await fs.promises.readFile("/run/secrets/dbpw", "utf-8");

            this.pool = await factory.CreateConnectionPool({
                type: "mysql",
                host: ENV.database.host,
                username: ENV.database.user,
                password: dbPw
            });
        }
        return this.pool;
    }
}