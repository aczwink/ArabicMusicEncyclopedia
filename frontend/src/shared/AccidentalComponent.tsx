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
import { Component, JSX_CreateElement } from "acfrontend";
import { EmmentalerComponent } from "./EmmentalerComponent";
import { Accidental } from "openarabicmusicdb-domain/dist/OctavePitch";

export class AccidentalComponent extends Component<{ accidental: Accidental; }>
{
    protected Render(): RenderValue
    {
        switch(this.input.accidental)
        {
            case Accidental.Flat:
                return <EmmentalerComponent glyph={"Flat"} />;
            case Accidental.HalfFlat:
                return <EmmentalerComponent glyph={"HalfFlat"} />;
            case Accidental.Natural:
                return <EmmentalerComponent glyph={"Natural"} />;
            case Accidental.HalfSharp:
                return <EmmentalerComponent glyph={"HalfSharp"} />
            case Accidental.Sharp:
                return <EmmentalerComponent glyph={"Sharp"} />
        }
    }
}