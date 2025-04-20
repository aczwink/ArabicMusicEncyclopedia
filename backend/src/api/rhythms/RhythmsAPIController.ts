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
import { APIController, Get, NotFound, Path } from "acts-util-apilib";
import { RhythmsController } from "../../dataaccess/RhythmsController";

@APIController("rhythms")
class RhythmsAPIController
{
    constructor(private rhythmsController: RhythmsController)
    {
    }

    @Get()
    public async ListRhythms()
    {
        return await this.rhythmsController.QueryRhythms();
    }

    @Get("{rhythmId}")
    public async QueryRhythm(
        @Path rhythmId: string
    )
    {
        const rhythm = await this.rhythmsController.QueryRhythm(rhythmId);
        if(rhythm === undefined)
            return NotFound("rhythm does not exist");
        return rhythm;
    }
}