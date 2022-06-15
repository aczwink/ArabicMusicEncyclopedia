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

import { AutoCompleteSelectBox, Component, Injectable, JSX_CreateElement, KeyDisplayValuePair } from "acfrontend";
import { PersonOverviewData, PersonType } from "../../dist/api";
import { PersonsService } from "./PersonsService";

@Injectable
export class SinglePersonSelectionComponent extends Component<{ type: PersonType, selected?: number, onSelectionChanged: (id: number) => void }>
{
    constructor(private personsService: PersonsService)
    {
        super();

        this.selection = null;
    }

    protected Render(): RenderValue
    {
        const selection = (this.selection === null) ? null : {
            key: this.selection.id,
            displayValue: this.selection.name
        };

        return <AutoCompleteSelectBox<number> selection={selection} onChanged={this.OnSelectionChanged.bind(this)} onLoadSuggestions={this.OnLoadSuggestions.bind(this)} />;
    }

    //Private members
    private selection: PersonOverviewData | null;

    //Event handlers
    public async OnInitiated()
    {
        if(this.input.selected !== undefined)
        {
            const person = await this.personsService.QueryPerson(this.input.selected);
            this.selection = {
                id: this.input.selected,
                name: person.name
            };
        }
    }

    private async OnLoadSuggestions(searchText: string): Promise<KeyDisplayValuePair<number>[]>
    {
        const result = await this.personsService.QueryPersons(this.input.type, searchText, 0, 10);

        return result.persons.map(p => ({
            key: p.id,
            displayValue: p.name
        }));
    }

    private OnSelectionChanged(newValue: KeyDisplayValuePair<number>)
    {
        this.selection = {
            id: newValue.key,
            name: newValue.displayValue
        };
        this.input.onSelectionChanged(this.selection.id);
    }
}