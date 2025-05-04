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

import { Injectable } from "acts-util-node";
import { DatabaseController } from "./DatabaseController";

export interface PersonOverviewData
{
    id: string;
    name: string;
}

@Injectable
export class PersonsController
{
    constructor(private dbController: DatabaseController)
    {
    }

    //Public methods
    public async QueryPerson(personId: string)
    {
        const document = await this.dbController.GetDocumentDB();
        const person = document.persons.find(x => x.id === personId);
        return person;
    }

    public async QueryPersonImage(personId: string)
    {
        const document = await this.dbController.GetDocumentDB();
        const person = document.persons.find(x => x.id === personId);
        if(person?.image === undefined)
            return undefined;
        switch(person.image.type)
        {
            case "external":
                return person.image.uri;
            case "private":
                throw new Error("TODO: implement me :)");
        }
    }

    public async QueryPersons(nameFilter: string, offset: number, limit: number)
    {
        nameFilter = nameFilter.toLowerCase();

        const document = await this.dbController.GetDocumentDB();
        const filtered = document.persons.Values().Filter(x => x.name.toLowerCase().includes(nameFilter));

        return {
            persons: filtered.Skip(offset).Take(limit).Map<PersonOverviewData>(x => ({
                id: x.id,
                name: x.name
            })).ToArray(),
            totalCount: filtered.Count()
        };
    }
}