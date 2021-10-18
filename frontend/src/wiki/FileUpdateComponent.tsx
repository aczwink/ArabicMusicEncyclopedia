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

import { Component, FileSelect, Injectable, JSX_CreateElement, ProgressSpinner, RouterState } from "acfrontend";
import { FileReferenceComponent } from "./FileReferenceComponent";
import { WikiFilesService } from "./WikiFilesService";

@Injectable
export class FileUpdateComponent extends Component
{
    constructor(routerState: RouterState, private wikiFilesService: WikiFilesService)
    {
        super();

        this.fileName = routerState.routeParams.title!;
        this.thumb = null;
        this.loading = false;
    }

    //Protected methods
    protected Render(): RenderValue
    {
        if(this.loading)
            return <ProgressSpinner />;
            
        return <fragment>
            <FileReferenceComponent fileName={this.fileName} />
            <FileSelect onChanged={newValue => this.thumb = newValue} />
            <button type="button" onclick={this.OnSave.bind(this)} disabled={this.thumb === null}>Save</button>
        </fragment>;
    }

    //Private members
    private fileName: string;
    private thumb: File | null;
    private loading: boolean;

    //Event handlers
    private async OnSave()
    {
        this.loading = true;
        await this.wikiFilesService.UpdateFile(this.fileName, this.thumb!);
        this.loading = false;
    }
}