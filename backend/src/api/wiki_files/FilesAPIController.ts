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

import { APIController, FormField, Get, NotFound, Put, Query } from "acts-util-apilib";
import { HTTP } from "acts-util-node";
import { FilesController } from "../../dataaccess/FilesController";

@APIController("files")
class FilesAPIController
{
    constructor(private filesController: FilesController)
    {
    }

    @Get()
    public async QueryFile(
        @Query title: string
    )
    {
        const result = await this.filesController.QueryFile(title);
        if(result === null)
            return NotFound("file does not exist");
        return result;
    }

    @Put()
    public async UpdateFile(
        @FormField fileName: string,
        @FormField file: HTTP.UploadedFile
    )
    {
        await this.filesController.UpdateFile(fileName, file.buffer);
    }
}