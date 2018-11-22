

function getTriangulationResults(points) {
    // point 1, 2, 3 are for enclosing triangle

    let DCEL = new DCELForIncrementalTriangulation(points);
    DCEL.triangulate();

    let fixedPointIndex = DCEL.getFixedPointIndex();

    return {
        'triangles': DCEL.getOutputTriangles(false),
        'fixedPointIndex': fixedPointIndex,
    }
}
