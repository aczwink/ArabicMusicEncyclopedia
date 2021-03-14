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
import { Rhythms } from "ame-api";
import { APIService } from "../shared/APIService";

@Injectable
export class RhythmsService
{
    constructor(private apiService: APIService)
    {
    }

    //Public methods
    public QueryRhythm(routeParams: Rhythms.API.RhythmAPI.RouteParams, data: Rhythms.API.RhythmAPI.Query.RequestData)
    {
        return this.apiService.Request<Rhythms.API.RhythmAPI.Query.ResultData>(Rhythms.API.RhythmAPI.route, Rhythms.API.RhythmAPI.Query.method, data, routeParams);
    }

    public QueryRhythms(data: Rhythms.API.List.RequestData)
    {
        return this.apiService.Request<Rhythms.API.List.ResultData>(Rhythms.API.route, Rhythms.API.List.method, data);
    }
}