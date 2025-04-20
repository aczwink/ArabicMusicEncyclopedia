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
import { Dictionary, ObjectExtensions } from "acts-util-core";
import { CountryCode } from "openarabicmusicdb-domain";

export interface MaqamCountryUsage
{
    countryCode: CountryCode | null;
    usage: number;
}

export interface RhythmCountryUsage
{
    countryCode: CountryCode | null;
    usage: number;
}

interface MaqamStats
{
    popularity: number;
    usage: MaqamCountryUsage[];
}

interface RhythmStats
{
    popularity: number;
    usage: RhythmCountryUsage[];
}

@Injectable
export class StatisticsController
{
    constructor(private dbController: DatabaseController)
    {
        this.maqamStatsCache = null;
        this.rhythmStatsCache = null;
    }

    //Public methods
    public async QueryMaqamUsage(maqamId: string)
    {
        if(this.maqamStatsCache === null)
        {
            const result = await this.ComputeAllMaqamStats();
            this.maqamStatsCache = result;
            return result[maqamId];
        }
        return this.maqamStatsCache[maqamId];
    }

    public async QueryMaqamUsageSafe(maqamId: string)
    {
        const usageData = await this.QueryMaqamUsage(maqamId);
        if(usageData === undefined)
            throw new Error("Should never happen");
        return usageData;
    }

    public async QueryRhythmUsage(rhythmId: string)
    {
        if(this.rhythmStatsCache === null)
        {
            const result = await this.ComputeAllRhythmStats();
            this.rhythmStatsCache = result;
            return result[rhythmId];
        }
        return this.rhythmStatsCache[rhythmId];
    }

    //Private methods
    private async ComputeAllMaqamStats()
    {
        const document = await this.dbController.GetDocumentDB();
        
        const dicts: Dictionary<{
            stats: Dictionary<number>;
            globalCount: number;
        }> = {};
        let maxGlobalCount = 0;
        for (const maqam of document.maqamat)
        {
            const stats = await this.ComputeMaqamStats(maqam.id);
            const maqamGlobalCount = ObjectExtensions.Values(stats).NotUndefined().Sum();

            dicts[maqam.id] = {
                stats,
                globalCount: maqamGlobalCount
            };

            if(maqamGlobalCount > maxGlobalCount)
                maxGlobalCount = maqamGlobalCount;
        }

        const result: Dictionary<MaqamStats> = {};
        for (const maqam of document.maqamat)
        {
            const statData = dicts[maqam.id]!;

            if(statData.globalCount === 0)
            {
                result[maqam.id] = {
                    popularity: 0,
                    usage: []
                };
            }
            else
            {
                const maxCountryCount = ObjectExtensions.Values(statData.stats).NotUndefined().Max();
                const globalScale = statData.globalCount / maxGlobalCount;

                result[maqam.id] = {
                    popularity: globalScale,
                    usage: ObjectExtensions.Entries(statData.stats).Map(kv => ({
                        countryCode: kv.key as CountryCode,
                        usage: kv.value! / maxCountryCount
                    })).ToArray()
                };
            }
        }

        return result;
    }
    
    private async ComputeAllRhythmStats()
    {
        const document = await this.dbController.GetDocumentDB();
        
        const dicts: Dictionary<{
            stats: Dictionary<number>;
            globalCount: number;
        }> = {};
        let maxGlobalCount = 0;
        for (const rhythm of document.rhythms)
        {
            const stats = await this.ComputeRhythmStats(rhythm.id);
            const rhythmGlobalCount = ObjectExtensions.Values(stats).NotUndefined().Sum();

            dicts[rhythm.id] = {
                stats,
                globalCount: rhythmGlobalCount
            };

            if(rhythmGlobalCount > maxGlobalCount)
                maxGlobalCount = rhythmGlobalCount;
        }

        const result: Dictionary<RhythmStats> = {};
        for (const rhythm of document.rhythms)
        {
            const statData = dicts[rhythm.id]!;

            if(statData.globalCount === 0)
            {
                result[rhythm.id] = {
                    popularity: 0,
                    usage: []
                };
            }
            else
            {
                const maxCountryCount = ObjectExtensions.Values(statData.stats).NotUndefined().Max();
                const globalScale = statData.globalCount / maxGlobalCount;

                result[rhythm.id] = {
                    popularity: globalScale,
                    usage: ObjectExtensions.Entries(statData.stats).Map(kv => ({
                        countryCode: kv.key as CountryCode,
                        usage: kv.value! / maxCountryCount
                    })).ToArray()
                };
            }
        }

        return result;
    }

    private async ComputeMaqamStats(maqamId: string)
    {
        const document = await this.dbController.GetDocumentDB();
        
        const dict: Dictionary<number> = {};
        for (const piece of document.musicalPieces)
        {
            for (const entry of piece.maqamat)
            {
                if(entry.maqamId === maqamId)
                {
                    const composer = document.persons.find(x => x.id === piece.composerId)!;
                    for (const location of composer.locations)
                    {
                        const count = dict[location];
                        if(count === undefined)
                            dict[location] = 1;
                        else
                            dict[location] = count + 1;
                    }
                }
            }
        }
        return dict;
    }

    private async ComputeRhythmStats(rhythmId: string)
    {
        const document = await this.dbController.GetDocumentDB();
        
        const dict: Dictionary<number> = {};
        for (const piece of document.musicalPieces)
        {
            for (const entry of piece.rhythms)
            {
                if(entry.rhythmId === rhythmId)
                {
                    const composer = document.persons.find(x => x.id === piece.composerId)!;
                    for (const location of composer.locations)
                    {
                        const count = dict[location];
                        if(count === undefined)
                            dict[location] = 1;
                        else
                            dict[location] = count + 1;
                    }
                }
            }
        }
        return dict;
    }

    //State
    private maqamStatsCache: Dictionary<MaqamStats> | null;
    private rhythmStatsCache: Dictionary<RhythmStats> | null;
}