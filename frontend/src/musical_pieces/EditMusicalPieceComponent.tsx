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
import { PieceDetailsData } from "../../dist/api";
import { MusicalPieceEditorComponent } from "./MusicalPieceEditorComponent";
import { AttachmentChangesCollection, MusicalPiecesService } from "./MusicalPiecesService";

@Injectable
export class EditMusicalPieceComponent extends Component
{
    constructor(routerState: RouterState, private musicalPiecesService: MusicalPiecesService, private router: Router)
    {
        super();

        this.pieceId = parseInt(routerState.routeParams.pieceId!);
        this.origPieceName = "";
        this.piece = null;
        this.attachments = {
            new: [],
            existing: [],
            deleted: []
        };
        this.isValid = true;
    }
    
    protected Render(): RenderValue
    {
        if( (this.piece === null) )
            return <ProgressSpinner />;

        return <fragment>
            <h1>Edit musical piece: {this.origPieceName}</h1>
            <MusicalPieceEditorComponent piece={this.piece} attachments={this.attachments} onValidationUpdated={newValue => this.isValid = newValue} />
            <button type="button" onclick={this.OnSave.bind(this)} disabled={!this.isValid}>Save</button>
        </fragment>;
    }

    //Private members
    private pieceId: number;
    private origPieceName: string;
    private piece: PieceDetailsData | null;
    private attachments: AttachmentChangesCollection;
    private isValid: boolean;

    //Event handlers
    public async OnInitiated()
    {
        const result = await this.musicalPiecesService.QueryPiece(this.pieceId);
        this.origPieceName = result.name;
        this.attachments.existing = result.attachments;
        this.piece = result;
    }

    private async OnSave()
    {
        await this.musicalPiecesService.SetPiece(this.pieceId, this.piece!);
        await this.musicalPiecesService.ApplyAttachmentChanges(this.pieceId, this.attachments);
        this.router.RouteTo("/musicalpieces/" + this.pieceId);
    }
}