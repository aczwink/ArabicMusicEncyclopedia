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
import fs from "fs";
import path from "path";

import { Injectable } from "acts-util-node";

type ImgType = "jins" | "maqam" | "maqamchords" | "rhythm";

@Injectable
export class ImageCacheManager
{
    //Public methods
    public async ReadCachedImage(imgType: ImgType, cacheName: string)
    {
        try
        {
            return await fs.promises.readFile(this.ConstructPath(imgType, cacheName));
        }
        catch(e)
        {
            if(e.code === "ENOENT")
                return undefined;
            else
                throw e;
        }
    }

    public async StoreImage(imgType: ImgType, cacheName: string, data: Buffer)
    {
        try
        {
            await fs.promises.writeFile(this.ConstructPath(imgType, cacheName), data);
        }
        catch(e)
        {
            if(e.code === "ENOENT")
            {
                await this.CreateDir(imgType);
                await fs.promises.writeFile(this.ConstructPath(imgType, cacheName), data);
            }
            else
                throw e;
        }
    }

    //Private methods
    private async CreateDir(imgType: ImgType)
    {
        try
        {
            await fs.promises.mkdir(this.ConstructDirPath(imgType));
        }
        catch(e)
        {
            if(e.code === "ENOENT")
            {
                await fs.promises.mkdir("imgcache");
                await fs.promises.mkdir(this.ConstructDirPath(imgType));
            }
            else
                throw e;
        }
    }

    private ConstructDirPath(imgType: ImgType)
    {
        return path.join("imgcache", imgType);
    }

    private ConstructPath(imgType: ImgType, cacheName: string)
    {
        return path.join(this.ConstructDirPath(imgType), cacheName);
    }
}