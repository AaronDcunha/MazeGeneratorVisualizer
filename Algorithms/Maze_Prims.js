import {
    breakWall,
    generateEmptyMaze,
    getGraph,
    highlightCell,
    sleep, stopGen,
    unHighlightCell
} from "../MazeGenerator.js";

async function Prims(wList){
    while(wList.length !== 0)
    {
        if(stopGen()){
            return;
        }
        let index = Math.floor(Math.random() * wList.length);
        let edge = wList[index];
        let cell1 = edge[0];
        let cell2 = edge[1];
        wList.splice(index, 1);
        if(cell2.getVisited() === false){
            highlightCell(cell1);
            await sleep()
            cell2.setVisited(true);
            unHighlightCell(cell1);
            breakWall(cell1, cell2);
            for(const c of getGraph().getIncident(cell2)){
                if(stopGen()){
                    return;
                }
                if(c.getVisited() === false){
                    wList.push([cell2,c]);
                }
            }
        }
    }

}

export async function Maze_Prims(){
    generateEmptyMaze();
    if(stopGen()){
        return;
    }
    let randI = Math.floor(Math.random() * getGraph().getLength());
    getGraph().getVertex(randI).setVisited(true);
    await Prims(getGraph().getIncident(getGraph().getVertex(randI)).map(v=>[getGraph().getVertex(randI),v]));
}