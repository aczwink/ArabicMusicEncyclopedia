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
import { Rhythms } from "ame-api";
import { RhythmsController } from "../../dataaccess/RhythmsController";

@Injectable
class _api_
{
    constructor(private rhythmsController: RhythmsController)
    {
    }

    @HTTPEndPoint({ method: Rhythms.API.List.method, route: Rhythms.API.route })
    public async ListRhythms(request: HTTPRequest<Rhythms.API.List.RequestData>): Promise<HTTPResultData<Rhythms.API.List.ResultData>>
    {
        return {
            data: {
                rhythms: await this.rhythmsController.QueryRhythms(),
            }
        };
    }

    @HTTPEndPoint({ method: Rhythms.API.RhythmAPI.Query.method, route: Rhythms.API.RhythmAPI.route })
    public async QueryRhythm(request: HTTPRequest<Rhythms.API.RhythmAPI.Query.RequestData, Rhythms.API.RhythmAPI.RouteParams>): Promise<HTTPResultData<Rhythms.API.RhythmAPI.Query.ResultData>>
    {
        const rhythm = await this.rhythmsController.QueryRhythm(request.routeParams.rhythmId);
        return {
            data: rhythm === undefined ? undefined : {
                rhythm
            }
        };
    }
}

export default _api_;