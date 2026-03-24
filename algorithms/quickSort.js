window.quickSort = async function(bars, arr, sleep, signal) {
    async function partition(low, high) {
        let pivot = arr[high];
        bars[high].classList.add('compare'); // Highlight pivot
        
        let i = low - 1;
        for (let j = low; j < high; j++) {
            bars[j].classList.add('compare');
            await sleep(signal);
            
            if (arr[j] <= pivot) {
                i++;
                // Swap arr[i] and arr[j]
                if (i !== j) {
                    bars[i].classList.add('swap');
                    bars[j].classList.add('swap');
                    
                    let temp = arr[i];
                    arr[i] = arr[j];
                    arr[j] = temp;
                    
                    bars[i].style.height = `${arr[i]}%`;
                    bars[j].style.height = `${arr[j]}%`;
                    
                    await sleep(signal);
                    bars[i].classList.remove('swap');
                    bars[j].classList.remove('swap');
                }
            }
            bars[j].classList.remove('compare');
        }
        
        // Swap arr[i+1] and arr[high]
        i++;
        if (i !== high) {
            bars[i].classList.add('swap');
            bars[high].classList.add('swap');
            
            let temp = arr[i];
            arr[i] = arr[high];
            arr[high] = temp;
            
            bars[i].style.height = `${arr[i]}%`;
            bars[high].style.height = `${arr[high]}%`;
            
            await sleep(signal);
            bars[i].classList.remove('swap');
            bars[high].classList.remove('swap');
        }
        
        bars[high].classList.remove('compare');
        bars[i].className = 'bar sorted'; // Pivot is at correct position
        
        return i;
    }

    async function quickSortHelper(low, high) {
        if (low < high) { // changed <= to < as per quicksort logic
            let pi = await partition(low, high);
            await quickSortHelper(low, pi - 1);
            await quickSortHelper(pi + 1, high);
        } else if (low === high) {
            bars[low].className = 'bar sorted';
        }
    }

    await quickSortHelper(0, arr.length - 1);
};
