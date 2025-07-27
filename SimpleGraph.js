export class SimpleGraph{
    constructor() {
        this.adjacencyList = new Map();
        this.vertices = [];
        this.edges = [];
    }

    addVertex(v){
        this.adjacencyList.set(v,[]);
        this.vertices.push(v);
    }

    addEdge(v,w){
        this.adjacencyList.get(v).push(w);
        this.adjacencyList.get(w).push(v);
        this.edges.push([w,v])
    }

    getEdges(){
        return this.edges;
    }

    getIncident(v){
        return this.adjacencyList.get(v);
    }

    getVertex(i){
        return this.vertices[i];
    }

    getVertices(){
        return this.vertices;
    }

    getLength(){
        return this.vertices.length;
    }

}