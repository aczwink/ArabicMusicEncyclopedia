/**
 * ArabicMusicEncyclopedia
 * Copyright (C) 2021-2023 Amir Czwink (amir130@hotmail.de)
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

import { Component, JSX_CreateElement, Textarea } from "acfrontend";

export class WikiTextEditComponent extends Component<{ text: string; onChanged: (newValue: string) => void}>
{
    protected Render(): RenderValue
    {
        return <fragment>
            <div className="row">
                <div className="col">
                    <a href="#" onclick={this.OnInsertHeading.bind(this)}>Heading</a>
                    <a href="#" onclick={this.OnInsertWikiLink.bind(this)}>Wiki link</a>
                    <a href="#" onclick={this.OnInsertExternalLink.bind(this)}>External link</a>
                </div>
            </div>
            <Textarea id="wiki_text" value={this.input.text} onChanged={this.input.onChanged} />
        </fragment>;
    }

    //Private methods
    private ReplaceSelection(replacer: (selectedText: string) => string, selectionBeginOffset: number, selectionEndOffset: number)
    {
        const element = document.getElementById("wiki_text")! as HTMLTextAreaElement;

        const selectionStart = element.selectionStart;
        const selectionEnd = element.selectionEnd;
        const selectedText = element.value.substring(selectionStart, selectionEnd);
        const replacedText = replacer(selectedText);

        const newText = element.value.substring(0, selectionStart) + replacedText + element.value.substring(selectionEnd);

        element.value = newText;

        element.select();
        element.setSelectionRange(selectionStart + selectionBeginOffset, selectionStart + replacedText.length - selectionEndOffset);

        this.input.onChanged(newText);
    }

    private ReplaceSelectionWith(replacedText: string)
    {
        this.ReplaceSelection(_ => replacedText, 0, 0);
    }

    private ReplaceSelectionWithStartAndEnd(before: string, after: string)
    {
        this.ReplaceSelection(selectedText => before + selectedText + after, before.length, after.length);
    }

    //Event handlers
    private OnInsertExternalLink(event: Event)
    {
        event.preventDefault();

        const url = prompt("URL");
        if(url !== null)
        {
            const title = prompt("title");
            if(title !== null)
            {
                this.ReplaceSelectionWith("[" + url + " " + title + "]");
            }
        }
    }

    private OnInsertHeading(event: Event)
    {
        event.preventDefault();

        this.ReplaceSelectionWithStartAndEnd("== ", " ==");
    }

    private OnInsertWikiLink(event: Event)
    {
        event.preventDefault();

        this.ReplaceSelectionWithStartAndEnd("[[", "]]");
    }
}