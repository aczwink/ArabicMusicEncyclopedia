/**
 * ArabicMusicEncyclopedia
 * Copyright (C) 2021-2025 Amir Czwink (amir130@hotmail.de)
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
import { Maqam, OctavePitch } from "../../dist/api";
import { g_backendBaseUrl } from "../env";
import { MapComponent } from "../shared/MapComponent";
import { PitchSelectionComponent } from "../shared/PitchSelectionComponent";
import { PopularityComponent } from "../shared/PopularityComponent";
import { WikiTextComponent } from "../shared/WikiTextComponent";
import { MaqamatService } from "./MaqamatService";
import { OctavePitchToString } from "openarabicmusicdb-domain/dist/OctavePitch";

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

            <div className="box" style="float: right; display: block">
                <table className="keyValue">
                    <tr>
                        <th>Popularity</th>
                        <td><PopularityComponent popularity={this.maqam.popularity} /></td>
                    </tr>
                </table>
                <MapComponent usages={this.maqam.usage} />
            </div>

            <p>
                <WikiTextComponent text={this.maqam.text} />
            </p>
            
            Transpose: <PitchSelectionComponent selection={pitch} onChanged={newValue => this.selectedPitch = newValue} />

            <h2>Forms</h2>
            <div className="row justify-content-evenly">{this.maqam.branchingJinsIds.map(this.RenderForm.bind(this, pitch))}</div>

            <h2>Chords</h2>
            <div className="row justify-content-evenly">{this.maqam.branchingJinsIds.map(this.RenderChords.bind(this, pitch))}</div>
        </div>;
    }

    //Private members
    private maqamId: string;
    private selectedPitch: OctavePitch | null;
    private maqam: Maqam | null;

    //Private methods
    private RenderChords(pitch: OctavePitch, branchingJinsId: string)
    {
        return <div className="col-auto">
            <img src={g_backendBaseUrl + "/maqamat/" + this.maqamId + "/chordsImage?basePitch=" + OctavePitchToString(pitch) + "&branchingJinsId=" + branchingJinsId} />
        </div>;
    }

    private RenderForm(pitch: OctavePitch, branchingJinsId: string)
    {
        return <div className="col-auto">
            <img src={g_backendBaseUrl + "/maqamat/" + this.maqamId + "/image?basePitch=" + OctavePitchToString(pitch) + "&branchingJinsId=" + branchingJinsId} />
        </div>;
    }

    //Event handlers
    public async OnInitiated()
    {
        this.maqam = await this.maqamatService.QueryMaqam(this.maqamId);
    }
}