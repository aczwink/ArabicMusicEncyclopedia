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

import { Injectable } from "acfrontend";
import { Musical } from "ame-api";
import { APIService } from "../shared/APIService";

@Injectable
export class MusicalService
{
    constructor(private apiService: APIService)
    {
    }

    //Public methods
    public ListForms(routeParams: Musical.API.FormsAPI.RouteParams, data: Musical.API.FormsAPI.List.RequestData)
    {
        return this.apiService.Request<Musical.API.FormsAPI.List.ResultData>(Musical.API.FormsAPI.route, Musical.API.FormsAPI.List.method, data, routeParams);
    }

    public ListLanguages(routeParams: Musical.API.LanguagesAPI.RouteParams, data: Musical.API.LanguagesAPI.List.RequestData)
    {
        return this.apiService.Request<Musical.API.LanguagesAPI.List.ResultData>(Musical.API.LanguagesAPI.route, Musical.API.LanguagesAPI.List.method, data, routeParams);
    }
}