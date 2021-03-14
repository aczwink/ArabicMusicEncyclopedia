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

import { Component, JSX_CreateElement } from "acfrontend";
import { NaturalNote, OctavePitch } from "ame-api";
import { AccidentalComponent } from "./AccidentalComponent";

export class PitchComponent extends Component<{ pitch: OctavePitch }>
{
    protected Render(): RenderValue
    {
        return <span>
            {this.RenderNaturalNote(this.input.pitch.baseNote)}<AccidentalComponent accidental={this.input.pitch.accidental} />
        </span>;
    }

    //Private methods
    private RenderNaturalNote(note: NaturalNote)
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
}