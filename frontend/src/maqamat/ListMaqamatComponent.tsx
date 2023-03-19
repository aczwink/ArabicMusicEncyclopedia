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

import { Anchor, Component, FormField, Injectable, JSX_CreateElement, ProgressSpinner } from "acfrontend";
import { MaqamOverviewData } from "../../dist/api";
import { MaqamatService } from "./MaqamatService";

@Injectable
export class ListMaqamatComponent extends Component
{
    constructor(private maqamatService: MaqamatService)
    {
        super();

        this.maqamat = null;
        this.orderByPopularity = true;
    }
    
    protected Render(): RenderValue
    {
        if(this.maqamat === null)
            return <ProgressSpinner />;

        return <fragment>
            <div className="row float-end">
                <div className="col">
                    <label className="me-2">
                        <input className="form-check-input me-1" type="radio" checked={this.orderByPopularity === false} onclick={this.UpdateOrder.bind(this, false)} />
                        Order by name
                    </label>
                    <label>
                        <input className="form-check-input me-1" type="radio" checked={this.orderByPopularity === true} onclick={this.UpdateOrder.bind(this, true)} />
                        Order by popularity
                    </label>
                </div>
            </div>
            <ul>
                {this.maqamat.map(maqam => <li><Anchor route={"/maqamat/" + maqam.id}>{maqam.name}</Anchor></li>)}
            </ul>
        </fragment>;
    }

    //Private state
    private maqamat: MaqamOverviewData[] | null;
    private orderByPopularity: boolean;

    //Private methods
    private UpdateOrder(newOrder: boolean)
    {
        this.orderByPopularity = newOrder;

        if(this.orderByPopularity)
            this.maqamat?.SortByDescending(x => x.popularity);
        else
            this.maqamat?.SortBy(x => x.name);
    }

    //Event handlers
    public async OnInitiated()
    {
        this.maqamat = await this.maqamatService.QueryMaqamat();
        this.UpdateOrder(this.orderByPopularity);
    }
}