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
import { ParseOctavePitch, Score } from "ame-api";
import { ImageCacheManager } from "../../services/ImageCacheManager";
import { LilypondImageCreator } from "../../services/LilypondImageCreator";
import { IntervalsService } from "../../services/IntervalsService";
import { MaqamPicCreator } from "../../services/MaqamPicCreator";

@Injectable
class _api_
{
    constructor(private imgCacheManager: ImageCacheManager, private lilypondImageCreator: LilypondImageCreator, private intervalsService: IntervalsService,
        private maqamPicCreator: MaqamPicCreator)
    {
    }

    @HTTPEndPoint({ method: Score.API.ImageAPI.Query.method, route: Score.API.ImageAPI.route })
    public async QueryScoreImage(request: HTTPRequest<Score.API.ImageAPI.Query.RequestData>): Promise<HTTPResultData<Score.API.ImageAPI.Query.ResultData>>
    {
        const text = request.data.data.trim();

        const cacheName = crypto.createHash('md5').update(text).digest('hex');
        let data = await this.imgCacheManager.ReadCachedImage(request.data.type, cacheName);

        if(data === undefined)
        {
            data = await this.CreateImage(request.data.type, text);
            if(data !== undefined)
                this.imgCacheManager.StoreImage(request.data.type, cacheName, data);
        }

        return {
            data
        };
    }

    //Private methods
    private CreateImage(type: Score.ScoreType, text: string)
    {
        switch(type)
        {
            case "maqam":
                return this.CreateMaqamImage(text);
            case "rhythm":
                return this.CreateRhythmImage(text);
        }
    }

    private CreateMaqamImage(text: string)
    {
        const pitches = text.split(/[\t ]+/);
        const parsedPitches = pitches.map(ParseOctavePitch);
        const fractions = this.intervalsService.ComputeIntervalsFromPitches(parsedPitches);
        const intervals = this.intervalsService.FromNumericIntervals(fractions);

        return this.maqamPicCreator.CreateImage(parsedPitches[0], intervals, []);
    }

    private CreateRhythmImage(text: string)
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