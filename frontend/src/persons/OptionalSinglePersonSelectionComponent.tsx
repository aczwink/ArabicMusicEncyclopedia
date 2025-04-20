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

import { AutoCompleteSelectBox, Component, Injectable, JSX_CreateElement, KeyDisplayValuePair } from "acfrontend";
import { PersonOverviewData } from "../../dist/api";
import { PersonsService } from "./PersonsService";

const allSelection: PersonOverviewData = {
    id: "-1",
    name: "All"
};

@Injectable
export class OptionalSinglePersonSelectionComponent extends Component<{ onSelectionChanged: (id: string | null) => void }>
{
    constructor(private personsService: PersonsService)
    {
        super();

        this.selection = allSelection;
    }
    
    protected Render(): RenderValue
    {
        const selection = {
            key: this.selection.id,
            displayValue: this.selection.name
        };

        return <AutoCompleteSelectBox<string> selection={selection} onChanged={this.OnSelectionChanged.bind(this)} onLoadSuggestions={this.OnLoadSuggestions.bind(this)} />;
    }

    //Private members
    private selection: PersonOverviewData;

    //Event handlers
    private async OnLoadSuggestions(searchText: string): Promise<KeyDisplayValuePair<string>[]>
    {
        const result = await this.personsService.QueryPersons(searchText, 0, 10);

        const all = [{
            key: allSelection.id,
            displayValue: allSelection.name
        }];

        return all.concat(result.persons.map(p => ({
            key: p.id,
            displayValue: p.name
        })));
    }

    private OnSelectionChanged(newValue: KeyDisplayValuePair<string>)
    {
        if(newValue.key === allSelection.id)
        {
            this.selection = allSelection;
            this.input.onSelectionChanged(null);
        }
        else
        {
            this.selection = {
                id: newValue.key,
                name: newValue.displayValue
            };
            this.input.onSelectionChanged(this.selection.id);
        }
    }
}