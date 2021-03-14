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
import { Maqamat } from "ame-api";
import { MaqamatController } from "../../dataaccess/MaqamatController";

@Injectable
class _api_
{
    constructor(private maqamatController: MaqamatController)
    {
    }

    @HTTPEndPoint({ method: Maqamat.API.List.method, route: Maqamat.API.route })
    public async ListMaqamat(request: HTTPRequest<Maqamat.API.List.RequestData>): Promise<HTTPResultData<Maqamat.API.List.ResultData>>
    {
        return {
            data: await this.maqamatController.QueryMaqamat(request.data.rootJinsId)
        };
    }

    @HTTPEndPoint({ method: Maqamat.API.MaqamAPI.Query.method, route: Maqamat.API.MaqamAPI.route })
    public async QueryMaqam(request: HTTPRequest<Maqamat.API.MaqamAPI.Query.RequestData, Maqamat.API.MaqamAPI.RouteParams>): Promise<HTTPResultData<Maqamat.API.MaqamAPI.Query.ResultData>>
    {
        return {
            data: await this.maqamatController.QueryMaqamInfo(request.routeParams.maqamId)
        };
    }
}

export default _api_;