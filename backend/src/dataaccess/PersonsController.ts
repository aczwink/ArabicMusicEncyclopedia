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
import { CountryCode } from "ame-api/dist/Locale";
import { DatabaseController } from "./DatabaseController";

export enum PersonType
{
    Composer = 0,
    Lyricist = 1,
    Singer = 2
};

export interface Person
{
    name: string;
    type: PersonType;
    lifeTime: string;
    origin: string;
    countryCodes: CountryCode[];
}

export interface PersonOverviewData
{
    id: number;
    name: string;
}

@Injectable
export class PersonsController
{
    constructor(private dbController: DatabaseController)
    {
    }

    //Public methods
    public async AddPerson(person: Person)
    {
        const conn = await this.dbController.CreateAnyConnectionQueryExecutor();
        const result = await conn.InsertRow("amedb.persons", {
            name: person.name,
            type: person.type,
            lifeTime: person.lifeTime,
            origin: person.origin
        });

        await this.UpdatePersonLocations(result.insertId, person.countryCodes);

        return result.insertId;
    }

    public async QueryPerson(personId: number)
    {
        const conn = await this.dbController.CreateAnyConnectionQueryExecutor();
        const row = await conn.SelectOne<Person>("SELECT name, type, lifeTime, origin FROM amedb.persons WHERE id = ?", personId);
        if(row === undefined)
            return undefined;

        const countryCodes = await conn.Select("SELECT location FROM amedb.persons_locations WHERE personId = ?", personId);
        row.countryCodes = countryCodes.map(x => x.location);

        return row;
    }

    public async QueryPersonImage(personId: number)
    {
        const conn = await this.dbController.CreateAnyConnectionQueryExecutor();
        const row = await conn.SelectOne<{ data: Buffer; }>("SELECT data FROM amedb.persons_images WHERE personId = ?", personId);

        if(row === undefined)
            return undefined;
        return row.data;
    }

    public async QueryPersons(type: PersonType, nameFilter: string, offset: number, limit: number)
    {
        const conn = await this.dbController.CreateAnyConnectionQueryExecutor();
        const query = `
        SELECT id, name
        FROM amedb.persons
        WHERE type = ? AND name LIKE ?
        LIMIT ?
        OFFSET ?
        `;
        const rows = await conn.Select<PersonOverviewData>(query, type, "%" + nameFilter + "%", limit, offset);

        const row = await conn.Select("SELECT COUNT(*) AS cnt FROM amedb.persons WHERE type = ? AND name LIKE ?", type, "%" + nameFilter + "%");

        return {
            persons: rows,
            totalCount: (row as any).cnt
        };
    }

    public async UpdatePerson(personId: number, person: Person)
    {
        const conn = await this.dbController.CreateAnyConnectionQueryExecutor();

        await conn.UpdateRows("amedb.persons", {
            name: person.name,
            type: person.type,
            lifeTime: person.lifeTime,
            origin: person.origin
        }, "id = ?", personId);

        await this.UpdatePersonLocations(personId, person.countryCodes);
    }

    public async UpdatePersonImage(personId: number, image: Buffer)
    {
        const conn = await this.dbController.CreateAnyConnectionQueryExecutor();

        const result = await conn.UpdateRows("amedb.persons_images", {
            data: image
        }, "personId = ?", personId);
        if(result.affectedRows === 0)
        {
            await conn.InsertRow("amedb.persons_images", {
                personId,
                data: image
            });
        }
    }

    //Private methods
    private async UpdatePersonLocations(personId: number, countryCodes: CountryCode[])
    {
        const conn = await this.dbController.CreateAnyConnectionQueryExecutor();

        await conn.DeleteRows("amedb.persons_locations", "personId = ?", personId);
        await countryCodes.Values().Map(cc => conn.InsertRow("amedb.persons_locations", { personId, location: cc }) ).PromiseAll();
    }
}