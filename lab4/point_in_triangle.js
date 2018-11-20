

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


function isInsideTriangle(ot1, ot2, ot3){
    // console.log("is inside triangle");
    // console.log(ot1, ot2, ot3)
    let t= ot1 > 0 && ot2 > 0 && ot3 > 0
    // console.log(t);
    return t
}


function isOnBoundaryOfTriangle(ot1, ot2, ot3){
    let sumOfSignFunctionOfOrientationTest = Math.sign(ot1) + Math.sign(ot2) + Math.sign(ot3);
    return sumOfSignFunctionOfOrientationTest === 2;
}


function isAVertexOfTriangle(ot1, ot2, ot3){
    let sumOfSignFunctionOfOrientationTest = Math.sign(ot1) + Math.sign(ot2) + Math.sign(ot3);
    return sumOfSignFunctionOfOrientationTest === 1;
}
