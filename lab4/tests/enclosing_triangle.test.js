const {computeEnclosingTriangle, isInsideTriangle} = require('../utils');

test('enclosing triangle doesn\'t have points it encloses on boundary', () => {
    let points = [
        {"x": 1, "y": 1, "z": 0},
        {"x": 2, "y": 2, "z": 0},
        {"x": 3, "y": 1, "z": 0},
    ];
    let enclosingTriangle = computeEnclosingTriangle(points);
    expect(isInsideTriangle(enclosingTriangle, points[0])).toBe(true);
    expect(isInsideTriangle(enclosingTriangle, points[1])).toBe(true);
    expect(isInsideTriangle(enclosingTriangle, points[2])).toBe(true);
});


test('enclosing triangle when point with max y coord is also most right', () => {
    let points = [
        {"x": 1, "y": 10, "z": 0},
        {"x": 2, "y": 2, "z": 0},
        {"x": 3, "y": 1, "z": 0},
    ];
    let enclosingTriangle = computeEnclosingTriangle(points);
    expect(isInsideTriangle(enclosingTriangle, points[0])).toBe(true);
    expect(isInsideTriangle(enclosingTriangle, points[1])).toBe(true);
    expect(isInsideTriangle(enclosingTriangle, points[2])).toBe(true);
});


test('enclosing triangle when point with max y coord is also most left', () => {
    let points = [
        {"x": 1, "y": 1, "z": 0},
        {"x": 2, "y": 2, "z": 0},
        {"x": 3, "y": 10, "z": 0},
    ];
    let enclosingTriangle = computeEnclosingTriangle(points);
    expect(isInsideTriangle(enclosingTriangle, points[0])).toBe(true);
    expect(isInsideTriangle(enclosingTriangle, points[1])).toBe(true);
    expect(isInsideTriangle(enclosingTriangle, points[2])).toBe(true);
});


test('enclosing triangle when all points lay in one horizontal line', () => {
    let points = [
        {"x": 1, "y": 1, "z": 0},
        {"x": 2, "y": 1, "z": 0},
        {"x": 3, "y": 1, "z": 0},
    ];
    let enclosingTriangle = computeEnclosingTriangle(points);
    // expect(isInsideTriangle(enclosingTriangle, points[0])).toBe(true);
    // expect(isInsideTriangle(enclosingTriangle, points[1])).toBe(true);
    // expect(isInsideTriangle(enclosingTriangle, points[2])).toBe(true);
});


test('enclosing triangle when all points lay in one vertical line', () => {
    let points = [
        {"x": 1, "y": 11, "z": 0},
        {"x": 1, "y": 12, "z": 0},
        {"x": 1, "y": 13, "z": 0},
    ];
    let enclosingTriangle = computeEnclosingTriangle(points);
    expect(isInsideTriangle(enclosingTriangle, points[0])).toBe(true);
    expect(isInsideTriangle(enclosingTriangle, points[1])).toBe(true);
    expect(isInsideTriangle(enclosingTriangle, points[2])).toBe(true);
});


test('enclosing triangle works for only one point', () => {
    let points = [
        {"x": 1, "y": 1, "z": 0},
    ];
    let enclosingTriangle = computeEnclosingTriangle(points);
    console.log(enclosingTriangle)
    expect(isInsideTriangle(enclosingTriangle, points[0])).toBe(true);
});

test('enclosing triangle works for only two points', () => {
    let points = [
        {"x": 1, "y": 1, "z": 0},
        {"x": 2, "y": 2, "z": 0},
    ];
    let enclosingTriangle = computeEnclosingTriangle(points);
    expect(isInsideTriangle(enclosingTriangle, points[0])).toBe(true);
    expect(isInsideTriangle(enclosingTriangle, points[1])).toBe(true);
});