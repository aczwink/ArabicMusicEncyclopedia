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

import { Component, FormField, Injectable, JSX_CreateElement, LineEdit, MatIcon, ProgressSpinner, Select, Textarea } from "acfrontend";
import { Maqamat, Musical, MusicalPieces, Rhythms } from "ame-api";
import { PieceMaqamAssociation, PieceRhythmAssociation } from "ame-api/dist/MusicalPieces";
import { PersonType } from "ame-api/dist/Persons";
import { MaqamatService } from "../maqamat/MaqamatService";
import { RhythmsService } from "../rhythms/RhythmsService";
import { WikiTextEditComponent } from "../shared/WikiTextEditComponent";
import { MusicalService } from "./MusicalService";
import { SinglePersonSelectionComponent } from "../persons/SinglePersonSelectionComponent";

@Injectable
export class MusicalPieceEditorComponent extends Component<{ piece: MusicalPieces.Piece; onValidationUpdated: (newValue: boolean) => void }>
{
    constructor(private musicalService: MusicalService, private maqamatService: MaqamatService, private rhythmsService: RhythmsService)
    {
        super();

        this.forms = null;
        this.languages = null;
        this.maqamat = null;
        this.rhythms = null;
    }
    
    protected Render(): RenderValue
    {
        if(
            (this.forms === null) || (this.languages === null) || (this.maqamat === null) || (this.rhythms === null)
        )
            return <ProgressSpinner />;

        const form = this.forms!.Values().Filter(x => x.id === this.input.piece.formId).First();
        if(form.hasLyrics)
        {
            if(this.input.piece.lyrics === undefined)
                this.input.piece.lyrics = {
                    languageId: 1,
                    lyricistId: 0,
                    lyricsText: "",
                    singerId: 0,
                };
        }
        else
            this.input.piece.lyrics = undefined;

        const piece = this.CreateDataBindingProxy(this.input.piece);
        return <fragment>
            <FormField hint="Name">
                <LineEdit value={piece.name} onChanged={newValue => piece.name = newValue} />
            </FormField>
            <FormField hint="Form">
                <Select onChanged={newValue => piece.formId = parseInt(newValue[0])}>
                    {this.forms.map(form => <option value={form.id.toString()} selected={piece.formId === form.id}>{form.name}</option>)}
                </Select>
            </FormField>
            <FormField hint="Composer">
                <SinglePersonSelectionComponent type={PersonType.Composer} selected={piece.composerId === 0 ? undefined : piece.composerId} onSelectionChanged={this.OnComposerChanged.bind(this)} />
            </FormField>
            <FormField hint="Release date">
                <LineEdit value={piece.releaseDate} onChanged={newValue => piece.releaseDate = newValue} />
            </FormField>
            {this.RenderLyricsPart(piece)}
            <h2>Text</h2>
            <WikiTextEditComponent text={piece.text} onChanged={newValue => piece.text = newValue} />

            <h2>Maqamat</h2>
            <div class="row">
                <table>
                    <tr>
                        <th>Maqam</th>
                        <th>Explanation</th>
                        <th>Actions</th>
                    </tr>
                    {piece.maqamat.map(this.RenderMaqamEntry.bind(this, piece))}
                </table>
                <button type="button" onclick={this.AddEntry.bind(this, piece.maqamat, { maqamId: 1, explanation: "" })}><MatIcon>add</MatIcon></button>
            </div>

            <h2>Rhythms</h2>
            <div class="row">
                <table>
                    <tr>
                        <th>Rhythm</th>
                        <th>Explanation</th>
                        <th>Actions</th>
                    </tr>
                    {piece.rhythms.map(this.RenderRhythmEntry.bind(this, piece))}
                </table>
                <button type="button" onclick={this.AddEntry.bind(this, piece.rhythms, { rhythmId: 1, explanation: "" })}><MatIcon>add</MatIcon></button>
            </div>
        </fragment>;
    }

    //Private members
    private forms: Musical.API.FormsAPI.List.Form[] | null;
    private languages: Musical.API.LanguagesAPI.List.Language[] | null;
    private maqamat: Maqamat.API.List.MaqamOverviewData[] | null;
    private rhythms: Rhythms.RhythmOverviewData[] | null;

    //Private methods
    private AddEntry<T>(arr: T[], itemToAdd: T)
    {
        arr.push(itemToAdd);
        this.Update();
    }

    private RemoveEntry<T>(arr: T[], itemToRemove: T)
    {
        const index = arr.indexOf(itemToRemove);
        arr.Remove(index);
        this.Update();
    }

    private RenderLyricsPart(piece: MusicalPieces.Piece)
    {
        if(piece.lyrics !== undefined)
        {
            const lyrics = piece.lyrics;

            return <fragment>
                <FormField hint="Language">
                    <Select onChanged={newValue => lyrics.languageId = parseInt(newValue[0])}>
                        {this.languages!.map(language => <option value={language.id} selected={language.id === lyrics.languageId}>{language.name}</option>)}
                    </Select>
                </FormField>
                <FormField hint="Singer">
                    <SinglePersonSelectionComponent type={PersonType.Singer} selected={lyrics.singerId === 0 ? undefined : lyrics.singerId} onSelectionChanged={this.OnSingerChanged.bind(this)} />
                </FormField>
                <FormField hint="Songwriter">
                    <SinglePersonSelectionComponent type={PersonType.Lyricist} selected={lyrics.lyricistId === 0 ? undefined : lyrics.lyricistId} onSelectionChanged={this.OnSongWriterChanged.bind(this)} />
                </FormField>
                <FormField hint="Lyrics">
                    <Textarea value={lyrics.lyricsText} onChanged={newValue => lyrics.lyricsText = newValue} />
                </FormField>
            </fragment>;
        }

        return null;
    }

    private RenderMaqamEntry(piece: MusicalPieces.Piece, maqamAssoc: PieceMaqamAssociation)
    {
        const maqam = this.maqamat?.Values().Filter(m => m.id === maqamAssoc.maqamId).First();

        return <tr>
            <td>
                <Select onChanged={newValue => maqamAssoc.maqamId = parseInt(newValue[0])}>
                    {this.maqamat?.map(m => <option value={m.id} selected={m.id === maqamAssoc.maqamId}>{m.name}</option>)}
                </Select>
            </td>
            <td><LineEdit value={maqamAssoc.explanation} onChanged={newValue => maqamAssoc.explanation = newValue} /></td>
            <td><a onclick={this.RemoveEntry.bind(this, piece.maqamat, maqamAssoc)}><MatIcon>delete</MatIcon></a></td>
        </tr>;
    }

    private RenderRhythmEntry(piece: MusicalPieces.Piece, rhythmAssoc: PieceRhythmAssociation)
    {
        return <tr>
            <td>
                <Select onChanged={newValue => rhythmAssoc.rhythmId = parseInt(newValue[0])}>
                    {this.rhythms?.map(r => <option value={r.id} selected={r.id === rhythmAssoc.rhythmId}>{r.name}</option>)}
                </Select>
            </td>
            <td><LineEdit value={rhythmAssoc.explanation} onChanged={newValue => rhythmAssoc.explanation = newValue} /></td>
            <td><a onclick={this.RemoveEntry.bind(this, piece.rhythms, rhythmAssoc)}><MatIcon>delete</MatIcon></a></td>
        </tr>;
    }

    private UpdateValidation()
    {
        const piece = this.input.piece;
        const areLyricsValid = (piece.lyrics !== undefined) ? ((piece.lyrics.lyricistId !== 0) && (piece.lyrics.singerId !== 0)) : true;
        const canSave = (piece.composerId !== 0) && areLyricsValid;

        this.input.onValidationUpdated(canSave);
    }

    //Event handlers
    public async OnInitiated()
    {
        const forms = await this.musicalService.ListForms({}, {});
        this.forms = forms.forms;

        const languages = await this.musicalService.ListLanguages({}, {});
        this.languages = languages.languages;

        const maqamat = await this.maqamatService.QueryMaqamat({});
        this.maqamat = maqamat;

        const rhythms = await this.rhythmsService.QueryRhythms({});
        this.rhythms = rhythms.rhythms;
    }

    private OnComposerChanged(newValue: number)
    {
        this.input.piece.composerId = newValue;
        this.UpdateValidation();
    }

    private OnSingerChanged(newValue: number)
    {
        this.input.piece.lyrics!.singerId = newValue;
        this.UpdateValidation();
    }

    private OnSongWriterChanged(newValue: number)
    {
        this.input.piece.lyrics!.lyricistId = newValue;
        this.UpdateValidation();
    }
}