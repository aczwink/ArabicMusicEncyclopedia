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
import { PersonsController } from "../../../dataaccess/PersonsController";

@Injectable
class _api_
{
    constructor(private personsController: PersonsController)
    {
    }

    @HTTPEndPoint({ method: Persons.API.PersonAPI.EditPerson.method, route: Persons.API.PersonAPI.route })
    public async EditPerson(request: HTTPRequest<Persons.API.PersonAPI.EditPerson.RequestData, Persons.API.PersonAPI.RouteParams>): Promise<HTTPResultData<Persons.API.PersonAPI.EditPerson.ResultData>>
    {
        await this.personsController.UpdatePerson(request.routeParams.personId, request.data.person);
        return {
            data: undefined
        };
    }

    @HTTPEndPoint({ method: Persons.API.PersonAPI.QueryPerson.method, route: Persons.API.PersonAPI.route })
    public async QueryPerson(request: HTTPRequest<Persons.API.PersonAPI.QueryPerson.RequestData, Persons.API.PersonAPI.RouteParams>): Promise<HTTPResultData<Persons.API.PersonAPI.QueryPerson.ResultData>>
    {
        const person = await this.personsController.QueryPerson(request.routeParams.personId);
        return {
            data: person === undefined ? undefined : {
                person
            }
        };
    }

    @HTTPEndPoint({ method: Persons.API.PersonAPI.ImageAPI.Query.method, route: Persons.API.PersonAPI.ImageAPI.route })
    public async QueryPersonImage(request: HTTPRequest<Persons.API.PersonAPI.ImageAPI.Query.RequestData, Persons.API.PersonAPI.ImageAPI.RouteParams>): Promise<HTTPResultData<Persons.API.PersonAPI.ImageAPI.Query.ResultData>>
    {
        const image = await this.personsController.QueryPersonImage(request.routeParams.personId);
        return {
            data: image === undefined ? Buffer.from("R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==", "base64") : image,
            headers: {
                "content-type": image === undefined ? "image/gif" : "TODO"
            }
        };
    }

    @HTTPEndPoint({ method: Persons.API.PersonAPI.ImageAPI.Update.method, route: Persons.API.PersonAPI.ImageAPI.route, files: [{name: "image", maxCount: 1}] })
    public async UpdatePersonImage(request: HTTPRequest<Persons.API.PersonAPI.ImageAPI.Update.RequestData, Persons.API.PersonAPI.ImageAPI.RouteParams>): Promise<HTTPResultData<Persons.API.PersonAPI.ImageAPI.Query.ResultData>>
    {
        await this.personsController.UpdatePersonImage(request.routeParams.personId, request.files.image![0].buffer);
        return {
            data: {}
        };
    }
}

export default _api_;