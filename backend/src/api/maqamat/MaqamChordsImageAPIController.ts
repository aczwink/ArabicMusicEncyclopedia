/**
 * ArabicMusicEncyclopedia
 * Copyright (C) 2021-2023 Amir Czwink (amir130@hotmail.de)
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
import { OctavePitch, OctavePitchToString, ParseOctavePitch } from "ame-api";
import { ImageCacheManager } from "../../services/ImageCacheManager";
import { AjnasController } from "../../dataaccess/AjnasController";
import { MaqamatController } from "../../dataaccess/MaqamatController";
import { IntervalsService } from "../../services/IntervalsService";
import { ChordDetectionService } from "../../services/ChordDetectionService";
import { LilypondRendererService } from "../../services/LilypondRendererService";
import { APIController, Get, NotFound, Path, Query } from "acts-util-apilib";

@APIController("maqamat/{maqamId}/chordsImage")
class MaqamChordsImageAPIController
{
    constructor(private imgCacheManager: ImageCacheManager, private ajnasController: AjnasController,
        private maqamController: MaqamatController, private intervalsService: IntervalsService, private chordDetectionService: ChordDetectionService,
        private lilypondImageCreator: LilypondRendererService)
    {
    }

    @Get()
    public async QueryMaqamImage(
        @Path maqamId: number,
        @Query basePitch: string,
        @Query branchingJinsId: number
    )
    {
        const cacheName = this.CreateCacheName(maqamId, basePitch, branchingJinsId);
        let data = await this.imgCacheManager.ReadCachedImage("maqamchords", cacheName);

        if(data === undefined)
        {
            data = await this.CreateImage(maqamId, branchingJinsId, ParseOctavePitch(basePitch));
        }

        if(data === undefined)
            return NotFound("a subresource was not found");

        return data;
    }

    //Private methods
    private CreateCacheName(maqamId: number, basePitch: string, branchingJinsId: number)
    {
        return maqamId + basePitch.toLowerCase() + branchingJinsId;
    }

    private async CreateImage(maqamId: number, branchingJinsId: number, basePitch: OctavePitch)
    {
        const scaleIntervals = await this.intervalsService.QueryMaqamIntervals(maqamId, branchingJinsId);
        if(scaleIntervals === undefined)
            return undefined;

        const chords = this.chordDetectionService.FindChords(scaleIntervals);
        const pitches = this.intervalsService.ResolveScalePitches(basePitch, this.intervalsService.ExtendScale(scaleIntervals, 4));

        const created = await this.lilypondImageCreator.CreateChordImage(chords, pitches);
        this.imgCacheManager.StoreImage("maqamchords", this.CreateCacheName(maqamId, OctavePitchToString(basePitch), branchingJinsId), created);
        return created;
    }
}