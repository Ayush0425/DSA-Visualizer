# Sorting Algorithm Visualizer

A sleek and interactive web-based tool built with HTML, CSS, and Vanilla JavaScript to visualize how various sorting algorithms work under the hood. 

## Features
- **Algorithms Implemented:** Bubble Sort, Selection Sort, and Insertion Sort.
- **Dynamic Array Control:** Users can change the array size from 10 to 100 elements on the fly using a slider.
- **Speed Control:** Variable speed settings to speed up or slow down the sorting animations.
- **Live Complexity Display:** View the Time Complexity (Best, Average, Worst) and Space Complexity for each algorithm in real-time.

## How It Works

The visualization logic is built entirely in Vanilla JS using modern asynchronous JavaScript to manipulate the Document Object Model (DOM) in real-time without freezing the browser window.

1. **State Representation:** The unsorted array is represented as a collection of vertical DOM `div` elements, where the CSS `height` of each bar directly corresponds to the magnitude of the array value. 
2. **Animation Injection:** We utilize standard algorithm implementations (e.g., standard Bubble Sort logic) but inject a custom `sleep(signal)` function between operations. This function returns a Promise that resolves after a specified timeout, forcing the algorithm to intentionally "pause" at each action.
3. **Color Coding Visuals:** As elements are actively being iterated over, their CSS classes are dynamically updated. We apply `.compare` (Red) to indicate values being checked against each other, `.swap` (Yellow) to indicate values being shifted, and `.sorted` (Green) when an element has reached its final resting place. 
4. **Graceful Cancellations:** An `AbortController` handles user-interruptions seamlessly. If a user tries to generate a new array or alter the array size *while* an algorithm is currently sorting, the active `sleep` promises are immediately rejected via an abort signal. This quickly cleans up the process and instantly reinitializes a fresh array, preventing memory leaks and overlapping algorithm executions. 

## How to Run Locally
There are zero external dependencies required to run this project!
1. Clone the repository to your local machine.
2. Open the `index.html` file in any modern web browser to start visualizing!