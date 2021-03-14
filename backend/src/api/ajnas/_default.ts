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

import { HTTPEndPoint, HTTPRequest, Injectable } from "acts-util-node";
import { HTTPResultData } from "acts-util-node/dist/http/HTTPRequestHandler";
import { Ajnas } from "ame-api";
import { AjnasController } from "../../dataaccess/AjnasController";

@Injectable
class _api_
{
    constructor(private ajnasController: AjnasController)
    {
    }

    @HTTPEndPoint({ method: Ajnas.API.List.method, route: Ajnas.API.route })
    public async ListAjnas(request: HTTPRequest<Ajnas.API.List.RequestData>): Promise<HTTPResultData<Ajnas.API.List.ResultData>>
    {
        return {
            data: await this.ajnasController.QueryAjnas()
        };
    }
}

export default _api_;