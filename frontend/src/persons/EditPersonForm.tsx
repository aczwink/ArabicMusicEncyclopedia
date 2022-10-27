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

import { Component, FileSelect, FormField, JSX_CreateElement, LineEdit, Select } from "acfrontend";
import { CountryCode } from "ame-api/dist/Locale";
import { Person, PersonType } from "../../dist/api";
import { WikiTextEditComponent } from "../shared/WikiTextEditComponent";

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

        return <form onsubmit={this.OnSave.bind(this)}>
            <FormField title="Name">
                <LineEdit value={p.name} onChanged={newValue => p.name = newValue} />
            </FormField>
            <FormField title="Type">
                <Select onChanged={newValue => p.type = parseInt(newValue[0])}>
                    <option value={PersonType.Composer} selected={p.type === PersonType.Composer}>Composer</option>
                    <option value={PersonType.Lyricist} selected={p.type === PersonType.Lyricist}>Lyricist</option>
                    <option value={PersonType.Singer} selected={p.type === PersonType.Singer}>Singer</option>
                </Select>
            </FormField>
            <FormField title="Origin">
                <LineEdit value={p.origin} onChanged={newValue => p.origin = newValue} />
            </FormField>
            <FormField title="Location">
                <fragment>{this.RenderLocations()}</fragment>
            </FormField>
            <FormField title="Lifetime">
                <LineEdit value={p.lifeTime} onChanged={newValue => p.lifeTime = newValue} />
            </FormField>
            <FormField title="Image">
                <FileSelect class="form-control" onChanged={newValue => this.thumb = newValue} />
            </FormField>
            <FormField title="Text">
                <WikiTextEditComponent text={p.text} onChanged={newValue => p.text = newValue} />
            </FormField>
            <button className="btn btn-primary" type="submit" disabled={!this.IsValid()}>{this.input.saveButtonText}</button>
        </form>;
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
        const allCodes: CountryCode[] = ["eg", "iq", "lb", "sy", "tr"];

        return allCodes.map(code => {
            const checked = this.person!.countryCodes.Contains(code);
            return <div className="form-check">
                <input className="form-check-input" type="checkbox" checked={checked} onclick={this.OnLocationChanged.bind(this, code, checked)} />
                <label className="form-check-label">{code}</label>
            </div>;          
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

    private OnSave(event: Event)
    {
        event.preventDefault();

        if(this.shouldDeleteThumb)
            this.input.onSave(null);
        else if(this.thumb === null)
            this.input.onSave(undefined);
        else
            this.input.onSave(this.thumb);
    }
}