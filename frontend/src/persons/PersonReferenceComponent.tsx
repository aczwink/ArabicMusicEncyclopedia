/**
 * ArabicMusicEncyclopedia
 * Copyright (C) 2023 Amir Czwink (amir130@hotmail.de)
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

import { Anchor, Component, JSX_CreateElement } from "acfrontend";
import { PersonOverviewData } from "../../dist/api";
import { g_backendBaseUrl } from "../env";

export class PersonReferenceComponent extends Component<PersonOverviewData>
{
    protected Render(): RenderValue
    {
        const row = this.input;
        return <Anchor route={"/persons/" + row.id}>
            <img src={g_backendBaseUrl + "/persons/" + row.id + "/image"} className="me-2 personrefthumb" />
            {row.name}
        </Anchor>;
    }
}