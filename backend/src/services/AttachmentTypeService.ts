/**
 * ArabicMusicEncyclopedia
 * Copyright (C) 2022 Amir Czwink (amir130@hotmail.de)
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
import { CreateTempFile, Injectable } from "acts-util-node";
import { UploadedFile } from "acts-util-node/dist/http/UploadedFile";

export type AttachmentContentType =
    "application/pdf"
    | "application/vnd.finale.mus"
    | "image/jpeg"
    | "text/x-lilypond";

@Injectable
export class AttachmentTypeService
{
    //Public methods
    public async FindContentType(uf: UploadedFile): Promise<AttachmentContentType | undefined>
    {
        const tmpFile = await CreateTempFile();
        await tmpFile.file.write(uf.buffer);
        await tmpFile.file.close();
        const foundType = child_process.execSync('file --mime-type -b "' + tmpFile.filePath + '"').toString("utf-8").trim();
        await fs.promises.unlink(tmpFile.filePath);

        switch(foundType)
        {
            case "application/pdf":
            case "image/jpeg":
                return foundType;
            case "text/plain":
                if(uf.originalName.endsWith(".ly") && uf.mediaType === "text/x-lilypond")
                    return uf.mediaType;
        }

        return undefined;
    }

    public TypeToFileExtension(contentType: AttachmentContentType)
    {
        switch(contentType)
        {
            case "application/pdf":
                return "pdf";
            case "application/vnd.finale.mus":
                return "mus";
            case "image/jpeg":
                return "jpg";
            case "text/x-lilypond":
                return "ly";
        }
    }
}