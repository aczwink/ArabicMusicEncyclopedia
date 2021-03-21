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

import { Injectable } from "acfrontend";
import { Persons } from "ame-api";
import { APIService } from "../shared/APIService";

@Injectable
export class PersonsService
{
    constructor(private apiService: APIService)
    {
    }

    //Public methods
    public QueryPerson(routeParams: Persons.API.PersonAPI.RouteParams, data: Persons.API.PersonAPI.QueryPerson.RequestData)
    {
        return this.apiService.Request<Persons.API.PersonAPI.QueryPerson.ResultData>(Persons.API.PersonAPI.route, Persons.API.PersonAPI.QueryPerson.method, data, routeParams);
    }

    public QueryPersons(data: Persons.API.List.RequestData)
    {
        return this.apiService.Request<Persons.API.List.ResultData>(Persons.API.route, Persons.API.List.method, data);
    }
}