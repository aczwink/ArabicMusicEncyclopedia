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

import { Component, Injectable, JSX_CreateElement, Router, RouterState } from "acfrontend";
import { Person } from "../../dist/api";
import { EditPersonForm } from "./EditPersonForm";
import { PersonsService } from "./PersonsService";

@Injectable
export class AddPersonComponent extends Component
{
    constructor(routerState: RouterState, private personsService: PersonsService, private router: Router)
    {
        super();

        this.person = {
            name: "",
            lifeTime: "",
            origin: "",
            text: "",
            type: parseInt(routerState.routeParams.type!),
            countryCodes: []
        };
    }
    
    protected Render(): RenderValue
    {
        return <fragment>
            <h1>Add person</h1>
            <div class="row">
                <div class="column">
                    <EditPersonForm person={this.person} saveButtonText="Add" onSave={this.OnAdd.bind(this)} />
                </div>
                <div class="column">
                </div>
            </div>
        </fragment>;
    }

    //Private members
    private person: Person;

    //Event handlers
    private async OnAdd(image?: File | null)
    {
        const personId = await this.personsService.AddPerson(this.person);
        if(image)
            await this.personsService.UpdatePersonImage(personId, image);
        this.router.RouteTo("/persons/" + personId);
    }
}