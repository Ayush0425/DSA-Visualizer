window.bubbleSort = async function(bars, arr, sleep, signal, trackCompare, trackSwap) {
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            bars[j].classList.add('compare');
            bars[j+1].classList.add('compare');
            if (trackCompare) trackCompare();
            await sleep(signal);
            
            if (arr[j] > arr[j+1]) {
                bars[j].classList.remove('compare');
                bars[j+1].classList.remove('compare');
                bars[j].classList.add('swap');
                bars[j+1].classList.add('swap');
                if (trackSwap) trackSwap();
                
                // Swap in array
                let temp = arr[j];
                arr[j] = arr[j+1];
                arr[j+1] = temp;
                
                // Swap heights visually
                bars[j].style.height = `${arr[j]}%`;
                bars[j+1].style.height = `${arr[j+1]}%`;
                await sleep(signal);
            }
            
            bars[j].className = 'bar';
            bars[j+1].className = 'bar';
        }
        // Mark the element that bubbled up as sorted
        bars[n - i - 1].className = 'bar sorted';
    }
    // Final element is sorted
    bars[0].className = 'bar sorted';
};
