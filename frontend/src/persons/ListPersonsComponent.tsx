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

import { Anchor, Component, Injectable, JSX_CreateElement, LineEdit, MatIcon, PaginationComponent, ProgressSpinner, RouterButton } from "acfrontend";
import { PersonOverviewData, PersonType } from "../../dist/api";
import { PersonsService } from "./PersonsService";

@Injectable
export class ListPersonsComponent extends Component<{ type: PersonType }>
{
    constructor(private personsService: PersonsService)
    {
        super();

        this.data = [];
        this.loading = false;
        this.nameFilter = "";
        this.offset = 0;
        this.size = 25;
        this.count = 0;
    }
    
    protected Render(): RenderValue
    {
        if(this.loading)
            return <ProgressSpinner />;

        return <fragment>
            <div class="box">
                <LineEdit value={this.nameFilter} onChanged={newValue => this.nameFilter = newValue} />
                <form onsubmit={this.OnSubmit.bind(this)}>
                    <button type="submit">Search</button>
                </form>
            </div>
            {this.RenderResultList()}
            <RouterButton route={"/persons/add/" + this.input.type}><MatIcon>add</MatIcon></RouterButton>
        </fragment>;
    }

    //Private members
    private data: PersonOverviewData[];
    private loading: boolean;
    private nameFilter: string;
    private count: number;
    private offset: number;
    private size: number;

    //Private methods
    private async ExecuteSearch()
    {
        this.loading = true;
        const result = await this.personsService.QueryPersons(this.input.type, this.nameFilter, this.offset, this.size);
        this.data = result.persons;
        this.count = result.totalCount;
        this.loading = false;
    }

    private RenderResultList()
    {
        if(this.data === null)
            return <ProgressSpinner />;
        if(this.data.length === 0)
            return null;
            
        return <fragment>
            <table>
                <tr>
                    <th>Name</th>
                </tr>
                {this.data.map(row => <tr>
                    <td><Anchor route={"/persons/" + row.id}>{row.name}</Anchor></td>
                </tr>)}
            </table>
            <PaginationComponent count={this.count} offset={this.offset} size={this.size} onOffsetChanged={this.OnOffsetChanged.bind(this)} onSizeChanged={this.OnSizeChanged.bind(this)} />
        </fragment>;
    }

    //Event handlers
    private OnOffsetChanged(newValue: number)
    {
        this.offset = newValue;
        this.ExecuteSearch();
    }

    private OnSizeChanged(newValue: number)
    {
        this.size = newValue;
        this.ExecuteSearch();
    }

    private OnSubmit(event: Event)
    {
        event.preventDefault();
        this.ExecuteSearch();
    }
}

export class ListComposersComponent extends Component
{
    protected Render(): RenderValue
    {
        return <ListPersonsComponent type={PersonType.Composer} />;
    }
}

export class ListLyricistsComponent extends Component
{
    protected Render(): RenderValue
    {
        return <ListPersonsComponent type={PersonType.Lyricist} />;
    }
}

export class ListSingersComponent extends Component
{
    protected Render(): RenderValue
    {
        return <ListPersonsComponent type={PersonType.Singer} />;
    }
}