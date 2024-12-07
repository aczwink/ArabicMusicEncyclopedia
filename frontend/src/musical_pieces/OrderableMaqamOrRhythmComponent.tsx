/**
 * ArabicMusicEncyclopedia
 * Copyright (C) 2021-2024 Amir Czwink (amir130@hotmail.de)
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

import { BootstrapIcon, Component, JSX_CreateElement, LineEdit } from "acfrontend";
import { PieceMaqamAssociation, PieceRhythmAssociation } from "../../dist/api";
import { MaqamSelectionComponent } from "../shared/MaqamSelectionComponent";
import { FullRhythmSelectionComponent } from "../shared/RhythmSelectionComponent";

interface OrderableMaqamOrRhythmInput
{
    entries: (PieceMaqamAssociation[]) | (PieceRhythmAssociation[]);
    onUpdate: () => void;
}

export class OrderableMaqamOrRhythmComponent extends Component<OrderableMaqamOrRhythmInput>
{
    protected Render(): RenderValue
    {
        return this.input.entries.map(this.RenderEntry.bind(this));
    }

    //Private methods
    private RemoveEntry<T>(arr: T[], itemToRemove: T)
    {
        const index = arr.indexOf(itemToRemove);
        arr.Remove(index);
        this.input.onUpdate();
    }

    private RenderEntry(entry: PieceMaqamAssociation | PieceRhythmAssociation, index: number)
    {
        return <tr>
            <td>
                {this.RenderEntrySelector(entry)}
            </td>
            <td><LineEdit value={entry.explanation} onChanged={newValue => entry.explanation = newValue} /></td>
            <td>
                <button type="button" disabled={index === 0} className="btn btn-secondary" onclick={this.OnMoveUpwards.bind(this, index)}><BootstrapIcon>arrow-up-short</BootstrapIcon></button>
                <button type="button" disabled={index === (this.input.entries.length-1)} className="btn btn-secondary" onclick={this.OnMoveDownwards.bind(this, index)}><BootstrapIcon>arrow-down-short</BootstrapIcon></button>
                <button type="button" className="btn btn-danger" onclick={this.RemoveEntry.bind(this, this.input.entries, entry)}><BootstrapIcon>trash</BootstrapIcon></button>
            </td>
        </tr>;
    }

    private RenderEntrySelector(entry: PieceMaqamAssociation | PieceRhythmAssociation)
    {
        if("maqamId" in entry)
            return <MaqamSelectionComponent maqamId={entry.maqamId} onSelectionChanged={newValue => entry.maqamId = newValue} />;
        return <FullRhythmSelectionComponent rhythmId={entry.rhythmId} onSelectionChanged={newValue => entry.rhythmId = newValue} />
    }

    private Swap(i1: number, i2: number)
    {
        const tmp = this.input.entries[i1];
        this.input.entries[i1] = this.input.entries[i2];
        this.input.entries[i2] = tmp;

        this.input.onUpdate();
    }

    //Event handlers
    private OnMoveDownwards(index: number)
    {
        this.Swap(index, index+1);
    }

    private OnMoveUpwards(index: number)
    {
        this.Swap(index, index-1);
    }
}