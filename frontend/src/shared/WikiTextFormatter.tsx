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
import { Anchor, JSX_CreateElement } from "acfrontend";
import { g_backendBaseUrl } from "../backend";

interface Formatter
{
    pattern: RegExp;
    mapper: (matched: string) => SingleRenderValue;
}

export class WikiTextFormatter
{
    constructor(private input: string)
    {
        this.currentList = [];
        this.elements = [];
    }

    //Public methods
    public Format()
    {
        const parts = this.ApplyBlockReplacements();
        for (const part of parts)
        {
            if(typeof(part) === "string")
            {
                const lines = part.split("\n");
                for (const l of lines)
                {
                    const line = l.trim();

                    if(line.startsWith("# "))
                    {
                        const formatted = this.FormatInlineText(line.substr(2));
                        this.currentList.push(<fragment>{formatted}</fragment>);
                    }
                    else if(line.startsWith("== ") && line.endsWith(" =="))
                    {
                        const formatted = this.FormatInlineText(line.substr(3, line.length - 6));
                        this.Add(<h2>{formatted}</h2>);
                    }
                    else //text
                        this.Add(line);
                }

                this.FinishCurrentList();
            }
            else
                this.elements.push(part);
        }

        return this.elements;
    }

    //Private members
    private currentList: SingleRenderValue[];
    private elements: SingleRenderValue[];

    //Private methods
    private Add(line: string)
    {
        this.FinishCurrentList();
        this.elements.push(line);
    }

    private ApplyBlockReplacements()
    {
        const formatters: Formatter[] = [
            {
                pattern: /<Rhythm>.+<\/Rhythm>/s,
                mapper: (matched: string) => {
                    const rhythmData = matched.substr(8, matched.length - 8 - 9);
                    return <img src={g_backendBaseUrl + "/rhythms/image?data=" + encodeURIComponent(rhythmData)} />;
                }
            }
        ];

        return this.ApplyFormatters([this.input], formatters);
    }

    private ApplyFormatters(renderValues: SingleRenderValue[], formatters: Formatter[])
    {
        let result: SingleRenderValue[] = renderValues;
        for (const formatter of formatters)
        {
            const formatted: SingleRenderValue[] = [];
            for (const part of result)
            {
                if(typeof(part) === "string")
                    formatted.push(...this.FormatText(part, formatter.pattern, formatter.mapper));
                else
                    formatted.push(part);
            }
            result = formatted;
        }

        return result;
    }

    private FinishCurrentList()
    {
        if(this.currentList.length > 0)
        {
            this.elements.push(<ol>{this.currentList.map(elem => <li>{elem}</li>)}</ol>);
            this.currentList = [];
        }
    }

    private FormatInlineText(text: string): SingleRenderValue[]
    {
        const lineFormatters = [
            {
                pattern: /(?:(https?:\/\/)|(www\.))[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
                mapper: (match: string) => {
                    let url = match;
                    if(!url.startsWith("http"))
                        url = "http://" + url;

                    return <a href={url}>{match}</a>;
                }
            },
            {
                pattern: /\[\[(.+)\]\]/,
                mapper: (match: string) => {
                    const title = match.substr(2, match.length - 4);
                    return <Anchor route={"/wiki/" + title}>{title}</Anchor>;
                }
            }
        ];

        return this.ApplyFormatters([text], lineFormatters);
    }

    private FormatText(text: string, pattern: RegExp, mapper: (matched: string) => SingleRenderValue)
    {
        const result = [];

        let match;
        while ((match = pattern.exec(text)) !== null)
        {
            if(match.index > 0)
                result.push(text.substr(0, match.index));

            result.push(mapper(match[0]));
            text = text.substr(match.index + match[0].length);
        }
        if(text)
            result.push(text);

        return result;
    }
}