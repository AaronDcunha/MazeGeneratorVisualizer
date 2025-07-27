import {Set} from "../UnionSet.js";
import {breakWall, generateEmptyMaze, sleep, getMazeDimensions, getGraph, stopGen} from "../MazeGenerator.js";

export async function Maze_Ellers(){
    generateEmptyMaze();

    for(let y = 0; y < getMazeDimensions()[1]; y++){
        let sets = [];
        let startX = 0;
        for(let x = 0; x < getMazeDimensions()[0]; x++){
            if(stopGen()){
                return;
            }
            if(x === getMazeDimensions()[0]-1){
                if(Set.getParent(getGraph().getVertex((x-1)+(y*getMazeDimensions()[0])).getSet()) !== Set.getParent(getGraph().getVertex((x)+(y*getMazeDimensions()[0])).getSet())){
                    sets.push([x,x]);
                }else{
                    sets.push([startX,x]);
                }
            }else{
                let Cell = getGraph().getVertex(x+(y*getMazeDimensions()[0]));
                let Cell2 = getGraph().getVertex((x+1)+(y*getMazeDimensions()[0]));
                if(Set.getParent(Cell.getSet()) !== Set.getParent(Cell2.getSet())){
                    if(Math.floor(Math.random()*2) === 0){
                        //Join the Cells
                        breakWall(Cell,Cell2);
                        await sleep();
                        Set.mergeSet(Cell.getSet(),Cell2.getSet());
                    }else{
                        sets.push([startX,x]);
                        startX = x+1;
                    }
                }
            }

        }

        if(y !== getMazeDimensions()[1]-1){
            for(let set of sets){
                if(stopGen()){
                    return;
                }
                let downwardConnection = 0;
                for(let i = set[0]; i <= set[1]; i++){
                    if(Math.random() < 0.5){
                        downwardConnection++;
                        let Cell1 = getGraph().getVertex(i+(y*getMazeDimensions()[0]));
                        let Cell2 = getGraph().getVertex(i+((y+1)*getMazeDimensions()[0]));
                        Set.mergeSet(Cell1.getSet(),Cell2.getSet());
                        breakWall(Cell1,Cell2);
                        await sleep();
                    }
                }
                if(downwardConnection === 0){
                    let randX = Math.floor(Math.random()*(set[1]-set[0]+1)) + set[0];
                    let Cell1 = getGraph().getVertex(randX+(y*getMazeDimensions()[0]));
                    let Cell2 = getGraph().getVertex(randX+((y+1)*getMazeDimensions()[0]));
                    Set.mergeSet(Cell1.getSet(),Cell2.getSet());
                    breakWall(Cell1,Cell2);
                    await sleep();
                }
            }
        }else{
            for(let i = 0; i < sets.length-1; i++){
                if(stopGen()){
                    return;
                }
                let Cell1 = getGraph().getVertex(sets[i][1]+(y*getMazeDimensions()[0]));
                let Cell2 = getGraph().getVertex(sets[i+1][0]+((y)*getMazeDimensions()[0]));
                breakWall(Cell1,Cell2);
                await sleep();
            }
        }

    }
}