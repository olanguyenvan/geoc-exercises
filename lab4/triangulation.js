

function computeTriangulation(points) {
    // point 1, 2, 3 are for enclosing triangle

    let DCEL = new DCELForIncrementalTriangulation(points);
    DCEL.triangulate();

    // DCEL.printEdges();
    // DCEL.printVertices();
    // DCEL.printFaces();

    return DCEL.getOutputTriangles(false);
}
