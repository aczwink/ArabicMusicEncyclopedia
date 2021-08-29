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

import { Anchor, Component, Injectable, JSX_CreateElement, MatIcon, ProgressSpinner, RouterState } from "acfrontend";
import { Persons } from "ame-api";
import { g_backendBaseUrl } from "../backend";
import { PersonsService } from "./PersonsService";


@Injectable
export class ShowPersonComponent extends Component
{
    constructor(routerState: RouterState, private personsService: PersonsService)
    {
        super();

        this.personId = parseInt(routerState.routeParams.personId!);
        this.data = null;
    }
    
    protected Render(): RenderValue
    {
        if(this.data === null)
            return <ProgressSpinner />;

        return <fragment>
            <h1>
                {this.data.name}
                <Anchor route={"/persons/edit/" + this.personId}><MatIcon>edit</MatIcon></Anchor>
            </h1>
            <div>
                <div class="box" style="float: right; display: block">
                    <img src={g_backendBaseUrl + "/persons/" + this.personId + "/image"} style="max-width: 25rem" />
                </div>
                <table class="keyValue">
                    <tr>
                        <th>Type</th>
                        <td>{this.TypeToString(this.data.type)}</td>
                    </tr>
                    <tr>
                        <th>Lifetime</th>
                        <td>{this.data.lifeTime}</td>
                    </tr>
                    <tr>
                        <th>Origin</th>
                        <td>{this.data.origin}</td>
                    </tr>
                </table>
            </div>
        </fragment>;
    }

    //Private members
    private personId: number;
    private data: Persons.Person | null;

    //Private methods
    private TypeToString(type: Persons.PersonType): RenderValue
    {
        switch(type)
        {
            case Persons.PersonType.Composer:
                return "Composer";
            case Persons.PersonType.Lyricist:
                return "Lyricist";
            case Persons.PersonType.Singer:
                return "Singer";
        }
    }

    //Event handlers
    public async OnInitiated()
    {
        const result = await this.personsService.QueryPerson({ personId: this.personId}, {});
        this.data = result.person;
    }
}