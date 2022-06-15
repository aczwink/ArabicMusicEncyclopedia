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

import { Component, Injectable, JSX_CreateElement, ProgressSpinner, Router, RouterState } from "acfrontend";
import { Person } from "../../dist/api";
import { EditPersonForm } from "./EditPersonForm";
import { PersonsService } from "./PersonsService";

@Injectable
export class EditPersonComponent extends Component
{
    constructor(private personsService: PersonsService, routerState: RouterState, private router: Router)
    {
        super();

        this.person = null;
        this.personId = parseInt(routerState.routeParams.personId!);
    }
    
    protected Render(): RenderValue
    {
        if(this.person === null)
            return <ProgressSpinner />;
            
        return <fragment>
            <h1>Edit person {this.person.name}</h1>
            <EditPersonForm person={this.person} saveButtonText="Save" onSave={this.OnSave.bind(this)} />
        </fragment>;
    }

    //Private members
    private personId: number;
    private person: Person | null;

    //Event handlers
    public async OnInitiated()
    {
        const result = await this.personsService.QueryPerson(this.personId);
        this.person = result;
    }

    private async OnSave(image?: File | null)
    {
        await this.personsService.EditPerson(this.personId, this.person!);
        if(image !== undefined)
            await this.personsService.UpdatePersonImage(this.personId, image);
        this.router.RouteTo("/persons/" + this.personId);
    }
}