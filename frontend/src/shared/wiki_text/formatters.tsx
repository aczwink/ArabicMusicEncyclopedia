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
import { Anchor, JSX_CreateElement } from "acfrontend";
import { g_backendBaseUrl } from "../../env";
import { FileReferenceComponent } from "../../wiki/FileReferenceComponent";
import { CurrentListType } from "./blocks";
import { WikiTextFormatter } from "./WikiTextFormatter";

export interface RegExFormatter
{
    pattern: RegExp;
    mapper: (matched: RegExpExecArray) => SingleRenderValue;
}

export interface LineFormatter
{
    prefix: string;
    suffix?: string;
    type: CurrentListType;
    format: (inner: SingleRenderValue[]) => SingleRenderValue;
}

export const blockFormatters: RegExFormatter[] = [
    {
        pattern: /<gallery>(.+?)<\/gallery>/s,
        mapper: (matched: RegExpExecArray) => {
            const data = matched[1];
            const entries = data.split("\n").filter(line => line.trim().length > 0).map(line => line.split("|")).map(x => <li>
                <div className="column">
                    <fragment>{WikiTextFormatter.FormatWikiText(x[0])}</fragment>
                    {x[1]}
                </div>
            </li>);
            return <ul className="horzList">{entries}</ul>;
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

export const lineFormatters: LineFormatter[] = [
    { prefix: "# ", type: CurrentListType.NumberedList, format: (formatted: SingleRenderValue[]) => <fragment>{formatted}</fragment> },
    { prefix: "* ", type: CurrentListType.UnnumberedList, format: (formatted: SingleRenderValue[]) => <fragment>{formatted}</fragment> },
    { prefix: "=== ", suffix: " ===", type: CurrentListType.None, format: (formatted: SingleRenderValue[]) => <h3>{formatted}</h3> },
    { prefix: "== ", suffix: " ==", type: CurrentListType.None, format: (formatted: SingleRenderValue[]) => <h2>{formatted}</h2> },
    { prefix: "| ", suffix: " |", type: CurrentListType.Table, format: (formatted: SingleRenderValue[]) => {
        const cells = [];
        for (const entry of formatted)
        {
            if(typeof entry === "string")
            {
                const subEntries = entry.split(" | ").map(x => x.trim()).filter(x => x.length > 0);
                cells.push(...subEntries);
            }
            else
                cells.push(entry);
        }

        function IsSeperator(value: any)
        {
            return (typeof value === "string") && value.ReplaceAll("-", "").length === 0;
        }

        if(cells.Values().Map(IsSeperator).All())
        {
            return "thead-tbody-seperator";
        }

        return <tr>{cells.map(x => <td>{x}</td>)}</tr>;
    }},
];

export const inlineFormatters = [
    {
        pattern: /\[\[(.+)\]\]/,
        mapper: (match: RegExpExecArray) => {
            const content = match[0].substr(2, match[0].length - 4);

            const filePrefix = "File:";
            if(content.startsWith(filePrefix))
            {
                const parts = content.substr(filePrefix.length).split("|");
                const inner = <FileReferenceComponent fileName={parts[0]} />;
                if(parts.length == 1)
                    return inner;
                return <div className="box">
                    <div className="column">
                        {inner}
                        {parts[1]}
                    </div>
                </div>;
            }
            else if(content.includes("|"))
            {
                const parts = content.split("|");
                return <Anchor route={"/wiki/" + parts[0]}>{parts[1]}</Anchor>;
            }

            const title = content;
            return <Anchor route={"/wiki/" + title}>{title}</Anchor>;
        }
    },
    {
        pattern: /\[(.+)\]/,
        mapper: (match: RegExpExecArray) => {
            const idx = match[1].indexOf(" ");

            let url, text;
            if(idx == -1)
            {
                url = match[1];
                text = url;
            }
            else
            {
                url = match[1].substr(0, idx);
                text = match[1].substr(idx + 1);
            }        
            return <a href={url} target="_blank">{text}</a>
        }
    },
    {
        pattern: /(?:(https?:\/\/)|(www\.))[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
        mapper: (match: RegExpExecArray) => {
            let url = match[0];
            if(!url.startsWith("http"))
                url = "http://" + url;

            return <a href={url} target="_blank">{url}</a>;
        }
    },
];