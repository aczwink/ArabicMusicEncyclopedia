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

import { Component, JSX_CreateElement } from "acfrontend";

type EmmentalerGlyph = "HalfFlat" | "HalfSharp";

export class EmmentalerComponent extends Component<{ glyph: EmmentalerGlyph; }>
{
    protected Render(): RenderValue
    {
        return <span class="emmentaler">{this.MapGlyph(this.input.glyph)}</span>;
    }

    //Private methods
    private MapGlyph(glyph: EmmentalerGlyph)
    {
        switch(glyph)
        {
            case "HalfFlat":
                return "\uE11F";
            case "HalfSharp":
                return "\uE113";
        }
    }
}