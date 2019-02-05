
var inputJSONs = [inputJSON1,inputJSON2] ;

var points = inputJSONs[0].points; // Default dat set
var circle_points = inputJSONs[0].circle_points;
var currentJSON = inputJSONs[0];

var colors = ["DeepPink", "BlueViolet", "DarkTurquoise", "DarkGoldenRod", 'Blue',];

// default styles
style = {
    curve: {
        width: 6,
        color: "#333"
    },
    line: {
        width: 1,
        color: "#000"
    },
    point: {
        radius: 4,
        width: 2,
        color: "Black",
        fill: "Black",
        arc1: 0,
        arc2: 2 * Math.PI
    },
    circle: {
        color:"black",
        fill: "none"
    }
}

context1 = canvas.getContext("2d");
context1.translate(320,320); // Translation so see full points
drawCanvas();

function orientationTest(segmentStart, segmentEnd, point){
    // < 0 for right
    // 0 on segment
    // > 0  for left
    return (segmentEnd.x - segmentStart.x) * (point.y - segmentStart.y) -
        (point.x - segmentStart.x) * (segmentEnd.y - segmentStart.y)
}


function getPointsInCounterClockwiseOrder(triangle){
    let ot = orientationTest(triangle[0], triangle[1], triangle[2]);
    if (ot < 0){
        return [triangle[0], triangle[2], triangle[1]]
    }
    return triangle;
}


//========= Auxiliary functions =========//
function drawCanvas() {
    context1.clearRect(-canvas.width / 2, -canvas.height / 2, 2 * canvas.width, 2 * canvas.height);
    document.getElementById("result").innerHTML = "";
    let circlePointsInCounterClockwiseOrder = getPointsInCounterClockwiseOrder(circle_points);
    drawPoints(context1, style, points, circlePointsInCounterClockwiseOrder);
    drawCircle(context1, style);

}

// Draws one point as circle
function drawPoint(ctx, style, p) {
    ctx.lineWidth = style.point.width;
    ctx.strokeStyle = style.point.color;
    ctx.fillStyle = style.point.fill;
    ctx.beginPath();
    ctx.arc(p.x, p.y, style.point.radius, style.point.arc1, style.point.arc2, true);
    ctx.fill();
    ctx.stroke();
}

// Draws the circle
function drawCircle(ctx, style) {
    ctx.lineWidth = style.circle.width;
    ctx.strokeStyle = style.circle.color;
    ctx.beginPath();
    ctx.arc(currentJSON.c.x, currentJSON.c.y, currentJSON.r, style.point.arc1, style.point.arc2, true);
    ctx.stroke();
}

// Draws all input points, with its classification color
function drawPoints(ctx, style, points, circlePointsInCounterClockwiseOrder) {
    for (let i = 0; i < points.length; i++) {

        let result = classifyPoint(points[i], circlePointsInCounterClockwiseOrder);
        style.point.fill = result.color;
        style.point.color = result.color;
        reportResult (result, i);
        drawPoint(ctx, style, points[i]);
    }
}

// Outputs the value of the intersection classification to the "results" HTML element
function reportResult(classification, index) {
    var text = "<font color='" + classification.color + "'>" + (index+1) + ":";
    text = text + classification.description;
    text = text + "</font><br>";
    document.getElementById("result").innerHTML = document.getElementById("result").innerHTML + text;
}

// Method to choose between the different data set
function changeDataSet() {
    var index = document.getElementById("dataset").value;
    // Change points and triangle
    points = inputJSONs[index].points; // Default dat set
    circle_points = inputJSONs[index].circle_points;
    currentJSON=inputJSONs[index];
    drawCanvas(); // Redraw
}


function classifyPoint(p, circle_points) {
    let color, description;

    let a = circle_points[0];
    let b = circle_points[1];
    let c = circle_points[2];
    let matrix = [
        [b.x - a.x, b.y - a.y, (b.x - a.x) * (b.x + a.x) + (b.y - a.y) * (b.y + a.y)],
        [c.x - a.x, c.y - a.y, (c.x - a.x) * (c.x + a.x) + (c.y - a.y) * (c.y + a.y)],
        [p.x - a.x, p.y - a.y, (p.x - a.x) * (p.x + a.x) + (p.y - a.y) * (p.y + a.y)]
    ];
    let determinant = math.det(matrix);

    if (determinant > 0){
        color = colors[0];
        description = "Point lies in the exterior of a circle";

    }
    else if (determinant === 0 ){
        color = colors[1];
        description = "Point lies in the circle";
    }else {
        color = colors[2];
        description = "Point lies in the interior of the circle"

    }
    return {"color": color, "description": description} ;
}
