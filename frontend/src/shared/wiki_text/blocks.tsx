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

import { JSX_CreateElement } from "acfrontend";

export enum CurrentListType
{
    None,
    NumberedList,
    Paragraph,
    UnnumberedList,
    Table
}

class Block
{
    constructor(private _type: CurrentListType)
    {
        this.entries = [];
    }

    //Properties
    public get type()
    {
        return this._type;
    }

    //Public methods
    public Add(renderNode: any)
    {
        this.entries.push(renderNode);
    }

    public ToRenderNode()
    {
        switch(this.type)
        {
            case CurrentListType.None:
                return this.entries;
            case CurrentListType.NumberedList:
                return <ol>{this.entries.map(elem => <li>{elem}</li>)}</ol>;
            case CurrentListType.Paragraph:
                return <p>{this.entries as any}</p>;
            case CurrentListType.UnnumberedList:
                return <ul>{this.entries.map(elem => <li>{elem}</li>)}</ul>;
            case CurrentListType.Table:
            {
                const sepIdx = this.entries.indexOf("thead-tbody-seperator");
                const head = this.entries.splice(0, sepIdx);
                const body = this.entries.splice(sepIdx);

                function td2th(x: RenderValue)
                {
                    if( (x === null) || (x === undefined) )
                        return;
                    if(typeof x === "boolean")
                        return;
                    if(typeof x === "number")
                        return;
                    if(typeof x === "string")
                        return;

                    if(Array.isArray(x))
                        x.forEach(td2th);
                    else if(x.type === "tr")
                        x.children.forEach(td2th);
                    else if(x.type === "td")
                        x.type = "th";
                }
                head.forEach(td2th);
                
                return <table className="table table-striped">
                    <thead>
                        {head}
                    </thead>
                    <tbody>
                        {body}
                    </tbody>
                </table>;
            }
        }
    }
    
    //Private members
    private entries: any[];
}

export class BlockList
{
    constructor()
    {
        this.blocks = [];
    }

    //Public methods
    public Add(type: CurrentListType, renderNode: any)
    {
        const lastBlock = this.blocks[this.blocks.length - 1];
        if( (lastBlock !== undefined) && (lastBlock.type === type) )
            lastBlock.Add(renderNode);
        else
        {
            const block = new Block(type);
            block.Add(renderNode);
            this.blocks.push(block);
        }
    }

    public ToRenderNodeList()
    {
        return this.blocks.map(block => block.ToRenderNode());
    }

    //Private members
    private blocks: Block[];
}