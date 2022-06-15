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

import { Component, DialogRef, FileSelect, Injectable, JSX_CreateElement, LineEdit } from "acfrontend";
import { Attachment } from "./MusicalPiecesService";

@Injectable
export class AddAttachmentComponent extends Component<{ onSuccess: (attachment: Attachment) => void }>
{
    constructor(private dialogRef: DialogRef)
    {
        super();

        this.comment = "";
        this.file = null;

        dialogRef.onAccept.Subscribe(this.OnUpload.bind(this));
        dialogRef.valid.Set(false);
    }
    
    protected Render(): RenderValue
    {
        return <fragment>
            Comment: <LineEdit value={this.comment} onChanged={this.OnCommentChanged.bind(this)} />
            Attachment: <FileSelect onChanged={this.OnFileChanged.bind(this)} />
        </fragment>;
    }

    //Private members
    private comment: string;
    private file: File | null;

    //Private methods
    private UpdateValidation()
    {
        this.dialogRef.valid.Set( (this.comment.trim().length > 0) && (this.file !== null) );
    }

    //Event handlers
    private OnCommentChanged(newValue: string)
    {
        this.comment = newValue;
        this.UpdateValidation();
    }

    private OnFileChanged(newValue: File | null)
    {
        this.file = newValue;
        this.UpdateValidation();
    }

    private async OnUpload()
    {
        this.dialogRef.waiting.Set(true);

        this.input.onSuccess({
            comment: this.comment,
            file: this.file!
        });
        
        this.dialogRef.Close();
    }
}