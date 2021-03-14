/**
 * ArabicMusicEncyclopedia
 * Copyright (C) 2021 Amir Czwink (amir130@hotmail.de)
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

export interface RhythmOverviewData
{
    id: number;
    name: string;
    timeSigNum: number;
    timeSigDen: number;
}

export interface Rhythm extends RhythmOverviewData
{
    popularity: string;
    category: string;
    usageImage: string;
    usageText: string;
    text: string;
}

const mainRoute = "/rhythms";
const objectRoute = mainRoute + "/:rhythmId";

export namespace API
{
    export const route = mainRoute;

    export namespace List
    {
        export const method = "GET";

        export interface RequestData
        {
        }

        export interface ResultData
        {
            rhythms: RhythmOverviewData[];
        }
    }

    export namespace RhythmAPI
    {
        export const route = objectRoute;

        export interface RouteParams
        {
            rhythmId: number;
        }

        export namespace Query
        {
            export const method = "GET";

            export interface RequestData
            {
            }
    
            export interface ResultData
            {
                rhythm: Rhythm;
            }
        }
    }
}