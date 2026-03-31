window.selectionSort = async function(bars, arr, sleep, signal, trackCompare, trackSwap) {
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        bars[minIdx].classList.add('swap');
        
        for (let j = i + 1; j < n; j++) {
            bars[j].classList.add('compare');
            if (trackCompare) trackCompare();
            await sleep(signal);
            
            if (arr[j] < arr[minIdx]) {
                if (minIdx !== i) {
                    bars[minIdx].className = 'bar'; // clear previous min
                }
                minIdx = j;
                bars[minIdx].classList.add('swap');
            } else {
                bars[j].className = 'bar'; // clear compare colour
            }
        }
        
        if (minIdx !== i) {
            // Swap in array
            let temp = arr[i];
            arr[i] = arr[minIdx];
            arr[minIdx] = temp;
            
            if (trackSwap) trackSwap();
            
            // Swap heights visually
            bars[i].style.height = `${arr[i]}%`;
            bars[minIdx].style.height = `${arr[minIdx]}%`;
            await sleep(signal);
        }
        
        if (minIdx !== i) {
            bars[minIdx].className = 'bar';
        }
        
        // Element at i is strictly in its final place
        bars[i].className = 'bar sorted';
    }
    // Final element is sorted
    bars[n - 1].className = 'bar sorted';
};
