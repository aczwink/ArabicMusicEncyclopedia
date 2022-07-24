/**
 * ArabicMusicEncyclopedia
 * Copyright (C) 2021-2022 Amir Czwink (amir130@hotmail.de)
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

import { Component, JSX_CreateElement, Select } from "acfrontend";
import { Accidental, NaturalNote, OctavePitch } from "ame-api";
import { AccidentalComponent } from "./AccidentalComponent";

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
        return <div class="row">
            <div class="col">
                <Select onChanged={newValue => this.input.onChanged({ accidental: this.input.selection.accidental, baseNote: this.ParseNote(newValue[0]) })}>
                    {naturalNotes.Entries().Map( kv =>
                        <option selected={kv.value === this.input.selection.baseNote}>{kv.key}</option>
                        ).ToArray()}
                </Select>
            </div>
            <div class="col">
                <Select onChanged={newValue => this.input.onChanged({ accidental: parseInt(newValue[0])!, baseNote: this.input.selection.baseNote })}>
                    {accidentals.map( acc =>
                        <option value={acc.toString()} selected={acc === this.input.selection.accidental}><AccidentalComponent accidental={acc} /></option>
                        )}
                </Select>
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