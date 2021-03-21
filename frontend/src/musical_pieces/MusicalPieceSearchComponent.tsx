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

import { Component, Injectable, JSX_CreateElement, PaginationComponent, ProgressSpinner } from "acfrontend";
import { MusicalPieces } from "ame-api";
import { MusicalPiecesListComponent } from "./MusicalPiecesListComponent";
import { MusicalPiecesService } from "./MusicalPiecesService";

@Injectable
export class MusicalPieceSearchComponent extends Component
{
    constructor(private musicalPiecesService: MusicalPiecesService)
    {
        super();

        this.loading = false;
        this.offset = 0;
        this.size = 25;
        this.pieces = [];
        this.totalCount = 0;
    }

    protected Render(): RenderValue
    {
        return <fragment>
            <div class="box">
                <form onsubmit={this.OnSubmit.bind(this)}>
                    <button type="submit">Search</button>
                </form>
            </div>
            {this.RenderResultList()}
        </fragment>;
    }

    //Private members
    private loading: boolean;
    private offset: number;
    private size: number;
    private pieces: MusicalPieces.API.List.Piece[];
    private totalCount: number;

    //Private methods
    private async ExecuteSearch()
    {
        this.loading = true;
        const result = await this.musicalPiecesService.ListPieces({ offset: this.offset, limit: this.size });
        this.pieces = result.pieces;
        this.totalCount = result.totalCount;
        this.loading = false;
    }

    private RenderResultList()
    {
        if(this.loading)
            return <ProgressSpinner />;
        if(this.pieces.length === 0)
            return null;
        return <fragment>
            <MusicalPiecesListComponent pieces={this.pieces} />
            <PaginationComponent count={this.totalCount} offset={this.offset} size={this.size} onOffsetChanged={this.OnOffsetChanged.bind(this)} onSizeChanged={this.OnSizeChanged.bind(this)} />
        </fragment>;
    }

    //Event handlers
    public OnInitiated()
    {
        this.ExecuteSearch();
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