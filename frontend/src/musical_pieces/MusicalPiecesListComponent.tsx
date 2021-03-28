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
import { Anchor, Component, JSX_CreateElement, MatIcon, RouterButton } from "acfrontend";
import { MusicalPieces } from "ame-api";

export class MusicalPiecesListComponent extends Component<{ pieces: MusicalPieces.API.List.Piece[] }>
{
    protected Render(): RenderValue
    {
        return <fragment>
                <table>
                <tr>
                    <th>Form</th>
                    <th>Title</th>
                    <th>Composer</th>
                    <th>Release date</th>
                    <th>Singer</th>
                </tr>
                {this.input.pieces.map(this.RenderPiece.bind(this))}
            </table>
            <RouterButton route={"/musicalpieces/add"}><MatIcon>add</MatIcon></RouterButton>
        </fragment>;
    }

    //Private methods
    private RenderPiece(piece: MusicalPieces.API.List.Piece)
    {
        return <tr>
            <td>{piece.formName}</td>
            <td><Anchor route={"/musicalpieces/" + piece.id}>{piece.name}</Anchor></td>
            <td>{piece.composerName}</td>
            <td>{piece.releaseDate}</td>
            <td>{piece.singerName}</td>
        </tr>
    }
}