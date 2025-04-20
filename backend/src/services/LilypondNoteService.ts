/**
 * ArabicMusicEncyclopedia
 * Copyright (C) 2021-2025 Amir Czwink (amir130@hotmail.de)
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
import { OctavePitch, NaturalNote, Accidental } from "openarabicmusicdb-domain/dist/OctavePitch";

type NoteLanguage = "italian";

interface LilypondPitch
{
    pitch: OctavePitch;
    language: NoteLanguage;
}

@Injectable
export class LilypondNoteService
{
    //Public methods
    public ParseLilypondPitch(pitch: string): LilypondPitch
    {
        switch(pitch)
        {
            case "do":
                return {
                    pitch: {
                        baseNote: NaturalNote.C,
                        accidental: Accidental.Natural
                    },
                    language: "italian"
                };
            default:
                throw new Error("NOT IMPLEMENTED: " + pitch);
        }
    }

    public ToLilypondNote(pitch: OctavePitch, language: NoteLanguage)
    {
        switch(language)
        {
            case "italian":
                return this.ToItalianLilypondNote(pitch);
        }
    }

    //Private methods
    private ToItalianLilypondNote(pitch: OctavePitch)
    {
        function AccidentalToString(acc: Accidental)
        {
            switch(acc)
            {
                case Accidental.Flat:
                    return "b";
                case Accidental.HalfFlat:
                    return "sb";
                case Accidental.Natural:
                    return "";
                case Accidental.HalfSharp:
                    return "sd";
                case Accidental.Sharp:
                    return "d";
                default:
                    throw new Error("NOT IMPLEMENTED: " + acc);
            }
        }

        function NoteNameToString(note: NaturalNote)
        {
            switch(note)
            {
                case NaturalNote.A:
                    return "la";
                case NaturalNote.B:
                    return "si";
                case NaturalNote.C:
                    return "do";
                case NaturalNote.D:
                    return "re";
                case NaturalNote.E:
                    return "mi";
                case NaturalNote.F:
                    return "fa";
                case NaturalNote.G:
                    return "sol";
            }
        }

        return NoteNameToString(pitch.baseNote) + AccidentalToString(pitch.accidental);
    }
}