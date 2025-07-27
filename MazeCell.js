import {Set } from "./UnionSet.js";

export class MazeCell {
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.visited = false;
        this.Set = new Set();
        this.ParentCell = null;
    }

    setVisited(visited){
        this.visited = visited;
    }

    getVisited(){
        return this.visited;
    }

    getSet(){
        return this.Set;
    }

    setParentCell(parentCell){
        this.ParentCell = parentCell;
    }

    getParentCell(){
        return this.ParentCell;
    }

}