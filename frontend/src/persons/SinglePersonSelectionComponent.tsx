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

import { AutoCompleteMultiSelectBox, Component, Injectable, JSX_CreateElement, KeyDisplayValuePair } from "acfrontend";
import { Persons } from "ame-api";
import { PersonsService } from "./PersonsService";

@Injectable
export class SinglePersonSelectionComponent extends Component<{ type: Persons.PersonType, onSelectionChanged: (id: number | null) => void }>
{
    constructor(private personsService: PersonsService)
    {
        super();

        this.selection = null;
    }
    
    protected Render(): RenderValue
    {
        return <AutoCompleteMultiSelectBox<number> selection={this.BuildSelection()} onChanged={this.OnSelectionChanged.bind(this)} onLoadSuggestions={this.OnLoadSuggestions.bind(this)} />;
    }

    //Private members
    private selection: Persons.PersonOverviewData | null;

    //Private methods
    private BuildSelection(): KeyDisplayValuePair<number>[]
    {
        if(this.selection === null)
            return [];
        return [{
            key: this.selection.id,
            displayValue: this.selection.name
        }];
    }

    //Event handlers
    private async OnLoadSuggestions(searchText: string): Promise<KeyDisplayValuePair<number>[]>
    {
        const result = await this.personsService.QueryPersons({
            limit: 10,
            nameFilter: searchText,
            offset: 0,
            type: this.input.type
        });

        return result.persons.map(p => ({
            key: p.id,
            displayValue: p.name
        }));
    }

    private OnSelectionChanged(newValue: KeyDisplayValuePair<number>[])
    {
        if(newValue.length == 0)
        {
            this.selection = null;
            this.input.onSelectionChanged(null);
        }
        else
        {
            this.selection = {
                id: newValue[0].key,
                name: newValue[0].displayValue
            };
            this.input.onSelectionChanged(this.selection.id);
        }
    }
}