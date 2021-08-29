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
import { Persons } from "ame-api";
import { PersonType } from "ame-api/dist/Persons";
import { DatabaseController } from "./DatabaseController";

@Injectable
export class PersonsController
{
    constructor(private dbController: DatabaseController)
    {
    }

    //Public methods
    public async AddPerson(person: Persons.Person)
    {
        const conn = await this.dbController.CreateAnyConnectionQueryExecutor();
        const result = await conn.InsertRow("amedb.persons", {
            name: person.name,
            type: person.type,
            lifeTime: person.lifeTime,
            origin: person.origin
        });

        return result.insertId;
    }

    public async QueryPerson(personId: number)
    {
        const conn = await this.dbController.CreateAnyConnectionQueryExecutor();
        const row = await conn.SelectOne<Persons.Person>("SELECT name, type, lifeTime, origin FROM amedb.persons WHERE id = ?", personId);

        return row;
    }

    public async QueryPersonImage(personId: number)
    {
        const conn = await this.dbController.CreateAnyConnectionQueryExecutor();
        const row = await conn.SelectOne("SELECT data FROM amedb.persons_images WHERE personId = ?", personId);

        if(row === undefined)
            return undefined;
        return row.data;
    }

    public async QueryPersons(type: PersonType): Promise<Persons.PersonOverviewData[]>
    {
        const conn = await this.dbController.CreateAnyConnectionQueryExecutor();
        const rows = await conn.Select<Persons.PersonOverviewData>("SELECT id, name FROM amedb.persons WHERE type = ?", type);

        return rows;
    }

    public async UpdatePerson(personId: number, person: Persons.Person)
    {
        const conn = await this.dbController.CreateAnyConnectionQueryExecutor();

        await conn.UpdateRows("amedb.persons", {
            name: person.name,
            type: person.type,
            lifeTime: person.lifeTime,
            origin: person.origin
        }, "id = ?", personId);
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
}