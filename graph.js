const gridContainer = document.getElementById('grid-container');
const startBtn = document.getElementById('start-btn');
const clearBoardBtn = document.getElementById('clear-board-btn');
const clearPathBtn = document.getElementById('clear-path-btn');
const generateMazeBtn = document.getElementById('generate-maze-btn');
const algorithmSelect = document.getElementById('algorithm-select');
const algoTitle = document.getElementById('algo-title');
const algoDesc = document.getElementById('algo-desc');
const visitedCountEl = document.getElementById('visited-count');
const pathLengthEl = document.getElementById('path-length');

const ALGO_INFO = {
    bfs: {
        title: "Breadth-First Search (BFS)",
        desc: "BFS guarantees the shortest path on an unweighted grid by exploring nodes layer by layer."
    },
    dfs: {
        title: "Depth-First Search (DFS)",
        desc: "DFS explores as far as possible along each branch before backtracking. It does NOT guarantee the shortest path."
    },
    dijkstra: {
        title: "Dijkstra's Algorithm",
        desc: "Dijkstra's guarantees the shortest path. On an unweighted grid, it behaves identically to BFS."
    }
};

algorithmSelect.addEventListener('change', () => {
    const info = ALGO_INFO[algorithmSelect.value];
    algoTitle.textContent = info.title;
    algoDesc.textContent = info.desc;
});

const ROW_COUNT = 21;
const COL_COUNT = 51;

let START_NODE_ROW = 10;
let START_NODE_COL = 10;
let TARGET_NODE_ROW = 10;
let TARGET_NODE_COL = 40;

let grid = [];
let isMousePressed = false;
let isVisualizing = false;
let abortController = null;

function createGrid() {
    gridContainer.innerHTML = '';
    gridContainer.style.gridTemplateColumns = `repeat(${COL_COUNT}, 25px)`;
    gridContainer.style.gridTemplateRows = `repeat(${ROW_COUNT}, 25px)`;
    gridContainer.style.width = `${COL_COUNT * 25}px`;
    gridContainer.style.height = `${ROW_COUNT * 25}px`;
    
    grid = [];
    for (let row = 0; row < ROW_COUNT; row++) {
        let currentRow = [];
        for (let col = 0; col < COL_COUNT; col++) {
            const node = createNode(row, col);
            currentRow.push(node);
            gridContainer.appendChild(node.element);
        }
        grid.push(currentRow);
    }
}

function createNode(row, col) {
    const element = document.createElement('div');
    element.id = `node-${row}-${col}`;
    element.className = 'node';
    
    let isStart = row === START_NODE_ROW && col === START_NODE_COL;
    let isTarget = row === TARGET_NODE_ROW && col === TARGET_NODE_COL;
    
    if (isStart) element.classList.add('start');
    if (isTarget) element.classList.add('target');
    
    element.addEventListener('mousedown', () => handleMouseDown(row, col));
    element.addEventListener('mouseenter', () => handleMouseEnter(row, col));
    element.addEventListener('mouseup', () => handleMouseUp());
    
    // Prevent default drag behaviour to allow custom drag logic
    element.ondragstart = () => { return false; };
    
    return {
        row,
        col,
        isStart,
        isTarget,
        isWall: false,
        element
    };
}

function handleMouseDown(row, col) {
    if (isVisualizing) return;
    const node = grid[row][col];
    
    if (node.isStart || node.isTarget) return; // For now, simple wall drawing only

    isMousePressed = true;
    toggleWall(node);
}

function handleMouseEnter(row, col) {
    if (isVisualizing || !isMousePressed) return;
    const node = grid[row][col];
    
    if (node.isStart || node.isTarget) return;
    
    toggleWall(node);
}

function handleMouseUp() {
    isMousePressed = false;
}

function toggleWall(node) {
    node.isWall = !node.isWall;
    if (node.isWall) {
        node.element.classList.add('wall');
    } else {
        node.element.classList.remove('wall');
    }
}

// Global mouse up to catch drops outside the grid
document.body.addEventListener('mouseup', handleMouseUp);
gridContainer.addEventListener('mouseleave', handleMouseUp);

function clearBoard() {
    if (isVisualizing) {
        if (abortController) abortController.abort();
    }
    setUIState(false);
    resetStats();
    createGrid(); // Recreates entirely, resetting walls and paths
}

function clearPath() {
    if (isVisualizing) {
        if (abortController) abortController.abort();
    }
    setUIState(false);
    resetStats();
    
    for (let row = 0; row < ROW_COUNT; row++) {
        for (let col = 0; col < COL_COUNT; col++) {
            const node = grid[row][col];
            if (!node.isStart && !node.isTarget && !node.isWall) {
                node.element.className = 'node'; // reset to base
            } else if (node.isStart) {
                node.element.className = 'node start';
            } else if (node.isTarget) {
                node.element.className = 'node target';
            }
        }
    }
}

function generateRandomMaze() {
    if (isVisualizing) return;
    clearBoard();
    
    for (let row = 0; row < ROW_COUNT; row++) {
        for (let col = 0; col < COL_COUNT; col++) {
            if (row === START_NODE_ROW && col === START_NODE_COL) continue;
            if (row === TARGET_NODE_ROW && col === TARGET_NODE_COL) continue;
            
            if (Math.random() < 0.25) { // 25% chance of wall
                toggleWall(grid[row][col]);
            }
        }
    }
}

function setUIState(visualizing) {
    isVisualizing = visualizing;
    startBtn.disabled = visualizing;
    clearBoardBtn.disabled = visualizing;
    clearPathBtn.disabled = visualizing;
    generateMazeBtn.disabled = visualizing;
    algorithmSelect.disabled = visualizing;
}

function resetStats() {
    visitedCountEl.textContent = '0';
    pathLengthEl.textContent = '0';
}

function updateStats(visited, path) {
    visitedCountEl.textContent = visited;
    pathLengthEl.textContent = path;
}

async function sleep(ms, signal) {
    return new Promise((resolve, reject) => {
        const timeout = setTimeout(resolve, ms);
        if (signal) {
            signal.addEventListener('abort', () => {
                clearTimeout(timeout);
                reject(new DOMException('Aborted', 'AbortError'));
            });
        }
    });
}

function getNeighbors(node, grid) {
    const neighbors = [];
    const {col, row} = node;
    // 4 directions: up, right, down, left
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (col < COL_COUNT - 1) neighbors.push(grid[row][col + 1]);
    if (row < ROW_COUNT - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    
    // Filter out walls
    return neighbors.filter(neighbor => !neighbor.isWall);
}

// Main execution function called by buttons
async function startVisualization() {
    if (isVisualizing) return;
    clearPath();
    setUIState(true);
    
    if (abortController) abortController.abort();
    abortController = new AbortController();
    
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const targetNode = grid[TARGET_NODE_ROW][TARGET_NODE_COL];
    const algoName = algorithmSelect.value;
    
    let result = { visitedNodesInOrder: [], nodesInShortestPathOrder: [] };
    
    try {
        if (algoName === 'bfs' && window.bfs) {
            result = window.bfs(grid, startNode, targetNode);
        } else if (algoName === 'dfs' && window.dfs) {
            result = window.dfs(grid, startNode, targetNode);
        } else if (algoName === 'dijkstra' && window.dijkstra) {
            result = window.dijkstra(grid, startNode, targetNode);
        }
        
        await animateSearch(result.visitedNodesInOrder, result.nodesInShortestPathOrder, abortController.signal);
    } catch (e) {
        if (e.name === 'AbortError') {
            console.log("Visualization cancelled.");
        } else {
            console.error(e);
        }
    } finally {
        setUIState(false);
    }
}

async function animateSearch(visitedNodesInOrder, nodesInShortestPathOrder, signal) {
    for (let i = 0; i < visitedNodesInOrder.length; i++) {
        // Stop animating if aborted
        if(signal && signal.aborted) throw new DOMException('Aborted', 'AbortError');
        
        const node = visitedNodesInOrder[i];
        if (!node.isStart && !node.isTarget) {
            node.element.classList.add('visited');
        }
        visitedCountEl.textContent = i + 1;
        await sleep(10, signal); // Animation speed
    }
    
    if (nodesInShortestPathOrder && nodesInShortestPathOrder.length > 0) {
        await animateShortestPath(nodesInShortestPathOrder, signal);
    }
}

async function animateShortestPath(nodesInShortestPathOrder, signal) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
        if(signal && signal.aborted) throw new DOMException('Aborted', 'AbortError');
        
        const node = nodesInShortestPathOrder[i];
        if (!node.isStart && !node.isTarget) {
            node.element.classList.remove('visited'); // Usually replace visited with path color
            node.element.classList.add('path');
        }
        pathLengthEl.textContent = i + 1;
        await sleep(30, signal);
    }
}

// Event Listeners
startBtn.addEventListener('click', startVisualization);
clearBoardBtn.addEventListener('click', clearBoard);
clearPathBtn.addEventListener('click', clearPath);
generateMazeBtn.addEventListener('click', generateRandomMaze);

// Init
createGrid();
