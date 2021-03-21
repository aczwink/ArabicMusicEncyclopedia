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

import { HTTPEndPoint, HTTPRequest, HTTPResultData, Injectable } from "acts-util-node";
import { Musical } from "ame-api";
import { MusicalController } from "../../dataaccess/MusicalController";

@Injectable
class _api_
{
    constructor(private musicalController: MusicalController)
    {
    }

    @HTTPEndPoint({ method: Musical.API.FormsAPI.List.method, route: Musical.API.FormsAPI.route })
    public async ListForms(request: HTTPRequest<Musical.API.FormsAPI.List.RequestData>): Promise<HTTPResultData<Musical.API.FormsAPI.List.ResultData>>
    {
        const forms = await this.musicalController.QueryForms();

        return {
            data: {
                forms
            }
        };
    }

    @HTTPEndPoint({ method: Musical.API.LanguagesAPI.List.method, route: Musical.API.LanguagesAPI.route })
    public async ListLanguages(request: HTTPRequest<Musical.API.LanguagesAPI.List.RequestData>): Promise<HTTPResultData<Musical.API.LanguagesAPI.List.ResultData>>
    {
        const languages = await this.musicalController.QueryLanguages();

        return {
            data: {
                languages
            }
        };
    }
}

export default _api_;