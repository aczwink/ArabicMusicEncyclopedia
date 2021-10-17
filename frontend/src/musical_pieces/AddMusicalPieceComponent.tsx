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

import { Component, Injectable, JSX_CreateElement, Router } from "acfrontend";
import { MusicalPieces } from "ame-api";
import { MusicalPieceEditorComponent } from "./MusicalPieceEditorComponent";
import { MusicalPiecesService } from "./MusicalPiecesService";

@Injectable
export class AddMusicalPieceComponent extends Component
{
    constructor(private musicalPiecesService: MusicalPiecesService, private router: Router)
    {
        super();

        this.piece = {
            composerId: 0,
            formId: 1,
            maqamat: [],
            name: "",
            releaseDate: "",
            rhythms: [],
            text: "",
        };
    }

    protected Render(): RenderValue
    {
        return <fragment>
            <h1>Add musical piece</h1>
            <MusicalPieceEditorComponent piece={this.piece} />
            <button type="button" onclick={this.OnCreate.bind(this)}>Add</button>
        </fragment>;
    }

    //Private members
    private piece: MusicalPieces.Piece;

    //Event handlers
    private async OnCreate()
    {
        const result = await this.musicalPiecesService.AddPiece({}, { piece: this.piece });
        this.router.RouteTo("/musicalpieces/" + result.pieceId);
    }
}