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

import { HTTPService, Injectable } from "acfrontend";
import { WikiFiles } from "ame-api";
import { g_backendAuthority, g_backendBaseUrl } from "../backend";
import { APIService } from "../shared/APIService";

@Injectable
export class WikiFilesService
{
    constructor(private apiService: APIService, private httpService: HTTPService)
    {
    }

    //Public methods
    public async QueryFile(routeParams: WikiFiles.API.RouteParams, data: WikiFiles.API.QueryFile.RequestData)
    {
        try
        {
            return await this.httpService.Request({
                data: {},
                headers: {},
                method: WikiFiles.API.QueryFile.method,
                responseType: "blob",
                url: g_backendBaseUrl + WikiFiles.API.route + "?title=" + data.title
            });
        }
        catch(error)
        {
            if(error === 404)
                return null;
            throw error;
        }
    }

    public async UpdateFile(fileName: string, file: File)
    {
        const fd = new FormData();
        fd.append("fileName", fileName);
        fd.append("data", file);
        
        await this.apiService.Request(WikiFiles.API.route, WikiFiles.API.UpdateFile.method, fd, {});
    }
}