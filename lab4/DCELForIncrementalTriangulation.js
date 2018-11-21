/**
 TODO Replace this by your own, correct, triangulation function
 Triangles should be return as arrays of array of indexes
 e.g., [[1,2,3],[2,3,4]] encodes two triangles, where the indices are relative to the array points
 **/



class DCELForIncrementalTriangulation extends DCEL{
    constructor(points){
        super(points);
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


        this.verticesList[0].edgeIndex = 0;
        this.verticesList[1].edgeIndex = 1;
        this.verticesList[2].edgeIndex = 2;

        this.fixedPoint = 3;
        this.fixedPointCoordinates = this.getVertexCoordinates(this.fixedPoint);
        this.addPointToFace(3, 0);
    }


    getEdgeThatDoesntPointToFixedVertexFromSetOfEdges(edgesIndices){
        for(let i=0; i < edgesIndices.length; i++){
            let edgeIndex = edgesIndices[i];
            if (this.getStartingVertexFromEdge(edgeIndex) !== this.fixedPoint && this.getEndingVertexFromEdge(edgeIndex) !== this.fixedPoint){
                return edgeIndex
            }
        }
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
        console.log('faces around fixed vertex', facesAroundFixedVertex);
        for(let i = 0; i < facesAroundFixedVertex.length; i++){
            let faceAroundFixedVertex = facesAroundFixedVertex[i];
            console.log("face around fixed vertex proceessed now", faceAroundFixedVertex)

            // check if point is already in this face
            let verticesIndicesAroundFace = this.getVerticesIndicesAroundFace(faceAroundFixedVertex);
            let verticesCoordinatesAroundFace = verticesIndicesAroundFace.map(this.getVertexCoordinates.bind(this));

            let triangle = getTriangleInCounterClockWiseOrder(verticesCoordinatesAroundFace);
            let vertex1 = triangle[0];
            let vertex2 = triangle[1];
            let vertex3 = triangle[2];

            console.log("check if cck", vertex1, vertex2, vertex3)
            let ot1 = orientationTest(vertex1, vertex2, newPointCoordinates);
            let ot2 = orientationTest(vertex2, vertex3, newPointCoordinates);
            let ot3 = orientationTest(vertex3, vertex1, newPointCoordinates);

            if (isInsideTriangleByDeterminants(ot1, ot2, ot3)){
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
                console.log("got to else")
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
        console.log("recurs by stabb ", edgeEnteredBy, faceIndex, newPointCoordinates)
        let verticesIndicesAroundFace = this.getVerticesIndicesAroundFace(faceIndex);
        let verticesCoordinatesAroundFace = verticesIndicesAroundFace.map(this.getVertexCoordinates.bind(this));

        let vertex1 = verticesCoordinatesAroundFace[0];
        let vertex2 = verticesCoordinatesAroundFace[1];
        let vertex3 = verticesCoordinatesAroundFace[2];
        let ot1 = orientationTest(vertex1, vertex2, newPointCoordinates);
        let ot2 = orientationTest(vertex2, vertex3, newPointCoordinates);
        let ot3 = orientationTest(vertex3, vertex1, newPointCoordinates);


        if (isInsideTrianglByDeterminants(ot1, ot2, ot3)){
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


    triangulate(){
        for(let i=4; i < 6; i++){
            try{
                this.addPointToTriangulatedSet(i)
            }
            catch(error){
                console.warn("problem with point no: ", i);
                console.warn(error);
                break;
            }
        }
        this.printEdges();
        this.printVertices();
        this.printFaces();

        // this.addPointToTriangulatedSet(6)
        // try{
        //     this.addPointToTriangulatedSet(4);
        //     this.addPointToTriangulatedSet(5);
        //     this.addPointToTriangulatedSet(6);
        //     // this.addPointToTriangulatedSet(7);
        //     // this.addPointToTriangulatedSet(8);
        // }
        // catch(error){
        //     console.warn(error);
        //     }
    }
}
