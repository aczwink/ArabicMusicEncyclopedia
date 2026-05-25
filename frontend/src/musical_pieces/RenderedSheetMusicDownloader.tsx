/**
 * ArabicMusicEncyclopedia
 * Copyright (C) 2026 Amir Czwink (amir130@hotmail.de)
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

import { Component, DialogRef, Injectable, JSX_CreateElement } from "@aczwink/acfrontend";
import { g_backendBaseUrl } from "../env";
import { PitchSelectionComponent } from "../shared/PitchSelectionComponent";
import { NaturalNote, Accidental, OctavePitch, OctavePitchToString } from "@aczwink/openarabicmusicdb-domain/dist/OctavePitch";

@Injectable
export class RenderedSheetMusicDownloader extends Component<{ pieceId: string; }>
{
    constructor(private dialogRef: DialogRef)
    {
        super();

        this.selectedPitch = {
            baseNote: NaturalNote.C,
            accidental: Accidental.Natural
        };
    }
    
    protected Render(): RenderValue
    {
        return <fragment>
            <div className="row">Target key: <PitchSelectionComponent selection={this.selectedPitch} onChanged={newValue => this.selectedPitch = newValue} /></div>
        </fragment>;
    }

    //Private variables
    private selectedPitch: OctavePitch;

    //Eventhandlers
    public OnInitiated()
    {
        this.dialogRef.onAccept.Subscribe(() => {
            const url = g_backendBaseUrl + "/musicalpieces/" + this.input.pieceId + "/rendered?basePitch=" + OctavePitchToString(this.selectedPitch);
            window.open(url, '_blank')?.focus();
            this.dialogRef.Close();
        });
    }
}