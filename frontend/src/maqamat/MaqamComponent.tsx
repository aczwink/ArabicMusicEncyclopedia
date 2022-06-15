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

import { Component, Injectable, JSX_CreateElement, ProgressSpinner, RouterState } from "acfrontend";
import { OctavePitch, OctavePitchToString } from "ame-api";
import { Maqam } from "../../dist/api";
import { g_backendBaseUrl } from "../backend";
import { PitchSelectionComponent } from "../shared/PitchSelectionComponent";
import { WikiTextComponent } from "../shared/WikiTextComponent";
import { MaqamatService } from "./MaqamatService";

@Injectable
export class MaqamComponent extends Component
{
    constructor(routerState: RouterState, private maqamatService: MaqamatService)
    {
        super();

        this.maqamId = routerState.routeParams.maqamId as any;
        this.selectedPitch = null;
        this.maqam = null;
    }

    protected Render(): RenderValue
    {
        if(this.maqam === null)
            return <ProgressSpinner />;

        const pitch = this.selectedPitch === null ? this.maqam.basePitch : this.selectedPitch;
        return <div>
            <h1>Maqam {this.maqam.name}</h1>

            <p>
                <WikiTextComponent text={this.maqam.text} />
            </p>
            
            Transpose: <PitchSelectionComponent selection={pitch} onChanged={newValue => this.selectedPitch = newValue} />

            <h2>Forms</h2>
            <div class="row evenly-spaced">{this.maqam.branchingJinsIds.map(this.RenderForm.bind(this, pitch))}</div>

            <h2>Chords</h2>
            <div class="row evenly-spaced">{this.maqam.branchingJinsIds.map(this.RenderChords.bind(this, pitch))}</div>
        </div>;
    }

    //Private members
    private maqamId: number;
    private selectedPitch: OctavePitch | null;
    private maqam: Maqam | null;

    //Private methods
    private RenderChords(pitch: OctavePitch, branchingJinsId: number)
    {
        return <img src={g_backendBaseUrl + "/maqamat/" + this.maqamId + "/chordsImage?basePitch=" + OctavePitchToString(pitch) + "&branchingJinsId=" + branchingJinsId} />;
    }

    private RenderForm(pitch: OctavePitch, branchingJinsId: number)
    {
        return <img src={g_backendBaseUrl + "/maqamat/" + this.maqamId + "/image?basePitch=" + OctavePitchToString(pitch) + "&branchingJinsId=" + branchingJinsId} />;
    }

    //Event handlers
    public async OnInitiated()
    {
        this.maqam = await this.maqamatService.QueryMaqam(this.maqamId);
    }
}