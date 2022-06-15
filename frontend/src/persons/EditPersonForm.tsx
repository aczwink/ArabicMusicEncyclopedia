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

import { Component, FileSelect, JSX_CreateElement, LineEdit, Select } from "acfrontend";
import { CountryCode } from "ame-api/dist/Locale";
import { Person, PersonType } from "../../dist/api";

export class EditPersonForm extends Component<{ person: Person; saveButtonText: string; onSave: (image?: File | null) => void }>
{
    constructor()
    {
        super();

        this.person = null;
        this.thumb = null;
        this.shouldDeleteThumb = false;
    }
    
    protected Render(): RenderValue
    {
        const p = this.person!;

        return <table class="keyValue">
            <tr>
                <th>Name</th>
                <td><LineEdit value={p.name} onChanged={newValue => p.name = newValue} /></td>
            </tr>
            <tr>
                <th>Type</th>
                <td>
                    <Select onChanged={newValue => p.type = parseInt(newValue[0])}>
                        <option value={PersonType.Composer} selected={p.type === PersonType.Composer}>Composer</option>
                        <option value={PersonType.Lyricist} selected={p.type === PersonType.Lyricist}>Lyricist</option>
                        <option value={PersonType.Singer} selected={p.type === PersonType.Singer}>Singer</option>
                    </Select>
                </td>
            </tr>
            <tr>
                <th>Origin</th>
                <td><LineEdit value={p.origin} onChanged={newValue => p.origin = newValue} /></td>
            </tr>
            <tr>
                <th>Location</th>
                <td>{this.RenderLocations()}</td>
            </tr>
            <tr>
                <th>Lifetime</th>
                <td><LineEdit value={p.lifeTime} onChanged={newValue => p.lifeTime = newValue} /></td>
            </tr>
            <tr>
                <th>Image</th>
                <td>
                    <FileSelect onChanged={newValue => this.thumb = newValue} />
                </td>
            </tr>
            <tr>
                <td colspan="2">
                    <button type="button" onclick={this.OnSave.bind(this)} disabled={!this.IsValid()}>{this.input.saveButtonText}</button>
                </td>
            </tr>
        </table>;
    }

    //Private members
    private person: Person | null;
    private thumb: File | null;
    private shouldDeleteThumb: boolean;

    //Private methods
    private IsNotEmpty(s: string)
    {
        return s.trim().length > 0;
    }

    private IsValid()
    {
        const p = this.person!;

        return this.IsNotEmpty(p.name) && this.IsNotEmpty(p.lifeTime) && this.IsNotEmpty(p.origin);
    }

    private RenderLocations()
    {
        const allCodes: CountryCode[] = ["eg", "lb", "sy", "tr"];

        return allCodes.map(code => {
            const checked = this.person!.countryCodes.Contains(code);
            return <fragment>
                <input type="checkbox" checked={checked} onclick={this.OnLocationChanged.bind(this, code, checked)} />
                {code}
            </fragment>;
        });
    }

    //Eventhandlers
    public OnInitiated()
    {
        this.person = this.CreateDataBindingProxy(this.input.person);
    }

    private OnLocationChanged(code: CountryCode, wasChecked: boolean)
    {
        if(wasChecked)
            this.person!.countryCodes.Remove(this.person!.countryCodes.indexOf(code));
        else
            this.person!.countryCodes.push(code);
        this.Update();
    }

    private OnSave()
    {
        if(this.shouldDeleteThumb)
            this.input.onSave(null);
        else if(this.thumb === null)
            this.input.onSave(undefined);
        else
            this.input.onSave(this.thumb);
    }
}