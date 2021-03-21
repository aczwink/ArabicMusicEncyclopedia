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
import crypto from "crypto";

import { HTTPEndPoint, HTTPRequest, HTTPResultData, Injectable } from "acts-util-node";
import { Rhythms } from "ame-api";
import { ImageCacheManager } from "../../services/ImageCacheManager";
import { LilypondImageCreator } from "../../services/LilypondImageCreator";

@Injectable
class _api_
{
    constructor(private imgCacheManager: ImageCacheManager, private lilypondImageCreator: LilypondImageCreator)
    {
    }

    @HTTPEndPoint({ method: Rhythms.API.ImageAPI.Query.method, route: Rhythms.API.ImageAPI.route })
    public async QueryRhythmImage(request: HTTPRequest<Rhythms.API.ImageAPI.Query.RequestData>): Promise<HTTPResultData<Rhythms.API.ImageAPI.Query.ResultData>>
    {
        const text = request.data.data.trim();

        const cacheName = crypto.createHash('md5').update(text).digest('hex');
        let data = await this.imgCacheManager.ReadCachedImage("rhythm", cacheName);

        if(data === undefined)
        {
            data = await this.CreateImage(text);
            if(data !== undefined)
                this.imgCacheManager.StoreImage("rhythm", cacheName, data);
        }

        return {
            data
        };
    }

    //Private methods
    private CreateImage(text: string)
    {
        const completeText = `
        \\include "arabic-rhythm1.ly"
        ${text}
        }}
        `;
        return this.lilypondImageCreator.CreateImage(completeText);
    }
}

export default _api_;