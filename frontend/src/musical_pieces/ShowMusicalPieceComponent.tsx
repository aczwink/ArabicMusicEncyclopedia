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

import { Anchor, BootstrapIcon, Component, Injectable, JSX_CreateElement, PopupManager, ProgressSpinner, RouterState, TitleService } from "acfrontend";
import { OpenArabicMusicDBDialect, OpenArabicMusicDBForm, OpenArabicMusicDBPerson, PieceDetailsData } from "../../dist/api";
import { g_backendBaseUrl } from "../env";
import { MaqamatService } from "../maqamat/MaqamatService";
import { PersonReferenceComponent } from "../persons/PersonReferenceComponent";
import { PersonsService } from "../persons/PersonsService";
import { RhythmsService } from "../rhythms/RhythmsService";
import { WikiTextComponent } from "../shared/WikiTextComponent";
import { MusicalPiecesService } from "./MusicalPiecesService";
import { MusicalService } from "./MusicalService";
import { RenderedAttachmentDownloader } from "./RenderedAttachmentDownloader";

interface Association
{
    id: string;
    name: string;
    explanation: string;
}

@Injectable
export class ShowMusicalPieceComponent extends Component
{
    constructor(routerState: RouterState, private musicalPiecesService: MusicalPiecesService, private personsService: PersonsService,
        private musicalService: MusicalService, private maqamatService: MaqamatService, private rhythmsService: RhythmsService,
        private titleService: TitleService, private popupManager: PopupManager)
    {
        super();

        this.pieceId = routerState.routeParams.pieceId!;
        this.piece = null;
        this.form = null;
        this.composer = null;
        this.language = null;
        this.singers = null;
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
            </h1>
            <div>
                <div className="row">
                    <div className="col">
                        {this.RenderLyrics()}
                    </div>

                    <div className="col-auto border">
                        <table className="keyValue">
                            <tr>
                                <th>Form</th>
                                <td>{this.form.name}</td>
                            </tr>
                            <tr>
                                <th>Composer</th>
                                <td><PersonReferenceComponent id={this.piece.composerId} name={this.composer.name} /></td>
                            </tr>
                            <tr>
                                <th>Release date</th>
                                <td>{this.piece.releaseDate}</td>
                            </tr>
                            {this.RenderLyricalInfo()}
                        </table>

                        <hr />
                        <h4>Maqamat</h4>
                        <table>
                            {this.maqamat.map(m => <tr>
                                <th><Anchor route={"/maqamat/" + m.id}>{m.name}</Anchor></th>
                                <td>{m.explanation}</td>
                            </tr>)}
                        </table>

                        <hr />
                        <h4>Rhythms</h4>
                        <table>
                            {this.rhythms.map(r => <tr>
                                <th><Anchor route={"/rhythms/" + r.id}>{r.name}</Anchor></th>
                                <td>{r.explanation}</td>
                            </tr>)}
                        </table>

                        <hr />
                        <h4>Attachments</h4>
                        <table>
                            <tr>
                                <th>Name</th>
                                <th>Actions</th>
                            </tr>
                            {this.piece.attachments.map( (attachment, idx) => <tr>
                                <td>{attachment.comment}</td>
                                <td>
                                    <a href={g_backendBaseUrl + "/musicalpieces/" + this.pieceId + "/attachment/" + idx} target="_blank"><BootstrapIcon>download</BootstrapIcon></a>
                                    {attachment.isRenderable ?
                                        <a onclick={this.OnDownloadRenderedAttachment.bind(this, idx)}><BootstrapIcon>file-pdf</BootstrapIcon></a>
                                    : null}
                                </td>
                            </tr>)}
                        </table>
                    </div>
                </div>
                <hr />
                <WikiTextComponent text={this.piece.text} />
            </div>
        </fragment>;
    }

    //Private members
    private pieceId: string;
    private piece: PieceDetailsData | null;
    private form: OpenArabicMusicDBForm | null;
    private composer: OpenArabicMusicDBPerson | null;
    private language: OpenArabicMusicDBDialect | null;
    private singers: OpenArabicMusicDBPerson[] | null;
    private lyricist: OpenArabicMusicDBPerson | null;
    private maqamat: Association[] | null;
    private rhythms: Association[] | null;

    //Private methods
    private RenderLyricalInfo()
    {
        const lyrics = this.piece?.lyrics;
        if(lyrics === undefined)
            return null;

        if((this.language === null) || (this.singers === null) || (this.lyricist === null))
            return <ProgressSpinner />;

        return <fragment>
            <tr>
                <th>Singers</th>
                <td>
                    <div className="col">
                    {this.piece!.lyrics!.singerIds.map( (singerId, idx) => <div className="row">
                        <PersonReferenceComponent id={singerId} name={this.singers![idx].name} />
                    </div>)}
                    </div>
                </td>
            </tr>
            <tr>
                <th>Songwriter</th>
                <td><PersonReferenceComponent id={this.piece!.lyrics!.lyricistId} name={this.lyricist.name} /></td>
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
            <h2>Lyrics <a href={g_backendBaseUrl + "/musicalpieces/" + this.pieceId + "/renderedtext"} target="_blank"><BootstrapIcon>filetype-pdf</BootstrapIcon></a></h2>
            <p style="white-space: break-spaces; direction: rtl; margin-left: 1rem">{this.piece.lyrics.lyricsText}</p>
        </fragment>;
    }

    //Event handlers
    private OnDownloadRenderedAttachment(attachmentIndex: number)
    {
        this.popupManager.OpenDialog(<RenderedAttachmentDownloader attachmentIndex={attachmentIndex} pieceId={this.pieceId} />, { title: "Download as PDF" });
    }

    public async OnInitiated()
    {
        const result = await this.musicalPiecesService.QueryPiece(this.pieceId);
        this.piece = result;

        this.titleService.title = this.piece.name;

        const forms = await this.musicalService.ListForms();
        this.form = forms.Values().Filter(x => x.id === result.formId).First();

        const composer = await this.personsService.QueryPerson(result.composerId);
        this.composer = composer;

        if(result.lyrics)
        {
            const languages = await this.musicalService.ListLanguages();
            this.language = languages.Values().Filter(x => x.id === result.lyrics!.languageId).First();

            this.singers = await Promise.all(result.lyrics.singerIds.map(singerId => this.personsService.QueryPerson(singerId)));

            const lyricist = await this.personsService.QueryPerson(result.lyrics.lyricistId);
            this.lyricist = lyricist;
        }

        this.maqamat = await result.maqamat.Values().Map(async m => ({
            id: m.maqamId,
            name: (await this.maqamatService.QueryMaqam(m.maqamId)).name,
            explanation: m.explanation
        })).PromiseAll();

        this.rhythms = await result.rhythms.Values().Map(async r => ({
            id: r.rhythmId,
            name: (await this.rhythmsService.QueryRhythm(r.rhythmId)).name,
            explanation: r.explanation
        })).PromiseAll();
    }
}