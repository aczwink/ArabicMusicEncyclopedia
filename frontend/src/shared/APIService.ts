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
import { Dictionary, URL } from "acts-util-core";
import { HTTPMethod, HTTPService, Injectable, RequestHeaders } from "acfrontend";
import { g_backendAuthority, g_backendProtocol } from "../backend";
import { API, RequestData, ResponseData } from "../../dist/api";

@Injectable
export class APIService extends API
{
    constructor(private httpService: HTTPService)
    {
        super();
    }

    //Protected methods
    protected async IssueRequest<SuccessStatusCodeType, ErrorStatusCodeType, DataType>(requestData: RequestData): Promise<ResponseData<SuccessStatusCodeType, ErrorStatusCodeType, DataType>>
    {
        const url = new URL({
            authority: g_backendAuthority,
            path: requestData.path,
            protocol: g_backendProtocol,
            queryParams: (requestData.query === undefined) ? {} : (requestData.query as Dictionary<string>)
        });
        const response = await this.httpService.SendRequest({
            body: this.FormatBody(requestData.body, requestData.requestBodyType),
            headers: this.CreateHeaders(requestData.body, requestData.requestBodyType),
            method: requestData.method,
            responseType: requestData.responseType,
            url: url.ToString()
        });

        if(response.statusCode === requestData.successStatusCode)
        {
            return {
                statusCode: response.statusCode as unknown as SuccessStatusCodeType,
                data: response.body
            };
        }
        return {
            statusCode: response.statusCode as unknown as ErrorStatusCodeType
        };
    }

    //Private methods
    private CreateHeaders(body: object | undefined, requestBodyType: "form-data" | undefined): RequestHeaders
    {
        if((body !== undefined) && (requestBodyType !== "form-data"))
        {
            return {
                "Content-Type": "application/json"
            };
        }
        return {};
    }

    private FormatBody(body: object | undefined, requestBodyType: "form-data" | undefined): any
    {
        if(body === undefined)
            return undefined;

        if(requestBodyType === "form-data")
        {
            //let XmlHttpRequest do this since it also sets the boundary
            //headers["Content-Type"] = "multipart/form-data";
            const fd = new FormData();

            for (const key in body)
            {
                if (Object.prototype.hasOwnProperty.call(body, key))
                {
                    fd.append(key, (body as any)[key]);
                }
            }

            return fd;
        }

        return JSON.stringify(body);
    }
    //TODO: remove the following legacy methods
    public Request<T>(route: string, method: HTTPMethod, data: any, routeParams?: any): Promise<T>
    {
        throw new Error("Legacy method 'APIService.Request' called");
    }
}