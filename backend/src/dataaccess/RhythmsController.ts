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
import { Injectable } from "acts-util-node";
import { DatabaseController } from "./DatabaseController";
import { RhythmCountryUsage, StatisticsController } from "./StatisticsController";

interface RhythmOverviewData
{
    id: string;
    name: string;
    popularity: number;
    timeSigNum: number;
}

interface Rhythm extends RhythmOverviewData
{
    alternativeNames: string;
    category: string;
    usage: RhythmCountryUsage[];
    usageText: string;
    text: string;
}

@Injectable
export class RhythmsController
{
    constructor(private dbController: DatabaseController, private statisticsController: StatisticsController)
    {
    }

    //Public methods
    public async QueryRhythm(rhythmId: string): Promise<Rhythm | undefined>
    {
        const document = await this.dbController.GetDocumentDB();
        const rhythm = document.rhythms.find(x => x.id === rhythmId);

        if(rhythm === undefined)
            return undefined;

        const usage = (await this.statisticsController.QueryRhythmUsage(rhythmId))!;
        return {
            alternativeNames: rhythm.alternativeNames,
            category: rhythm.category,
            id: rhythm.id,
            name: rhythm.name,
            text: rhythm.text,
            usageText: rhythm.usageText,
            timeSigNum: rhythm.timeSignatureNumerators[0],

            popularity: usage.popularity,
            usage: usage.usage,
        };
    }

    public async QueryRhythms(): Promise<RhythmOverviewData[]>
    {
        const document = await this.dbController.GetDocumentDB();

        const res = await document.rhythms.Values().Map(async row => {
            const usageData = (await this.statisticsController.QueryRhythmUsage(row.id))!;

            return row.timeSignatureNumerators.Values().Map<RhythmOverviewData>(x => ({
                id: row.id,
                name: row.name,
                popularity: usageData.popularity,
                timeSigNum: x
            }));
        }).PromiseAll();
        return res.Values().Flatten().ToArray();
    }
}