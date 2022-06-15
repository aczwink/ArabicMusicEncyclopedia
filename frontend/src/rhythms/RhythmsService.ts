/**
 * ArabicMusicEncyclopedia
 * Copyright (C) 2021-2022 Amir Czwink (amir130@hotmail.de)
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
import { APIService } from "../shared/APIService";

@Injectable
export class RhythmsService
{
    constructor(private apiService: APIService)
    {
    }

    //Public methods
    public async QueryRhythm(rhythmId: number)
    {
        const result = await this.apiService.rhythms_any_.get(rhythmId);
        if(result.statusCode === 404)
            throw new Error("TODO: implement me");
        return result.data;
    }

    public async QueryRhythms()
    {
        return (await this.apiService.rhythms.get()).data;
    }
}