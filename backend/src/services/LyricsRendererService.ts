/**
 * ArabicMusicEncyclopedia
 * Copyright (C) 2022-2023 Amir Czwink (amir130@hotmail.de)
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
import { Injectable } from "acts-util-node";
import { LilypondRendererService } from "./LilypondRendererService";

@Injectable
export class LyricsRendererService
{
    constructor(private lilypondRendererService: LilypondRendererService)
    {
    }

    //Public methods
    public async Render(pieceName: string, composerName: string, lyrics: string)
    {
        const blocks = this.SplitIntoBlocks(lyrics);

        const { twoColumns, fontSize } = this.DoLayoutComputation(blocks);

        const splitIdx = Math.round(blocks.length / (twoColumns ? 2 : 1));
        const col1Text = this.BlocksToLilypondLines(blocks.slice(0, splitIdx));
        const col2Text = this.BlocksToLilypondLines(blocks.slice(splitIdx));

        const singleColumnCode = `
            \\column
            {
                ${col1Text}
            }
        `;
        const twoColumnCode = `
            \\hspace #1
            ${singleColumnCode}
            \\hspace #2
            \\column
            {
                ${col2Text}
            }
            \\hspace #1
        `;
        const finalTextCode = (col2Text.length === 0) ? singleColumnCode : twoColumnCode;

        const lilypondText = `
\\version "2.22.0"

\\paper
{
    myStaffSize = #20
    #(define fonts
      (make-pango-font-tree "Noto Naskh Arabic"
                            "Noto Sans Arabic"
                            "Noto Kufi Arabic"
                             (/ myStaffSize 20)))
}


#(set-global-staff-size ${fontSize})


\\markup naskh_bold = \\markup \\override #'((font-name . "Noto Naskh Arabic Bold") (font-size . 6)) \\etc
\\markup naskh_composer = \\markup \\override #'((font-name . "Noto Naskh Arabic") (font-size . 0.5)) \\etc

\\header
{
    title = \\markup \\naskh_bold "${pieceName}"
    composer = \\markup \\naskh_composer "${composerName}"
}

\\markup
{
    \\override #'(font-name . "Noto Naskh Arabic")
    {
        \\override #'(text-direction . -1)
        \\huge
        \\fill-line
        {
            ${finalTextCode}
        }
    }
}
        `;
        return await this.lilypondRendererService.Render(lilypondText, "pdf");
    }

    //Private methods
    private BlockToLilypondLines(block: string[])
    {
        return block.map(x => "\\right-align\\line {" + x + "}");
    }

    private BlocksToLilypondLines(blocks: string[][])
    {
        return blocks.map(this.BlockToLilypondLines.bind(this)).map(x => x.join("\n")).join("\\line {\\null}");
    }

    private CalcMaxLineLength(blocks: string[][])
    {
        return blocks.Values().Map(x => x.Values()).Flatten().Map(x => x.length).OrderByDescending(x => x).First();
    }

    private CalcNumberOfLinesOfBlocks(blocks: string[][])
    {
        const nSpaceLines = blocks.length - 1;
        return blocks.Values().Map(x => x.length).Sum() + nSpaceLines;
    }

    private Clamp(num: number, min: number, max: number)
    {
        return Math.min(Math.max(num, min), max);
    }

    private DoLayoutComputation(blocks: string[][])
    {
        const minFontSize = 26;
        const maxFontSize = 36;
        const linesPerColumnPerPageAtMaxSize = 25;
        const linesPerColumnPerPageAtMinSize = 36;
        const charsPerColumnAtMaxSize = 30;
        const charsPerColumnAtMinSize = 45;

        const maxLineLength = this.CalcMaxLineLength(blocks);
        const nLines = this.CalcNumberOfLinesOfBlocks(blocks);

        const x = this.Clamp(maxLineLength, charsPerColumnAtMaxSize, charsPerColumnAtMinSize);
        const wx = (x - charsPerColumnAtMaxSize) / (charsPerColumnAtMinSize - charsPerColumnAtMaxSize);

        const y = this.Clamp(nLines, linesPerColumnPerPageAtMaxSize, linesPerColumnPerPageAtMinSize);
        const wy = (y - linesPerColumnPerPageAtMaxSize) / (linesPerColumnPerPageAtMinSize - linesPerColumnPerPageAtMaxSize);

        const w = (wx + wy) / 2;

        const fontSize = (1 - w) * maxFontSize + w * minFontSize;
        const twoColumns = wy > 0.75;

        console.log(maxLineLength, nLines, wx, wy, fontSize);

        return {
            twoColumns,
            fontSize
        };
    }

    private SplitIntoBlocks(lyrics: string)
    {
        const lines = lyrics.split("\n");

        const blocks = [];
        let currentBlock = [];

        for (const line of lines)
        {
            const trimmed = line.trim();
            if((trimmed.length === 0) && (currentBlock.length > 0))
            {
                blocks.push(currentBlock);
                currentBlock = [];
            }
            else
                currentBlock.push(trimmed);
        }
        if(currentBlock.length > 0)
            blocks.push(currentBlock);

        return blocks;
    }
}