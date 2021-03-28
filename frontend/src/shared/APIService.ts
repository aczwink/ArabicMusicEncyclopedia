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

import { HTTPMethod, HTTPService, Injectable } from "acfrontend";
import { g_backendAuthority } from "../backend";

@Injectable
export class APIService
{
    constructor(private httpService: HTTPService)
    {
    }

    //Private methods
    public Request<T>(route: string, method: HTTPMethod, data: any, routeParams?: any)
    {
        return this.httpService.SimpleRequest<T>(g_backendAuthority, route, method, data, routeParams);
    }
}