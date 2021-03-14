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

import { Anchor, Component, JSX_CreateElement, Navigation, NavigationGroup, RouterComponent } from "acfrontend";

export class RootComponent extends Component
{
    protected Render()
    {
        return <fragment>
            <Navigation>
                <NavigationGroup>
                    <Anchor route="/ajnas">Ajnas</Anchor>
                    <Anchor route="/maqamat/families">Maqam families</Anchor>
                    <Anchor route="/rhythms">Rhythms</Anchor>
                </NavigationGroup>
                <NavigationGroup>
                    <Anchor route="/composers">Composers</Anchor>
                    <Anchor route="/lyricists">Lyricists</Anchor>
                    <Anchor route="/singers">Singers</Anchor>
                </NavigationGroup>
                <NavigationGroup>
                    <Anchor route="/musicalpieces">Musical pieces</Anchor>
                </NavigationGroup>
                <NavigationGroup>
                    <Anchor route="/wiki">Wiki</Anchor>
                </NavigationGroup>
            </Navigation>
            <RouterComponent />
        </fragment>;
    }
}