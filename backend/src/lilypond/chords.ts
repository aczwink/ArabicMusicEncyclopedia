/**
 * ArabicMusicEncyclopedia
 * Copyright (C) 2021-2026 Amir Czwink (amir130@hotmail.de)
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
import { ChordType } from "../model/Chord";

//https://lilypond.org/doc/v2.23/Documentation/notation/common-chord-modifiers.html
export function ChordTypeToLilyPondString(chord: ChordType): string
{
    switch(chord)
    {
        case ChordType.AugmentedTriad:
            return ":aug";
        case ChordType.DiminishedTriad:
            return ":dim";
        case ChordType.DominantSeventh:
            return ":7";
        case ChordType.MajorSeventh:
            return ":maj7";
        case ChordType.MajorTriad:
            return "";
        case ChordType.MinorSeventh:
            return ":m7";
        case ChordType.MinorTriad:
            return ":m";
        case ChordType.PowerChord:
            return ":5.8";
        case ChordType.MajorAddFlatNine:
            return ":3.5.9-";
        case ChordType.Suspended2nd:
            return ":sus2";
    }
}