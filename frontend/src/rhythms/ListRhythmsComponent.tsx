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

import { Anchor, CheckBox, Component, Injectable, JSX_CreateElement, ProgressSpinner } from "acfrontend";
import { RhythmOverviewData } from "../../dist/api";
import { RhythmsService } from "./RhythmsService";

@Injectable
export class ListRhythmsComponent extends Component
{
    constructor(private rhythmsService: RhythmsService)
    {
        super();

        this.data = null;
        this.groupByTimeSig = true;
        this.orderByPopularity = true;
        this.presentationData = [];
    }
    
    protected Render(): RenderValue
    {
        if(this.data === null)
            return <ProgressSpinner />;

        return <fragment>
            <div className="row float-end">
                <div className="col">
                    <label className="me-2">
                        <CheckBox value={this.groupByTimeSig} onChanged={this.UpdateGrouping.bind(this)} />
                        Group by time signature
                    </label>
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
            {this.presentationData.map(this.RenderRhythmSection.bind(this))}
        </fragment>;
    }

    //Private members
    private data: RhythmOverviewData[][] | null;
    private groupByTimeSig: boolean;
    private orderByPopularity: boolean;
    private presentationData: RhythmOverviewData[][];

    //Private methods
    private RenderRhythmSection(rhyhtmSection: RhythmOverviewData[])
    {
        return <fragment>
            {this.RenderRhythmSectionTitle(rhyhtmSection)}
            <ul>
                {rhyhtmSection.map(r => <li><Anchor route={"/rhythms/" + r.id}>{r.name}</Anchor></li>)}
            </ul>
        </fragment>
    }

    private RenderRhythmSectionTitle(rhyhtmSection: RhythmOverviewData[])
    {
        if(this.groupByTimeSig)
            return <h2>{rhyhtmSection[0].timeSigNum}</h2>;
        return null;
    }

    //Private methods
    private GetGroupedPresentationData()
    {
        if(this.groupByTimeSig)
            return this.data!.Clone();
        return [this.data!.Values().Map(x => x.Values()).Flatten().ToArray()];
    }
    private UpdateGrouping()
    {
        this.groupByTimeSig = !this.groupByTimeSig;
        this.UpdatePresentationData();
    }

    private UpdateOrder(newOrder: boolean)
    {
        this.orderByPopularity = newOrder;
        this.UpdatePresentationData();
    }

    private UpdatePresentationData()
    {
        const grouped = this.GetGroupedPresentationData();

        const map = new Map;
        for (const group of grouped)
        {
            if(this.orderByPopularity)
                group.SortByDescending(r => r.popularity);
            else
                group.SortBy(r => r.name);

            const groupPopularity = group.Values().Map(x => x.popularity).Sum() / group.length;
            map.set(group, groupPopularity);
        }

        if(this.orderByPopularity)
            grouped.SortByDescending(g => map.get(g));

        this.presentationData = grouped;
    }

    //Event handlers
    public async OnInitiated()
    {
        const data = await this.rhythmsService.QueryRhythmsGroupedByTimeSigNumerator();
        this.data = data;
        this.UpdatePresentationData();
    }
}