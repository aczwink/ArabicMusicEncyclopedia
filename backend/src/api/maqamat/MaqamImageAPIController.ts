/**
 * ArabicMusicEncyclopedia
 * Copyright (C) 2021-2025 Amir Czwink (amir130@hotmail.de)
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
import { ImageCacheManager } from "../../services/ImageCacheManager";
import { AjnasController } from "../../dataaccess/AjnasController";
import { MaqamPicCreator } from "../../services/MaqamPicCreator";
import { MaqamatController } from "../../dataaccess/MaqamatController";
import { IntervalsService } from "../../services/IntervalsService";
import { APIController, Get, NotFound, Path, Query } from "acts-util-apilib";
import { ParseOctavePitch, OctavePitch, OctavePitchToString } from "openarabicmusicdb-domain/dist/OctavePitch";

@APIController("maqamat/{maqamId}/image")
class MaqamImageAPIController
{
    constructor(private imgCacheManager: ImageCacheManager, private ajnasController: AjnasController, private maqamPicCreator: MaqamPicCreator,
        private maqamController: MaqamatController, private intervalsService: IntervalsService)
    {
    }

    @Get()
    public async QueryMaqamImage(
        @Path maqamId: string,
        @Query basePitch: string,
        @Query branchingJinsId: string
    )
    {
        const cacheName = this.CreateCacheName(maqamId, basePitch, branchingJinsId);
        let data = await this.imgCacheManager.ReadCachedImage("maqam", cacheName);

        if(data === undefined)
        {
            data = await this.CreateImage(maqamId, ParseOctavePitch(basePitch), branchingJinsId);
        }

        if(data === undefined)
            return NotFound("a subresource was not found");

        return data;
    }

    //Private methods
    private CreateCacheName(maqamId: string, basePitch: string, branchingJinsId: string)
    {
        return maqamId + basePitch.toLowerCase() + branchingJinsId;
    }

    private async CreateImage(maqamId: string, basePitch: OctavePitch, branchingJinsId: string)
    {
        const maqam = await this.maqamController.QueryMaqam(maqamId);
        if(maqam === undefined)
            return undefined;
        
        const rootJins = await this.ajnasController.QueryJins(maqam.rootJinsId);
        if(rootJins === undefined)
            return undefined;
        const branchingJins = await this.ajnasController.QueryJins(branchingJinsId);
        if(branchingJins === undefined)
            return undefined;

        const created = await this.maqamPicCreator.CreateImage(basePitch, this.intervalsService.GetMaqamIntervals(maqam, rootJins, branchingJins), [
            {
                start: 1,
                length: 1 + rootJins.intervals.length,
                name: rootJins.name,
            },
            {
                start: maqam.dominant === 34 ? 3 : maqam.dominant,
                length: 1 + branchingJins.intervals.length,
                name: branchingJins.name
            }
        ]);
        this.imgCacheManager.StoreImage("maqam", this.CreateCacheName(maqamId, OctavePitchToString(basePitch), branchingJinsId), created);
        return created;
    }
}