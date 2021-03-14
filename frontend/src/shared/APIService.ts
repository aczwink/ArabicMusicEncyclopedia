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

import { HttpService, Injectable, RouterState, Url } from "acfrontend";
import { g_backendAuthority } from "../backend";

@Injectable
export class APIService
{
    constructor(private httpService: HttpService)
    {
    }

    //Private methods
    public Request<ResultType>(route: string, method: "GET" | "POST", data: any, routeParams?: any)
    {
        if(routeParams !== undefined)
        {
            const segments = RouterState.CreateAbsoluteUrl(route).pathSegments;
            route = "/" + segments.map(x => x.startsWith(":") ? routeParams[x.substr(1)] : x).join("/");
        }
        const url = new Url({
            authority: g_backendAuthority,
            path: route,
            protocol: "http",
            queryParams: {}
        });

        if(method === "GET")
            return this.httpService.Get<ResultType>(url.ToString(), data);
        return this.httpService.DataRequest<ResultType>(url.ToString(), method, data);
    }
}