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

import { Component, Injectable, JSX_CreateElement, ProgressSpinner, Router, RouterState } from "acfrontend";
import { WikiService } from "./WikiService";
import { WikiTextEditComponent } from "../shared/WikiTextEditComponent";

@Injectable
export class CreateArticleComponent extends Component
{
    constructor(routerState: RouterState, private wikiService: WikiService, private router: Router)
    {
        super();

        this.title = routerState.routeParams.title!;
        this.text = "";
        this.saving = false;
    }
    
    protected Render(): RenderValue
    {
        if(this.saving)
            return <ProgressSpinner />;

        return <fragment>
            <h1>Create article: {this.title}</h1>
            <WikiTextEditComponent text={this.text} onChanged={newValue => this.text = newValue} />
            <button type="button" onclick={this.OnCreateArticle.bind(this)}>Create</button>
        </fragment>;
    }

    //Private members
    private title: string;
    private text: string;
    private saving: boolean;
    
    //Event handlers
    private async OnCreateArticle()
    {
        this.saving = true;
        await this.wikiService.CreateArticle({}, { title: this.title, text: this.text });
        this.router.RouteTo("/wiki/" + this.title);
    }
}