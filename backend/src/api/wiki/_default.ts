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
import { Wiki } from "ame-api";
import { ArticlesController } from "../../dataaccess/ArticlesController";

@Injectable
class _api_
{
    constructor(private articlesController: ArticlesController)
    {
    }

    @HTTPEndPoint({ method: Wiki.API.CreateArticle.method, route: Wiki.API.route })
    public async CreateArticle(request: HTTPRequest<Wiki.API.CreateArticle.RequestData, Wiki.API.RouteParams>): Promise<HTTPResultData<Wiki.API.CreateArticle.ResultData>>
    {
        await this.articlesController.CreateArticle(request.data.title, request.data.text);
        return {
            data: {}
        };
    }

    @HTTPEndPoint({ method: Wiki.API.QueryArticle.method, route: Wiki.API.route })
    public async QueryArticle(request: HTTPRequest<Wiki.API.QueryArticle.RequestData, Wiki.API.RouteParams>): Promise<HTTPResultData<Wiki.API.QueryArticle.ResultData>>
    {
        const result = await this.articlesController.QueryArticle(request.data.title);
        return {
            data: {
                article: result === undefined ? null : result
            }
        };
    }

    @HTTPEndPoint({ method: Wiki.API.UpdateArticle.method, route: Wiki.API.route })
    public async UpdateArticle(request: HTTPRequest<Wiki.API.UpdateArticle.RequestData, Wiki.API.RouteParams>): Promise<HTTPResultData<Wiki.API.UpdateArticle.ResultData>>
    {
        await this.articlesController.UpdateArticle(request.data.title, request.data.text);
        return {
            data: {}
        };
    }
}

export default _api_;