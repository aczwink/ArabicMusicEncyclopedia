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
import { Jins, MaqamOverviewData } from "../../dist/api";
import { AjnasService } from "../ajnas/AjnasService";
import { MaqamatService } from "./MaqamatService";

@Injectable
export class ListMaqamFamiliesComponent extends Component
{
    constructor(private ajnasService: AjnasService, private maqamatService: MaqamatService)
    {
        super();

        this.rootAjnas = null;
        this.selectedRootJinsId = null;
        this.maqamat = null;
    }
    
    protected Render(): RenderValue
    {
        if(this.rootAjnas === null)
            return <ProgressSpinner />;

        return <div class="row">
            <div class="col-1">
                <ul class="nav nav-pills flex-column">
                {this.rootAjnas.map(this.RenderFamilyRow.bind(this))}
                </ul>
            </div>
            <div class="col">{this.RenderMaqamList()}</div>
        </div>;
    }

    //Private members
    private rootAjnas: Jins[] | null;
    private selectedRootJinsId: number | null;
    private maqamat: MaqamOverviewData[] | null;

    //Private methods
    private RenderFamilyRow(jins: Jins)
    {
        const className = "nav-link" + ((this.selectedRootJinsId === jins.id) ? " active" : "");
        return <li><a class={className} onclick={this.OnSelectionChanged.bind(this, jins.id)}>{jins.name}</a></li>;
    }

    private RenderMaqamList()
    {
        if(this.maqamat === null)
            return <ProgressSpinner />;

        return <ul>
            {this.maqamat.map(maqam => <li><Anchor route={"/maqamat/" + maqam.id}>{maqam.name}</Anchor></li>)}
        </ul>;
    }

    //Event handlers
    public async OnInitiated()
    {
        this.rootAjnas = await this.ajnasService.QueryAjnas();
        this.OnSelectionChanged(this.rootAjnas[0].id);
    }

    private async OnSelectionChanged(newSelection: number)
    {
        this.selectedRootJinsId = newSelection;
        this.maqamat = null;
        this.maqamat = await this.maqamatService.QueryMaqamat(newSelection);
    }
}