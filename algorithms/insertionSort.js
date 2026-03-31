window.insertionSort = async function(bars, arr, sleep, signal, trackCompare, trackSwap) {
    const n = arr.length;
    bars[0].className = 'bar sorted';
    
    for (let i = 1; i < n; i++) {
        let key = arr[i];
        let j = i - 1;
        
        bars[i].classList.add('compare');
        if (trackCompare) trackCompare();
        await sleep(signal);
        
        while (j >= 0 && arr[j] > key) {
            if (trackCompare) trackCompare();
            bars[j].classList.add('swap');
            bars[j + 1].classList.add('swap');
            
            if (trackSwap) trackSwap();
            
            // Shift in array and visually
            arr[j + 1] = arr[j];
            bars[j + 1].style.height = `${arr[j + 1]}%`;
            await sleep(signal);
            
            bars[j].className = 'bar sorted';
            bars[j + 1].className = 'bar sorted';
            j--;
        }
        
        arr[j + 1] = key;
        bars[j + 1].style.height = `${key}%`;
        if (trackSwap) trackSwap();
        bars[j + 1].className = 'bar sorted';
        await sleep(signal);
        
        // Ensure everything up to i is marked as sorted
        for (let k = 0; k <= i; k++) {
            bars[k].className = 'bar sorted';
        }
    }
};
