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

export interface Article
{
    id: number;
    text: string;
}

export namespace API
{
    export const route = "/articles";

    export interface RouteParams
    {
    }

    export namespace CreateArticle
    {
        export const method = "POST";

        export interface RequestData
        {
            title: string;
            text: string;
        }

        export interface ResultData
        {
        }
    }

    export namespace QueryArticle
    {
        export const method = "GET";

        export interface RequestData
        {
            title: string;
        }

        export interface ResultData
        {
            article: Article | null;
        }
    }

    export namespace UpdateArticle
    {
        export const method = "PUT";

        export interface RequestData
        {
            title: string;
            text: string;
        }

        export interface ResultData
        {
        }
    }
}