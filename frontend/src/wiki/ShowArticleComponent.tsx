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

import { Anchor, Component, Injectable, JSX_CreateElement, MatIcon, ProgressSpinner, Router, RouterState } from "acfrontend";
import { Article } from "ame-api/dist/Wiki";
import { WikiTextComponent } from "../shared/WikiTextComponent";
import { WikiService } from "./WikiService";

@Injectable
export class ShowArticleComponent extends Component
{
    constructor(routerState: RouterState, private wikiService: WikiService, private router: Router)
    {
        super();

        this.title = routerState.routeParams.title!;
        this.article = null;
    }
    
    protected Render()
    {
        if(this.article === null)
            return <ProgressSpinner />;
    
        return <fragment>
            <h1>
                {this.title}
                <Anchor route={"/wiki/edit/" + this.article.id}><MatIcon>edit</MatIcon></Anchor>
            </h1>
            <WikiTextComponent text={this.article.text} />
        </fragment>;
    }

    //Private members
    private title: string;
    private article: Article | null;

    //Event handlers
    public async OnInitiated()
    {
        const result = await this.wikiService.QueryArticle({}, { title: this.title });
        this.article = result.article;

        if(result.article === null)
            this.router.RouteTo("/wiki/create/" + this.title);
    }
}