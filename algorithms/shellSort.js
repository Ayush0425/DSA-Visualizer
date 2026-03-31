/**
 * Shell Sort Implementation for Visualizer
 * @param {HTMLElement[]} bars - DOM elements representing the bars
 * @param {number[]} arr - Original array values
 * @param {Function} sleep - Async function to delay for animations
 * @param {AbortSignal} signal - Signal to cancel animation
 * @param {trackCompare} trackCompare - Function to track comparisons
 * @param {trackSwap} trackSwap - Function to track swaps/moves
 */
window.shellSort = async function(bars, arr, sleep, signal, trackCompare, trackSwap) {
    const n = arr.length;
    
    // Start with a large gap, then reduce the gap
    for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
        // Do a gapped insertion sort for this gap size.
        // The first gap elements a[0..gap-1] are already in gapped order
        // keep adding one more element until the entire array is gap sorted
        for (let i = gap; i < n; i += 1) {
            // add a[i] to the elements that have been gap sorted
            // save a[i] in temp and make a hole at position i
            let temp = arr[i];
            let tempHeight = bars[i].style.height;
            let j;
            
            bars[i].classList.add('compare');
            if (trackCompare) trackCompare();
            await sleep(signal);
            
            for (j = i; j >= gap && arr[j - gap] > temp; j -= gap) {
                if (trackCompare) trackCompare(); // Comparing arr[j-gap] and temp
                // Shift elements
                bars[j - gap].classList.add('compare');
                bars[j].classList.add('swap');
                if (trackSwap) trackSwap();
                await sleep(signal);
                
                arr[j] = arr[j - gap];
                bars[j].style.height = `${arr[j]}%`;
                
                bars[j - gap].classList.remove('compare');
                bars[j].classList.remove('swap');
                await sleep(signal);
            }
            
            // put temp (the original a[i]) in its correct location
            arr[j] = temp;
            bars[j].style.height = tempHeight;
            if (trackSwap) trackSwap();
            bars[i].classList.remove('compare');
            await sleep(signal);
        }
    }
    
    // Mark as sorted
    for (let k = 0; k < n; k++) {
        bars[k].className = 'bar sorted';
    }
};
