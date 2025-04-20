/**
 * ArabicMusicEncyclopedia
 * Copyright (C) 2022-2025 Amir Czwink (amir130@hotmail.de)
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
import { LilypondNoteService } from "./LilypondNoteService";
import { OctavePitch } from "openarabicmusicdb-domain/dist/OctavePitch";

@Injectable
export class LilypondTransposer
{
    constructor(private lilypondNoteService: LilypondNoteService)
    {
    }

    //Public methods
    public TransposeTo(source: string, targetPitch: OctavePitch)
    {
        const keyMatches = Array.from(source.matchAll(/\\key[ \t]+([a-z]+)[ \t]+/g));
        if(keyMatches.length !== 1)
            throw new Error("no key or too many found");
        const stringKey = keyMatches[0][1];
        const key = this.lilypondNoteService.ParseLilypondPitch(stringKey);

        const headerPos = source.indexOf("\\header");
        const endOfHeaderPos = source.indexOf("}", headerPos);

        const transposePositions = [];
        transposePositions.push(endOfHeaderPos + 1);

        return this.InsertTranspositions(source, transposePositions, stringKey, this.lilypondNoteService.ToLilypondNote(targetPitch, key.language));
    }

    //Private methods
    private InsertTranspositions(source: string, positions: number[], sourceKey: string, targetKey: string)
    {
        const ordered = positions.Values().OrderByDescending(x => x).ToArray();
        let dest = source;

        for (const pos of ordered)
        {
            dest = dest.substring(0, pos) + "\\transpose " + sourceKey + " " + targetKey + " " + dest.substring(pos);
        }

        return dest;
    }
}