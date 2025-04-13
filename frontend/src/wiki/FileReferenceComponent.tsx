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

import { Anchor, Component, Injectable, JSX_CreateElement, ProgressSpinner } from "acfrontend";
import { g_backendBaseUrl } from "../env";
import { WikiFilesService } from "./WikiFilesService";

@Injectable
export class FileReferenceComponent extends Component<{ fileName: string; }>
{
    constructor(private wikiFilesService: WikiFilesService)
    {
        super();

        this.exists = null;
    }
    
    protected Render(): RenderValue
    {
        if(this.exists === null)
            return <ProgressSpinner />;

        return <Anchor route={"/wiki/file/" + this.input.fileName}>{this.RenderContent(this.input.fileName)}</Anchor>
    }

    private RenderContent(fileName: string)
    {
        if(this.exists === false)
            return "Create file: " + fileName;

        const imageExtensions = [
            ".gif", ".jpg", ".png", ".svg"
        ];
        for (const ext of imageExtensions)
        {
            if(fileName.endsWith(ext))
                return <img src={g_backendBaseUrl + "/files?title=" + fileName} />;   
        }
        return fileName;
    }

    //Private members
    private exists: boolean | null;

    //Event handlers
    public async OnInitiated()
    {
        const data = await this.wikiFilesService.QueryFile(this.input.fileName);
        this.exists = data !== null;
    }
}