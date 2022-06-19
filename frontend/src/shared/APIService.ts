/**
 * ArabicMusicEncyclopedia
 * Copyright (C) 2021-2022 Amir Czwink (amir130@hotmail.de)
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
import { APIServiceBase, HTTPService, Injectable } from "acfrontend";
import { g_backendAuthority, g_backendProtocol } from "../backend";
import { API } from "../../dist/api";

@Injectable
export class APIService extends API
{
    constructor(httpService: HTTPService)
    {
        super( req => this.base.IssueRequest(req) );

        this.base = new APIServiceBase(httpService, g_backendAuthority, g_backendProtocol);
    }

    //Private variables
    private base: APIServiceBase;
}