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

import { Routes } from "acfrontend";
import { routes as ajnasRoutes } from "./ajnas/routing";
import { routes as maqamatRoutes } from "./maqamat/routing";
import { routes as rhythmsRoutes } from "./rhythms/routing";
import { routes as wikiRoutes } from "./wiki/routing";

export const routes : Routes = [
    { path: "ajnas", children: ajnasRoutes },
    { path: "maqamat", children: maqamatRoutes },
    { path: "rhythms", children: rhythmsRoutes },
    { path: "wiki", children: wikiRoutes },
    { path: "*", redirect: "wiki" },
];