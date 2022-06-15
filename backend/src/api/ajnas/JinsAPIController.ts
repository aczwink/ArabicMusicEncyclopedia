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
import { APIController, Get, NotFound, Path, Query } from "acts-util-apilib";
import { ParseOctavePitch } from "ame-api";
import { AjnasController } from "../../dataaccess/AjnasController";
import { ImageCacheManager } from "../../services/ImageCacheManager";
import { MaqamPicCreator } from "../../services/MaqamPicCreator";

@APIController("ajnas/{jinsId}")
class JinsAPIController
{
    constructor(private imgCacheManager: ImageCacheManager, private ajnasController: AjnasController, private maqamPicCreator: MaqamPicCreator)
    {
    }

    @Get("image")
    public async QueryJinsImage(
        @Path jinsId: number,
        @Query basePitch: string
    )
    {
        const cacheName = jinsId + basePitch.toLowerCase();
        let data = await this.imgCacheManager.ReadCachedImage("jins", cacheName);

        if(data === undefined)
        {
            const jins = await this.ajnasController.QueryJins(jinsId);
            if(jins === undefined)
                return NotFound("jins does not exist");
                
            const created = await this.maqamPicCreator.CreateImage(ParseOctavePitch(basePitch), jins.intervals, []);
            this.imgCacheManager.StoreImage("jins", cacheName, created);
            data = created;
        }
        
        return data;
    }
}