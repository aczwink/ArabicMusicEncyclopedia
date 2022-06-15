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

import { Component, Injectable, JSX_CreateElement } from "acfrontend";
import { Locale } from "ame-api";
import { RhythmCountryUsage } from "../../dist/api";

@Injectable
export class MapComponent extends Component<{ usages: RhythmCountryUsage[] }>
{
    constructor()
    {
        super();

        this.usageImage = "levant";
    }
    
    //Protected methods
    protected Render(): RenderValue
    {
        return <object id="svg-object" data={"/images/usagemaps/" + this.usageImage + ".svg"} type="image/svg+xml" onload={this.OnMapLoaded.bind(this)} style="width: 25rem"></object>;
    }

    //Private members
    private usageImage: "levant" | "arabicworld";

    //Private methods
    private Colorize(doc: Document, countryCode: Locale.CountryCode, color: string)
    {
        if(this.usageImage === "levant")
        {
            const codesToPathsMap = {
                "eg": "path4341",
                "lb": "path4547",
                "sy": "path4439",
                "tr": "path4419",
            };

            doc.getElementById(codesToPathsMap[countryCode])?.setAttribute("fill", color);
        }
        else
        {
            throw new Error("Method not implemented.");
        }
    }

    private Interpolate(c1: number, c2: number, mix: number)
    {
        const c = (1-mix) * c1 + mix * c2;
        if(c < 0)
            return 0;
        if(c > 255)
            return 255;
        return c;
    }

    private Mix(c1: number, c2: number, mix: number)
    {
        return (this.Interpolate(c1 >> 16, c2 >> 16, mix) << 16)
            | (this.Interpolate( (c1 >> 8) & 0xFF, (c2 >> 8) & 0xFF, mix) << 8)
            | this.Interpolate(c1 & 0xFF, c2 & 0xFF, mix);
    }

    //Event handlers
    private OnMapLoaded(event: Event)
    {
        const doc = (event.target as HTMLObjectElement).getSVGDocument()!;

        for (const usage of this.input.usages)
        {
            const color = this.Mix(0xB9B9B9, 0x346733, usage.usage)
            this.Colorize(doc, usage.countryCode, "#" + color.toString(16));
        }
    }
}