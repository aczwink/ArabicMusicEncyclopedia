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

import { Component, Injectable, JSX_CreateElement, ProgressSpinner, Router, RouterState } from "acfrontend";
import { WikiService } from "./WikiService";
import { WikiTextEditComponent } from "../shared/WikiTextEditComponent";

@Injectable
export class EditArticleComponent extends Component
{
    constructor(routerState: RouterState, private wikiService: WikiService, private router: Router)
    {
        super();

        this.title = routerState.routeParams.title!;
        this.text = null;
    }
    
    protected Render(): RenderValue
    {
        if(this.text === null)
            return <ProgressSpinner />;

        return <fragment>
            <h1>Edit article: {this.title}</h1>
            <WikiTextEditComponent text={this.text} onChanged={newValue => this.text = newValue} />
            <button type="button" onclick={this.OnSaveArticle.bind(this)}>Save</button>
        </fragment>;
    }

    //Private members
    private title: string;
    private text: string | null;
    
    //Event handlers
    public async OnInitiated()
    {
        const result = await this.wikiService.QueryArticle(this.title);
        this.text = result!.text;
    }


    private async OnSaveArticle()
    {
        const text = this.text!;
        this.text = null;
        await this.wikiService.UpdateArticle(this.title, text);
        this.router.RouteTo("/wiki/" + this.title);
    }
}