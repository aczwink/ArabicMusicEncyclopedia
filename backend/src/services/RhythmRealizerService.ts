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

import { Injectable } from "@aczwink/acts-util-node";
import { OAMDB_RhythmDefinition } from "@aczwink/openarabicmusicdb-domain";
import { Fraction } from "../model/Fraction";

@Injectable
export class RhythmRealizerService
{
    public ComputeTimeSig(rhythm: OAMDB_RhythmDefinition): Fraction
    {
        if("note" in rhythm)
            return new Fraction(1, rhythm.duration);

        return rhythm.partitions.Values().Map(x => this.ComputeTimeSig(x)).Accumulate( (a, b) => a.Add(b));
    }
}