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

import { CountryCode } from "./Locale";

export enum PersonType
{
    Composer = 0,
    Lyricist = 1,
    Singer = 2
};

export interface PersonOverviewData
{
    id: number;
    name: string;
}

export interface Person
{
    name: string;
    type: PersonType;
    lifeTime: string;
    origin: string;
    countryCodes: CountryCode[];
}

const mainRoute = "/persons";
const objectRoute = mainRoute + "/:personId";

export namespace API
{
    export const route = mainRoute;

    export namespace AddPerson
    {
        export const method = "POST";

        export interface RequestData
        {
            person: Person;
        }

        export interface ResultData
        {
            personId: number;
        }
    }

    export namespace List
    {
        export const method = "GET";

        export interface RequestData
        {
            type: PersonType;
            nameFilter: string;
            offset: number;
            limit: number;
        }

        export interface ResultData
        {
            persons: PersonOverviewData[];
            totalCount: number;
        }
    }

    export namespace PersonAPI
    {
        export const route = objectRoute;

        export interface RouteParams
        {
            personId: number;
        }

        export namespace EditPerson
        {
            export const method = "PUT";

            export interface RequestData
            {
                person: Person;
            }

            export interface ResultData
            {
            }
        }

        export namespace QueryPerson
        {
            export const method = "GET";
            
            export interface RequestData
            {
            }

            export interface ResultData
            {
                person: Person;
            }
        }

        export namespace ImageAPI
        {
            export const route = objectRoute + "/image";

            export interface RouteParams
            {
                personId: number;
            }

            export namespace Delete
            {
                export const method = "DELETE";

                export interface RequestData
                {
                }
        
                export interface ResultData
                {
                }
            }

            export namespace Query
            {
                export const method = "GET";

                export interface RequestData
                {
                }
        
                export type ResultData = any;
            }

            export namespace Update
            {
                export const method = "PUT";

                export interface RequestData
                {
                }
        
                export interface ResultData
                {
                }
            }
        }
    }
}