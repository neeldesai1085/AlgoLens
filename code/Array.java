/*
 * ------------------------------------------------------------
 * DynamicArray<T> – Beginner-Friendly Growable Array in Java
 * ------------------------------------------------------------
 *
 * This class mimics a simplified version of Java's ArrayList.
 * It supports the following core operations:
 * 
 *  - insert(T element):     Add an element at the end
 *  - delete(T element):     Remove the first occurrence of an element
 *  - search(T element):     Find the index of an element (linear search)
 *  - size():                Return current number of elements
 * 
 * Notes:
 * - Uses an underlying Object[] array to store generic elements.
 * - Automatically resizes when capacity is exceeded.
 * - Designed for educational visualization and conceptual clarity.
 */

public class Array<T> {

    // ------------------------------------------------------------
    // Fields – internal data structure and size trackers
    // ------------------------------------------------------------
    private Object[] array;  // Internal storage for elements (generic workaround)
    private int size;        // Number of valid elements in the array
    private int capacity;    // Maximum capacity before resizing

    // ------------------------------------------------------------
    // Constructor – initializes array with default capacity
    // ------------------------------------------------------------
    public Array() {
        capacity = 10;                  // Initial capacity
        array = new Object[capacity];   // Create backing array
        size = 0;                       // Start with 0 elements
    }

    // ------------------------------------------------------------
    // insert – adds a new element to the end of the array
    // ------------------------------------------------------------
    public void insert(T element) {
        // Step 1: Check if resizing is needed
        if (size == capacity) {
            resize(); // Double the capacity
        }

        // Step 2: Add element at the current end
        array[size] = element;

        // Step 3: Increase size count
        size = size + 1;
    }

    // ------------------------------------------------------------
    // delete – removes the first matching element, shifts rest
    // ------------------------------------------------------------
    public boolean delete(T element) {
        // Step 1: Search for the element’s index
        int index = search(element);

        // Step 2: If not found, deletion fails
        if (index == -1) {
            return false;
        }

        // Step 3: Shift all elements after index to the left
        shiftLeft(index);

        // Step 4: Decrease size count
        size = size - 1;

        return true; // Deletion successful
    }

    // ------------------------------------------------------------
    // search – returns index of the element, or -1 if not found
    // ------------------------------------------------------------
    public int search(T element) {
        // Step 1: Traverse from beginning to current size
        for (int i = 0; i < size; i++) {
            if (array[i].equals(element)) {
                return i; // Match found
            }
        }
        return -1; // Match not found
    }

    // ------------------------------------------------------------
    // resize – doubles the internal capacity of the array
    // ------------------------------------------------------------
    private void resize() {
        // Step 1: Double the capacity value
        capacity = capacity * 2;

        // Step 2: Create new larger array
        Object[] newArray = new Object[capacity];

        // Step 3: Copy all old elements to new array
        for (int i = 0; i < size; i++) {
            newArray[i] = array[i];
        }

        // Step 4: Replace old array with new one
        array = newArray;
    }

    // ------------------------------------------------------------
    // shiftLeft – shifts all elements after index one step left
    // ------------------------------------------------------------
    private void shiftLeft(int index) {
        // Step through from index to second-last
        for (int i = index; i < size - 1; i++) {
            array[i] = array[i + 1]; // Overwrite current with next
        }
        // The last element remains untouched (can be garbage)
    }

    // ------------------------------------------------------------
    // size – returns number of elements currently stored
    // ------------------------------------------------------------
    public int size() {
        return size;
    }
}
// End of DynamicArray<T> class
