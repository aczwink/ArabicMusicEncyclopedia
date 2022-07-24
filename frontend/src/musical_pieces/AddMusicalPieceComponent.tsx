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

import { Component, Injectable, JSX_CreateElement, Router } from "acfrontend";
import { PieceDetailsData } from "../../dist/api";
import { MusicalPieceEditorComponent } from "./MusicalPieceEditorComponent";
import { AttachmentChangesCollection, MusicalPiecesService } from "./MusicalPiecesService";

@Injectable
export class AddMusicalPieceComponent extends Component
{
    constructor(private musicalPiecesService: MusicalPiecesService, private router: Router)
    {
        super();

        this.piece = {
            attachments: [],
            composerId: 0,
            formId: 1,
            maqamat: [],
            name: "",
            releaseDate: "",
            rhythms: [],
            text: "",
        };
        this.attachments = {
            new: [],
            existing: [],
            deleted: []
        };
        this.isValid = false;
    }

    protected Render(): RenderValue
    {
        return <fragment>
            <h1>Add musical piece</h1>
            <MusicalPieceEditorComponent piece={this.piece} attachments={this.attachments} onValidationUpdated={newValue => this.isValid = newValue} />
            <button className="btn btn-primary" type="button" onclick={this.OnCreate.bind(this)} disabled={!this.isValid}>Add</button>
        </fragment>;
    }

    //Private members
    private piece: PieceDetailsData;
    private attachments: AttachmentChangesCollection;
    private isValid: boolean;

    //Event handlers
    private async OnCreate()
    {
        const pieceId = await this.musicalPiecesService.AddPiece(this.piece);
        await this.musicalPiecesService.ApplyAttachmentChanges(pieceId, this.attachments);
        this.router.RouteTo("/musicalpieces/" + pieceId);
    }
}