/**
 * ArabicMusicEncyclopedia
 * Copyright (C) 2023 Amir Czwink (amir130@hotmail.de)
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
import { MaqamWithDominant } from "../../dist/api";
import { APIService } from "../shared/APIService";

@Injectable
export class ListMaqamatGroupingsByDominantComponent extends Component
{
    constructor(private apiService: APIService)
    {
        super();

        this.data = null;
    }
    
    protected Render(): RenderValue
    {
        if(this.data === null)
            return <ProgressSpinner />;
            
        return this.data.map(this.RenderGroup.bind(this));
    }

    //Private state
    private data: MaqamWithDominant[][] | null;

    //Private methods
    private RenderGroup(group: MaqamWithDominant[])
    {
        return <fragment>
            Dominant {group[0].dominant}:
            <ul>
                {group.map(x => <li><Anchor route={"maqamat/" + x.id}>{x.name}</Anchor></li>)}
            </ul>
        </fragment>;
    }

    //Event handlers
    public async OnInitiated()
    {
        const result = await this.apiService.maqamatgroupings.dominant.get();
        result.data.SortByDescending(x => x.length);
        this.data = result.data;
    }
}