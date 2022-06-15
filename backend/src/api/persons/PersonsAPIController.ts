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
import { APIController, Body, Get, Post, Query } from "acts-util-apilib";
import { Person, PersonOverviewData, PersonsController, PersonType } from "../../dataaccess/PersonsController";

interface ResultData
{
    persons: PersonOverviewData[];
    totalCount: number;
}

@APIController("persons")
class PersonsAPIController
{
    constructor(private personsController: PersonsController)
    {
    }

    @Post()
    public async AddPerson(
        @Body person: Person
    )
    {
        const personId = await this.personsController.AddPerson(person);
        return personId;
    }

    @Get()
    public async QueryPersons(
        @Query type: PersonType,
        @Query nameFilter: string,
        @Query offset: number,
        @Query limit: number,
    ): Promise<ResultData>
    {
        const result = await this.personsController.QueryPersons(type, nameFilter, offset, limit);
        return {
            persons: result.persons,
            totalCount: result.totalCount,
        };
    }
}