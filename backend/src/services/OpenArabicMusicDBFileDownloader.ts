/**
 * ArabicMusicEncyclopedia
 * Copyright (C) 2025 Amir Czwink (amir130@hotmail.de)
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

import { HTTP, Injectable } from "acts-util-node";
import { OpenArabicMusicDBAttachment } from "openarabicmusicdb-domain";
import { AbsURL } from "acts-util-core";

@Injectable
export class OpenArabicMusicDBFileDownloader
{    
    public async Download(file: OpenArabicMusicDBAttachment)
    {
        switch(file.type)
        {
            case "external":
            case "private":
                throw new Error("Not implemented");
            case "public":
                return await this.DownloadPublicFile(file.uri);
        }
    }

    //Private methods
    private async DownloadPublicFile(repoPath: string)
    {
        const url = "https://raw.githubusercontent.com/aczwink/OpenArabicMusicDB/refs/heads/main/data" + repoPath;
        const sender = new HTTP.RequestSender();
        const response = await sender.SendRequest({
            body: Buffer.alloc(0),
            headers: {},
            method: "GET",
            url: AbsURL.Parse(url)
        });

        if(response.statusCode === 404)
            return null;
        return response.body;
    }
}