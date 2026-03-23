const visualizationContainer = document.getElementById('visualization-container');
const generateBtn = document.getElementById('generate-btn');
const startBtn = document.getElementById('start-btn');
const sizeSlider = document.getElementById('size-slider');
const sizeValue = document.getElementById('size-value');
const speedSelect = document.getElementById('speed-slider');
const algorithmSelect = document.getElementById('algorithm-select');

// Info Panel elements
const infoPanel = {
    title: document.getElementById('algo-title'),
    best: document.getElementById('best-time'),
    average: document.getElementById('average-time'),
    worst: document.getElementById('worst-time'),
    space: document.getElementById('worst-space')
};

const ALGO_INFO = {
    bubble: {
        title: "Bubble Sort",
        best: "O(n)",
        average: "O(n²)",
        worst: "O(n²)",
        space: "O(1)"
    },
    selection: {
        title: "Selection Sort",
        best: "O(n²)",
        average: "O(n²)",
        worst: "O(n²)",
        space: "O(1)"
    },
    insertion: {
        title: "Insertion Sort",
        best: "O(n)",
        average: "O(n²)",
        worst: "O(n²)",
        space: "O(1)"
    }
};

let array = [];
let isSorting = false;
let abortController = null;

function updateAlgorithmInfo() {
    const algo = ALGO_INFO[algorithmSelect.value];
    infoPanel.title.textContent = algo.title;
    infoPanel.best.textContent = algo.best;
    infoPanel.average.textContent = algo.average;
    infoPanel.worst.textContent = algo.worst;
    infoPanel.space.textContent = algo.space;
}

function generateArray() {
    if (isSorting) return;
    array = [];
    visualizationContainer.innerHTML = '';
    const size = parseInt(sizeSlider.value);
    
    for (let i = 0; i < size; i++) {
        // Generate values between 5 and 100
        const value = Math.floor(Math.random() * 96) + 5;
        array.push(value);
        
        const bar = document.createElement('div');
        bar.classList.add('bar');
        bar.style.height = `${value}%`;

        // Calculate a nice width based on the number of elements
        const availableWidth = visualizationContainer.clientWidth - (size * 3) - 40; // Approx 3px gap, 40px padding
        let calculatedWidth = Math.max(2, Math.floor(availableWidth / size));
        if (calculatedWidth > 30) calculatedWidth = 30; // Max width cap
        
        bar.style.width = `${calculatedWidth}px`;
        
        visualizationContainer.appendChild(bar);
    }
}

function setUIState(sorting) {
    isSorting = sorting;
    generateBtn.disabled = sorting;
    startBtn.disabled = sorting;
    sizeSlider.disabled = sorting;
    // speedSelect can remain enabled so user can change speed during sorting!
    algorithmSelect.disabled = sorting;
}

// Utility for waiting to create animations
async function sleep(signal) {
    const speedMultiplier = parseFloat(speedSelect.value);
    const baseDelay = 150; // Delay base
    
    const delay = Math.max(5, baseDelay / Math.pow(speedMultiplier, 1.5));
    
    return new Promise((resolve, reject) => {
        const timeout = setTimeout(resolve, delay);
        if (signal) {
            signal.addEventListener('abort', () => {
                clearTimeout(timeout);
                reject(new DOMException('Aborted', 'AbortError'));
            });
        }
    });
}

function getBars() {
    return document.querySelectorAll('.bar');
}

async function startSorting() {
    if (isSorting) return;
    setUIState(true);
    
    if (abortController) {
        abortController.abort();
    }
    abortController = new AbortController();
    
    const algoName = algorithmSelect.value;
    const bars = getBars();
    
    try {
        if (algoName === 'bubble' && window.bubbleSort) {
            await window.bubbleSort(bars, array, sleep, abortController.signal);
        } else if (algoName === 'selection' && window.selectionSort) {
            await window.selectionSort(bars, array, sleep, abortController.signal);
        } else if (algoName === 'insertion' && window.insertionSort) {
            await window.insertionSort(bars, array, sleep, abortController.signal);
        }
        
        // Final sorted visual flourish
        for (let i = 0; i < bars.length; i++) {
            bars[i].className = 'bar sorted';
            await sleep(abortController.signal); // small staggered delay
        }
    } catch (e) {
        if (e.name === 'AbortError') {
            console.log('Sorting animation canceled due to restart or generated array.');
        } else {
            console.error("Sorting error:", e);
        }
    } finally {
        setUIState(false);
    }
}

// Event Listeners
generateBtn.addEventListener('click', () => {
    if (abortController) {
        abortController.abort();
    }
    setUIState(false);
    generateArray();
});

sizeSlider.addEventListener('input', (e) => {
    sizeValue.textContent = e.target.value;
    if (abortController) abortController.abort();
    setUIState(false);
    generateArray();
});

algorithmSelect.addEventListener('change', updateAlgorithmInfo);
startBtn.addEventListener('click', startSorting);

// On resize, we might want to regenerate to fix bar width anomalies
window.addEventListener('resize', () => {
    if (!isSorting) {
        generateArray();
    }
});

// Initialization
updateAlgorithmInfo();
generateArray();
