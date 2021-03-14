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
import { Accidental, NaturalNote, OctavePitch } from "ame-api";
import { JinsData } from "../dataaccess/AjnasController";
import { MaqamData } from "../dataaccess/MaqamatController";
import { Fraction } from "../model/Fraction";
import { Interval } from "../model/Interval";

@Injectable
export class IntervalsService
{
    //Public methods
    public ComputeIntervalsUpwardsFromFirst(intervals: Fraction[])
    {
        let last = new Fraction(0, 1);

        return intervals.map(interval => {
            const result = interval.Add(last);
            last = result;
            return result;
        });
    }

    public ExtendScale(intervals: Interval[], extension: number)
    {
        return intervals.concat(intervals.slice(0, extension));
    }

    public GetMaqamIntervals(maqam: MaqamData, rootJins: JinsData, branchingJins: JinsData)
    {
        switch(maqam.dominant)
        {
            case 5:
                return rootJins.intervals.concat(maqam.additionalIntervals).concat(branchingJins.intervals);
            default:
                throw new Error("Dominant not handled: " + maqam.dominant);
        }
    }

    public ResolveScalePitches(basePitch: OctavePitch, scaleIntervals: Interval[])
    {
        let last = basePitch;
        return [basePitch].concat(scaleIntervals.map(interval => {
            const next = this.ResolveNextPitch(last, interval);
            last = next;
            return next;
        }));
    }

    public To12TET(intervals: Fraction[])
    {
        return intervals.map(this.FractionTo12TET.bind(this));
    }

    public ToNumericIntervals(intervals: Interval[])
    {
        return intervals.map(this.ToNumericInterval.bind(this));
    }

    //Private methods
    private AccidentalToFraction(accidental: Accidental): Fraction
    {
        switch(accidental)
        {
            case Accidental.Flat:
                return new Fraction(-1, 2);
            case Accidental.HalfFlat:
                return new Fraction(-1, 4);
            case Accidental.Natural:
                return new Fraction(0, 1);
            case Accidental.HalfSharp:
                return new Fraction(1, 4);
            case Accidental.Sharp:
                return new Fraction(1, 2);
        }
    }

    private FractionTo12TET(fraction: Fraction)
    {
        const v = fraction.num * 2 / fraction.den;
        if(Math.floor(v) === v)
            return v;
        return undefined;
    }

    private NumericIntervalToAccidental(fraction: Fraction): Accidental
    {
        const v = fraction.num * 4 / fraction.den;
        switch(v)
        {
            case -2:
                return Accidental.Flat;
            case -1:
                return Accidental.HalfFlat;
            case 0:
                return Accidental.Natural;
            case 1:
                return Accidental.HalfSharp;
            case 2:
                return Accidental.Sharp;
            default:
                throw new Error("Interval can't be mapped to accidental:" + fraction.ToString())
        }
    }

    private ResolveNextPitch(pitch: OctavePitch, interval: Interval): OctavePitch
    {
        const step = (pitch.baseNote === NaturalNote.E) || (pitch.baseNote === NaturalNote.B) ? new Fraction(1, 2) : new Fraction(1, 1);
        const i = this.ToNumericInterval(interval);
        const own = this.AccidentalToFraction(pitch.accidental);

        return {
            accidental: this.NumericIntervalToAccidental(i.Subtract(step).Add(own)),
            baseNote: (pitch.baseNote === NaturalNote.G) ? NaturalNote.A : (pitch.baseNote + 1)
        };
    }

    private ToNumericInterval(interval: Interval)
    {
        switch(interval)
        {
            case Interval.SemiTone:
                return new Fraction(1, 2);
            case Interval.ThreeQuarters:
                return new Fraction(3, 4);
            case Interval.Tone:
                return new Fraction(1, 1);
        }
    }
}