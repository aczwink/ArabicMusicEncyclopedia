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

import { OctavePitch } from "@aczwink/openarabicmusicdb-domain/dist/OctavePitch";
import { NoteOrRest } from "./Note";
import { TimedChord } from "./Chord";
import { OAMDB_SheetMusic_LayoutInfo } from "@aczwink/openarabicmusicdb-domain";
import { Fraction } from "./Fraction";

export enum MelodyEventType
{
    NotesOrRests,
    Repeat,
    SegnoRepeat,
    UpdateMaqam,
    UpdateTempo,
    UpdateTimeSignature,
}

export interface NotesOrRestsEvent
{
    type: MelodyEventType.NotesOrRests;
    notesOrRests: NoteOrRest[];
}

export interface RepeatEvent
{
    type: MelodyEventType.Repeat;
    nestedEvents: MelodyEvent[];
}

export interface SegnoRepeatEvent
{
    type: MelodyEventType.SegnoRepeat;
    fineAfterRepeat: boolean;
    followingEvents: MelodyEvent[];
    repeatedEvents: MelodyEvent[];
}

export interface UpdateMaqamEvent
{
    type: MelodyEventType.UpdateMaqam;
    pitch: OctavePitch;
    maqamId: string;
}

export interface UpdateTempoEvent
{
    type: MelodyEventType.UpdateTempo;
    tempo: number;
    duration: Fraction;
}

export interface UpdateTimeSignatureEvent
{
    type: MelodyEventType.UpdateTimeSignature;
    num: number;
    den: number;
}

export type MelodyEvent = NotesOrRestsEvent | RepeatEvent | SegnoRepeatEvent | UpdateMaqamEvent | UpdateTempoEvent | UpdateTimeSignatureEvent;

export interface Section
{
    chords: TimedChord[];
    melody: MelodyEvent[];
}

interface PieceInfo
{
    title: string;
    composerName: string;
    lyrics: string;
}

export interface SheetMusic
{
    layout: OAMDB_SheetMusic_LayoutInfo;
    pieceInfo: PieceInfo;
    sections: Section[];
    sectionSequence: number[];
}

export interface SingleSectionSheetMusic
{
    layout: OAMDB_SheetMusic_LayoutInfo;
    pieceInfo: PieceInfo;
    chords: TimedChord[];
    melody: MelodyEvent[];
}