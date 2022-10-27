/**
 * ArabicMusicEncyclopedia
 * Copyright (C) 2021-2022 Amir Czwink (amir130@hotmail.de)
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
import child_process from "child_process";
import fs from "fs";
import os from "os";
import path from "path";

import { Injectable } from "acts-util-node";
import { Accidental, NaturalNote, OctavePitch, OctavePitchToString } from "ame-api";
import { Interval } from "../model/Interval";

interface JinsInfo
{
    start: number;
    length: number;
    name: string;
}

@Injectable
export class MaqamPicCreator
{
    //Public methods
    public async CreateImage(basePitch: OctavePitch, intervals: Interval[], ajnas: JinsInfo[])
    {
        let inputData = this.OctavePitchToString(basePitch) + " " + intervals.join(" ");
        if(ajnas.length > 0)
        {
            inputData += "\n";
            inputData += ajnas.map(jins => jins.start + " " + jins.length + " " + jins.name).join("\n");
        }

        const dir = await fs.promises.mkdtemp(`${os.tmpdir()}${path.sep}ame`, "utf-8");

        await fs.promises.writeFile(this.GetInputFilePath(dir), inputData, "utf-8");
        await fs.promises.symlink(path.join(this.GetScriptDir(), "emmentaler-26.otf"), path.join(dir, "emmentaler-26.otf"))
        await this.CallScript(dir);
        const result = await fs.promises.readFile(this.GetOutputFilePath(dir));

        await fs.promises.rmdir(dir, { recursive: true});

        return result;
    }

    //Private methods
    private async CallScript(inputDir: string)
    {
        const child = child_process.exec(path.join(this.GetScriptDir(), "scaler.py") + " " + this.GetInputFilePath(inputDir), {
            cwd: inputDir,
        });

        await new Promise( (resolve, reject) => {
            child.on("exit", resolve);
            child.on("error", reject);
        });
    }

    private GetInputFilePath(dir: string)
    {
        return path.join(dir, "_input");
    }

    private GetOutputFilePath(dir: string)
    {
        return this.GetInputFilePath(dir) + ".png";
    }

    private GetScriptDir()
    {
        const rootDir = path.dirname(path.dirname(require.main!.filename));
        return path.join(rootDir, "scripts");
    }

    private OctavePitchToString(basePitch: OctavePitch)
    {
        let octaveNumber = 4;
        switch(basePitch.baseNote)
        {
            case NaturalNote.A:
            case NaturalNote.B:
            case NaturalNote.G:
                octaveNumber = 3;
                break;
        }

        function AccidentalToString(acc: Accidental)
        {
            switch(acc)
            {
                case Accidental.Flat:
                    return "b";
                case Accidental.HalfFlat:
                    return "hb";
                case Accidental.Natural:
                    return "n";
                case Accidental.HalfSharp:
                    return "h#";
                case Accidental.Sharp:
                    return "#";
                default:
                        throw new Error("NOT IMPLEMENTED: " + acc);
            }
        }

        return OctavePitchToString(basePitch).substr(0, 1).toLowerCase() + AccidentalToString(basePitch.accidental) + octaveNumber;
    }

}