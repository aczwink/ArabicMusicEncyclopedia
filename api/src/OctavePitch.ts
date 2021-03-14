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

export enum NaturalNote
{
    A,
    B,
    C,
    D,
    E,
    F,
    G
}

export enum Accidental
{
    Flat,
    HalfFlat,
    Natural,
    HalfSharp,
    Sharp,
}

export interface OctavePitch
{
    baseNote: NaturalNote;
    accidental: Accidental;
}

export function ParseOctavePitch(str: string): OctavePitch
{
    function ParseNaturalNote(str: string)
    {
        switch(str)
        {
            case "A":
                return NaturalNote.A;
            case "B":
                return NaturalNote.B;
            case "C":
                return NaturalNote.C;
            case "D":
                return NaturalNote.D;
            case "E":
                return NaturalNote.E;
            case "F":
                return NaturalNote.F;
            case "G":
                return NaturalNote.G;
        }

        throw new Error("Can't parse natural note: " + str);
    }

    function ParseAccidental(str: string)
    {
        switch(str)
        {
            case "":
                return Accidental.Natural;
            case "b":
                return Accidental.Flat;
            case "hb":
                return Accidental.HalfFlat;
            case "h#":
                return Accidental.HalfSharp;
            case "#":
                return Accidental.Sharp;
        }

        throw new Error("Can't parse accidental: " + str);
    }

    return {
        accidental: ParseAccidental(str.substr(1)),
        baseNote: ParseNaturalNote(str[0])
    };
}

export function OctavePitchToString(pitch: OctavePitch)
{
    function NaturalNoteToString(note: NaturalNote)
    {
        switch(note)
        {
            case NaturalNote.A:
                return "A";
            case NaturalNote.B:
                return "B";
            case NaturalNote.C:
                return "C";
            case NaturalNote.D:
                return "D";
            case NaturalNote.E:
                return "E";
            case NaturalNote.F:
                return "F";
            case NaturalNote.G:
                return "G";
        }
    }

    function AccidentalToString(accidental: Accidental)
    {
        switch(accidental)
        {
            case Accidental.Flat:
                return "b";
            case Accidental.HalfFlat:
                return "hb";
            case Accidental.Natural:
                return "";
            case Accidental.HalfSharp:
                return "h#";
            case Accidental.Sharp:
                return "#";
        }
    }

    return NaturalNoteToString(pitch.baseNote) + AccidentalToString(pitch.accidental);
}