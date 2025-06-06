/**
 * ArabicMusicEncyclopedia
 * Copyright (C) 2022-2025 Amir Czwink (amir130@hotmail.de)
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

import { Component, DialogRef, FormField, Injectable, JSX_CreateElement, Switch } from "acfrontend";
import { g_backendBaseUrl } from "../env";
import { PitchSelectionComponent } from "../shared/PitchSelectionComponent";
import { NaturalNote, Accidental, OctavePitch, OctavePitchToString } from "openarabicmusicdb-domain/dist/OctavePitch";

@Injectable
export class RenderedAttachmentDownloader extends Component<{ attachmentIndex: number; pieceId: string; }>
{
    constructor(private dialogRef: DialogRef)
    {
        super();

        this.transpose = false;
        this.selectedPitch = {
            baseNote: NaturalNote.C,
            accidental: Accidental.Natural
        };
    }
    
    protected Render(): RenderValue
    {
        return <fragment>
            <FormField title="Transpose">
                <Switch checked={this.transpose} onChanged={newValue => this.transpose = newValue} />
            </FormField>
            {this.transpose ? <div className="row">Target key: <PitchSelectionComponent selection={this.selectedPitch} onChanged={newValue => this.selectedPitch = newValue} /></div> : null}
        </fragment>;
    }

    //Private variables
    private transpose: boolean;
    private selectedPitch: OctavePitch;

    //Eventhandlers
    public OnInitiated()
    {
        this.dialogRef.onAccept.Subscribe(() => {
            const baseUrl = g_backendBaseUrl + "/musicalpieces/" + this.input.pieceId + "/attachment/" + this.input.attachmentIndex + "/rendered";
            const url = baseUrl + (this.transpose ? "?basePitch=" + OctavePitchToString(this.selectedPitch) : "");
            window.open(url, '_blank')?.focus();
            this.dialogRef.Close();
        });
    }
}