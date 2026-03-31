/**
 * Cocktail Shaker Sort Implementation for Visualizer
 * @param {HTMLElement[]} bars - DOM elements representing the bars
 * @param {number[]} arr - Original array values
 * @param {Function} sleep - Async function to delay for animations
 * @param {AbortSignal} signal - Signal to cancel animation
 * @param {Function} trackCompare - Function to track comparisons
 * @param {Function} trackSwap - Function to track swaps/moves
 */
window.cocktailSort = async function(bars, arr, sleep, signal, trackCompare, trackSwap) {
    let n = arr.length;
    let swapped = true;
    let start = 0;
    let end = n - 1;

    while (swapped) {
        swapped = false;

        // Forward pass (like bubble sort)
        for (let i = start; i < end; i++) {
            bars[i].classList.add('compare');
            bars[i + 1].classList.add('compare');
            if (trackCompare) trackCompare();
            await sleep(signal);

            if (arr[i] > arr[i + 1]) {
                // Swap
                let temp = arr[i];
                arr[i] = arr[i + 1];
                arr[i + 1] = temp;
                
                bars[i].style.height = `${arr[i]}%`;
                bars[i + 1].style.height = `${arr[i + 1]}%`;
                bars[i].classList.add('swap');
                bars[i + 1].classList.add('swap');
                if (trackSwap) trackSwap();
                await sleep(signal);
                
                swapped = true;
            }
            bars[i].className = 'bar';
            bars[i + 1].className = 'bar';
        }

        if (!swapped) break;

        swapped = false;
        bars[end].className = 'bar sorted';
        end--;

        // Backward pass
        for (let i = end - 1; i >= start; i--) {
            bars[i].classList.add('compare');
            bars[i + 1].classList.add('compare');
            if (trackCompare) trackCompare();
            await sleep(signal);

            if (arr[i] > arr[i + 1]) {
                // Swap
                let temp = arr[i];
                arr[i] = arr[i + 1];
                arr[i + 1] = temp;
                
                bars[i].style.height = `${arr[i]}%`;
                bars[i + 1].style.height = `${arr[i + 1]}%`;
                bars[i].classList.add('swap');
                bars[i + 1].classList.add('swap');
                if (trackSwap) trackSwap();
                await sleep(signal);
                
                swapped = true;
            }
            bars[i].className = 'bar';
            bars[i + 1].className = 'bar';
        }
        bars[start].className = 'bar sorted';
        start++;
    }

    // Mark remaining as sorted
    for (let i = 0; i < n; i++) {
        bars[i].className = 'bar sorted';
    }
};
