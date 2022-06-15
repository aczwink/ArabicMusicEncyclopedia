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

import { Anchor, Component, Injectable, JSX_CreateElement, ProgressSpinner } from "acfrontend";
import { RhythmOverviewData } from "../../dist/api";
import { RhythmsService } from "./RhythmsService";

@Injectable
export class ListRhythmsByTimeSignatureComponent extends Component
{
    constructor(private rhythmsService: RhythmsService)
    {
        super();

        this.data = null;
    }
    
    protected Render(): RenderValue
    {
        if(this.data === null)
            return <ProgressSpinner />;

        return this.data.Entries().Map(kv => kv.value).Map(this.RenderRhythmSection.bind(this)).ToArray();
    }

    //Private members
    private data: Map<number, RhythmOverviewData[]> | null;

    //Private methods
    private RenderRhythmSection(rhyhtmSection: RhythmOverviewData[])
    {
        return <fragment>
            <h2>{rhyhtmSection[0].timeSigNum}</h2>
            <ul>
                {rhyhtmSection.map(r => <li><Anchor route={"/rhythms/" + r.id}>{r.name}</Anchor></li>)}
            </ul>
        </fragment>
    }

    //Event handlers
    public async OnInitiated()
    {
        const data = await this.rhythmsService.QueryRhythms();
        const m = new Map<number, RhythmOverviewData[]>();
        for (const rhythm of data)
        {
            const timeSig = rhythm.timeSigNum;
            if(m.has(timeSig))
                m.get(timeSig)!.push(rhythm);
            else
                m.set(timeSig, [rhythm]);
        }
        this.data = m;
    }
}