import {Set} from "../UnionSet.js";
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
export async function Maze_Kruskal(){
    generateEmptyMaze();
    if(stopGen()){
        return;
    }
    const shuffled = [...getGraph().getEdges()].sort(() => Math.random() - 0.5);
    for (const edge of shuffled) {
        if(stopGen()){
            return;
        }
        let cell1 = edge[0];
        let cell2 = edge[1];
        highlightCell(cell1);
        await sleep();
        //console.log(cell1);
        //console.log(cell2);
        if(Set.getParent(cell1.getSet()) !== Set.getParent(cell2.getSet())){
            Set.mergeSet(cell1.getSet(),cell2.getSet());
            //console.log("Not a Union so joining!");
            breakWall(cell1, cell2)
            unHighlightCell(cell1);
            highlightCell(cell2);
            await sleep(getGenSpeed());
            unHighlightCell(cell2);
        }
        unHighlightCell(cell1);
    }
}