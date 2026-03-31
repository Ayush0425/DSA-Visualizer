window.dfs = function(grid, startNode, targetNode) {
    const visitedNodesInOrder = [];
    const stack = [];
    
    // Reset state
    for (let row of grid) {
        for (let node of row) {
            node.isVisitedDFS = false;
            node.previousNodeDFS = null;
        }
    }
    
    stack.push(startNode);
    
    while (stack.length > 0) {
        const closestNode = stack.pop();
        
        if (closestNode.isWall) continue;
        if (closestNode.isVisitedDFS) continue;
        
        closestNode.isVisitedDFS = true;
        visitedNodesInOrder.push(closestNode);
        
        if (closestNode === targetNode) break;
        
        const unvisitedNeighbors = getUnvisitedNeighborsDFS(closestNode, grid);
        for (const neighbor of unvisitedNeighbors) {
            if (!neighbor.isVisitedDFS) {
                neighbor.previousNodeDFS = closestNode;
                stack.push(neighbor);
            }
        }
    }
    
    // Calculate Shortest path (note: DFS doesn't guarantee shortest)
    const nodesInShortestPathOrder = [];
    let currentNode = targetNode;
    while (currentNode !== null) {
        nodesInShortestPathOrder.unshift(currentNode);
        currentNode = currentNode.previousNodeDFS;
    }
    
    if (nodesInShortestPathOrder.length === 1 && nodesInShortestPathOrder[0] !== startNode) {
        return { visitedNodesInOrder, nodesInShortestPathOrder: [] };
    }
    
    return { visitedNodesInOrder, nodesInShortestPathOrder };
};

// Push neighbors in reverse order (bottom, left, top, right) 
// so when popped from stack they go up, right, down, left (standard)
function getUnvisitedNeighborsDFS(node, grid) {
    const neighbors = [];
    const {col, row} = node;
    const ROW_COUNT = grid.length;
    const COL_COUNT = grid[0].length;
    
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (col < COL_COUNT - 1) neighbors.push(grid[row][col + 1]);
    if (row < ROW_COUNT - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    
    // Reverse for stack processing order consistency
    neighbors.reverse();
    
    return neighbors.filter(neighbor => !neighbor.isWall);
}
