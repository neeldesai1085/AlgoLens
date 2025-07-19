/*
 * ------------------------------------------------------------
 * Stack<T> – Simple Dynamic Stack (LIFO) for Beginners
 * ------------------------------------------------------------
 *
 * This class implements a dynamic stack using an array.
 * Supports typical stack operations:
 *  - push: Add an element to the top
 *  - pop: Remove and return the top element
 *  - peek: View the top element without removing it
 *
 * Key Features:
 *  - Auto-resizing when full (just like ArrayList)
 *  - Type-safe generics for flexibility
 *  - Designed for: Animation + Easy learning
 */

public class Stack<T> {

    // ---------- Fields ----------

    // Underlying array to store elements (Object array to support generics)
    private Object[] stack;

    // Current number of elements stored
    private int size;

    // Current capacity of the internal array
    private int capacity;

    // Index of the topmost element in the stack
    private int top;

    // ---------- Constructor ----------

    // Initializes the stack with default capacity of 5
    public Stack() {
        this.capacity = 5;
        this.stack = new Object[this.capacity];
        this.size = 0;
        this.top = -1;
    }

    // ---------- Internal Helper ----------

    // Doubles the stack capacity when full and copies all elements
    private void resize() {
        int newCapacity = capacity * 2;

        // Create a new array with double capacity and copy elements
        this.stack = java.util.Arrays.copyOf(this.stack, newCapacity);

        // Update the capacity
        this.capacity = newCapacity;
    }

    // ---------- Core Stack Operations ----------

    // Adds an element on top of the stack
    public void push(T data) {
        // Resize the stack if it's full
        if (size == capacity) {
            resize();
        }

        // Move top pointer to next empty index
        top++;

        // Place the new data
        stack[top] = data;

        // Increment the size
        size++;
    }

    // Removes and returns the topmost element
    public T pop() {
        // Handle empty stack
        if (isEmpty()) {
            return null;
        }

        // Retrieve the top element
        T data = (T) stack[top];

        // Clear the reference for GC
        stack[top] = null;

        // Move top pointer down
        top--;

        // Decrease logical size
        size--;

        return data;
    }

    // Returns (but does not remove) the top element
    public T peek() {
        // Handle empty stack
        if (isEmpty()) {
            return null;
        }

        // Return top element
        return (T) stack[top];
    }

    // ---------- Utility Methods ----------

    // Checks if the stack is empty
    public boolean isEmpty() {
        return size == 0;
    }

    // Returns current number of elements in the stack
    public int size() {
        return size;
    }
}
// End of Stack class
