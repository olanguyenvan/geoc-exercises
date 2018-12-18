/**
 TODO Replace this by your own, correct, triangulation function
 Triangles should be return as arrays of array of indexes
 e.g., [[1,2,3],[2,3,4]] encodes two triangles, where the indices are relative to the array points
 **/



class DCEL{
    constructor(points){
        // fixed point will be always 4th point
        let numberOfPoints = points.length;
        this.facesList = [numberOfPoints - 2];
        this.edgesList = new Array(3 * numberOfPoints - 6);
        this.verticesList = new Array(numberOfPoints);

        for(let i = 0; i < points.length; i++){
            this.verticesList[i] = {pointCoordinates: points[i]}
        }

        this.facesCount = 0;
        this.edgesCount = 0;
    }


    getEdgeFromVertex(vertexIndex){
        return this.verticesList[vertexIndex].edgeIndex;
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
            console.warn("this edge",edgeIndex, "doesnt have this face", faceIndex)
        }
    }


    replaceFaceIndexWithNewOne(edgeIndex, previousFaceIndex, newFaceIndex){
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

    getVertexCoordinates(vertexIndex){
        return this.verticesList[vertexIndex].pointCoordinates
    }

    getOtherFaceFromEdge(edgeIndex, firstFace){
        let rightFace = this.getRightFace(edgeIndex);
        if (rightFace === firstFace){
            return this.getLeftFace(edgeIndex);
        }
        return rightFace;
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
            secondEdgeAttachedToFace = this.getNextEdge(firstEdgeAttachedToFace);
            if (this.getStartingVertexFromEdge(secondEdgeAttachedToFace) === this.getEndingVertexFromEdge(firstEdgeAttachedToFace)){
                thirdEdgeAttachedToFace = this.getNextEdge(secondEdgeAttachedToFace)
            }
            else{
                thirdEdgeAttachedToFace = this.getBeforeEdge(secondEdgeAttachedToFace)
            }
        }
        return [thirdEdgeAttachedToFace, secondEdgeAttachedToFace, firstEdgeAttachedToFace]
    }


    getFarthestVertexFromNeighbouringFace(faceIndex, neighbouringFaceIndex) {
        let verticesIndicesAroundFace = this.getVerticesIndicesAroundFace(faceIndex);
        let verticesIndicesAroundNeighbouringFace = this.getVerticesIndicesAroundFace(neighbouringFaceIndex);

        for(let vertexIndex = 0; vertexIndex < verticesIndicesAroundNeighbouringFace.length; vertexIndex++){
            let forthVertex = verticesIndicesAroundNeighbouringFace[vertexIndex];
            if (verticesIndicesAroundFace.indexOf(forthVertex) === -1){
                return forthVertex;
            }
        }
        console.error("getFarthestVertexFromNeighbouringFace didn't find 4th vertex. faceindex neighouring", neighbouringFaceIndex, " faceindex", faceIndex)
        this.printEdges()
        this.printFaces()
        this.printVertices()
    }

    getFacesAroundFace(faceIndex){
        let facesAroundFace = [];
        let firstEdgeAttachedToFace = this.facesList[faceIndex];
        let secondEdgeAttachedToFace, thirdEdgeAttachedToFace;

        if(this.getLeftFace(firstEdgeAttachedToFace) === faceIndex) {
            facesAroundFace.push(this.getRightFace(firstEdgeAttachedToFace));
            secondEdgeAttachedToFace = this.getBeforeEdge(firstEdgeAttachedToFace);
            //
            // if (this.getLeftFace(secondEdgeAttachedToFace) === faceIndex){
            //     facesAroundFace.push(this.getRightFace(secondEdgeAttachedToFace));
            //     thirdEdgeAttachedToFace = this.getBeforeEdge(secondEdgeAttachedToFace);
            // }
            // else {
            //     facesAroundFace.push(this.getLeftFace(secondEdgeAttachedToFace));
            //     thirdEdgeAttachedToFace = this.getNextEdge(secondEdgeAttachedToFace);
            // }
            //
            // if(this.getRightFace(thirdEdgeAttachedToFace) === faceIndex){
            //     facesAroundFace.push(this.getLeftFace(thirdEdgeAttachedToFace))
            // }
            // else {
            //     facesAroundFace.push(this.getRightFace(thirdEdgeAttachedToFace))
            // }
        }

        else {
            facesAroundFace.push(this.getLeftFace(firstEdgeAttachedToFace));
            secondEdgeAttachedToFace = this.getNextEdge(firstEdgeAttachedToFace);

            // if (this.getLeftFace(secondEdgeAttachedToFace) === faceIndex){
            //     facesAroundFace.push(this.getRightFace(secondEdgeAttachedToFace))
            //     thirdEdgeAttachedToFace = this.getBeforeEdge(secondEdgeAttachedToFace);
            // }
            // else {
            //     facesAroundFace.push(this.getLeftFace(secondEdgeAttachedToFace));
            //     thirdEdgeAttachedToFace = this.getNextEdge(secondEdgeAttachedToFace);
            // }
            //
            // if(this.getRightFace(thirdEdgeAttachedToFace) === faceIndex){
            //     facesAroundFace.push(this.getLeftFace(thirdEdgeAttachedToFace))
            // }
            // else {
            //     facesAroundFace.push(this.getRightFace(thirdEdgeAttachedToFace))
            // }
        }
        if (this.getLeftFace(secondEdgeAttachedToFace) === faceIndex){
            facesAroundFace.push(this.getRightFace(secondEdgeAttachedToFace))
            thirdEdgeAttachedToFace = this.getBeforeEdge(secondEdgeAttachedToFace);
        }
        else {
            facesAroundFace.push(this.getLeftFace(secondEdgeAttachedToFace));
            thirdEdgeAttachedToFace = this.getNextEdge(secondEdgeAttachedToFace);
        }

        if(this.getRightFace(thirdEdgeAttachedToFace) === faceIndex){
            facesAroundFace.push(this.getLeftFace(thirdEdgeAttachedToFace))
        }
        else {
            facesAroundFace.push(this.getRightFace(thirdEdgeAttachedToFace))
        }

        return facesAroundFace
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
                console.log("vertex ", i, " coord: ", this.getVertexCoordinates(i).x,
                    this.getVertexCoordinates(i).y, " edge: ", this.verticesList[i].edgeIndex)
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


    getVerticesIndicesAroundFace(faceIndex) {
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

    getFacesAroundVertex(vertexIndex){
        console.log("get faces around vertex ", vertexIndex);
        let facesAroundVertex = [];
        let firstEdge = this.getEdgeFromVertex(vertexIndex);
        let edge = firstEdge;
        let tmpFace = null;

        do{
            if (this.getStartingVertexFromEdge(edge) === vertexIndex){
                tmpFace = this.getLeftFace(edge);
                edge = this.getBeforeEdge(edge);
            }
            else {
                tmpFace = this.getRightFace(edge);
                edge = this.getNextEdge(edge);
            }
            facesAroundVertex.push(tmpFace)
        } while (edge !== firstEdge);

        return facesAroundVertex
    }


    getOutputTriangles(withoutEnclosingTriangle) {
        let outputTriangles = [];
        for(let i = 0; i<this.facesList.length; i++){
            let faceEdge = this.facesList[i];
            if (faceEdge !== undefined){
                if (withoutEnclosingTriangle){
                    let verticesAroundFace = this.getVerticesIndicesAroundFace(i);
                    if (verticesAroundFace.filter(vertex => !(vertex in [0, 1, 2])).length === 3){
                        outputTriangles.push(this.getVerticesIndicesAroundFace(i))
                    }

                }
                else {
                    outputTriangles.push(this.getVerticesIndicesAroundFace(i))
                }
            }
        }
        return outputTriangles
    }
}
