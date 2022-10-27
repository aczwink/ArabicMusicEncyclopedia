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

import { Component } from "acfrontend";

 
export class PopularityComponent extends Component<{ popularity: number }>
{
    protected Render(): RenderValue
    {
        const popularity = this.input.popularity;
        
        if(popularity > 0.75)
            return "very popular";
        if(popularity > 0.5)
            return "popular";
        if(popularity > 0.25)
            return "infrequently used";
        return "very rarely used";
    }
}