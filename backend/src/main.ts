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
import http from "http";

import { Factory, GlobalInjector, HTTP_APILoader } from "acts-util-node";
import { DatabaseController } from "./dataaccess/DatabaseController";

const port = 8083;

async function SetupServer()
{
    const requestHandler = Factory.CreateHTTPRequestHandler({
        trustedOrigins: ["http://localhost:8082"]
    });

    const server = http.createServer(requestHandler.requestListener);

    const apiLoader = new HTTP_APILoader;
    await apiLoader.LoadDirectory(__dirname + "/api/");

    requestHandler.RegisterRouteSetups(apiLoader.GetEndPointSetups());

    server.listen(port, () => {
        console.log("Server is running...");
    });

    process.on('SIGINT', function()
    {
        console.log("Shutting server down...");
        GlobalInjector.Resolve(DatabaseController).Close();
        server.close();
    });
}

SetupServer();