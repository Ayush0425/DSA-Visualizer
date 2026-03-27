const visualizationContainer = document.getElementById('visualization-container');
const generateBtn = document.getElementById('generate-btn');
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const sizeSlider = document.getElementById('size-slider');
const sizeValue = document.getElementById('size-value');
const speedSelect = document.getElementById('speed-slider');
const algorithmSelect = document.getElementById('algorithm-select');
const customArrayInput = document.getElementById('custom-array-input');
const setCustomBtn = document.getElementById('set-custom-btn');

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
    },
    merge: {
        title: "Merge Sort",
        best: "O(n log n)",
        average: "O(n log n)",
        worst: "O(n log n)",
        space: "O(n)"
    },
    quick: {
        title: "Quick Sort",
        best: "O(n log n)",
        average: "O(n log n)",
        worst: "O(n²)",
        space: "O(log n)"
    },
    heap: {
        title: "Heap Sort",
        best: "O(n log n)",
        average: "O(n log n)",
        worst: "O(n log n)",
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

function generateArray(customValues = null) {
    if (isSorting) return;
    array = [];
    visualizationContainer.innerHTML = '';
    
    let size;
    if (customValues) {
        size = customValues.length;
    } else {
        size = parseInt(sizeSlider.value);
    }
    
    // Auto-scale up to 100% max if values are large
    let maxValue = customValues ? Math.max(...customValues, 100) : 100;
    
    for (let i = 0; i < size; i++) {
        let value;
        if (customValues) {
            let rawValue = customValues[i];
            // Scale and constrain height between 5% and 100%
            let scaledValue = (rawValue / maxValue) * 100;
            value = Math.floor(Math.max(5, Math.min(100, scaledValue)));
        } else {
            // Generate values between 5 and 100
            value = Math.floor(Math.random() * 96) + 5;
        }
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
    stopBtn.disabled = !sorting;
    sizeSlider.disabled = sorting;
    customArrayInput.disabled = sorting;
    setCustomBtn.disabled = sorting;
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
        } else if (algoName === 'merge' && window.mergeSort) {
            await window.mergeSort(bars, array, sleep, abortController.signal);
        } else if (algoName === 'quick' && window.quickSort) {
            await window.quickSort(bars, array, sleep, abortController.signal);
        } else if (algoName === 'heap' && window.heapSort) {
            await window.heapSort(bars, array, sleep, abortController.signal);
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
setCustomBtn.addEventListener('click', () => {
    if (isSorting) return;
    const inputVal = customArrayInput.value;
    if (!inputVal.trim()) return;
    
    // Parse comma separated values
    const parts = inputVal.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
    if (parts.length === 0) {
        alert("Please enter valid comma-separated numbers.");
        return;
    }
    
    if (abortController) abortController.abort();
    setUIState(false);
    generateArray(parts);
});

generateBtn.addEventListener('click', () => {
    if (abortController) {
        abortController.abort();
    }
    setUIState(false);
    customArrayInput.value = ''; // Clear custom input when generating random array
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
stopBtn.addEventListener('click', () => {
    if (isSorting && abortController) {
        abortController.abort();
    }
});

// On resize, we might want to regenerate to fix bar width anomalies
window.addEventListener('resize', () => {
    if (!isSorting) {
        generateArray();
    }
});

// Initialization
updateAlgorithmInfo();
generateArray();
