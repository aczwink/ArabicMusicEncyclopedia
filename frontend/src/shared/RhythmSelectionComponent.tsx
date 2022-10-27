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

import { Component, Injectable, JSX_CreateElement, ProgressSpinner, Select } from "acfrontend";
import { RhythmOverviewData } from "../../dist/api";
import { RhythmsService } from "../rhythms/RhythmsService";

interface RhythmSelectionInput
{
    rhythmId: number | null;
    rhythmGroups: RhythmOverviewData[][];
    onSelectionChanged: (newValue: number) => void;
}

export class RhythmSelectionComponent extends Component<RhythmSelectionInput>
{
    protected Render(): RenderValue
    {
        return <Select onChanged={newValue => this.input.onSelectionChanged(parseInt(newValue[0]))}>
            {this.input.rhythmGroups.map(rhythmGroup =>
                <optgroup label={rhythmGroup[0].timeSigNum.toString()}>
                    {rhythmGroup.map(form => <option value={form.id.toString()} selected={this.input.rhythmId === form.id}>{form.name}</option>)}
                </optgroup>)}
        </Select>;
    }
}

@Injectable
export class FullRhythmSelectionComponent extends Component<{ rhythmId: number | null; onSelectionChanged: (newValue: number) => void; }>
{
    constructor(private rhythmsService: RhythmsService)
    {
        super();

        this.rhythmGroups = null;
    }

    protected Render(): RenderValue
    {
        if(this.rhythmGroups === null)
            return <ProgressSpinner />;

        return <RhythmSelectionComponent rhythmId={this.input.rhythmId} rhythmGroups={this.rhythmGroups} onSelectionChanged={this.input.onSelectionChanged} />;
    }

    //Private variables
    private rhythmGroups: RhythmOverviewData[][] | null;

    //Event handlers
    override async OnInitiated(): Promise<void>
    {
        const rhythms = await this.rhythmsService.QueryRhythmsGroupedByTimeSigNumerator();
        this.rhythmGroups = rhythms;
    }
}