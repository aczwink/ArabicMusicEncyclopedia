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
    mapper: (matched: RegExpExecArray) => SingleRenderValue;
}

export class WikiTextFormatter
{
    constructor(private input: string)
    {
        this.currentList = [];
    }

    //Public methods
    public Format()
    {
        const parts = this.ApplyBlockReplacements([this.input]);
        return this.ApplyTransformation(parts, this.ExecuteLineReplacements.bind(this));
    }

    //Class functions
    public static FormatWikiText(text: string)
    {
        const instance = new WikiTextFormatter(text);
        return instance.Format();
    }

    //Private members
    private currentList: SingleRenderValue[];

    //Private methods
    private Add(line: string): SingleRenderValue[]
    {
        const result = this.FinishCurrentList();
        if(result === undefined)
            return [line];
        return [result, line];
    }

    private ApplyBlockReplacements(renderValues: SingleRenderValue[])
    {
        const formatters: Formatter[] = [
            {
                pattern: /<gallery>(.+?)<\/gallery>/s,
                mapper: (matched: RegExpExecArray) => {
                    const data = matched[1];
                    const entries = data.split("\n").filter(line => line.trim().length > 0).map(line => line.split("|")).map(x => <li>
                        <div class="column">
                            <fragment>{WikiTextFormatter.FormatWikiText(x[0])}</fragment>
                            {x[1]}
                        </div>
                    </li>);
                    return <ul class="horzList">{entries}</ul>;
                }
            },
            {
                pattern: /<score(?: type="(?<type>.+?)")>(?<content>.+?)<\/score>/s,
                mapper: (matched: RegExpExecArray) => {
                    const data = matched.groups!.content!.trim();
                    return <img src={g_backendBaseUrl + "/score/image?type=" + matched.groups!.type + "&data=" + encodeURIComponent(data)} />;
                }
            }
        ];

        return this.ApplyFormatters(renderValues, formatters);
    }

    private ApplyFormatters(renderValues: SingleRenderValue[], formatters: Formatter[])
    {
        let result: SingleRenderValue[] = renderValues;
        for (const formatter of formatters)
        {
            result = this.ApplyTransformation(result, this.FormatText.bind(this, formatter.pattern, formatter.mapper));
        }

        return result;
    }

    private ApplyInlineTextFormatters(text: string): SingleRenderValue[]
    {
        const lineFormatters = [
            {
                pattern: /(?:(https?:\/\/)|(www\.))[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
                mapper: (match: RegExpExecArray) => {
                    let url = match[0];
                    if(!url.startsWith("http"))
                        url = "http://" + url;

                    return <a href={url} target="_blank">{url}</a>;
                }
            },
            {
                pattern: /\[\[(.+)\]\]/,
                mapper: (match: RegExpExecArray) => {
                    const title = match[0].substr(2, match[0].length - 4);
                    return <Anchor route={"/wiki/" + title}>{title}</Anchor>;
                }
            }
        ];

        return this.ApplyFormatters([text], lineFormatters);
    }

    private ApplyTransformation(renderValues: SingleRenderValue[], transformation: (part: string) => SingleRenderValue[])
    {
        const formatted: SingleRenderValue[] = [];
        for (const part of renderValues)
        {
            if(typeof(part) === "string")
                formatted.push(...transformation(part));
            else
                formatted.push(part);
        }
        return formatted;
    }

    private ExecuteLineReplacements(part: string)
    {
        const result = [];
        const lines = part.split("\n");
        for (const l of lines)
        {
            const line = l.trim();

            if(line.startsWith("# "))
            {
                const formatted = this.ApplyInlineTextFormatters(line.substr(2));
                this.currentList.push(<fragment>{formatted}</fragment>);
            }
            else if(line.startsWith("== ") && line.endsWith(" =="))
            {
                const formatted = this.ApplyInlineTextFormatters(line.substr(3, line.length - 6));
                result.push(this.Add(<h2>{formatted}</h2>));
            }
            else //text
                result.push(this.Add(line));
        }

        const listRes = this.FinishCurrentList();
        if(listRes !== undefined)
            result.push(listRes);
        return result;
    }

    private FinishCurrentList()
    {
        if(this.currentList.length > 0)
        {
            const data = this.currentList;
            this.currentList = [];
            return <ol>{data.map(elem => <li>{elem}</li>)}</ol>;
        }
    }

    private FormatText(pattern: RegExp, mapper: (matched: RegExpExecArray) => SingleRenderValue, text: string)
    {
        const result = [];

        let match;
        while ((match = pattern.exec(text)) !== null)
        {
            if(match.index > 0)
                result.push(text.substr(0, match.index));

            result.push(mapper(match));
            text = text.substr(match.index + match[0].length);
        }
        if(text)
            result.push(text);

        return result;
    }
}