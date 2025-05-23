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

import { Component, JSX_CreateElement, Select, SingleSelect } from "acfrontend";
import { AccidentalComponent } from "./AccidentalComponent";
import { ObjectExtensions } from "acts-util-core";
import { NaturalNote, Accidental, OctavePitch } from "openarabicmusicdb-domain/dist/OctavePitch";

const naturalNotes = {
    "A": NaturalNote.A,
    "B": NaturalNote.B,
    "C": NaturalNote.C,
    "D": NaturalNote.D,
    "E": NaturalNote.E,
    "F": NaturalNote.F,
    "G": NaturalNote.G,
};
const accidentals = [
    Accidental.Flat,
    Accidental.HalfFlat,
    Accidental.Natural,
    Accidental.HalfSharp,
    Accidental.Sharp,
];

export class PitchSelectionComponent extends Component<{
    selection: OctavePitch;
    onChanged: (newValue: OctavePitch) => void;
}>
{
    protected Render(): RenderValue
    {
        return <div className="row">
            <div className="col">
                <Select onChanged={newValue => this.input.onChanged({ accidental: this.input.selection.accidental, baseNote: this.ParseNote(newValue[0]) })}>
                    {ObjectExtensions.Entries(naturalNotes).Map( kv =>
                        <option selected={kv.value === this.input.selection.baseNote}>{kv.key}</option>
                        ).ToArray()}
                </Select>
            </div>
            <div className="col">
                <SingleSelect selectedIndex={accidentals.indexOf(this.input.selection.accidental)}
                    onSelectionChanged={newIndex => this.input.onChanged({ accidental: accidentals[newIndex], baseNote: this.input.selection.baseNote })}>
                    {...accidentals.map( acc => <AccidentalComponent accidental={acc} /> )}
                </SingleSelect>
            </div>
        </div>;
    }

    //Private methods
    private ParseNote(v: string)
    {
        const n: any = naturalNotes;
        return n[v];
    }
}