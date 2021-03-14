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

import { OctavePitch } from "./OctavePitch";

export interface Maqam
{
    name: string;
    basePitch: OctavePitch;
    branchingJinsIds: number[];
}

const mainRoute = "/maqamat";
const objectRoute = mainRoute + "/:maqamId";

export namespace API
{
    export const route = mainRoute;

    export namespace List
    {
        export const method = "GET";

        export interface RequestData
        {
            rootJinsId?: number;
        }

        export interface MaqamOverviewData
        {
            id: number;
            name: string;
        }

        export type ResultData = MaqamOverviewData[];
    }

    export namespace MaqamAPI
    {
        export const route = objectRoute;

        export interface RouteParams
        {
            maqamId: number;
        }

        export namespace Query
        {
            export const method = "GET";

            export interface RequestData
            {
            }

            export type ResultData = Maqam;
        }

        export namespace ChordsImageAPI
        {
            export const route = objectRoute + "/chordsImage";
            export interface RouteParams
            {
                maqamId: number;
            }

            export namespace Query
            {
                export const method = "GET";

                export interface RequestData
                {
                    basePitch: string;
                    branchingJinsId: number;
                }
        
                export type ResultData = any;
            }
        }

        export namespace ImageAPI
        {
            export const route = objectRoute + "/image";
            export interface RouteParams
            {
                maqamId: number;
            }

            export namespace Query
            {
                export const method = "GET";

                export interface RequestData
                {
                    basePitch: string;
                    branchingJinsId: number;
                }
        
                export type ResultData = any;
            }
        }
    }
}