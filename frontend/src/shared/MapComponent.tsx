/**
 * ArabicMusicEncyclopedia
 * Copyright (C) 2021-2023 Amir Czwink (amir130@hotmail.de)
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
                "iq": "path4635",
                "lb": "path4547",
                "sy": "path4439",
                "tr": "path4419",
            };
            const elementId = (codesToPathsMap as any)[countryCode];
            doc.getElementById(elementId)?.setAttribute("fill", color);
        }
        else
        {
            function SetFillOnElement(element: Element)
            {
                const styleParts = element.getAttribute("style")?.split(";") ?? [];
                const styleValues = styleParts.map(x => {
                    const parts = x.split(":");
                    return { key: parts[0], value: parts[1] };
                });

                const fill = styleValues.find(x => x.key === "fill");
                if(fill === undefined)
                    styleValues.push({ key: "fill", value: color });
                else
                    fill.value = color;

                const styleLine = styleValues.map(x => x.key + ":" + x.value).join(";");
                element.setAttribute("style", styleLine);
            }

            const element = doc.getElementById(countryCode);
            if(element === null)
                throw new Error("MISSING COUNTRY: " + countryCode);
            SetFillOnElement(element);
            for(let child = element.firstElementChild; child !== null; child = child?.nextElementSibling ?? null)
                SetFillOnElement(child!);
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
    override OnInitiated(): void
    {
        if(this.input.usages.find(x => x.countryCode === "tn"))
            this.usageImage = "arabicworld";
    }

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