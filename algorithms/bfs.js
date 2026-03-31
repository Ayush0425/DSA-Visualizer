function getUnvisitedNeighbors(node, grid) {
    const neighbors = [];
    const {col, row} = node;
    const ROW_COUNT = grid.length;
    const COL_COUNT = grid[0].length;
    
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (col < COL_COUNT - 1) neighbors.push(grid[row][col + 1]);
    if (row < ROW_COUNT - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    
    return neighbors.filter(neighbor => !neighbor.isWall);
}

window.bfs = function(grid, startNode, targetNode) {
    const visitedNodesInOrder = [];
    const queue = [];
    
    // Add distance and previous properties dynamically
    for (let row of grid) {
        for (let node of row) {
            node.isVisited = false;
            node.previousNode = null;
        }
    }
    
    queue.push(startNode);
    startNode.isVisited = true;
    
    while (queue.length > 0) {
        const closestNode = queue.shift();
        
        if (closestNode.isWall) continue;
        
        visitedNodesInOrder.push(closestNode);
        
        if (closestNode === targetNode) break;
        
        const unvisitedNeighbors = getUnvisitedNeighbors(closestNode, grid);
        for (const neighbor of unvisitedNeighbors) {
            if (!neighbor.isVisited) {
                neighbor.isVisited = true;
                neighbor.previousNode = closestNode;
                queue.push(neighbor);
            }
        }
    }
    
    // Calculate Shortest path
    const nodesInShortestPathOrder = [];
    let currentNode = targetNode;
    while (currentNode !== null) {
        nodesInShortestPathOrder.unshift(currentNode);
        currentNode = currentNode.previousNode;
    }
    
    // If target is unreachable, don't show a path back to start
    if (nodesInShortestPathOrder.length === 1 && nodesInShortestPathOrder[0] !== startNode) {
        return { visitedNodesInOrder, nodesInShortestPathOrder: [] };
    }
    
    return { visitedNodesInOrder, nodesInShortestPathOrder };
};
