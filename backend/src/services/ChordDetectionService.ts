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

import { Injectable } from "acts-util-node";
import { Fraction } from "../model/Fraction";
import { Interval } from "../model/Interval";
import { IntervalsService } from "./IntervalsService";

export enum ChordType
{
    MajorTriad,
    MinorTriad,
    DiminishedTriad,
    PowerChord,
}

@Injectable
export class ChordDetectionService
{
    constructor(private intervalsService: IntervalsService)
    {
    }

    //Public methods
    public FindChords(scaleIntervals: Interval[])
    {
        const fullIntervals = this.intervalsService.ExtendScale(scaleIntervals, 4);
        const numericIntervals = this.intervalsService.ToNumericIntervals(fullIntervals);

        return this.FindChordsFromSemitones(numericIntervals).slice(0, scaleIntervals.length);
    }

    //Private methods
    private FindChordsFromSemitones(intervals: Fraction[])
    {
        const chordMatchers: { type: ChordType, matcher: (st: (number | undefined)[]) => boolean}[] = [
            { type: ChordType.MajorTriad, matcher: st => (st[1] === 4) && (st[3] === 7) },
            { type: ChordType.MinorTriad, matcher: st => (st[1] === 3) && (st[3] === 7) },
            { type: ChordType.DiminishedTriad, matcher: st => (st[1] === 3) && (st[3] === 6) },
            { type: ChordType.PowerChord, matcher: st => (st[1] === undefined) && (st[3] === 7) },
        ];

        const chords = [];
        for (let index = 0; index < intervals.length; index++)
        {
            const upwards = this.intervalsService.ComputeIntervalsUpwardsFromFirst(intervals.slice(index));
            const semiTones = this.intervalsService.To12TET(upwards);

            chords.push(undefined);

            for (const { type, matcher } of chordMatchers)
            {
                if(matcher(semiTones))
                {
                    chords[index] = type;
                    break;
                }
            }
        }

        return chords;
    }
}