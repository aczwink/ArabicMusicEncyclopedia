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

import { Component, Injectable, JSX_CreateElement, ProgressSpinner } from "acfrontend";
import { Ajnas, OctavePitch, OctavePitchToString } from "ame-api";
import { g_backendBaseUrl } from "../backend";
import { PitchSelectionComponent } from "../shared/PitchSelectionComponent";
import { WikiTextComponent } from "../shared/WikiTextComponent";
import { AjnasService } from "./AjnasService";

@Injectable
export class ListAjnasComponent extends Component
{
    constructor(private ajnasService: AjnasService)
    {
        super();

        this.data = null;
        this.selectedJins = null;
        this.selectedPitch = null;
    }
    
    protected Render(): RenderValue
    {
        if(this.data === null)
            return <ProgressSpinner />;

        return <div>
            <div class="vertNav">
                <ul>
                    {this.data.map(this.RenderJinsRow.bind(this))}
                </ul>
            </div>
            <div class="stack">
                {this.RenderSelectedJins()}
            </div>
        </div>;
    }

    //Private members
    private data: Ajnas.API.List.ResultData | null;
    private selectedJins: Ajnas.Jins | null;
    private selectedPitch: OctavePitch | null;

    //Private methods
    private RenderJinsRow(jins: Ajnas.Jins)
    {
        const className = (this.selectedJins === jins) ? "active" : "";
        return <li class={className}><a onclick={this.OnSelectionChanged.bind(this, jins)}>{jins.name}</a></li>;
    }

    private RenderSelectedJins()
    {
        if(this.selectedJins === null)
            return null;

        const pitch = this.selectedPitch === null ? this.selectedJins.basePitch : this.selectedPitch;
        return <fragment>
            <div class="column">
                <img src={g_backendBaseUrl + "/ajnas/" + this.selectedJins.id + "/image?basePitch=" + OctavePitchToString(pitch)} />
                <div class="row">Transpose: <PitchSelectionComponent selection={pitch} onChanged={newValue => this.selectedPitch = newValue} /></div>
            </div>
            <WikiTextComponent text={this.selectedJins.text} />
        </fragment>
    }

    //Event handlers
    public async OnInitiated()
    {
        this.data = await this.ajnasService.QueryAjnas({});
        this.OnSelectionChanged(this.data[0]);
    }

    private OnSelectionChanged(newSelection: Ajnas.Jins)
    {
        this.selectedJins = newSelection;
        this.selectedPitch = newSelection.basePitch;
    }
}