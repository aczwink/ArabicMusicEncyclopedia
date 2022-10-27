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

import { Component, Injectable, JSX_CreateElement, ProgressSpinner } from "acfrontend";
import { OctavePitch, OctavePitchToString } from "ame-api";
import { Jins } from "../../dist/api";
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

        return <div className="row">
            <div className="col-1">
                <ul className="nav nav-pills flex-column">
                {this.data.map(this.RenderJinsRow.bind(this))}
                </ul>
            </div>
            <div className="col">{this.RenderSelectedJins()}</div>
        </div>;
    }

    //Private members
    private data: Jins[] | null;
    private selectedJins: Jins | null;
    private selectedPitch: OctavePitch | null;

    //Private methods
    private RenderJinsRow(jins: Jins)
    {
        const className = "nav-link" + ((this.selectedJins === jins) ? " active" : "");
        return <li><a className={className} onclick={this.OnSelectionChanged.bind(this, jins)}>{jins.name}</a></li>;
    }

    private RenderSelectedJins()
    {
        if(this.selectedJins === null)
            return null;

        const pitch = this.selectedPitch === null ? this.selectedJins.basePitch : this.selectedPitch;
        return <fragment>
            <div className="col">
                <div className="row justify-content-center">
                    <div className="col-auto">
                        <img src={g_backendBaseUrl + "/ajnas/" + this.selectedJins.id + "/image?basePitch=" + encodeURIComponent(OctavePitchToString(pitch))} />
                    </div>
                </div>
                <div className="row">Transpose: <PitchSelectionComponent selection={pitch} onChanged={newValue => this.selectedPitch = newValue} /></div>
            </div>
            <WikiTextComponent text={this.selectedJins.text} />
        </fragment>
    }

    //Event handlers
    public async OnInitiated()
    {
        this.data = await this.ajnasService.QueryAjnas();
        this.OnSelectionChanged(this.data[0]);
    }

    private OnSelectionChanged(newSelection: Jins)
    {
        this.selectedJins = newSelection;
        this.selectedPitch = newSelection.basePitch;
    }
}