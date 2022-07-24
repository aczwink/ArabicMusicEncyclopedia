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

import { Component, JSX_CreateElement } from "acfrontend";

type EmmentalerGlyph = "Flat" | "HalfFlat" | "HalfSharp" | "Natural" | "Sharp";

export class EmmentalerComponent extends Component<{ glyph: EmmentalerGlyph; }>
{
    protected Render(): RenderValue
    {
        return <span className="emmentaler">{this.MapGlyph(this.input.glyph)}</span>;
    }

    //Private methods
    private MapGlyph(glyph: EmmentalerGlyph)
    {
        switch(glyph)
        {
            case "Flat":
                return "\uE11B";
            case "HalfFlat":
                return "\uE11F";
            case "HalfSharp":
                return "\uE113";
            case "Natural":
                return "\uE117";
            case "Sharp":
                return "\uE10F";
        }
    }
}