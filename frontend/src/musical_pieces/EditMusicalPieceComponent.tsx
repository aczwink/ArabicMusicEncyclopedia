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

import { Component, Injectable, JSX_CreateElement, ProgressSpinner, Router, RouterState } from "acfrontend";
import { MusicalPieces } from "ame-api";
import { MusicalPieceEditorComponent } from "./MusicalPieceEditorComponent";
import { MusicalPiecesService } from "./MusicalPiecesService";

@Injectable
export class EditMusicalPieceComponent extends Component
{
    constructor(routerState: RouterState, private musicalPiecesService: MusicalPiecesService, private router: Router)
    {
        super();

        this.pieceId = parseInt(routerState.routeParams.pieceId!);
        this.origPieceName = "";
        this.piece = null;
    }
    
    protected Render(): RenderValue
    {
        if( (this.piece === null) )
            return <ProgressSpinner />;

        return <fragment>
            <h1>Edit musical piece: {this.origPieceName}</h1>
            <MusicalPieceEditorComponent piece={this.piece} />
            <button type="button" onclick={this.OnSave.bind(this)}>Save</button>
        </fragment>;
    }

    //Private members
    private pieceId: number;
    private origPieceName: string;
    private piece: MusicalPieces.Piece | null;

    //Event handlers
    public async OnInitiated()
    {
        const result = await this.musicalPiecesService.QueryPiece({ pieceId: this.pieceId}, {});
        this.origPieceName = result.piece.name;
        this.piece = result.piece;
    }

    private async OnSave()
    {
        await this.musicalPiecesService.SetPiece({ pieceId: this.pieceId }, { piece: this.piece! });
        this.router.RouteTo("/musicalpieces/" + this.pieceId);
    }
}