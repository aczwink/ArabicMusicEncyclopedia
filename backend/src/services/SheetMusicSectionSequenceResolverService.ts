/**
 * ArabicMusicEncyclopedia
 * Copyright (C) 2026 Amir Czwink (amir130@hotmail.de)
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

import { Injectable } from "@aczwink/acts-util-node";
import { MelodyEvent, MelodyEventType, Section, SheetMusic, SingleSectionSheetMusic } from "../model/SheetMusic";

@Injectable
export class SheetMusicSectionSequenceResolverService
{
    public ResolveSequence(sheetMusic: SheetMusic): SingleSectionSheetMusic
    {
        /*const groups = sheetMusic.sectionSequence.Values().GroupAdjacent(x => x.toString());

        const finalSections: Section[] = [];
        const finalSectionSequence = [];
        for (const group of groups)
        {
            const sectionIndex = group[0];
            finalSectionSequence.push(sectionIndex);

            const section = sheetMusic.sections[sectionIndex];
            if(group.length === 1)
                finalSections.push(section);
            else
            {
                finalSections.push({
                    melody: [
                        {
                            type: MelodyEventType.Repeat,
                            nestedEvents: section.melody
                        }
                    ]
                });
            }
        }

        if(finalSectionSequence.Equals([0, 1, 2, 1]))
        {
            flattened = this.LayoutSectionsWithDasSegnoAlFine(finalSections);
        }*/
        let flattened, flattenedChords;
        if(sheetMusic.sectionSequence.Equals([0, 0, 1, 1, 2, 1]))
        {
            flattened = this.LayoutSectionsWithDasSegnoAlFine(sheetMusic.sections);
            flattenedChords = this.FlattenSections123(sheetMusic.sections);
        }
        else
        {
            //console.log(sheetMusic.sectionSequence, finalSectionSequence);
            console.log(sheetMusic.sectionSequence);
            throw new Error("Method not implemented.");
        }

        return {
            chords: flattenedChords,
            melody: flattened,
            pieceInfo: sheetMusic.pieceInfo,
        };
    }

    //Private methods
    private FlattenSections123(sections: Section[])
    {
        return [
            ...sections[0].chords,
            ...sections[1].chords,
            ...sections[2].chords,
        ];
    }

    private LayoutSectionsWithDasSegnoAlFine(sections: Section[]): MelodyEvent[]
    {
        return [
            {
                type: MelodyEventType.Repeat,
                nestedEvents: sections[0].melody,
            },
            {
                type: MelodyEventType.SegnoRepeat,
                repeatedEvents: [
                    {
                        type: MelodyEventType.Repeat,
                        nestedEvents: sections[1].melody
                    }
                ],
                fineAfterRepeat: true,
                followingEvents: sections[2].melody,
            }
        ];
    }
}