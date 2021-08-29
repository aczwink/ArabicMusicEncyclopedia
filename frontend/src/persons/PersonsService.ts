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
    public AddPerson(routeParams: undefined, data: Persons.API.AddPerson.RequestData)
    {
        return this.apiService.Request<Persons.API.AddPerson.ResultData>(Persons.API.route, Persons.API.AddPerson.method, data, routeParams);
    }

    public EditPerson(routeParams: Persons.API.PersonAPI.RouteParams, data: Persons.API.PersonAPI.EditPerson.RequestData)
    {
        return this.apiService.Request<Persons.API.PersonAPI.EditPerson.ResultData>(Persons.API.PersonAPI.route, Persons.API.PersonAPI.EditPerson.method, data, routeParams);
    }

    public QueryPerson(routeParams: Persons.API.PersonAPI.RouteParams, data: Persons.API.PersonAPI.QueryPerson.RequestData)
    {
        return this.apiService.Request<Persons.API.PersonAPI.QueryPerson.ResultData>(Persons.API.PersonAPI.route, Persons.API.PersonAPI.QueryPerson.method, data, routeParams);
    }

    public QueryPersons(data: Persons.API.List.RequestData)
    {
        return this.apiService.Request<Persons.API.List.ResultData>(Persons.API.route, Persons.API.List.method, data);
    }

    public async UpdatePersonImage(personId: number, image: File | null)
    {
        const routeParams: Persons.API.PersonAPI.ImageAPI.RouteParams = {
            personId
        };

        if(image === null)
        {
            await this.apiService.Request(Persons.API.PersonAPI.ImageAPI.route, Persons.API.PersonAPI.ImageAPI.Delete.method, undefined, routeParams);
        }
        else
        {
            const fd = new FormData();
            fd.append("image", image);

            await this.apiService.Request(Persons.API.PersonAPI.ImageAPI.route, Persons.API.PersonAPI.ImageAPI.Update.method, fd, routeParams);
        }
    }
}