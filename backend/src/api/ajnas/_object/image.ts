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
import { Ajnas, ParseOctavePitch } from "ame-api";
import { ImageCacheManager } from "../../../services/ImageCacheManager";
import { AjnasController } from "../../../dataaccess/AjnasController";
import { MaqamPicCreator } from "../../../services/MaqamPicCreator";

@Injectable
class _api_
{
    constructor(private imgCacheManager: ImageCacheManager, private ajnasController: AjnasController, private maqamPicCreator: MaqamPicCreator)
    {
    }

    @HTTPEndPoint({ method: Ajnas.API.JinsAPI.ImageAPI.Query.method, route: Ajnas.API.JinsAPI.ImageAPI.route })
    public async QueryJinsImage(request: HTTPRequest<Ajnas.API.JinsAPI.ImageAPI.Query.RequestData, Ajnas.API.JinsAPI.ImageAPI.RouteParams>): Promise<HTTPResultData<Ajnas.API.JinsAPI.ImageAPI.Query.ResultData>>
    {
        const cacheName = request.routeParams.jinsId + request.data.basePitch.toLowerCase();
        let data = await this.imgCacheManager.ReadCachedImage("jins", cacheName);

        if(data === undefined)
        {
            const jins = await this.ajnasController.QueryJins(request.routeParams.jinsId);
            if(jins !== undefined)
            {
                const created = await this.maqamPicCreator.CreateImage(ParseOctavePitch(request.data.basePitch), jins.intervals, []);
                this.imgCacheManager.StoreImage("jins", cacheName, created);
                data = created;
            }
        }

        return {
            data
        };
    }
}

export default _api_;