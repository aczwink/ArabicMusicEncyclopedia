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
import { OctavePitch } from "openarabicmusicdb-domain/dist/OctavePitch";
import { Interval } from "openarabicmusicdb-domain";
import { MaqamCountryUsage, StatisticsController } from "./StatisticsController";

export interface MaqamData
{
    rootJinsId: string;
    dominant: number;
    additionalIntervals: Interval[];
}

export interface MaqamOverviewData
{
    id: string;
    name: string;
    popularity: number;
}

interface Maqam extends MaqamOverviewData
{
    text: string;
    basePitch: OctavePitch;
    branchingJinsIds: string[];
    usage: MaqamCountryUsage[];
}

@Injectable
export class MaqamatController
{
    constructor(private dbController: DatabaseController, private statisticsController: StatisticsController)
    {
    }

    //Public methods
    public async QueryMaqam(maqamId: string): Promise<MaqamData | undefined>
    {
        const document = await this.dbController.GetDocumentDB();
        const maqam = document.maqamat.find(x => x.id === maqamId);

        if(maqam === undefined)
            return undefined;
        return{
            additionalIntervals: maqam.additionalIntervals,
            dominant: maqam.dominant,
            rootJinsId: maqam.rootJinsId
        };
    }

    public async QueryMaqamInfo(maqamId: string): Promise<Maqam | undefined>
    {
        const document = await this.dbController.GetDocumentDB();
        const maqam = document.maqamat.find(x => x.id === maqamId);

        if(maqam === undefined)
            return undefined;
        const usageData = await this.statisticsController.QueryMaqamUsageSafe(maqamId);
        return {
            id: maqam.id,
            name: maqam.name,
            text: maqam.text,
            basePitch: maqam.basePitch,
            branchingJinsIds: maqam.branchingAjnas,

            popularity: usageData.popularity,
            usage: usageData.usage
        };
    }

    public async QueryMaqamat(rootJinsId?: string): Promise<MaqamOverviewData[]>
    {
        const document = await this.dbController.GetDocumentDB();

        const maqamat = (rootJinsId === undefined) ? document.maqamat : document.maqamat.filter(x => x.rootJinsId === rootJinsId);
        return await maqamat.Values().Map(async maqam => {
            const usageData = await this.statisticsController.QueryMaqamUsageSafe(maqam.id);

            const mod: MaqamOverviewData = {
                id: maqam.id,
                name: maqam.name,
                popularity: usageData.popularity
            };
            return mod;
        }).PromiseAll();
    }
}