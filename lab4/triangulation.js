/**
 TODO Replace this by your own, correct, triangulation function
 Triangles should be return as arrays of array of indexes
 e.g., [[1,2,3],[2,3,4]] encodes two triangles, where the indices are relative to the array points
**/



class DCELStructure{
    constructor(points){
        // fixed point will be always 4th point
        let numberOfPoints = points.length;
        this.facesList = [numberOfPoints - 2];
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

        this.verticesList = new Array(numberOfPoints);
        for(let i = 0; i < points.length; i++){
            this.verticesList[i] = {pointCoordinates: points[i]}
        }
        this.verticesList[0].edgeIndex = 0;
        this.verticesList[1].edgeIndex = 1;
        this.verticesList[2].edgeIndex = 2;

        this.fixedPoint = 3;
        this.fixedPointCoordinates = this.getVertexCoordinates(this.fixedPoint);
        this.addPointToFace(3, 0);

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

    getEdgeThatDoesntPointToFixedVertexFromSetOfEdges(edgesIndices){
        for(let i=0; i < edgesIndices.length; i++){
            let edgeIndex = edgesIndices[i];
            if (this.getStartingVertexFromEdge(edgeIndex) !== this.fixedPoint && this.getEndingVertexFromEdge(edgeIndex) !== this.fixedPoint){
                return edgeIndex
            }
        }
    }


    getVertexCoordinates(vertexIndex){
        return this.verticesList[vertexIndex].pointCoordinates
    }

    addPointOnBoundary(edgeToSplit, newPointIndex){
        let startVertex = this.getStartingVertexFromEdge(edgeToSplit);
        let endVertex = this.getEndingVertexFromEdge(edgeToSplit);

        let nextEdge = this.getNextEdge(edgeToSplit);
        let beforeEdge = this.getBeforeEdge(edgeToSplit);


        let leftFace = this.getLeftFace(edgeToSplit);
        let rightFace = this.getRightFace(edgeToSplit);

        let thirdEdgeInLeftFace = this.getEdgesEnclosingFaceInCounterClockwiseOrder(leftFace).filter(
            edge => edge !== edgeToSplit && edge !== beforeEdge
        )[0];
        let thirdEdgeInRightFace = this.getEdgesEnclosingFaceInCounterClockwiseOrder(rightFace).filter(
            edge => edge !== edgeToSplit && edge !== nextEdge
        )[0];


        let verticesAroundLeftFace = this.getVerticesIndicesAroundFace(leftFace);
        let verticesAroundRightFace = this.getVerticesIndicesAroundFace(rightFace);

        let thirdVertexFromLeftFace = verticesAroundLeftFace.filter(
            vertex => vertex !== startVertex && vertex !== endVertex
        )[0];
        let thirdVertexFromRightFace = verticesAroundRightFace.filter(
            vertex => vertex !== startVertex && vertex !== endVertex
        )[0];

        let edgesCountBeforeAdding = this.edgesCount;
        let facesCountBeforeAdding = this.facesCount;

        this.edgesCount += 3;
        this.facesCount += 2;

        this.verticesList[newPointIndex].edgeIndex = edgesCountBeforeAdding;
        this.facesList[facesCountBeforeAdding] = edgesCountBeforeAdding + 2;
        this.facesList[facesCountBeforeAdding + 1] = edgesCountBeforeAdding + 2;

        this.edgesList[edgesCountBeforeAdding] = {
                'vertexStart': newPointIndex,
                'vertexEnd': thirdVertexFromLeftFace,
                'faceLeft': facesCountBeforeAdding,
                'faceRight': leftFace,
                'edgeNext': thirdEdgeInLeftFace,
                'edgeBefore': edgesCountBeforeAdding + 2,
        };


        this.edgesList[edgesCountBeforeAdding + 1] = {
                'vertexStart': newPointIndex,
                'vertexEnd': thirdVertexFromRightFace,
                'faceLeft': leftFace,
                'faceRight': facesCountBeforeAdding + 1,
                'edgeNext': thirdEdgeInRightFace,
                'edgeBefore': edgeToSplit,
        };

        this.edgesList[edgesCountBeforeAdding + 2] = {
            'vertexStart': startVertex,
            'vertexEnd': newPointIndex,
            'faceLeft': facesCountBeforeAdding,
            'faceRight': facesCountBeforeAdding + 1,
            'edgeNext': edgesCountBeforeAdding + 1,
            'edgeBefore': beforeEdge,
        };

        this.edgesList[edgeToSplit].vertexStart = newPointIndex;
        this.edgesList[edgeToSplit].edgeBefore = edgesCountBeforeAdding;

        this.replaceFaceIndexWithNewOne(beforeEdge, leftFace, facesCountBeforeAdding);
        this.replaceFaceIndexWithNewOne(thirdEdgeInRightFace, rightFace, facesCountBeforeAdding + 1);
    }

    addPointToTriangulatedSet(newPointIndex){
        let newPointCoordinates = this.getVertexCoordinates(newPointIndex);
        let facesAroundFixedVertex = this.getFacesAroundVertex(this.fixedPoint);

        for(let i = 0; i < facesAroundFixedVertex.length; i++){
            let faceAroundFixedVertex = facesAroundFixedVertex[i];
            // check if point is already in this face
            let verticesIndicesAroundFace = this.getVerticesIndicesAroundFace(faceAroundFixedVertex);
            let verticesCoordinatesAroundFace = verticesIndicesAroundFace.map(this.getVertexCoordinates.bind(this));

            let triangle = getTriangleInCounterClockWiseOrder(verticesCoordinatesAroundFace);
            let vertex1 = triangle[0];
            let vertex2 = triangle[1];
            let vertex3 = triangle[2];
            let ot1 = orientationTest(vertex1, vertex2, newPointCoordinates);
            let ot2 = orientationTest(vertex2, vertex3, newPointCoordinates);
            let ot3 = orientationTest(vertex3, vertex1, newPointCoordinates);

            if (isInsideTriangle(ot1, ot2, ot3)){
                this.addPointToFace(newPointIndex, faceAroundFixedVertex);
                break;
            }

            // let pointOnBoundaryOfTriangle = isOnBoundaryOfTriangle(verticesCoordinatesAroundFace, newPointCoordinates);
            else if (isOnBoundaryOfTriangle(ot1, ot2, ot3)) {
                let edgesAroundFace = this.getEdgesEnclosingFaceInCounterClockwiseOrder(faceAroundFixedVertex);
                let edgeToSplit = edgesAroundFace.filter(
                    edge => orientationTest(this.getVertexCoordinates(this.getStartingVertexFromEdge(edge)),
                        this.getVertexCoordinates(this.getEndingVertexFromEdge(edge)), newPointCoordinates) === 0
                )[0];
                this.addPointOnBoundary(edgeToSplit, newPointIndex)
            }

            else {
                let edgesAroundFace = this.getEdgesEnclosingFaceInCounterClockwiseOrder(faceAroundFixedVertex);
                let edgeNotPointingToFixedVertex = this.getEdgeThatDoesntPointToFixedVertexFromSetOfEdges(edgesAroundFace);

                let startVertexCoordinates = this.getVertexCoordinates(this.getStartingVertexFromEdge(edgeNotPointingToFixedVertex));
                let endVertexCoordinates = this.getVertexCoordinates(this.getEndingVertexFromEdge(edgeNotPointingToFixedVertex));

                let a = orientationTest(startVertexCoordinates, endVertexCoordinates, this.fixedPointCoordinates);
                let b = orientationTest(startVertexCoordinates, endVertexCoordinates, newPointCoordinates);
                let c = orientationTest(this.fixedPointCoordinates, newPointCoordinates, startVertexCoordinates);
                let d = orientationTest(this.fixedPointCoordinates, newPointCoordinates, endVertexCoordinates);

                if (a * b < 0 && c * d < 0){
                    let nextFaceToSearch = this.getOtherFaceFromEdge(edgeNotPointingToFixedVertex, faceAroundFixedVertex);
                    let foundFace =  this.recursivelySearchByStabbingLine(edgeNotPointingToFixedVertex, nextFaceToSearch, newPointCoordinates);
                    this.addPointToFace(newPointIndex, foundFace);
                    break;
                }
            }
        }
    }

    recursivelySearchByStabbingLine(edgeEnteredBy, faceIndex, newPointCoordinates){
        let verticesIndicesAroundFace = this.getVerticesIndicesAroundFace(faceIndex);
        let verticesCoordinatesAroundFace = verticesIndicesAroundFace.map(this.getVertexCoordinates.bind(this));

        let vertex1 = verticesCoordinatesAroundFace[0];
        let vertex2 = verticesCoordinatesAroundFace[1];
        let vertex3 = verticesCoordinatesAroundFace[2];
        let ot1 = orientationTest(vertex1, vertex2, newPointCoordinates);
        let ot2 = orientationTest(vertex2, vertex3, newPointCoordinates);
        let ot3 = orientationTest(vertex3, vertex1, newPointCoordinates);

        // let pointInTriangle =  isInsideTriangle(ot1, ot2, ot3);;

        if (isInsideTriangle(ot1, ot2, ot3)){
            return faceIndex
        }

        let pointOnBoundaryOfTriangle = isOnBoundaryOfTriangle(verticesCoordinatesAroundFace, newPointCoordinates);
        if (pointOnBoundaryOfTriangle) {
            console.log("\n\n\n\n\n\n!!!!!!!!!!!!!!!!!point on boundary", edgeEnteredBy, faceIndex, newPointCoordinates)
            // return;
        }


        let edgesAroundFace = this.getEdgesEnclosingFaceInCounterClockwiseOrder(faceIndex);
        let edgesToCheckWhetherTheyCrossWithStabbingLine = edgesAroundFace.filter(edge => edge !== edgeEnteredBy);

        for (let i = 0; i < edgesToCheckWhetherTheyCrossWithStabbingLine.length; i++){
            let edgeToCheck = edgesToCheckWhetherTheyCrossWithStabbingLine[i];
            let startVertexCoordinates = this.getVertexCoordinates(this.getStartingVertexFromEdge(edgeToCheck));
            let endVertexCoordinates = this.getVertexCoordinates(this.getEndingVertexFromEdge(edgeToCheck));
            let a = orientationTest(startVertexCoordinates, endVertexCoordinates, this.fixedPointCoordinates);
            let b = orientationTest(startVertexCoordinates, endVertexCoordinates, newPointCoordinates);
            let c = orientationTest(this.fixedPointCoordinates, newPointCoordinates, startVertexCoordinates);
            let d = orientationTest(this.fixedPointCoordinates, newPointCoordinates, endVertexCoordinates);

            if (a * b < 0 && c * d < 0){
                let nextFaceToSearch = this.getOtherFaceFromEdge(edgeToCheck, faceIndex);
                return this.recursivelySearchByStabbingLine(edgeToCheck, nextFaceToSearch, newPointCoordinates);
            }
        }
    }

    getOtherFaceFromEdge(edgeIndex, firstFace){
        let rightFace = this.getRightFace(edgeIndex);
        if (rightFace === firstFace){
            return this.getLeftFace(edgeIndex);
        }
        return rightFace;
    }


    addPointToFace(newPointIndex, faceIndex){
        faceIndex = parseInt(faceIndex); //WTF
        let edgesCountBeforeAdding = this.edgesCount;
        let facesCountBeforeAdding = this.facesCount;

        this.verticesList[newPointIndex].edgeIndex = edgesCountBeforeAdding; //add information about edge
        let edgesEnclosingFace = this.getEdgesEnclosingFaceInCounterClockwiseOrder(faceIndex);
        this.facesList[faceIndex] = edgesCountBeforeAdding;
        this.facesList[facesCountBeforeAdding] = edgesCountBeforeAdding + 1; //create two new faces
        this.facesList[facesCountBeforeAdding + 1] = edgesCountBeforeAdding + 2;


        this.edgesList[edgesCountBeforeAdding] = {
            'vertexStart': newPointIndex,
            'vertexEnd': this.getStartingVertexFromEdgeWithRespectToFaceBeingOnLeft(
                edgesEnclosingFace[0], faceIndex),
            'faceRight': faceIndex,
            'faceLeft': facesCountBeforeAdding,
            'edgeNext': edgesEnclosingFace[2],
            'edgeBefore': edgesCountBeforeAdding + 1,
        };

        this.replaceFaceIndexWithNewOne(edgesEnclosingFace[0], faceIndex, facesCountBeforeAdding);
        this.replaceEdgeWithNewOne(edgesEnclosingFace[0], edgesEnclosingFace[2], edgesCountBeforeAdding);


        this.edgesList[edgesCountBeforeAdding + 1] = {
            'vertexStart': newPointIndex,
            'vertexEnd': this.getStartingVertexFromEdgeWithRespectToFaceBeingOnLeft(
                edgesEnclosingFace[1], faceIndex),
            'faceRight': facesCountBeforeAdding,
            'faceLeft': facesCountBeforeAdding + 1,
            'edgeNext': edgesEnclosingFace[0],
            'edgeBefore': edgesCountBeforeAdding + 2,
        };

        this.replaceFaceIndexWithNewOne(edgesEnclosingFace[1], faceIndex, facesCountBeforeAdding + 1);
        this.replaceEdgeWithNewOne(edgesEnclosingFace[1], edgesEnclosingFace[0], edgesCountBeforeAdding + 1);

        this.edgesList[edgesCountBeforeAdding + 2] = {
            'vertexStart': newPointIndex,
            'vertexEnd': this.getStartingVertexFromEdgeWithRespectToFaceBeingOnLeft(
                edgesEnclosingFace[2], faceIndex),
            'faceLeft': faceIndex,
            'faceRight': facesCountBeforeAdding + 1,
            'edgeNext': edgesEnclosingFace[1],
            'edgeBefore': edgesCountBeforeAdding,
        };

        this.replaceEdgeWithNewOne(edgesEnclosingFace[2], edgesEnclosingFace[1], edgesCountBeforeAdding + 2);

        this.edgesCount += 3;
        this.facesCount += 2;
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


    triangulate(){
        for(let i=4; i < 4; i++){
            try{
                this.addPointToTriangulatedSet(i)
            }
            catch(error){
                console.warn("problem with point no: ", i);
                console.warn(error);
                break;
            }
        }
        try{
            this.addPointToTriangulatedSet(4);
            this.addPointToTriangulatedSet(5);
            this.addPointToTriangulatedSet(6);
            // this.addPointToTriangulatedSet(7);
            // this.addPointToTriangulatedSet(8);
        }
        catch(error){
            console.warn(error);
            }
    }
}


function computeTriangulation(points) {
    // point 1, 2, 3 are for enclosing triangle

    let DCEL = new DCELStructure(points);
    DCEL.triangulate();

    DCEL.printEdges();
    DCEL.printVertices();
    DCEL.printFaces();

    return DCEL.getOutputTriangles(false);
}
