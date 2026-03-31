window.heapSort = async function(bars, arr, sleep, signal, trackCompare, trackSwap) {
    const n = arr.length;

    // Build max heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        await heapify(bars, arr, n, i, sleep, signal, trackCompare, trackSwap);
    }

    // Extract elements from heap one by one
    for (let i = n - 1; i > 0; i--) {
        // Move current root to end
        bars[0].classList.add('swap');
        bars[i].classList.add('swap');
        
        if (trackSwap) trackSwap();
        
        let temp = arr[0];
        arr[0] = arr[i];
        arr[i] = temp;
        
        bars[0].style.height = `${arr[0]}%`;
        bars[i].style.height = `${arr[i]}%`;
        await sleep(signal);
        
        bars[0].classList.remove('swap');
        bars[i].classList.remove('swap');
        
        // Mark as sorted
        bars[i].className = 'bar sorted';

        // call max heapify on the reduced heap
        await heapify(bars, arr, i, 0, sleep, signal, trackCompare, trackSwap);
    }
    // Mark the last remaining element as sorted
    bars[0].className = 'bar sorted';
};

async function heapify(bars, arr, n, i, sleep, signal, trackCompare, trackSwap) {
    let largest = i; // Initialize largest as root
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    bars[largest].classList.add('compare');
    if (left < n) {
        bars[left].classList.add('compare');
        if (trackCompare) trackCompare();
    }
    if (right < n) {
        bars[right].classList.add('compare');
        if (trackCompare) trackCompare();
    }
    await sleep(signal);

    if (left < n && arr[left] > arr[largest]) {
        largest = left;
    }

    if (right < n && arr[right] > arr[largest]) {
        largest = right;
    }

    bars[i].classList.remove('compare');
    if (left < n) bars[left].classList.remove('compare');
    if (right < n) bars[right].classList.remove('compare');

    if (largest !== i) {
        bars[i].classList.add('swap');
        bars[largest].classList.add('swap');
        
        if (trackSwap) trackSwap();
        
        let swap = arr[i];
        arr[i] = arr[largest];
        arr[largest] = swap;
        
        bars[i].style.height = `${arr[i]}%`;
        bars[largest].style.height = `${arr[largest]}%`;
        await sleep(signal);
        
        bars[i].classList.remove('swap');
        bars[largest].classList.remove('swap');
        
        // Recursively heapify the affected sub-tree
        await heapify(bars, arr, n, largest, sleep, signal, trackCompare, trackSwap);
    }
}
