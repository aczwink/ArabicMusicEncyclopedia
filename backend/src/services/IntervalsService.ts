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

import { Injectable } from "acts-util-node";
import { AjnasController } from "../dataaccess/AjnasController";
import { MaqamatController, MaqamData } from "../dataaccess/MaqamatController";
import { Fraction } from "../model/Fraction";
import { OctavePitch, Accidental, NaturalNote } from "openarabicmusicdb-domain/dist/OctavePitch";
import { Interval, OpenArabicMusicDBJins } from "openarabicmusicdb-domain";

@Injectable
export class IntervalsService
{
    constructor(private maqamController: MaqamatController, private ajnasController: AjnasController)
    {
    }

    //Public methods
    public ComputeIntervalsFromPitches(pitches: OctavePitch[])
    {
        const result = [];
        for(let i = 0; i < pitches.length-1; i++)
        {
            const d1 = this.IntervalBetween(pitches[i], pitches[i+1]);
            result.push(d1);
        }

        return result;
    }

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

    public FromNumericIntervals(fractions: Fraction[])
    {
        return fractions.map(fraction => {
            if((fraction.num === 1) && (fraction.den === 1))
                return Interval.Tone;
            if((fraction.num === 1) && (fraction.den === 2))
                return Interval.SemiTone;
            if((fraction.num === 3) && (fraction.den === 4))
                return Interval.ThreeQuarters;
            throw new Error("Illegal fraction: " + fraction.ToString());
        });
    }

    public GetMaqamIntervals(maqam: MaqamData, rootJins: OpenArabicMusicDBJins, branchingJins: OpenArabicMusicDBJins)
    {
        switch(maqam.dominant)
        {
            case 3:
            case 4:
                return rootJins.intervals.concat(branchingJins.intervals).concat(maqam.additionalIntervals);
            case 5:
                return rootJins.intervals.concat(maqam.additionalIntervals).concat(branchingJins.intervals);
            case 34: //special for maqam saba. Dominant is on 3 but saba jins spans until 4
                return rootJins.intervals.concat(branchingJins.intervals.slice(1)).concat(maqam.additionalIntervals);
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

    public async QueryMaqamIntervals(maqamId: string, branchingJinsId: string)
    {
        const maqam = await this.maqamController.QueryMaqam(maqamId);
        if(maqam === undefined)
            return undefined;
        
        const rootJins = await this.ajnasController.QueryJins(maqam.rootJinsId);
        if(rootJins === undefined)
            return undefined;
        const branchingJins = await this.ajnasController.QueryJins(branchingJinsId);
        if(branchingJins === undefined)
            return undefined;

        const scaleIntervals = this.GetMaqamIntervals(maqam, rootJins, branchingJins);

        return scaleIntervals;
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
            case Accidental.DoubleFlat:
                return new Fraction(-1, 1);
            case Accidental.ThreeQuarterFlat:
                return new Fraction(-3, 4);
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

    private IntervalBetween(a: OctavePitch, b: OctavePitch): Fraction
    {
        if(a.baseNote === b.baseNote)
            return this.AccidentalToFraction(a.accidental).Negate().Add(this.AccidentalToFraction(b.accidental));

        let d = 1;
        if((a.baseNote === NaturalNote.B) || (a.baseNote === NaturalNote.E))
            d = 2;
        return new Fraction(1, d).Add(this.IntervalBetween({ accidental: a.accidental, baseNote: (a.baseNote+1) % 7 }, b));
    }

    private NumericIntervalToAccidental(fraction: Fraction): Accidental
    {
        const v = fraction.num * 4 / fraction.den;
        switch(v)
        {
            case -4:
                return Accidental.DoubleFlat;
            case -3:
                return Accidental.ThreeQuarterFlat;
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
            case Interval.OneAndAHalfTones:
                return new Fraction(3, 2);
            case Interval.SemiTone:
                return new Fraction(1, 2);
            case Interval.ThreeQuarters:
                return new Fraction(3, 4);
            case Interval.Tone:
                return new Fraction(1, 1);
        }
    }
}