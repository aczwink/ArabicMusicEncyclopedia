/**
 * ArabicMusicEncyclopedia
 * Copyright (C) 2022-2026 Amir Czwink (amir130@hotmail.de)
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

export type AttachmentContentType =
    "application/pdf"
    | "application/vnd.musician"
    | "image/jpeg"
    | "text/x-lilypond";

@Injectable
export class AttachmentTypeService
{
    //Public methods
    public TypeToFileExtension(contentType: AttachmentContentType)
    {
        switch(contentType)
        {
            case "application/pdf":
                return "pdf";
            case "application/vnd.musician":
                return "mus";
            case "image/jpeg":
                return "jpg";
            case "text/x-lilypond":
                return "ly";
        }
    }
}