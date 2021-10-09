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

import { Anchor, Component, Injectable, JSX_CreateElement, MatIcon, ProgressSpinner, RouterState } from "acfrontend";
import { Rhythms } from "ame-api";
import { WikiTextComponent } from "../shared/WikiTextComponent";
import { RhythmsService } from "./RhythmsService";

@Injectable
export class ShowRhythmComponent extends Component
{
    constructor(routerState: RouterState, private rhythmsService: RhythmsService)
    {
        super();
        
        this.data = null;
        this.rhythmId = parseInt(routerState.routeParams.rhythmId!);
    }
    
    protected Render(): RenderValue
    {
        if(this.data === null)
            return <ProgressSpinner />;

        return <fragment>
            <h1>
                {this.data.name}
                <Anchor route={"/rhythms/edit/" + this.rhythmId}><MatIcon>edit</MatIcon></Anchor>
            </h1>
            <div>
                <div class="box" style="float: right; display: block">
                    <table class="keyValue">
                        {this.RenderAlternativeNames()}
                        <tr>
                            <th>Popularity</th>
                            <td>{this.data.popularity}</td>
                        </tr>
                        <tr>
                            <th>Category</th>
                            <td>{this.data.category}</td>
                        </tr>
                    </table>
                    <img src={"/images/usagemaps/" + this.data.usageImage + ".svg"} style="width: 25rem" />
                    <p style="white-space: break-spaces;">{this.data.usageText}</p>
                </div>
                <WikiTextComponent text={this.data.text} />
            </div>
        </fragment>;
    }

    //Private members
    private rhythmId: number;
    private data: Rhythms.Rhythm | null;

    //Private methods
    private RenderAlternativeNames()
    {
        if(this.data!.alternativeNames.trim().length > 0)
            return <tr>
                <th>Alternative names</th>
                <td>{this.data?.alternativeNames}</td>
            </tr>

        return null;
    }

    //Event handlers
    public async OnInitiated()
    {
        const result = await this.rhythmsService.QueryRhythm({ rhythmId: this.rhythmId }, {});
        this.data = result.rhythm;
    }
}