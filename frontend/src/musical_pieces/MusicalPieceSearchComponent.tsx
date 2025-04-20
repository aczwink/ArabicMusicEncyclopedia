/**
 * ArabicMusicEncyclopedia
 * Copyright (C) 2021-2025 Amir Czwink (amir130@hotmail.de)
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

import { BootstrapIcon, Component, FormField, Injectable, JSX_CreateElement, LineEdit, PaginationComponent, ProgressSpinner, RouterButton, Select } from "acfrontend";
import { OpenArabicMusicDBForm, PieceOverviewData } from "../../dist/api";
import { OptionalSinglePersonSelectionComponent } from "../persons/OptionalSinglePersonSelectionComponent";
import { MaqamSelectionComponent } from "../shared/MaqamSelectionComponent";
import { FullRhythmSelectionComponent } from "../shared/RhythmSelectionComponent";
import { MusicalPiecesListComponent } from "./MusicalPiecesListComponent";
import { MusicalPiecesService } from "./MusicalPiecesService";
import { MusicalService } from "./MusicalService";

@Injectable
export class MusicalPieceSearchComponent extends Component
{
    constructor(private musicalPiecesService: MusicalPiecesService, private musicalService: MusicalService)
    {
        super();

        this.loading = false;
        this.offset = 0;
        this.size = 25;

        this.formId = null;
        this.titleFilter = "";
        this.composerId = null;
        this.lyricistId = null;
        this.singerId = null;
        this.maqamId = null;
        this.rhythmId = null;

        this.forms = null;
        this.pieces = [];
        this.totalCount = 0;
    }

    protected Render(): RenderValue
    {
        if( this.forms === null )
            return <ProgressSpinner />;

        return <fragment>
            <div className="box">
                <form onsubmit={this.OnSubmit.bind(this)}>
                    <div className="row">
                        <div className="col">
                            <FormField title="Form">
                                <Select onChanged={newValue => this.formId = newValue[0]}>
                                    {this.forms.map(form => <option value={form.id.toString()} selected={this.formId === form.id}>{form.name}</option>)}
                                </Select>
                            </FormField>
                        </div>
                        <div className="col">
                            <FormField title="Title">
                                <LineEdit value={this.titleFilter} onChanged={newValue => this.titleFilter = newValue} />
                            </FormField>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <FormField title="Composer">
                                <OptionalSinglePersonSelectionComponent onSelectionChanged={newValue => this.composerId = newValue} />
                            </FormField>
                        </div>
                        <div className="col">
                            <FormField title="Lyricist">
                                <OptionalSinglePersonSelectionComponent onSelectionChanged={newValue => this.lyricistId = newValue} />
                            </FormField>
                        </div>
                        <div className="col">
                            <FormField title="Singer">
                                <OptionalSinglePersonSelectionComponent onSelectionChanged={newValue => this.singerId = newValue} />
                            </FormField>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <FormField title="Maqam">
                                <MaqamSelectionComponent maqamId={this.maqamId} onSelectionChanged={newValue => this.maqamId = newValue} />
                            </FormField>
                        </div>
                        <div className="col">
                            <FormField title="Rhythm">
                                <FullRhythmSelectionComponent rhythmId={this.rhythmId} onSelectionChanged={newValue => this.rhythmId = newValue} />
                            </FormField>
                        </div>
                    </div>
                    <button className="btn btn-primary" type="submit">Search</button>
                </form>
            </div>
            {this.RenderResultList()}
        </fragment>;
    }

    //Private members
    private loading: boolean;
    private offset: number;
    private size: number;

    private formId: string | null;
    private titleFilter: string;
    private composerId: string | null;
    private lyricistId: string | null;
    private singerId: string | null;
    private maqamId: string | null;
    private rhythmId: string | null;

    private forms: OpenArabicMusicDBForm[] | null;
    private pieces: PieceOverviewData[];
    private totalCount: number;

    //Private methods
    private async ExecuteSearch()
    {
        this.loading = true;
        const result = await this.musicalPiecesService.ListPieces({
            formId: this.formId,
            titleFilter: this.titleFilter,
            composerId: this.composerId,
            lyricistId: this.lyricistId,
            singerId: this.singerId,
            maqamId: this.maqamId,
            rhythmId: this.rhythmId,
        }, this.offset, this.size);
        this.pieces = result.pieces;
        this.totalCount = result.totalCount;
        this.loading = false;
    }

    private RenderResultList()
    {
        if(this.loading)
            return <ProgressSpinner />;
        if(this.pieces.length === 0)
            return <RouterButton color="primary" className="btn" route={"/musicalpieces/add"}><BootstrapIcon>plus</BootstrapIcon></RouterButton>;
        return <fragment>
            <MusicalPiecesListComponent pieces={this.pieces} />
            <PaginationComponent count={this.totalCount} offset={this.offset} size={this.size} onOffsetChanged={this.OnOffsetChanged.bind(this)} onSizeChanged={this.OnSizeChanged.bind(this)} />
            <RouterButton color="primary" className="btn" route={"/musicalpieces/add"}><BootstrapIcon>plus</BootstrapIcon></RouterButton>
        </fragment>;
    }

    //Event handlers
    public async OnInitiated()
    {
        const forms = await this.musicalService.ListForms();
        this.forms = forms;
    }

    private OnOffsetChanged(newValue: number)
    {
        this.offset = newValue;
        this.ExecuteSearch();
    }

    private OnSizeChanged(newValue: number)
    {
        this.size = newValue;
        this.ExecuteSearch();
    }

    private OnSubmit(event: Event)
    {
        event.preventDefault();
        this.ExecuteSearch();
    }
}