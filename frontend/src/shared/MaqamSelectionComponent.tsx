/**
 * ArabicMusicEncyclopedia
 * Copyright (C) 2021-2023 Amir Czwink (amir130@hotmail.de)
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

import { Component, Injectable, JSX_CreateElement, ProgressSpinner, Select } from "acfrontend";
import { MaqamOverviewData } from "../../dist/api";
import { AjnasService } from "../ajnas/AjnasService";
import { MaqamatService } from "../maqamat/MaqamatService";

interface Family
{
    name: string;
    maqamat: MaqamOverviewData[];
}

@Injectable
export class MaqamSelectionComponent extends Component<{ maqamId: number | null; onSelectionChanged: (newValue: number) => void }>
{
    constructor(private maqamatService: MaqamatService, private ajnasService: AjnasService)
    {
        super();

        this.maqamFamilies = null;
    }

    protected Render(): RenderValue
    {
        return <Select onChanged={newValue => this.input.onSelectionChanged(parseInt(newValue[0]))}>
            {this.RenderFamilies()}
        </Select>;
    }

    //Private state
    private maqamFamilies: Family[] | null;

    //Private methods
    private RenderFamilies()
    {
        if(this.maqamFamilies === null)
            return <ProgressSpinner />;

        return this.maqamFamilies.map(x => <optgroup label={x.name}>
            {x.maqamat.map(form => <option value={form.id.toString()} selected={this.input.maqamId === form.id}>{form.name}</option>)}
        </optgroup>);
    }

    //Event handlers
    override async OnInitiated(): Promise<void>
    {
        const ajnas = await this.ajnasService.QueryAjnas();

        const families = await ajnas.Values().Map(async j => {
            const maqamat = await this.maqamatService.QueryMaqamat(j.id);
            maqamat.SortBy(x => x.name);
            
            const family: Family = {
                maqamat,
                name: j.name
            };
            return family;
        }).PromiseAll();

        families.SortBy(x => x.name);
        this.maqamFamilies = families;
    }
}