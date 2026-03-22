/**
 * ArabicMusicEncyclopedia
 * Copyright (C) 2023-2026 Amir Czwink (amir130@hotmail.de)
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

import { Component, JSX_CreateElement } from "@aczwink/acfrontend";

type Pitch = "A" | "Bb" | "B" | "C" | "Db" | "D" | "Eb" | "E" | "F" | "F#" | "G" | "Ab";
const stepsCount = 13;

interface ChordStringFingering
{
    stringNumber: number;
    fretNumber: number;
}

interface ChordFingering
{
    title: string;
    fingering: ChordStringFingering[];
}

interface ChordFingeringCategory
{
    title: string;
    description: string;
    chordFingers: ChordFingering[];
}

const knownChordFingerings: ChordFingeringCategory[] = [
    {
        chordFingers: [
            {
                title: "C major",
                fingering: [
                    { stringNumber: 5, fretNumber: 3 },
                    { stringNumber: 4, fretNumber: 2 },
                    { stringNumber: 3, fretNumber: 0 },
                    { stringNumber: 2, fretNumber: 0 },
                ]
            },
            {
                title: "C minor",
                fingering: [
                    { stringNumber: 5, fretNumber: 3 },
                    { stringNumber: 4, fretNumber: 1 },
                    { stringNumber: 3, fretNumber: 0 },
                    { stringNumber: 2, fretNumber: 0 },
                ]
            },
            {
                title: "D major",
                fingering: [
                    { stringNumber: 7, fretNumber: 2 },
                    { stringNumber: 6, fretNumber: 1 },
                    { stringNumber: 5, fretNumber: 0 },
                    { stringNumber: 4, fretNumber: 0 },
                ]
            },
            {
                title: "D minor",
                fingering: [
                    { stringNumber: 7, fretNumber: 2 },
                    { stringNumber: 6, fretNumber: 0 },
                    { stringNumber: 5, fretNumber: 0 },
                    { stringNumber: 4, fretNumber: 0 },
                ]
            },
            {
                title: "F major",
                fingering: [
                    { stringNumber: 4, fretNumber: 3 },
                    { stringNumber: 3, fretNumber: 2 },
                    { stringNumber: 2, fretNumber: 0 },
                    { stringNumber: 1, fretNumber: 0 },
                ]
            },
            {
                title: "F minor",
                fingering: [
                    { stringNumber: 4, fretNumber: 3 },
                    { stringNumber: 3, fretNumber: 1 },
                    { stringNumber: 2, fretNumber: 0 },
                    { stringNumber: 1, fretNumber: 0 },
                ]
            },
            {
                title: "G major",
                fingering: [
                    { stringNumber: 6, fretNumber: 2 },
                    { stringNumber: 5, fretNumber: 2 },
                    { stringNumber: 4, fretNumber: 0 },
                    { stringNumber: 3, fretNumber: 0 },
                ]
            },
            {
                title: "G minor",
                fingering: [
                    { stringNumber: 6, fretNumber: 2 },
                    { stringNumber: 5, fretNumber: 1 },
                    { stringNumber: 4, fretNumber: 0 },
                    { stringNumber: 3, fretNumber: 0 },
                ]
            },
            {
                title: "Bb major",
                fingering: [
                    { stringNumber: 3, fretNumber: 3 },
                    { stringNumber: 2, fretNumber: 2 },
                    { stringNumber: 1, fretNumber: 0 },
                ]
            },
            {
                title: "Bb minor",
                fingering: [
                    { stringNumber: 3, fretNumber: 3 },
                    { stringNumber: 2, fretNumber: 1 },
                    { stringNumber: 1, fretNumber: 0 },
                ]
            },
        ],
        description: "",
        title: "Standard pattern with 2 open strings"
    },
    {
        chordFingers: [
            {
                title: "D minor",
                fingering: [
                    { stringNumber: 4, fretNumber: 0 },
                    { stringNumber: 3, fretNumber: 2 },
                    { stringNumber: 2, fretNumber: 2 },
                    { stringNumber: 1, fretNumber: 0 },
                ]
            },
            {
                title: "G5",
                fingering: [
                    { stringNumber: 3, fretNumber: 0 },
                    { stringNumber: 2, fretNumber: 2 },
                    { stringNumber: 1, fretNumber: 2 },
                ]
            },
            {
                title: "A minor",
                fingering: [
                    { stringNumber: 5, fretNumber: 0 },
                    { stringNumber: 4, fretNumber: 2 },
                    { stringNumber: 3, fretNumber: 2 },
                    { stringNumber: 2, fretNumber: 0 },
                ]
            },
        ],
        description: "",
        title: "One finger on two notes directly on next string"
    },
    {
        chordFingers: [
            {
                title: "C minor",
                fingering: [
                    { stringNumber: 6, fretNumber: 7 },
                    { stringNumber: 5, fretNumber: 6 },
                    { stringNumber: 4, fretNumber: 5 },
                ]
            },
            {
                title: "Ab minor",
                fingering: [
                    { stringNumber: 6, fretNumber: 3 },
                    { stringNumber: 5, fretNumber: 2 },
                    { stringNumber: 4, fretNumber: 1 },
                ]
            },
            {
                title: "A minor",
                fingering: [
                    { stringNumber: 6, fretNumber: 4 },
                    { stringNumber: 5, fretNumber: 3 },
                    { stringNumber: 4, fretNumber: 2 },
                ]
            },
            {
                title: "Bb minor",
                fingering: [
                    { stringNumber: 6, fretNumber: 5 },
                    { stringNumber: 5, fretNumber: 4 },
                    { stringNumber: 4, fretNumber: 3 },
                ]
            },
            {
                title: "B minor",
                fingering: [
                    { stringNumber: 6, fretNumber: 6 },
                    { stringNumber: 5, fretNumber: 5 },
                    { stringNumber: 4, fretNumber: 4 },
                ]
            },
        ],
        description: "Can also add 1st finger on G-string for octave",
        title: "Minor on 6th string",
    },
    {
        chordFingers: [
            {
                title: "Em (no 5)",
                fingering: [
                    { stringNumber: 4, fretNumber: 2 },
                    { stringNumber: 3, fretNumber: 0 },
                    { stringNumber: 2, fretNumber: 4 },
                ]
            },
        ],
        description: "",
        title: "Minor omit fifth"
    },
    {
        chordFingers: [
            {
                title: "C major",
                fingering: [
                    { stringNumber: 3, fretNumber: 5 },
                    { stringNumber: 2, fretNumber: 4 },
                    { stringNumber: 1, fretNumber: 2 },
                ]
            },
            {
                title: "C minor",
                fingering: [
                    { stringNumber: 3, fretNumber: 5 },
                    { stringNumber: 2, fretNumber: 3 },
                    { stringNumber: 1, fretNumber: 2 },
                ]
            },
            {
                title: "Db minor",
                fingering: [
                    { stringNumber: 5, fretNumber: 4 },
                    { stringNumber: 4, fretNumber: 2 },
                    { stringNumber: 3, fretNumber: 1 },
                ]
            },
            {
                title: "D minor",
                fingering: [
                    { stringNumber: 5, fretNumber: 5 },
                    { stringNumber: 4, fretNumber: 3 },
                    { stringNumber: 3, fretNumber: 2 },
                ]
            },
            {
                title: "Eb minor",
                fingering: [
                    { stringNumber: 5, fretNumber: 6 },
                    { stringNumber: 4, fretNumber: 4 },
                    { stringNumber: 3, fretNumber: 3 },
                ]
            },
            {
                title: "E minor",
                fingering: [
                    { stringNumber: 5, fretNumber: 7 },
                    { stringNumber: 4, fretNumber: 5 },
                    { stringNumber: 3, fretNumber: 4 },
                ]
            },
            {
                title: "F# minor",
                fingering: [
                    { stringNumber: 4, fretNumber: 4 },
                    { stringNumber: 3, fretNumber: 2 },
                    { stringNumber: 2, fretNumber: 1 },
                ]
            },
            {
                title: "G minor",
                fingering: [
                    { stringNumber: 4, fretNumber: 5 },
                    { stringNumber: 3, fretNumber: 3 },
                    { stringNumber: 2, fretNumber: 2 },
                ]
            },
            {
                title: "Ab minor",
                fingering: [
                    { stringNumber: 4, fretNumber: 6 },
                    { stringNumber: 3, fretNumber: 4 },
                    { stringNumber: 2, fretNumber: 3 },
                ]
            },
            {
                title: "A minor",
                fingering: [
                    { stringNumber: 4, fretNumber: 7 },
                    { stringNumber: 3, fretNumber: 5 },
                    { stringNumber: 2, fretNumber: 4 },
                ]
            },
        ],
        description: "Can also add 1st finger on G-string for octave",
        title: "Standard pattern"
    },
    {
        chordFingers: [
            {
                title: "Bb major",
                fingering: [
                    { stringNumber: 5, fretNumber: 1 },
                    { stringNumber: 4, fretNumber: 3 },
                    { stringNumber: 3, fretNumber: 3 },
                    { stringNumber: 2, fretNumber: 2 },
                ]
            },
            {
                title: "Ab minor",
                fingering: [
                    { stringNumber: 6, fretNumber: 3 },
                    { stringNumber: 5, fretNumber: 6 },
                    { stringNumber: 4, fretNumber: 6 },
                    { stringNumber: 3, fretNumber: 4 },
                ]
            }
        ],
        description: "",
        title: "Complex"
    },
];


export class OudFingerBoardComponent extends Component
{
    constructor()
    {
        super();

        this.highlightedChordFingering = null;
        this.highlightedPitches = new Set();
    }

    protected Render(): RenderValue
    {
        const tuning: Pitch[] = ["C", "F", "A", "D", "G", "C", "F"];
        return <fragment>
            <h2>Oud finger board</h2>
            <table className="table table-striped-columns table-hover">
                <tbody>
                    {tuning.reverse().map( (x, i) => this.RenderString(x, i+1))}
                </tbody>
                <tfoot>
                    <tr>
                        <th> </th>
                        <th>empty</th>
                        {this.RenderChromaticSteps()}
                    </tr>
                </tfoot>
            </table>

            <h4>Highlight notes</h4>
            <div className="row">
                {this.RenderPitchHighlight()}
            </div>

            <h4>Highlight known chord fingerings</h4>
            {knownChordFingerings.map(this.RenderChordFingeringCategory.bind(this))}
        </fragment>;
    }

    //State
    private highlightedChordFingering: ChordFingering | null;
    private highlightedPitches: Set<Pitch>;

    //Private methods
    private NextPitch(pitch: Pitch): Pitch
    {
        switch(pitch)
        {
            case "A":
                return "Bb";
            case "Bb":
                return "B";
            case "B":
                return "C";
            case "C":
                return "Db";
            case "Db":
                return "D";
            case "D":
                return "Eb";
            case "Eb":
                return "E";
            case "E":
                return "F";
            case "F":
                return "F#";
            case "F#":
                return "G";
            case "G":
                return "Ab";
            case "Ab":
                return "A";
        }
    }

    private RenderChordFingering(cf: ChordFingering)
    {
        return <div className="col-auto">
            <label>
                <input type="checkbox" checked={this.highlightedChordFingering === cf} onclick={this.ToggleHighlightChordFingering.bind(this, cf)} />
                {cf.title}
            </label>
        </div>;
    }

    private RenderChordFingeringCategory(cf: ChordFingeringCategory)
    {
        return <div className="row mt-4">
            <h5>{cf.title}</h5>
            <i>{cf.description}</i>
            {cf.chordFingers.map(this.RenderChordFingering.bind(this))}
        </div>;
    }

    private RenderChromaticSteps()
    {
        const cells = [];
        for(let i = 0; i < stepsCount - 1; i++)
        {
            cells.push(<td>{i + 1}</td>);
        }
        return cells;
    }

    private RenderPitch(pitch: Pitch, highlight: boolean)
    {
        if(highlight)
            return <td className="table-primary">{pitch}</td>;
        return <td>{pitch}</td>;
    }

    private RenderPitchHighlight()
    {
        const pitches = [];

        let pitch: Pitch = "A";
        for(let i = 0; i < 12; i++)
        {
            pitches.push(
                <div className="col">
                    <label>
                        <input type="checkbox" checked={this.highlightedPitches.has(pitch)} onclick={this.ToggleHighlight.bind(this, pitch)} />
                        {pitch}
                    </label>
                </div>);
            pitch = this.NextPitch(pitch);
        }

        return pitches;
    }

    private RenderString(startPitch: Pitch, stringNumber: number)
    {
        const cells = [<td style="font-weight: bold;">{stringNumber}</td>];

        let pitch = startPitch;
        for(let i = 0; i < stepsCount; i++)
        {
            cells.push(this.RenderPitch(pitch, this.ShouldPitchBeHighlighted(pitch, stringNumber, i)));
            pitch = this.NextPitch(pitch);
        }

        return <tr>{cells}</tr>;
    }

    private ShouldPitchBeHighlighted(pitch: Pitch, stringNumber: number, fretNumber: number)
    {
        if(this.highlightedChordFingering !== null)
        {
            if(this.highlightedChordFingering.fingering.find(x => (x.stringNumber === stringNumber) && (x.fretNumber === fretNumber)))
                return true;
        }
        return this.highlightedPitches.has(pitch);
    }

    private ToggleHighlight(pitch: Pitch)
    {
        if(this.highlightedPitches.has(pitch))
            this.highlightedPitches.delete(pitch);
        else
            this.highlightedPitches.add(pitch);
        this.Update();
    }

    private ToggleHighlightChordFingering(cf: ChordFingering)
    {
        if(this.highlightedChordFingering === cf)
            this.highlightedChordFingering = null;
        else
            this.highlightedChordFingering = cf;
    }
}