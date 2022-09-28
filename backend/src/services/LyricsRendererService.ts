/**
 * ArabicMusicEncyclopedia
 * Copyright (C) 2022 Amir Czwink (amir130@hotmail.de)
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

const linesPerPage = 48;

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

        const lilypondText = `
\\version "2.22.1"

\\paper
{
    myStaffSize = #${fontSize}
    #(define fonts
      (make-pango-font-tree "Noto Naskh Arabic"
                            "Noto Sans Arabic"
                            "Noto Kufi Arabic"
                             (/ myStaffSize 20)))
  }


#(set-global-staff-size ${fontSize})

\\header
{
    title = "${pieceName}"
    composer = "${composerName}"
}

\\markup
{
    \\override #'(text-direction . -1)
	\\huge
	\\fill-line
	{
		\\hspace #1
		\\column
		{
            ${col1Text}
        }
        \\hspace #2
		\\column
		{
            ${col2Text}
        }
		\\hspace #1
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

    private CalcNumberOfLinesOfBlocks(blocks: string[][])
    {
        const nSpaceLines = blocks.length - 1;
        return blocks.Values().Map(x => x.length).Sum() + nSpaceLines;
    }

    private DoLayoutComputation(blocks: string[][])
    {
        const ranges = [
            { nLines: 0, fontSize: 26, twoColumns: false },
            { nLines: Number.MAX_SAFE_INTEGER, fontSize: 26, twoColumns: true }
        ];
        const nLines = this.CalcNumberOfLinesOfBlocks(blocks);
        console.log(nLines);
        const possibleRanges = ranges.Values().Filter(r => r.nLines < nLines).ToArray();

        return possibleRanges[possibleRanges.length - 1];
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