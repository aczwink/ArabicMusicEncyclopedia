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
import { Anchor, Component, JSX_CreateElement } from "acfrontend";
import { PieceOverviewData } from "../../dist/api";
import { PersonReferenceComponent } from "../persons/PersonReferenceComponent";

export class MusicalPiecesListComponent extends Component<{ pieces: PieceOverviewData[] }>
{
    protected Render(): RenderValue
    {
        return <fragment>
            <table className="table table-striped table-hover">
                <thead>
                    <tr>
                        <th>Form</th>
                        <th>Title</th>
                        <th>Composer</th>
                        <th>Release date</th>
                        <th>Singer</th>
                    </tr>
                </thead>
                <tbody>{this.input.pieces.map(this.RenderPiece.bind(this))}</tbody>
            </table>
        </fragment>;
    }

    //Private methods
    private RenderPiece(piece: PieceOverviewData)
    {
        return <tr>
            <td>{piece.formName}</td>
            <td><Anchor route={"/musicalpieces/" + piece.id}>{piece.name}</Anchor></td>
            <td><PersonReferenceComponent id={piece.composerId} name={piece.composerName} /></td>
            <td>{piece.releaseDate}</td>
            <td>{piece.singerId ? <PersonReferenceComponent id={piece.singerId} name={piece.singerName} /> : null}</td>
        </tr>
    }
}