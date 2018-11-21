

function orientationTest(segmentStart, segmentEnd, point){
    // < 0 for right
    // 0 on segment
    // > 0  for left
    return (segmentEnd.x - segmentStart.x) * (point.y - segmentStart.y) -
        (point.x - segmentStart.x) * (segmentEnd.y - segmentStart.y)
}


function getTriangleInCounterClockWiseOrder(triangle){
    let ot = orientationTest(triangle[0], triangle[1], triangle[2]);
    if (ot < 0){
        return [triangle[0], triangle[2], triangle[1]]
    }
    return triangle;
}


function isInsideTriangleByDeterminants(ot1, ot2, ot3){
    return ot1 > 0 && ot2 > 0 && ot3 > 0
}

function isInsideTriangle(triangle, pointCoordinates){
    let triangleInCounterClockwiseOrder = getTriangleInCounterClockWiseOrder(triangle);
    let vertex1 = triangleInCounterClockwiseOrder[0];
    let vertex2 = triangleInCounterClockwiseOrder[1];
    let vertex3 = triangleInCounterClockwiseOrder[2];

    let ot1 = orientationTest(vertex1, vertex2, pointCoordinates);
    let ot2 = orientationTest(vertex2, vertex3, pointCoordinates);
    let ot3 = orientationTest(vertex3, vertex1, pointCoordinates);
    return ot1 > 0 && ot2 > 0 && ot3 > 0;
}


function isOnBoundaryOfTriangle(ot1, ot2, ot3){
    let sumOfSignFunctionOfOrientationTest = Math.sign(ot1) + Math.sign(ot2) + Math.sign(ot3);
    return sumOfSignFunctionOfOrientationTest === 2;
}


function isAVertexOfTriangle(ot1, ot2, ot3){
    let sumOfSignFunctionOfOrientationTest = Math.sign(ot1) + Math.sign(ot2) + Math.sign(ot3);
    return sumOfSignFunctionOfOrientationTest === 1;
}

function computeExtremePoints(pointOfView, points){
    let left = points[0];
    let right = points[0];

    for (let i = 1; i < points.length; i++){
        let currentPoint = points[i];
        if (orientationTest(pointOfView, left, currentPoint) > 0){
            left = currentPoint;
        }
        else if(orientationTest(pointOfView, right, currentPoint) < 0){
            right = currentPoint;
        }
    }
    return [left, right]
}

function computeEnclosingTriangle(pointsToEnclose){
    let pointWithMaximumYCoordinate = pointsToEnclose[0];
    let pointWithMinimumYCoordinate = pointsToEnclose[0];

    for(let i = 0; i < pointsToEnclose.length; i++){
        if (pointsToEnclose[i].y > pointWithMaximumYCoordinate.y){
            pointWithMaximumYCoordinate = pointsToEnclose[i]
        }
        if (pointsToEnclose[i].y < pointWithMinimumYCoordinate.y){
            pointWithMinimumYCoordinate = pointsToEnclose[i]
        }
    }

    let toAddInY = pointWithMaximumYCoordinate.y - pointWithMinimumYCoordinate.y;
    if (toAddInY === 0) {
        toAddInY = 1;
    }

    let firstVertexEnclosingTriangle = {
        'x': pointWithMaximumYCoordinate.x,
        'y': pointWithMaximumYCoordinate.y + toAddInY,
        'z': pointWithMaximumYCoordinate.z
    };


    let extremePointsVisibleFromFirstVertex = computeExtremePoints(firstVertexEnclosingTriangle, pointsToEnclose);
    let mostLeftPoint = extremePointsVisibleFromFirstVertex[0];
    let mostRightPoint = extremePointsVisibleFromFirstVertex[1];

    let secondVertexEnclosingTriangle, thirdVertexEnclosingTriangle;
    if(mostLeftPoint.x === firstVertexEnclosingTriangle.x){
        secondVertexEnclosingTriangle = {
            "x": mostLeftPoint.x + 1, "y": pointWithMinimumYCoordinate.y - 1, 'z': 0
        }
    }
    else {
        let leftTangentSlope = (firstVertexEnclosingTriangle.y - mostLeftPoint.y) / (firstVertexEnclosingTriangle.x - mostLeftPoint.x);
        let leftBCoefficient = firstVertexEnclosingTriangle.y - leftTangentSlope * pointWithMaximumYCoordinate.x;
        let leftTangentXCoordinate = (pointWithMinimumYCoordinate.y - leftBCoefficient)/ leftTangentSlope;
        secondVertexEnclosingTriangle = {
            'x': leftTangentXCoordinate + 1, 'y': pointWithMinimumYCoordinate.y + 0.3 * leftTangentSlope, 'z': 0
        }
    }

    if(mostRightPoint.x === firstVertexEnclosingTriangle.x){
        thirdVertexEnclosingTriangle = {
            "x": mostRightPoint.x - 1, "y": pointWithMinimumYCoordinate.y - 1, "z": 0
        };
    }
    else {
        let rightTangentSlope = (firstVertexEnclosingTriangle.y - mostRightPoint.y) / (firstVertexEnclosingTriangle.x - mostRightPoint.x);
        let rightbCoefficient = firstVertexEnclosingTriangle.y - rightTangentSlope * pointWithMaximumYCoordinate.x;
        let rightTangentXCoordinate = (pointWithMinimumYCoordinate.y - rightbCoefficient)/ rightTangentSlope;
        thirdVertexEnclosingTriangle = {'x': rightTangentXCoordinate - 1, 'y': pointWithMinimumYCoordinate.y - 0.3 * rightTangentSlope, 'z': 0}
    }

    let t = [
        firstVertexEnclosingTriangle,
        thirdVertexEnclosingTriangle,
        secondVertexEnclosingTriangle,
    ];

    return t;
}


module.exports = {computeEnclosingTriangle, isInsideTriangle};