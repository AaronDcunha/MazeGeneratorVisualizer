import {
    breakWall,
    drawBorder,
    generateMazeBorderOnly,
    getMazeDimensions,
    sleep,
    getGraph, stopGen
} from "../MazeGenerator.js";

//Biased random to favor more central values
function biasedRandom() {
    let sum = 0;
    for (let i = 0; i < 5; i++) {
        sum += Math.random();
    }
    return sum / 5;
}

//dirFlag = 0, 1 : Horizontal, Vertical
async function RecDiv_Divide(x1,y1,x2,y2, dirFlag){
    //console.log("X1: ", x1, "Y1: ", y1, "X2: ", x2, "Y2: ", y2);
    if(dirFlag === 0){
        let y = Math.floor(Math.random() * (y2-y1)) + y1;
        let CellBorderStart = getGraph().getVertex(x1+(y*getMazeDimensions()[0]));
        let CellBorderEnd = getGraph().getVertex(x2+(y*getMazeDimensions()[0]));
        let randomX = Math.floor(biasedRandom()*(x2-x1+1))+x1;
        //console.log(randomX);
        let CellBreak1 = getGraph().getVertex((randomX+(y*getMazeDimensions()[0])));
        let CellBreak2 = getGraph().getVertex((randomX+((y+1)*getMazeDimensions()[0])));
        drawBorder(CellBorderStart, CellBorderEnd, dirFlag);
        await sleep();
        breakWall(CellBreak1,CellBreak2);
        await sleep();
        await RecDiv(x1,y1,x2,y,(dirFlag === 0? 1 : 0));
        await RecDiv(x1,y+1,x2,y2,(dirFlag === 0? 1 : 0));
    }else{
        let x = Math.floor(Math.random() * (x2-x1)) + x1;
        let CellBorderStart = getGraph().getVertex(x+(y1*getMazeDimensions()[0]));
        let CellBorderEnd = getGraph().getVertex(x+(y2*getMazeDimensions()[0]));
        let randomY = Math.floor(biasedRandom()*(y2-y1+1))+y1;
        //console.log(randomY);
        let CellBreak1 = getGraph().getVertex((x+(randomY*getMazeDimensions()[0])));
        let CellBreak2 = getGraph().getVertex(((x+1)+(randomY*getMazeDimensions()[0])));
        drawBorder(CellBorderStart, CellBorderEnd, dirFlag);
        await sleep();
        breakWall(CellBreak1,CellBreak2);
        await sleep();
        await RecDiv(x1,y1,x,y2,(dirFlag === 0? 1 : 0));
        await RecDiv(x+1,y1,x2,y2,(dirFlag === 0? 1 : 0));
    }
}
async function RecDiv(x1, y1, x2, y2, dirFlag){
    if(stopGen()){
        return;
    }
    if(dirFlag === 0){
        if(y2 - y1 >= 1){
            await RecDiv_Divide(x1, y1, x2, y2, dirFlag);
        }else{
            if(x2 - x1 >= 1){
                await RecDiv_Divide(x1, y1, x2, y2, 1);
            }
        }
    }else{
        if(x2 - x1 >= 1){
            await RecDiv_Divide(x1, y1, x2, y2, dirFlag);
        }else{
            if(y2 - y1 >= 1){
                await RecDiv_Divide(x1, y1, x2, y2, 0);
            }
        }
    }
}
export async function Maze_RecursiveDivision() {
    //Maze Border
    generateMazeBorderOnly();
    if(stopGen()){
        return;
    }
    await RecDiv(0, 0, getMazeDimensions()[0]-1, getMazeDimensions()[1] - 1, 1);

}