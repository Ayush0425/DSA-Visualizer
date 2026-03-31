function sortNodesByDistance(unvisitedNodes) {
    unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}

function updateUnvisitedNeighbors(node, grid) {
    const unvisitedNeighbors = getUnvisitedNeighbors(node, grid); // Re-uses from bfs.js
    for (const neighbor of unvisitedNeighbors) {
        neighbor.distance = node.distance + 1;
        neighbor.previousNode = node;
    }
}

window.dijkstra = function(grid, startNode, targetNode) {
    const visitedNodesInOrder = [];
    const unvisitedNodes = []; // Using a basic array sort instead of a true Priority Queue for simplicity
    
    for (let row of grid) {
        for (let node of row) {
            node.distance = Infinity;
            node.isVisited = false;
            node.previousNode = null;
            unvisitedNodes.push(node);
        }
    }
    
    startNode.distance = 0;
    
    while (!!unvisitedNodes.length) {
        sortNodesByDistance(unvisitedNodes);
        const closestNode = unvisitedNodes.shift();
        
        // If trapped (all remaining nodes are at Infinity distance), break
        if (closestNode.distance === Infinity) return { visitedNodesInOrder, nodesInShortestPathOrder: [] };
        
        if (closestNode.isWall) continue;
        
        closestNode.isVisited = true;
        visitedNodesInOrder.push(closestNode);
        
        if (closestNode === targetNode) break;
        
        updateUnvisitedNeighbors(closestNode, grid);
    }
    
    // Calculate Shortest path
    const nodesInShortestPathOrder = [];
    let currentNode = targetNode;
    while (currentNode !== null) {
        nodesInShortestPathOrder.unshift(currentNode);
        currentNode = currentNode.previousNode;
    }
    
    if (nodesInShortestPathOrder.length === 1 && nodesInShortestPathOrder[0] !== startNode) {
        return { visitedNodesInOrder, nodesInShortestPathOrder: [] };
    }
    
    return { visitedNodesInOrder, nodesInShortestPathOrder };
};
