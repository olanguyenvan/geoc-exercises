const {isInsideTriangle} = require('../utils');

test('test if returns true for point being inside', () => {
    let triangle = [
        {"x": 0, "y": 0},
        {"x": 4, "y": 0},
        {"x": 2, "y": 2},
    ];
    let pointInside = {
        "x": 2, "y": 1
    };

    expect(isInsideTriangle(triangle, pointInside)).toBe(true);
});


test('test if returns false for point being on boundary of triangle', () => {
    let triangle = [
        {"x": 0, "y": 0},
        {"x": 4, "y": 0},
        {"x": 2, "y": 2},
    ];
    let pointOnBoundary = {
        "x": 2, "y": 2
    };

    expect(isInsideTriangle(triangle, pointOnBoundary)).toBe(false);
});


test('test if returns false for point being the vertex of triangle', () => {
    let triangle = [
        {"x": 1, "y": 1},
        {"x": 3, "y": 1},
        {"x": 2, "y": 2},
    ];

    expect(isInsideTriangle(triangle, triangle[0])).toBe(false);
    expect(isInsideTriangle(triangle, triangle[1])).toBe(false);
    expect(isInsideTriangle(triangle, triangle[2])).toBe(false);
});


test('test if works for triangle given not in counterclockwise order', () => {
    let triangle = [
        {"x": 0, "y": 0},
        {"x": 2, "y": 2},
        {"x": 4, "y": 0},
    ];
    let pointInside = {
        "x": 2, "y": 1
    };

    expect(isInsideTriangle(triangle, pointInside)).toBe(true);
});
