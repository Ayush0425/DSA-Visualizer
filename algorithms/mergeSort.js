window.mergeSort = async function(bars, arr, sleep, signal, trackCompare, trackSwap) {
    await mergeSortHelper(bars, arr, 0, arr.length - 1, sleep, signal, trackCompare, trackSwap);
};

async function mergeSortHelper(bars, arr, left, right, sleep, signal, trackCompare, trackSwap) {
    if (left >= right) return;
    const mid = Math.floor(left + (right - left) / 2);
    
    await mergeSortHelper(bars, arr, left, mid, sleep, signal, trackCompare, trackSwap);
    await mergeSortHelper(bars, arr, mid + 1, right, sleep, signal, trackCompare, trackSwap);
    await merge(bars, arr, left, mid, right, sleep, signal, trackCompare, trackSwap);
}

async function merge(bars, arr, left, mid, right, sleep, signal, trackCompare, trackSwap) {
    let temp = [];
    let i = left;
    let j = mid + 1;

    for (let k = left; k <= right; k++) {
        bars[k].classList.add('compare');
    }
    await sleep(signal);

    while (i <= mid && j <= right) {
        if (trackCompare) trackCompare();
        bars[i].classList.add('swap');
        bars[j].classList.add('swap');
        await sleep(signal);
        
        if (arr[i] <= arr[j]) {
            temp.push(arr[i]);
            bars[i].classList.remove('swap');
            bars[j].classList.remove('swap');
            i++;
        } else {
            temp.push(arr[j]);
            bars[i].classList.remove('swap');
            bars[j].classList.remove('swap');
            j++;
        }
    }

    while (i <= mid) {
        bars[i].classList.add('swap');
        await sleep(signal);
        temp.push(arr[i]);
        bars[i].classList.remove('swap');
        i++;
    }

    while (j <= right) {
        bars[j].classList.add('swap');
        await sleep(signal);
        temp.push(arr[j]);
        bars[j].classList.remove('swap');
        j++;
    }

    for (let k = left; k <= right; k++) {
        if (trackSwap) trackSwap();
        arr[k] = temp[k - left];
        bars[k].style.height = `${arr[k]}%`;
        bars[k].className = 'bar swap';
        await sleep(signal);
        bars[k].className = 'bar';
    }
}
