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
import { APIController, Get } from "acts-util-apilib";
import { AjnasController } from "../../dataaccess/AjnasController";
import { MaqamatController, MaqamOverviewData } from "../../dataaccess/MaqamatController";
import { Interval } from "../../model/Interval";
import { IntervalsService } from "../../services/IntervalsService";

interface MaqamByIntervalGroupingData
{
    maqamId: number;
    maqamName: string;
    branchingJinsId: number;
    branchingJinsName: string;
    intervals: Interval[];
}

interface MaqamByIntervalGroupingResultData
{
    maqamId: number;
    maqamName: string;
    branchingJinsName: string;
}

interface MaqamWithDominant extends MaqamOverviewData
{
    dominant: number;
}

@APIController("maqamatgroupings")
class MaqamatGroupingsAPIController
{
    constructor(private maqamatController: MaqamatController, private intervalsService: IntervalsService, private ajnasController: AjnasController)
    {
    }

    @Get("dominant")
    public async ListMaqamatGroupedByDominant()
    {
        const maqamat = (await this.maqamatController.QueryMaqamat()) as MaqamWithDominant[];
        await maqamat.Values().Map(async x => {
            const result = await this.maqamatController.QueryMaqam(x.id);
            x.dominant = result!.dominant;
        }).PromiseAll();

        return maqamat.Values().GroupBy(x => x.dominant).Map(x => x.value).ToArray();
    }

    @Get("intervals")
    public async ListMaqamatGroupedByIntervals(
    ): Promise<MaqamByIntervalGroupingResultData[][]>
    {
        const maqamat = await this.maqamatController.QueryMaqamat();
        const allMaqamForms: MaqamByIntervalGroupingData[] = [];

        const filtered = maqamat;

        for (const maqam of filtered)
        {
            const maqamDetails = await this.maqamatController.QueryMaqamInfo(maqam.id);

            for (const branchingJinsId of maqamDetails!.branchingJinsIds)
            {
                const branchingJins = await this.ajnasController.QueryJins(branchingJinsId);
                allMaqamForms.push({
                    maqamId: maqam.id,
                    maqamName: maqam.name,
                    branchingJinsId,
                    branchingJinsName: branchingJins!.name,
                    intervals: (await this.intervalsService.QueryMaqamIntervals(maqam.id, branchingJinsId))!
                });
            }
        }

        const groups: MaqamByIntervalGroupingResultData[][] = [];
        while(allMaqamForms.length > 0)
        {
            const a = allMaqamForms.pop()!;

            const group: MaqamByIntervalGroupingResultData[] = [
                {
                    branchingJinsName: a.branchingJinsName,
                    maqamId: a.maqamId,
                    maqamName: a.maqamName
                }
            ];

            for(let j = 0; j < allMaqamForms.length;)
            {
                const b = allMaqamForms[j];

                if(this.ScaleIntervalsMatch(a, b))
                {
                    group.push({
                        branchingJinsName: b.branchingJinsName,
                        maqamId: b.maqamId,
                        maqamName: b.maqamName
                    });
                    allMaqamForms.Remove(j);
                }
                else
                    j++;
            }
            if(group.length > 1)
                groups.push(group);
        }

        return groups;
    }

    //Private methods
    private ScaleIntervalsMatch(a: MaqamByIntervalGroupingData, b: MaqamByIntervalGroupingData)
    {
        const extended = this.intervalsService.ExtendScale(b.intervals, 7);

        for(let i = 1; i < 8; i++)
        {
            const slice = extended.slice(i, i+7);

            if(a.intervals.Equals(slice))
            {
                return true;
            }
        }

        return false;
    }
}