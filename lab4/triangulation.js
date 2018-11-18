/**
 TODO Replace this by your own, correct, triangulation function
 Triangles should be return as arrays of array of indexes
 e.g., [[1,2,3],[2,3,4]] encodes two triangles, where the indices are relative to the array points
**/



class DCELStructure{
    constructor(points){
        this.points = points;
        let numberOfPoints = points.length;
        this.facesList = [numberOfPoints - 2];
        this.verticesList = new Array(numberOfPoints);
        this.edgesList = new Array(3 * numberOfPoints - 6);
        this.facesCount = 0;
        this.edgesCount = 0;


        this.edgesList[0] = {
            'vertexStart': 0,
            'vertexEnd': 1,
            'faceLeft': 0,
            'faceRight': -1,
            'edgeBefore': 2,
            'edgeNext': 1,
        };
        this.edgesList[1] = {
            'vertexStart': 1,
            'vertexEnd': 2,
            'faceLeft': 0,
            'faceRight': -1,
            'edgeBefore': 0,
            'edgeNext': 2,
        };
        this.edgesList[2] = {
            'vertexStart': 2,
            'vertexEnd': 0,
            'faceLeft': 0,
            'faceRight': -1,
            'edgeBefore': 1,
            'edgeNext': 0,
        };

        this.edgesCount += 3;

        this.facesList[0] = 0;
        this.facesCount += 1;

        this.verticesList[0] = {point: this.points[0], edgeIndex:0};
        this.verticesList[1] = {point: this.points[1], edgeIndex:1};
        this.verticesList[2] = {point: this.points[2], edgeIndex:2};
    }

    getStartingVertexFromEdge(edgeIndex){
        return this.edgesList[edgeIndex].vertexStart
    }

    getEndingVertexFromEdge(edgeIndex){
        return this.edgesList[edgeIndex].vertexEnd;
    }

    getRightFace(edgeIndex){
       return this.edgesList[edgeIndex].faceRight;
    }

    getLeftFace(edgeIndex){
        return this.edgesList[edgeIndex].faceLeft;
    }

    getBeforeEdge(edgeIndex){
        return this.edgesList[edgeIndex].edgeBefore;
    }

    getNextEdge(edgeIndex){
        return this.edgesList[edgeIndex].edgeNext;
    }
    


    getStartingVertexFromEdgeWithRespectToFaceBeingOnLeft(edgeIndex, faceIndex){
        if (this.getLeftFace(edgeIndex) === faceIndex){
            return this.getStartingVertexFromEdge(edgeIndex);
        }
        else if(this.getRightFace(edgeIndex) === faceIndex){
            return this.getEndingVertexFromEdge(edgeIndex);
        }
        else {
            console.warn("an edge ", edgeIndex,  " didnt have face with index ", faceIndex)
            this.printEdges();
        }

    }


    replaceFaceIndexWithNewOne(edgeIndex, previousFaceIndex, newFaceIndex){
        // will detect whether to replace right or left face
        if (this.getLeftFace(edgeIndex) === previousFaceIndex){
            this.edgesList[edgeIndex].faceLeft = newFaceIndex
        }
        else {
            this.edgesList[edgeIndex].faceRight = newFaceIndex
        }
    }


    replaceEdgeWithNewOne(edgeIndex, previousEdgeIndex, newEdgeIndex){
        if (this.getBeforeEdge(edgeIndex) === previousEdgeIndex){
            this.edgesList[edgeIndex].edgeBefore = newEdgeIndex
        }
        else {
            this.edgesList[edgeIndex].edgeNext = newEdgeIndex
        }
    }


    addPointToTriangulatedSet(faceIndex, newPointIndex){
        let edgesCountBeforeAdding = this.edgesCount;
        let facesCountBeforeAdding = this.facesCount;

        this.verticesList[newPointIndex] = {'edgeIndex': edgesCountBeforeAdding, point: this.points[newPointIndex]}; //create new vertex
        this.facesList[facesCountBeforeAdding] = edgesCountBeforeAdding; //create three new faces
        this.facesList[facesCountBeforeAdding + 1] = edgesCountBeforeAdding + 1;
        this.facesList[facesCountBeforeAdding + 2] = edgesCountBeforeAdding + 2;


        let edgesEnclosingFace = this.getEdgesEnclosingFaceInCounterClockwiseOrder(faceIndex);

        this.edgesList[edgesCountBeforeAdding] = {
            'vertexStart': newPointIndex,
            'vertexEnd': this.getStartingVertexFromEdgeWithRespectToFaceBeingOnLeft(
                edgesEnclosingFace[0], faceIndex),
            'faceLeft': facesCountBeforeAdding,
            'faceRight': facesCountBeforeAdding + 2,
            'edgeNext': edgesEnclosingFace[2],
            'edgeBefore': edgesCountBeforeAdding + 1,
        };


        this.replaceFaceIndexWithNewOne(edgesEnclosingFace[0], faceIndex, facesCountBeforeAdding);
        this.replaceEdgeWithNewOne(edgesEnclosingFace[0], edgesEnclosingFace[2], edgesCountBeforeAdding);
        // this.edgesList[edgesEnclosingFace[0]]


        this.edgesList[edgesCountBeforeAdding + 1] = {
            'vertexStart': newPointIndex,
            'vertexEnd': this.getStartingVertexFromEdgeWithRespectToFaceBeingOnLeft(
                edgesEnclosingFace[1], faceIndex),
            'faceLeft': facesCountBeforeAdding + 1,
            'faceRight': facesCountBeforeAdding,
            'edgeNext': edgesEnclosingFace[0],
            'edgeBefore': edgesCountBeforeAdding + 2,
        };

        this.replaceFaceIndexWithNewOne(edgesEnclosingFace[1], faceIndex, facesCountBeforeAdding + 1);
        this.replaceEdgeWithNewOne(edgesEnclosingFace[1], edgesEnclosingFace[0], edgesCountBeforeAdding + 1);



        this.edgesList[edgesCountBeforeAdding + 2] = {
            'vertexStart': newPointIndex,
            'vertexEnd': this.getStartingVertexFromEdgeWithRespectToFaceBeingOnLeft(
                edgesEnclosingFace[2], faceIndex),
            'faceLeft': facesCountBeforeAdding + 2,
            'faceRight': facesCountBeforeAdding + 1,
            'edgeNext': edgesEnclosingFace[1],
            'edgeBefore': edgesCountBeforeAdding,
        };

        this.replaceFaceIndexWithNewOne(edgesEnclosingFace[2], faceIndex, facesCountBeforeAdding + 2);
        this.replaceEdgeWithNewOne(edgesEnclosingFace[2], edgesEnclosingFace[1], edgesCountBeforeAdding + 2);

        this.edgesCount += 3;
        this.facesCount += 3;

        this.facesList[faceIndex] = -1;
    }
    


    getEdgesEnclosingFaceInCounterClockwiseOrder(faceIndex) {
        let firstEdgeAttachedToFace = this.facesList[faceIndex];
        let secondEdgeAttachedToFace, thirdEdgeAttachedToFace;

        if (this.getLeftFace(firstEdgeAttachedToFace) === faceIndex) {
            secondEdgeAttachedToFace= this.getBeforeEdge(firstEdgeAttachedToFace);
            if (this.getStartingVertexFromEdge(firstEdgeAttachedToFace) === this.getEndingVertexFromEdge(secondEdgeAttachedToFace)){
                thirdEdgeAttachedToFace = this.getBeforeEdge(secondEdgeAttachedToFace);
            }
            else{
                thirdEdgeAttachedToFace = this.getNextEdge(secondEdgeAttachedToFace)
            }
        }

        else { //sees the faces on its right, then find next
            secondEdgeAttachedToFace= this.getNextEdge(firstEdgeAttachedToFace);
            if (this.getEndingVertexFromEdge(secondEdgeAttachedToFace) === this.getStartingVertexFromEdge(secondEdgeAttachedToFace)){
                thirdEdgeAttachedToFace = this.getNextEdge(secondEdgeAttachedToFace)
            }
            else{
                thirdEdgeAttachedToFace = this.getBeforeEdge(secondEdgeAttachedToFace)
            }
        }
        console.log("faceIndex: ", faceIndex, "returning: ", [thirdEdgeAttachedToFace, secondEdgeAttachedToFace, firstEdgeAttachedToFace])
        return [thirdEdgeAttachedToFace, secondEdgeAttachedToFace, firstEdgeAttachedToFace]
    }


    printEdges(){
        for(let i=0; i < this.edgesList.length; i++){
            let edge = this.edgesList[i];
            if (edge !== undefined){
                console.log("edge ", i, " from vrt ", edge.vertexStart, " to ", edge.vertexEnd, ". fl ",
                    edge.faceLeft, " fr ", edge.faceRight, " ed-b ", edge.edgeBefore, "ed-n ", edge.edgeNext)
            }
        }
    }

    printVertices(){
        for(let i = 0; i < this.verticesList.length; i++){
            if (this.verticesList[i] !== undefined) {
                console.log("vertex ", i, " coord: ", this.verticesList[i].point.x, this.verticesList[i].point.y)
            }
        }
    }

    printFaces(){
        for(let i = 0; i < this.facesList.length; i++){
            if (this.facesList[i] !== undefined) {
                console.log("face ", i, " has edge: ", this.facesList[i])
            }
        }
    }


    getVerticesAroundFace(faceIndex) {
        let vertices = [];
        let firstEdgeAttachedToFace = this.facesList[faceIndex];
        vertices.push(this.getStartingVertexFromEdge(firstEdgeAttachedToFace), this.getEndingVertexFromEdge(firstEdgeAttachedToFace));
        let secondEdgeAttachedToFace;

        if (this.getLeftFace(firstEdgeAttachedToFace) === faceIndex) {
            secondEdgeAttachedToFace= this.getBeforeEdge(firstEdgeAttachedToFace);
        }
        else {
            secondEdgeAttachedToFace= this.getNextEdge(firstEdgeAttachedToFace);
        }

        vertices.push(this.getStartingVertexFromEdge(secondEdgeAttachedToFace), this.getEndingVertexFromEdge(secondEdgeAttachedToFace));
        return Array.from(new Set(vertices))
    }

    getOutputTriangles() {
        let outputTriangles = [];
        for(let i = 0; i<this.facesList.length; i++){
            let faceEdge = this.facesList[i];
            if (faceEdge !== undefined && faceEdge!== -1){
                outputTriangles.push(this.getVerticesAroundFace(i))

            }
        }
        console.log(outputTriangles)
        return outputTriangles
    }
}


function computeTriangulation(points) {
    // point 1, 2, 3 are for triangle

    let DCEL = new DCELStructure(points);
    let auxiliaryPoint = points[3];
    DCEL.addPointToTriangulatedSet(0, 3);
    DCEL.addPointToTriangulatedSet(1, 4);
    DCEL.addPointToTriangulatedSet(2, 5);
    DCEL.addPointToTriangulatedSet(7, 6);


    DCEL.printEdges();
    DCEL.printVertices();
    DCEL.printFaces();


    return DCEL.getOutputTriangles();


}

