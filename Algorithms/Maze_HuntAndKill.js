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
async function huntKill(cell){
    if(stopGen()){
        return;
    }
    cell.setVisited(true);
    let nextC = null;
    const shuffled = [...getGraph().getIncident(cell)].sort(() => Math.random() - 0.5);
    for (const c of shuffled) {
        if(c.getVisited() === false){
            if(stopGen()){
                return;
            }
            nextC = c;
            await sleep();
            unHighlightCell(cell);
            highlightCell(nextC);
            breakWall(cell, nextC);
            break;
        }
    }

    //Hunt Phase
    if(nextC === null){
        await sleep();
        unHighlightCell(cell);
        for(const c of getGraph().getVertices()){
            if(stopGen()){
                return;
            }
            highlightCell(c);
            if(c.getVisited() === false){
                let sentinel = 0;
                for(const c_2 of [...getGraph().getIncident(c)].sort(() => Math.random() - 0.5)){
                    if(c_2.getVisited() === true) {
                        breakWall(c, c_2);
                        sentinel = 1;
                        break;
                    }
                }
                if(sentinel === 1){
                    nextC = c;
                    await sleep(getGenSpeed()/2);
                    unHighlightCell(c);
                    break;
                }
            }
            await sleep(getGenSpeed()/2);
            unHighlightCell(c);
        }
        if(stopGen()){
            return;
        }
        if(nextC !== null){
            await sleep();
            highlightCell(nextC);
            await huntKill(nextC);
        }

    }else{
        if(stopGen()){
            return;
        }
        await huntKill(nextC);
    }

}

export async function Maze_HuntAndKill(){
    generateEmptyMaze();
    if(stopGen()){
        return;
    }
    let randI = Math.floor(Math.random() * getGraph().getLength());
    highlightCell(getGraph().getVertex(randI));
    await huntKill(getGraph().getVertex(randI));
}