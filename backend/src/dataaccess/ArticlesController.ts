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
import { Injectable } from "acts-util-node";
import { DatabaseController } from "./DatabaseController";

@Injectable
export class ArticlesController
{
    constructor(private dbController: DatabaseController)
    {
    }

    //Public methods
    public async CreateArticle(title: string, text: string)
    {
        const conn = await this.dbController.CreateAnyConnectionQueryExecutor();
        await conn.InsertRow("amedb.articles", { title, text });
    }

    public async QueryArticle(title: string)
    {
        const document = await this.dbController.GetDocumentDB();
        const article = document.articles.find(x => x.title === title);

        return article;
    }

    public async UpdateArticle(title: string, text: string)
    {
        const conn = await this.dbController.CreateAnyConnectionQueryExecutor();
        await conn.UpdateRows("amedb.articles", { text }, "title = ?", title);
    }
}