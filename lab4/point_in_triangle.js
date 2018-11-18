

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


function isInsideTriangle(vertexA, vertexB, vertexC, point){
    let triangleInCounterClockWiseOrder = getTriangleInCounterClockWiseOrder([vertexA, vertexB, vertexC]);
    return classifyPoint(point, triangleInCounterClockWiseOrder)
}



function classifyPoint(p, triangle) {
    let color, description;
    let ot1 = orientationTest(triangle[0], triangle[1], p);
    let ot2 = orientationTest(triangle[1], triangle[2], p);
    let ot3 = orientationTest(triangle[2], triangle[0], p);


    if (ot1 > 0 && ot2 > 0 && ot3 > 0) {
        color = colors[2];
        description = "Point is inside triangle";

    }
    else if (ot1 < 0 || ot2 < 0 || ot3 < 0) {
        color = colors[0];
        description = "Point lays outside triangle";
    } else {
        let sumOfSignFunctionOfOrientationTest = Math.sign(ot1) + Math.sign(ot2) + Math.sign(ot3);
        if (sumOfSignFunctionOfOrientationTest === 1) {
            color = colors[3];
            description = "Point lays on the vertice of triangle";
        }
        else if (sumOfSignFunctionOfOrientationTest === 2) {
            color = colors[1];
            description = "Point lays on the boundary of triangle (but isn't a vertex)";
        }
    }

    return {"color": color, "description": description};
}