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

import { APIController, Body, Delete, FormField, Get, NotFound, Ok, Path, Put } from "acts-util-apilib";
import { UploadedFile } from "acts-util-node/dist/http/UploadedFile";
import { Person, PersonsController } from "../../dataaccess/PersonsController";

@APIController("persons/{personId}")
class PersonAPIController
{
    constructor(private personsController: PersonsController)
    {
    }

    @Get()
    public async QueryPerson(
        @Path personId: number
    )
    {
        const person = await this.personsController.QueryPerson(personId);
        if(person === undefined)
            return NotFound("person does not exist");
        return person;
    }

    @Put()
    public async UpdatePerson(
        @Path personId: number,
        @Body person: Person
    )
    {
        await this.personsController.UpdatePerson(personId, person);
    }

    @Delete("image")
    public async DeletePersonImage(
        @Path personId: number
    )
    {
        //TODO: implement me
    }

    @Get("image")
    public async QueryPersonImage(
        @Path personId: number
    )
    {
        const image = await this.personsController.QueryPersonImage(personId);
        if(image === undefined)
        {
            const emptyImage = Buffer.from("R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==", "base64");
            return Ok(emptyImage, {
                "Content-Type": {
                    mediaType: "image/gif"
                }
            });
        }
        return image;
    }

    @Put("image")
    public async UpdatePersonImage(
        @Path personId: number,
        @FormField file: UploadedFile
    )
    {
        await this.personsController.UpdatePersonImage(personId, file.buffer);
    }
}