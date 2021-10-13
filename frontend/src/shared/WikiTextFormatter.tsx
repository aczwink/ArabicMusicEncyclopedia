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

enum CurrentListType
{
    None,
    NumberedList,
    Paragraph,
    UnnumberedList,
}

class Block
{
    constructor(private _type: CurrentListType)
    {
        this.entries = [];
    }

    //Properties
    public get type()
    {
        return this._type;
    }

    //Public methods
    public Add(renderNode: any)
    {
        this.entries.push(renderNode);
    }

    public ToRenderNode()
    {
        switch(this.type)
        {
            case CurrentListType.None:
                return this.entries;
            case CurrentListType.NumberedList:
                return <ol>{this.entries.map(elem => <li>{elem}</li>)}</ol>;
            case CurrentListType.Paragraph:
                return <p>{this.entries.join("\n")}</p>;
            case CurrentListType.UnnumberedList:
                return <ul>{this.entries.map(elem => <li>{elem}</li>)}</ul>;
        }
    }
    
    //Private members
    private entries: any[];
}

class BlockList
{
    constructor()
    {
        this.blocks = [];
    }

    //Public methods
    public Add(type: CurrentListType, renderNode: any)
    {
        const lastBlock = this.blocks[this.blocks.length - 1];
        if( (lastBlock !== undefined) && (lastBlock.type === type) )
            lastBlock.Add(renderNode);
        else
        {
            const block = new Block(type);
            block.Add(renderNode);
            this.blocks.push(block);
        }
    }

    public ToRenderNodeList()
    {
        return this.blocks.map(block => block.ToRenderNode());
    }

    //Private members
    private blocks: Block[];
}

interface LineFormatter
{
    prefix: string;
    suffix?: string;
    type: CurrentListType;
    format: (inner: SingleRenderValue[]) => SingleRenderValue;
}

export class WikiTextFormatter
{
    constructor(private input: string)
    {
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

    //Private methods
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
        const inlineFormatters = [
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

        return this.ApplyFormatters([text], inlineFormatters);
    }

    private ApplyLineFormatters(line: string)
    {
        const lineFormatters: LineFormatter[] = [
            { prefix: "# ", type: CurrentListType.NumberedList, format: (formatted: SingleRenderValue[]) => <fragment>{formatted}</fragment> },
            { prefix: "* ", type: CurrentListType.UnnumberedList, format: (formatted: SingleRenderValue[]) => <fragment>{formatted}</fragment> },
            { prefix: "=== ", suffix: " ===", type: CurrentListType.None, format: (formatted: SingleRenderValue[]) => <h3>{formatted}</h3> },
            { prefix: "== ", suffix: " ==", type: CurrentListType.None, format: (formatted: SingleRenderValue[]) => <h2>{formatted}</h2> },
        ];

        for (const lineFormatter of lineFormatters)
        {
            const suffix = lineFormatter.suffix === undefined ? "" : lineFormatter.suffix;

            if(line.startsWith(lineFormatter.prefix) && line.endsWith(suffix))
            {
                const inner = line.substr(lineFormatter.prefix.length, line.length - lineFormatter.prefix.length - suffix.length);
                const formatted = this.ApplyInlineTextFormatters(inner);
                return { type: lineFormatter.type, renderNode: lineFormatter.format(formatted) };
            }
        }
        
        //text
        return { type: CurrentListType.Paragraph, renderNode: line };
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
        const blockList = new BlockList();

        const lines = part.split("\n");
        for (const l of lines)
        {
            const line = l.trim();
            const replaced = this.ApplyLineFormatters(line);
            blockList.Add(replaced.type, replaced.renderNode);
        }

        return blockList.ToRenderNodeList();
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