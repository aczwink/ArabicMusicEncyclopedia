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

import { Anchor, Component, Injectable, JSX_CreateElement, ProgressSpinner } from "acfrontend";
import { Persons } from "ame-api";
import { PersonsService } from "./PersonsService";

@Injectable
export class ListPersonsComponent extends Component<{ type: Persons.PersonType }>
{
    constructor(private personsService: PersonsService)
    {
        super();

        this.data = null;
    }
    
    protected Render(): RenderValue
    {
        if(this.data === null)
            return <ProgressSpinner />;
        return <table>
            <tr>
                <th>Name</th>
            </tr>
            {this.data.map(row => <tr>
                <td><Anchor route={"/persons/" + row.id}>{row.name}</Anchor></td>
            </tr>)}
        </table>;
    }

    //Private members
    private data: Persons.PersonOverviewData[] | null;

    //Event handlers
    public async OnInitiated()
    {
        const result = await this.personsService.QueryPersons({ type: this.input.type });
        this.data = result.persons;
    }
}

export class ListComposersComponent extends Component
{
    protected Render(): RenderValue
    {
        return <ListPersonsComponent type={Persons.PersonType.Composer} />;
    }
}

export class ListLyricistsComponent extends Component
{
    protected Render(): RenderValue
    {
        return <ListPersonsComponent type={Persons.PersonType.Lyricist} />;
    }
}

export class ListSingersComponent extends Component
{
    protected Render(): RenderValue
    {
        return <ListPersonsComponent type={Persons.PersonType.Singer} />;
    }
}