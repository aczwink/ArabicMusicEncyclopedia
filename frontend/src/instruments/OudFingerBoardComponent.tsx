/**
 * ArabicMusicEncyclopedia
 * Copyright (C) 2023-2024 Amir Czwink (amir130@hotmail.de)
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

import { Component, JSX_CreateElement } from "acfrontend";

type Pitch = "A" | "Bb" | "B" | "C" | "Db" | "D" | "Eb" | "E" | "F" | "F#" | "G" | "Ab";
const stepsCount = 13;

export class OudFingerBoardComponent extends Component
{
    constructor()
    {
        super();

        this.highlighted = new Set();
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
            <h4>Highlight</h4>
            <div className="row">
                {this.RenderPitchHighlight()}
            </div>
        </fragment>;
    }

    //State
    private highlighted: Set<Pitch>;

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

    private RenderChromaticSteps()
    {
        const cells = [];
        for(let i = 0; i < stepsCount - 1; i++)
        {
            cells.push(<td>{i + 1}</td>);
        }
        return cells;
    }

    private RenderPitch(pitch: Pitch)
    {
        if(this.highlighted.has(pitch))
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
                        <input type="checkbox" checked={this.highlighted.has(pitch)} onclick={this.ToggleHighlight.bind(this, pitch)} />
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
            cells.push(this.RenderPitch(pitch));
            pitch = this.NextPitch(pitch);
        }

        return <tr>{cells}</tr>;
    }

    private ToggleHighlight(pitch: Pitch)
    {
        if(this.highlighted.has(pitch))
            this.highlighted.delete(pitch);
        else
            this.highlighted.add(pitch);
        this.Update();
    }
}