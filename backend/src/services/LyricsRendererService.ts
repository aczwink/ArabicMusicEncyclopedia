/**
 * ArabicMusicEncyclopedia
 * Copyright (C) 2022-2024 Amir Czwink (amir130@hotmail.de)
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

interface PageState
{
    leftCol: (string | null)[];
    rightCol: (string | null)[];
}

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

        const { twoColumns, fontSize, linesPerPage } = this.DoLayoutComputation(blocks);

        const pageBlocks = this.SplitBlocksOntoPages(blocks, twoColumns, linesPerPage);
        const pageRendered = pageBlocks.map(this.RenderPage.bind(this));

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
${pageRendered.join("\n")}
        `;
        return await this.lilypondRendererService.Render(lilypondText, "pdf");
    }

    //Private methods
    private BlockToLilypondLines(block: (string | null)[])
    {
        return block.map( x => "\\right-align\\line {" + ((x === null) ? "\\null" : x) + "}");
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

        let fontSize = (1 - w) * maxFontSize + w * minFontSize;
        let wFontSize = (fontSize - minFontSize) / (maxFontSize - minFontSize);
        let charsPerColumnAtFontSize = (1 - wFontSize) * charsPerColumnAtMinSize + wFontSize * charsPerColumnAtMaxSize;

        const twoColumnsWorthConsidering = (wy > 0.75);
        let twoColumns = false;
        if(twoColumnsWorthConsidering)
        {
            let fontSizeTemp = fontSize;
            let charsPerColumnAtFontSizeTemp = charsPerColumnAtFontSize;
            while((charsPerColumnAtFontSizeTemp >= maxLineLength) && (fontSizeTemp > minFontSize))
            {
                fontSizeTemp--;
                const wFontSize = (fontSize - minFontSize) / (maxFontSize - minFontSize);
                charsPerColumnAtFontSizeTemp = (1 - wFontSize) * charsPerColumnAtMinSize + wFontSize * charsPerColumnAtMaxSize;
            }
            twoColumns = (charsPerColumnAtFontSizeTemp >= maxLineLength);
            if(twoColumns)
            {
                fontSize = Math.max(fontSizeTemp, minFontSize);
                wFontSize = (fontSize - minFontSize) / (maxFontSize - minFontSize);
                charsPerColumnAtFontSize = (1 - wFontSize) * charsPerColumnAtMinSize + wFontSize * charsPerColumnAtMaxSize;
            }
        }

        const linesPerPage = Math.round((1 - wFontSize) * linesPerColumnPerPageAtMinSize + wFontSize * linesPerColumnPerPageAtMaxSize);

        console.log(twoColumns, maxLineLength, nLines, wx, wy, fontSize, charsPerColumnAtFontSize, linesPerPage);

        return {
            twoColumns,
            fontSize,
            linesPerPage
        };
    }

    private RenderPage(page: PageState)
    {
        const col1Text = this.BlockToLilypondLines(page.leftCol).join("\n");
        const col2Text = this.BlockToLilypondLines(page.rightCol).join("\n");

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

        return `
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
    }

    private SplitBlocksOntoPages(blocks: string[][], twoColumns: boolean, linesPerPage: number)
    {
        if(twoColumns)
            linesPerPage -= 2; //else the text overlaps the composer name

        let pageState: PageState = {
            leftCol: [],
            rightCol: []
        };
        const pages: PageState[] = [];
        function AddBlock(block: string[])
        {
            let addTo = pageState.leftCol;
            if((pageState.leftCol.length + block.length) > linesPerPage)
            {
                if(twoColumns && ((pageState.rightCol.length + block.length) > linesPerPage))
                {
                    pages.push(pageState);
                    pageState = {
                        leftCol: [],
                        rightCol: []
                    };
                    addTo = pageState.leftCol;
                }
                else if(twoColumns)
                {
                    addTo = pageState.rightCol;
                }
                else
                {
                    pages.push(pageState);
                    pageState = {
                        leftCol: [],
                        rightCol: []
                    };
                    addTo = pageState.leftCol;
                }
            }
            
            addTo.push(...block);
            addTo.push(null); //end of block
        }

        blocks.forEach(AddBlock);
        if(pageState.leftCol.length > 0)
            pages.push(pageState);

        return pages;
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