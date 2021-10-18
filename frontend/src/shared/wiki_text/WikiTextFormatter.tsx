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
import { BlockList, CurrentListType } from "./blocks";
import { blockFormatters, inlineFormatters, lineFormatters, RegExFormatter } from "./formatters";

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
        return this.ApplyFormatters(renderValues, blockFormatters);
    }

    private ApplyFormatters(renderValues: SingleRenderValue[], formatters: RegExFormatter[])
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
        return this.ApplyFormatters([text], inlineFormatters);
    }

    private ApplyLineFormatters(line: string)
    {
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