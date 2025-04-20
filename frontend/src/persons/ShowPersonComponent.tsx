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
import { g_backendBaseUrl } from "../env";
import { WikiTextComponent } from "../shared/WikiTextComponent";
import { PersonsService } from "./PersonsService";
import { MapComponent } from "../shared/MapComponent";
import { OpenArabicMusicDBPerson } from "../../dist/api";


@Injectable
export class ShowPersonComponent extends Component
{
    constructor(routerState: RouterState, private personsService: PersonsService)
    {
        super();

        this.personId = routerState.routeParams.personId!;
        this.data = null;
    }
    
    protected Render(): RenderValue
    {
        if(this.data === null)
            return <ProgressSpinner />;

        const usages = this.data.locations.map(cc => ({ countryCode: cc, usage: 1 }));
        return <fragment>
            <h1>
                {this.data.name}
            </h1>
            <div>
                <div className="box" style="float: right; display: block">
                    <img src={g_backendBaseUrl + "/persons/" + this.personId + "/image"} style="max-width: 25rem" />
                </div>
                <table className="keyValue">
                    <tr>
                        <th>Lifetime</th>
                        <td>{this.data.lifeTime}</td>
                    </tr>
                    <tr>
                        <th>Origin</th>
                        <td>{this.data.origin}</td>
                    </tr>
                </table>
                <WikiTextComponent text={this.data.text} />
                <MapComponent usages={usages} />
            </div>
        </fragment>;
    }

    //Private members
    private personId: string;
    private data: OpenArabicMusicDBPerson | null;

    //Event handlers
    public async OnInitiated()
    {
        const result = await this.personsService.QueryPerson(this.personId);
        this.data = result;
    }
}