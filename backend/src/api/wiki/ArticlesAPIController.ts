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

import { APIController, Get, NotFound, Query } from "acts-util-apilib";
import { ArticlesController } from "../../dataaccess/ArticlesController";

@APIController("articles")
class ArticlesAPIController
{
    constructor(private articlesController: ArticlesController)
    {
    }

    @Get()
    public async QueryArticle(
        @Query title: string
    )
    {
        const result = await this.articlesController.QueryArticle(title);
        if(result === undefined)
            return NotFound("article does not exist");
        return result;
    }
}