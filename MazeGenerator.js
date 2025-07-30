//Imports
import {MazeCell} from "./MazeCell.js";
import {SimpleGraph} from "./SimpleGraph.js";
import {Set } from "./UnionSet.js";
import {Maze_DFS} from "./Algorithms/Maze_DFS.js";
import {Maze_HuntAndKill} from "./Algorithms/Maze_HuntAndKill.js";
import {Maze_Kruskal} from "./Algorithms/Maze_Kruskal.js";
import {Maze_Prims} from "./Algorithms/Maze_Prims.js";
import {Maze_RecursiveDivision} from "./Algorithms/Maze_RecursiveDivision.js";
import {Maze_Ellers} from "./Algorithms/Maze_Ellers.js";

//Canvas
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

//Default Parameters
let borderColorDefault = "#000000";
let bgColorDefault = "#ffffff";
let brokenWallColorDefault = "#cfcfcf";
let highlightColorDefault = "#55ff00";
let solutionColorDefault = "#55ff00";
let genSpeedDefault = 125;
let instantGenDefault = false;

//Parameters
const columns = 12;
const rows = 12;
const borderWidth = 24;
let borderColor = "#000000";
let bgColor = "#ffffff";
let brokenWallColor = "#cfcfcf"; //By Default bgColor = brokenWallColor
let highlightColor = "#55ff00";
let solutionColor = "#55ff00";
let genSpeed = 125;
let instantGen = false;

let Graph;
let GraphGenerated = true;
let GraphSolution;
let stopGenerating = false;
let solveBlocked = true;
let solutionGenerated = false;

function setupCanvas(){
    GraphGenerated = false;
    stopGenerating = false;
    canvas.width = (columns*2+1) * borderWidth;
    canvas.height = (rows*2+1) * borderWidth;

    Graph = new SimpleGraph();
    GraphSolution = new SimpleGraph();

    //Add each vertex
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < columns; x++) {
            let m = new MazeCell(x,y)
            Graph.addVertex(m);
            GraphSolution.addVertex(m);
        }
    }

    //Add the Edge
    for (let i = 0; i < Graph.getLength()-1; i++) {
        let thisVertex = Graph.getVertex(i);
        let nextVertex = Graph.getVertex(i+1);

        if(nextVertex.y === thisVertex.y){
            Graph.addEdge(thisVertex, nextVertex);
        }
        if(nextVertex.y !== rows-1){
            Graph.addEdge(thisVertex, Graph.getVertex(i+columns));
        }
    }

    ctx.globalAlpha = 1;
}

export function stopGen(){
    return stopGenerating;
}

export function toCanvasCoord(val){
    return (val * 2 * borderWidth) + borderWidth;
}

export function toCanvasCoords(cell){
    return [toCanvasCoord(cell.x), toCanvasCoord(cell.y)];
}

function drawBorderLeftUp(coords){
    ctx.fillRect(coords[0]-borderWidth, coords[1], borderWidth, borderWidth); //Left
    ctx.fillRect(coords[0], coords[1] - borderWidth, borderWidth, borderWidth); //Up
}

function drawBorderRight(coords){
    ctx.fillRect(coords[0]+borderWidth, coords[1], borderWidth, borderWidth); //Right
}

function drawBorderDown(coords){
    ctx.fillRect(coords[0], coords[1] + borderWidth, borderWidth, borderWidth); //Down
}

//Returns where C2 is with respect to C1
//Left Up Right Down = 0 1 2 3
export function getRelDirection(c1,c2){
    if(c1.x === c2.x){
        if (c1.y > c2.y){
            //console.log("Returns Up");
            return 1; //Down
        }else{
            //console.log("Returns Down");
            return 3; //Up
        }
    }else{
        if (c1.x > c2.x){
            //console.log("Returns Left");
            return 0; //Left
        }else{
            //console.log("Returns Right");
            return 2; //Right
        }
    }
}

export function generateEmptyMaze(){
    //Reset canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //Draw the Cell Borders
    ctx.fillStyle = borderColor;
    let i;
    for (i = 0; i < Graph.getLength()-1; i++) {
        let thisVertex = Graph.getVertex(i);
        let nextVertex = Graph.getVertex(i+1);

        let coords = toCanvasCoords(thisVertex);

        //Add Left, Up Border
        drawBorderLeftUp(coords);
        //Check if Right-most Cell, Add Right Border
        if(nextVertex.y !== thisVertex.y){
            drawBorderRight(coords);
        }
        //Check if Bottom Row, Add Bottom Border
        if(nextVertex.y === rows-1){
            drawBorderDown(coords);
        }
    }
    let lastVertex = Graph.getVertex(i);
    let coords = toCanvasCoords(lastVertex);
    drawBorderLeftUp(coords);
    drawBorderRight(coords);
    drawBorderDown(coords);

    //Draw the Cell Border Corners
    for (let y = 0; y < rows+1; y++) {
        for (let x = 0; x < columns+1; x++) {
            ctx.fillRect(x*(borderWidth*2), y*(borderWidth*2), borderWidth, borderWidth);
        }
    }

    ctx.fillStyle = bgColor;
}

export function breakWall(cell1, cell2){
    let coords = toCanvasCoords(cell1);
    let direction = getRelDirection(cell1, cell2);
    ctx.fillStyle = brokenWallColor;
    switch(direction){
        case 0:
            //console.log("L");
            ctx.fillRect(coords[0]-borderWidth, coords[1], borderWidth, borderWidth);
            break;
        case 1:
            //console.log("U");
            ctx.fillRect(coords[0], coords[1]-borderWidth, borderWidth, borderWidth);
            break;
        case 2:
            //console.log("R");
            ctx.fillRect(coords[0]+borderWidth, coords[1], borderWidth, borderWidth);
            break;
        case 3:
            //console.log("D");
            ctx.fillRect(coords[0], coords[1]+borderWidth, borderWidth, borderWidth);
            break;
    }

    GraphSolution.addEdge(cell1,cell2);
}

export function sleep(t=genSpeed) {
    if(instantGen === false){
        return new Promise(resolve => setTimeout(resolve, t));
    }
}

export function highlightCell(c){
    if(instantGen === false){
        let coords = toCanvasCoords(c);
        ctx.fillStyle = highlightColor;
        ctx.fillRect(coords[0], coords[1], borderWidth, borderWidth);
    }
}

export function unHighlightCell(c){
    if(instantGen === false){
        let coords = toCanvasCoords(c);
        ctx.fillStyle = bgColor;
        ctx.fillRect(coords[0], coords[1], borderWidth, borderWidth);
    }
}

export function getGenSpeed(){
    return genSpeed;
}

export function getGraph(){
    return Graph;
}

export function generateMazeBorderOnly(){
    //Maze Border
    //Reset canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = borderColor;
    ctx.fillRect(0, 0, borderWidth, canvas.height);
    ctx.fillRect(0, 0, canvas.width, borderWidth);
    ctx.fillRect(canvas.width - borderWidth, 0, borderWidth, canvas.height);
    ctx.fillRect(0, canvas.height - borderWidth, canvas.width, borderWidth);
}

export function getMazeDimensions(){
    return [columns,rows];
}

export function drawBorder(minPointCell, maxPointCell, dirFlag){
    ctx.fillStyle = borderColor;
    let Coords1 = toCanvasCoords(minPointCell);
    let Coords2 = toCanvasCoords(maxPointCell);
    if(dirFlag === 0){
        ctx.fillRect(Coords1[0],Coords1[1]+borderWidth,Coords2[0]+borderWidth-Coords1[0], borderWidth);
    }else{
        ctx.fillRect(Coords1[0]+borderWidth,Coords1[1],borderWidth, Coords2[1]+borderWidth-Coords1[1]);
    }
}

//Generate Maze using DSA
function genMaze_DFS(){
    Maze_DFS().then(r => {mazeReady()});
}

//Generate Maze using Kruskal
function genMaze_KRUSKAL(){
    Maze_Kruskal().then(r => {mazeReady()});
}

//Generate Maze using Hunt and Kill
function genMaze_HuntKill(){
    Maze_HuntAndKill().then(r => {mazeReady()});
}

//Generate Maze using Prims
function genMaze_Prims(){
    Maze_Prims().then(r => {mazeReady()});
}

//Generate Maze using Recursive Division
function genMaze_RecDiv() {
    Maze_RecursiveDivision().then(r => {mazeReady()});
}

//Generate Maze using Eller's Algorithm
function genMaze_Eller(){
    Maze_Ellers().then(r => {mazeReady()});
}

//Solve Maze using BFS
function solveMaze(){
    if(GraphGenerated === false || solveBlocked === true || solutionGenerated === true){
        return;
    }

    solutionGenerated = true;
    let startingPoint = GraphSolution.getVertex(0);
    let endingPoint = GraphSolution.getVertex((rows*columns)-1);
    let solved = false;

    for(const c of GraphSolution.getVertices()){
        c.setVisited(false);
    }

    let queue = [startingPoint];
    startingPoint.setVisited(true);

    while(queue.length > 0 || !solved){
        let cell = queue.shift();
        let asd = GraphSolution.getIncident(cell);
        for(const otherCell of asd){
            if(otherCell.getVisited() === false){
                otherCell.setVisited(true);
                otherCell.setParentCell(cell);
                if(otherCell === endingPoint){
                    solved = true;
                    break;
                }
                queue.push(otherCell);
            }
        }
    }

    ctx.globalAlpha = 0.3;
    ctx.fillStyle = solutionColor;
    let pCell = null;
    let currentCell = endingPoint;
    while(currentCell !== null){
        if(pCell !== null){
            let coordsA = toCanvasCoords(currentCell);
            let coordsB = toCanvasCoords(pCell);
            let direction = getRelDirection(currentCell,pCell);
            switch(direction){
                case 0:
                    //console.log("L");
                    ctx.fillRect(coordsB[0], coordsB[1], borderWidth*3, borderWidth);
                    break;
                case 1:
                    //console.log("U");
                    ctx.fillRect(coordsB[0], coordsB[1], borderWidth, borderWidth*3);
                    break;
                case 2:
                    //console.log("R");
                    ctx.fillRect(coordsA[0], coordsA[1], borderWidth*3, borderWidth);
                    break;
                case 3:
                    //console.log("D");
                    ctx.fillRect(coordsA[0], coordsA[1], borderWidth, borderWidth*3);
                    break;
            }
        }
        pCell = currentCell;
        currentCell = currentCell.getParentCell();
    }
    ctx.fillRect(0, borderWidth, borderWidth, borderWidth);
    ctx.fillRect(columns*2*borderWidth, rows*2*borderWidth-borderWidth, borderWidth, borderWidth);

}

function mazeReady(){
    //solveMaze();
    GraphGenerated = true;
    console.log("Maze Generated!");
}

async function waitUntilTrue() {
    while (GraphGenerated === false) {
        await new Promise(resolve => setTimeout(resolve, 50));
    }
}

let elementGenAlg = document.getElementById('algorithm');
let elementBorderColor = document.getElementById("borderColor");
let elementMazeColor1 = document.getElementById("mazeColor");
let elementMazeColor2 = document.getElementById("mazeColor2");
let elementSolnColor = document.getElementById("solutionColor");
let elementHlColor = document.getElementById("highlightColor");
let elementSpeed = document.getElementById("speed");
let elementInstant = document.getElementById("instant");

async function generateMaze(){
    borderColor = elementBorderColor.value;
    bgColor = elementMazeColor1.value;
    brokenWallColor = elementMazeColor2.value;
    solutionColor = elementSolnColor.value;
    highlightColor = elementHlColor.value;
    genSpeed = elementSpeed.value;
    instantGen = elementInstant.checked;

    stopGenerating = true;
    solutionGenerated = false;

    await waitUntilTrue();

    setupCanvas();
    solveBlocked = false;

    let genAlg = elementGenAlg.value
    //console.log(genAlg)
    //console.log(genAlg === "0");
    switch (genAlg) {
        case "0":
            genMaze_DFS();
            break;
        case "1":
            genMaze_KRUSKAL();
            break;
        case "2":
            genMaze_Prims();
            break;
        case "3":
            genMaze_HuntKill();
            break;
        case "4":
            genMaze_RecDiv();
            break;
        case "5":
            genMaze_Eller();
            break;
    }

    //Entry / Ending Point
    ctx.fillStyle = brokenWallColor;
    ctx.fillRect(0, borderWidth, borderWidth, borderWidth);
    ctx.fillRect(columns*2*borderWidth, rows*2*borderWidth-borderWidth, borderWidth, borderWidth);
}

function setDefaultHTMLParameters(){
    elementBorderColor.value = borderColorDefault;
    elementMazeColor1.value = bgColorDefault;
    elementMazeColor2.value = brokenWallColorDefault;
    elementSolnColor.value = solutionColorDefault;
    elementHlColor.value = highlightColorDefault;
    elementSpeed.value = genSpeedDefault;
    elementInstant.checked = instantGenDefault;
    document.getElementById("speedValue").innerHTML = genSpeedDefault.toString();
}

function downloadMaze(){
    const mazeImage = document.createElement("a");
    mazeImage.download = "maze-image.png";
    mazeImage.href = canvas.toDataURL("image/jpeg");
    mazeImage.click();
}

setupCanvas();
generateMazeBorderOnly();
GraphGenerated = true;
document.getElementById("mazeGenerate").addEventListener("click", generateMaze);
document.getElementById("mazeSolve").addEventListener("click", solveMaze);
document.getElementById("mazeReset").addEventListener("click", ()=>{
    setDefaultHTMLParameters();
});
document.getElementById("mazeDownload").addEventListener("click", downloadMaze);
setDefaultHTMLParameters();
