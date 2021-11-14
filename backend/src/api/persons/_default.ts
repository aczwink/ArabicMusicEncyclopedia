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

import { HTTPEndPoint, HTTPRequest, HTTPResultData, Injectable } from "acts-util-node";
import { Persons } from "ame-api";
import { PersonsController } from "../../dataaccess/PersonsController";

@Injectable
class _api_
{
    constructor(private personsController: PersonsController)
    {
    }

    @HTTPEndPoint({ method: Persons.API.AddPerson.method, route: Persons.API.route })
    public async AddPerson(request: HTTPRequest<Persons.API.AddPerson.RequestData>): Promise<HTTPResultData<Persons.API.AddPerson.ResultData>>
    {
        const personId = await this.personsController.AddPerson(request.data.person);
        return {
            data: {
                personId
            }
        };
    }

    @HTTPEndPoint({ method: Persons.API.List.method, route: Persons.API.route })
    public async QueryPersons(request: HTTPRequest<Persons.API.List.RequestData>): Promise<HTTPResultData<Persons.API.List.ResultData>>
    {
        const result = await this.personsController.QueryPersons(request.data.type, request.data.nameFilter, request.data.offset, request.data.limit);
        return {
            data: {
                persons: result.persons,
                totalCount: result.totalCount,
            }
        };
    }
}

export default _api_;