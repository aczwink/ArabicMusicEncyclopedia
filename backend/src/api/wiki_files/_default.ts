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
import { WikiFiles } from "ame-api";
import { FilesController } from "../../dataaccess/FilesController";

@Injectable
class _api_
{
    constructor(private filesController: FilesController)
    {
    }

    @HTTPEndPoint({ method: WikiFiles.API.QueryFile.method, route: WikiFiles.API.route })
    public async QueryFile(request: HTTPRequest<WikiFiles.API.QueryFile.RequestData, WikiFiles.API.RouteParams>): Promise<HTTPResultData<Buffer>>
    {
        const result = await this.filesController.QueryFile(request.data.title);
        if(result === null)
            return {
                statusCode: 404
            };
            
        return {
            data: result
        };
    }

    @HTTPEndPoint({ method: WikiFiles.API.UpdateFile.method, route: WikiFiles.API.route, files: [{name: "data", maxCount: 1}] })
    public async UpdateFile(request: HTTPRequest<WikiFiles.API.UpdateFile.RequestData, WikiFiles.API.RouteParams>): Promise<HTTPResultData<WikiFiles.API.UpdateFile.ResultData>>
    {
        await this.filesController.UpdateFile((request.data as any).fileName, request.files.data![0].buffer);
        return {
        };
    }
}

export default _api_;