import {
    breakWall,
    generateEmptyMaze,
    getGenSpeed,
    getGraph,
    highlightCell,
    sleep,
    unHighlightCell,
    stopGen
} from "../MazeGenerator.js";

async function DFS(cell){
    await sleep();
    if(stopGen()){
        return;
    }
    cell.setVisited(true);
    //console.log(Graph.getIncident(cell));
    const shuffled = [...getGraph().getIncident(cell)].sort(() => Math.random() - 0.5);
    for (const c of shuffled) {
        if(stopGen()){
            return;
        }
        if(c.getVisited() === false){
            //console.log(c);
            unHighlightCell(cell);
            highlightCell(c);
            breakWall(cell, c);
            await DFS(c);
        }
    }
    highlightCell(cell);
    await sleep(getGenSpeed());
    unHighlightCell(cell);
}

export async function Maze_DFS(){
    generateEmptyMaze();
    if(stopGen()){
        return;
    }
    let randI = Math.floor(Math.random() * getGraph().getLength());
    //console.log(Graph.getVertex(randI));
    highlightCell(getGraph().getVertex(randI));
    await DFS(getGraph().getVertex(randI));

}