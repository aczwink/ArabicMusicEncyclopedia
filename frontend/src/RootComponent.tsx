/**
 * ArabicMusicEncyclopedia
 * Copyright (C) 2021-2023 Amir Czwink (amir130@hotmail.de)
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

import { Component, JSX_CreateElement, Navigation, NavItem, RouterComponent } from "acfrontend";

export class RootComponent extends Component
{
    protected Render()
    {
        return <fragment>
            <Navigation>
                <ul className="nav nav-pills">
                    <NavItem route="/ajnas">Ajnas</NavItem>
                    <NavItem route="/maqamat/families">Maqam families</NavItem>
                    <NavItem route="/maqamat/list">Maqamat</NavItem>
                    <NavItem route="/rhythms">Rhythms</NavItem>
                    <NavItem route="/instruments">Instruments</NavItem>
                </ul>
                <ul className="nav nav-pills">
                    <NavItem route="/persons">Composers / Lyricists / Singers</NavItem>
                </ul>
                <ul className="nav nav-pills">
                    <NavItem route="/musicalpieces">Musical pieces</NavItem>
                </ul>
                <ul className="nav nav-pills">
                    <NavItem route="/wiki">Wiki</NavItem>
                </ul>
            </Navigation>
            <div className="container-fluid">
                <RouterComponent />
            </div>
        </fragment>;
    }
}