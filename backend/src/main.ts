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
import fs from "fs";
import http from "http";
import { OpenAPI } from "acts-util-core";
import { Factory, HTTP } from "acts-util-node";
import { APIRegistry } from "acts-util-apilib";
import ENV from "./env";

async function SetupServer()
{
    const requestHandlerChain = Factory.CreateRequestHandlerChain();
    requestHandlerChain.AddCORSHandler([ENV.allowedOrigin]);
    requestHandlerChain.AddBodyParser();

    await import("./__http_registry");

    const openAPIDef: OpenAPI.Root = JSON.parse(await fs.promises.readFile("openapi.json", "utf-8"));
    const backendStructure = JSON.parse(await fs.promises.readFile("openapi-structure.json", "utf-8"));
    requestHandlerChain.AddRequestHandler(new HTTP.RouterRequestHandler(openAPIDef, backendStructure, APIRegistry.endPointTargets));

    const server = http.createServer(requestHandlerChain.requestListener);

    server.listen(ENV.port, () => {
        console.log("Server is running...");
    });

    process.on('SIGINT', function()
    {
        console.log("Shutting server down...");
        server.close();
    });
}

SetupServer();