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

    @HTTPEndPoint({ method: Persons.API.List.method, route: Persons.API.route })
    public async QueryPersons(request: HTTPRequest<Persons.API.List.RequestData>): Promise<HTTPResultData<Persons.API.List.ResultData>>
    {
        return {
            data: {
                persons: await this.personsController.QueryPersons(request.data.type),
            }
        };
    }
}

export default _api_;