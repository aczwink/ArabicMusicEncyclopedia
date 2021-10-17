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

import { Anchor, Component, Injectable, JSX_CreateElement, MatIcon, ProgressSpinner, RouterState } from "acfrontend";
import { Musical, MusicalPieces, Persons } from "ame-api";
import { MaqamatService } from "../maqamat/MaqamatService";
import { PersonsService } from "../persons/PersonsService";
import { RhythmsService } from "../rhythms/RhythmsService";
import { WikiTextComponent } from "../shared/WikiTextComponent";
import { MusicalPiecesService } from "./MusicalPiecesService";
import { MusicalService } from "./MusicalService";

interface Association
{
    id: number;
    name: string;
    explanation: string;
}

@Injectable
export class ShowMusicalPieceComponent extends Component
{
    constructor(routerState: RouterState, private musicalPiecesService: MusicalPiecesService, private personsService: PersonsService,
        private musicalService: MusicalService, private maqamatService: MaqamatService, private rhythmsService: RhythmsService)
    {
        super();

        this.pieceId = parseInt(routerState.routeParams.pieceId!);
        this.piece = null;
        this.form = null;
        this.composer = null;
        this.language = null;
        this.singer = null;
        this.lyricist = null;
        this.maqamat = null;
        this.rhythms = null;
    }
    
    protected Render(): RenderValue
    {
        if( (this.piece === null) || (this.form === null) || (this.composer === null) || (this.maqamat === null) || (this.rhythms === null) )
            return <ProgressSpinner />;

        return <fragment>
            <h1>
                {this.piece.name}
                <Anchor route={"/musicalpieces/edit/" + this.pieceId}><MatIcon>edit</MatIcon></Anchor>
            </h1>
            <div>
                <div class="box" style="float: right; display: block">
                    <table class="keyValue">
                        <tr>
                            <th>Form</th>
                            <td>{this.form.name}</td>
                        </tr>
                        <tr>
                            <th>Composer</th>
                            <td><Anchor route={"/persons/" + this.piece.composerId}>{this.composer.name}</Anchor></td>
                        </tr>
                        <tr>
                            <th>Release date</th>
                            <td>{this.piece.releaseDate}</td>
                        </tr>
                        {this.RenderLyricalInfo()}
                    </table>

                    <h4>Maqamat</h4>
                    <table>
                        {this.maqamat.map(m => <tr>
                            <th>{m.name}</th>
                            <td>{m.explanation}</td>
                        </tr>)}
                    </table>

                    <h4>Rhythms</h4>
                    <table>
                        {this.rhythms.map(r => <tr>
                            <th>{r.name}</th>
                            <td>{r.explanation}</td>
                        </tr>)}
                    </table>
                </div>
                {this.RenderLyrics()}
                <WikiTextComponent text={this.piece.text} />
            </div>
        </fragment>;
    }

    //Private members
    private pieceId: number;
    private piece: MusicalPieces.Piece | null;
    private form: Musical.API.FormsAPI.List.Form | null;
    private composer: Persons.Person | null;
    private language: Musical.API.LanguagesAPI.List.Language | null;
    private singer: Persons.Person | null;
    private lyricist: Persons.Person | null;
    private maqamat: Association[] | null;
    private rhythms: Association[] | null;

    //Private methods
    private RenderLyricalInfo()
    {
        const lyrics = this.piece?.lyrics;
        if(lyrics === undefined)
            return null;

        if((this.language === null) || (this.singer === null) || (this.lyricist === null))
            return <ProgressSpinner />;

        return <fragment>
            <tr>
                <th>Singer</th>
                <td><Anchor route={"/persons/" + this.piece?.lyrics?.singerId}>{this.singer.name}</Anchor></td>
            </tr>
            <tr>
                <th>Songwriter</th>
                <td><Anchor route={"/persons/" + this.piece?.lyrics?.lyricistId}>{this.lyricist.name}</Anchor></td>
            </tr>
            <tr>
                <th>Language</th>
                <td>{this.language!.name}</td>
            </tr>
        </fragment>;
    }

    private RenderLyrics()
    {
        if(this.piece?.lyrics === undefined)
            return null;
        return <fragment>
            <h2>Lyrics</h2>
            <p style="white-space: break-spaces;">{this.piece.lyrics.lyricsText}</p>
        </fragment>;
    }

    //Event handlers
    public async OnInitiated()
    {
        const result = await this.musicalPiecesService.QueryPiece({ pieceId: this.pieceId }, {});
        this.piece = result.piece;

        const forms = await this.musicalService.ListForms({}, {});
        this.form = forms.forms.Values().Filter(x => x.id === result.piece.formId).First();

        const composer = await this.personsService.QueryPerson({ personId: result.piece.composerId}, {});
        this.composer = composer.person;

        if(result.piece.lyrics)
        {
            const languages = await this.musicalService.ListLanguages({}, {});
            this.language = languages.languages.Values().Filter(x => x.id === result.piece.lyrics!.languageId).First();

            const singer = await this.personsService.QueryPerson({ personId: result.piece.lyrics.singerId}, {});
            this.singer = singer.person;

            const lyricist = await this.personsService.QueryPerson({ personId: result.piece.lyrics.lyricistId}, {});
            this.lyricist = lyricist.person;
        }

        this.maqamat = await result.piece.maqamat.Values().Map(async m => ({
            id: m.maqamId,
            name: (await this.maqamatService.QueryMaqam({ maqamId: m.maqamId }, {})).name,
            explanation: m.explanation
        })).PromiseAll();

        this.rhythms = await result.piece.rhythms.Values().Map(async r => ({
            id: r.rhythmId,
            name: (await this.rhythmsService.QueryRhythm({ rhythmId: r.rhythmId }, {})).rhythm.name,
            explanation: r.explanation
        })).PromiseAll();
    }
}