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
import crypto from "crypto";

import { ParseOctavePitch } from "ame-api";
import { ImageCacheManager } from "../../services/ImageCacheManager";
import { LilypondImageCreator } from "../../services/LilypondImageCreator";
import { IntervalsService } from "../../services/IntervalsService";
import { MaqamPicCreator } from "../../services/MaqamPicCreator";
import { APIController, Get, Query } from "acts-util-apilib";

type ScoreType = "maqam" | "rhythm" | "rhythm2";

@APIController("score")
class ScoreAPIController
{
    constructor(private imgCacheManager: ImageCacheManager, private lilypondImageCreator: LilypondImageCreator, private intervalsService: IntervalsService,
        private maqamPicCreator: MaqamPicCreator)
    {
    }

    @Get("image")
    public async QueryScoreImage(
        @Query type: ScoreType,
        @Query data: string
    )
    {
        const text = data.trim();

        const cacheName = crypto.createHash('md5').update(text).digest('hex');
        let imgData = await this.imgCacheManager.ReadCachedImage(type, cacheName);

        if(imgData === undefined)
        {
            imgData = await this.CreateImage(type, text);
            this.imgCacheManager.StoreImage(type, cacheName, imgData);
        }

        return imgData;
    }

    //Private methods
    private CreateImage(type: ScoreType, text: string)
    {
        switch(type)
        {
            case "maqam":
                return this.CreateMaqamImage(text);
            case "rhythm":
                return this.CreateRhythmImage(text);
            case "rhythm2":
                return this.CreateRhythm2Image(text);
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

    private CreateRhythm2Image(text: string)
    {
        const completeText = `
        \\include "arabic-rhythm2.ly"
        ${text}
        }}
        `;
        return this.lilypondImageCreator.CreateImage(completeText);
    }
}