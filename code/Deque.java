/*
 * ------------------------------------------------------------
 * Deque<T> – Beginner-Friendly Circular Double-Ended Queue
 * ------------------------------------------------------------
 *
 * A simple implementation of a generic deque (double-ended queue)
 * using a circular array. It supports insertion and deletion
 * from both front and rear ends efficiently.
 *
 * Supported Operations:
 * 
 * - addFirst(T element)   → Insert at front
 * - addLast(T element)    → Insert at rear
 * - removeFirst()         → Remove from front
 * - removeLast()          → Remove from rear
 * - peekFirst()           → Get front element
 * - peekLast()            → Get rear element
 * - size()                → Get number of elements
 * 
 * Internals:
 * - Uses a circular array with dynamic resizing
 * - Designed for visualization and conceptual understanding
 */

public class Deque<T> {

    // ------------------------------------------------------------
    // Fields – internal structure and pointers
    // ------------------------------------------------------------
    private Object[] deque;   // Backing circular array
    private int size;         // Number of valid elements
    private int capacity;     // Maximum before resizing
    private int front;        // Points to front element
    private int rear;         // Points to rear element

    // ------------------------------------------------------------
    // Constructor – initializes deque with small default capacity
    // ------------------------------------------------------------
    public Deque() {
        capacity = 5;                   // Initial capacity
        deque = new Object[capacity];   // Underlying array
        size = 0;                       // Start empty
        front = -1;                     // Invalid positions initially
        rear = -1;
    }

    // ------------------------------------------------------------
    // isFull – returns true if the deque is full
    // ------------------------------------------------------------
    public boolean isFull() {
        return size == capacity;
    }

    // ------------------------------------------------------------
    // isEmpty – returns true if deque has no elements
    // ------------------------------------------------------------
    public boolean isEmpty() {
        return size == 0;
    }

    // ------------------------------------------------------------
    // resize – doubles the array capacity (preserves circular order)
    // ------------------------------------------------------------
    private void resize() {
        int newCapacity = capacity * 2;

        Object[] newDeque = new Object[newCapacity];

        int i = 0;
        int j = front;

        // Copy elements in correct logical order
        while (i < size) {
            newDeque[i] = deque[j];
            j = (j + 1) % capacity;
            i++;
        }

        // Update fields
        deque = newDeque;
        capacity = newCapacity;
        front = 0;
        rear = size - 1;
    }

    // ------------------------------------------------------------
    // addFirst – inserts element at the front of the deque
    // ------------------------------------------------------------
    public void addFirst(T element) {
        // Step 1: Resize if full
        if (isFull()) {
            resize();
        }

        // Step 2: If empty, initialize front and rear
        if (isEmpty()) {
            front = 0;
            rear = -1;
        } else {
            // Step 3: Move front backward (circularly)
            front = (front - 1 + capacity) % capacity;
        }

        // Step 4: Insert at front position
        deque[front] = element;

        // Step 5: Increment size
        size++;
    }

    // ------------------------------------------------------------
    // addLast – inserts element at the rear of the deque
    // ------------------------------------------------------------
    public void addLast(T element) {
        // Step 1: Resize if full
        if (isFull()) {
            resize();
        }

        // Step 2: If empty, initialize front and rear
        if (isEmpty()) {
            front = 0;
            rear = -1;
        }

        // Step 3: Move rear forward (circularly)
        rear = (rear + 1) % capacity;

        // Step 4: Insert at rear position
        deque[rear] = element;

        // Step 5: Increment size
        size++;
    }

    // ------------------------------------------------------------
    // removeFirst – removes and returns the front element
    // ------------------------------------------------------------
    public T removeFirst() {
        // Step 1: Check for underflow
        if (isEmpty()) {
            return null;
        }

        // Step 2: Store and clear front element
        T element = (T) deque[front];
        deque[front] = null;

        // Step 3: Decrease size
        size--;

        // Step 4: Reset if deque becomes empty
        if (isEmpty()) {
            front = -1;
            rear = -1;
        } else {
            // Step 5: Move front forward (circularly)
            front = (front + 1) % capacity;
        }

        return element;
    }

    // ------------------------------------------------------------
    // removeLast – removes and returns the rear element
    // ------------------------------------------------------------
    public T removeLast() {
        // Step 1: Check for underflow
        if (isEmpty()) {
            return null;
        }

        // Step 2: Store and clear rear element
        T element = (T) deque[rear];
        deque[rear] = null;

        // Step 3: Decrease size
        size--;

        // Step 4: Reset if deque becomes empty
        if (isEmpty()) {
            front = -1;
            rear = -1;
        } else {
            // Step 5: Move rear backward (circularly)
            rear = (rear - 1 + capacity) % capacity;
        }

        return element;
    }

    // ------------------------------------------------------------
    // peekFirst – returns the front element without removing
    // ------------------------------------------------------------
    public T peekFirst() {
        if (isEmpty()) {
            return null;
        }
        return (T) deque[front];
    }

    // ------------------------------------------------------------
    // peekLast – returns the rear element without removing
    // ------------------------------------------------------------
    public T peekLast() {
        if (isEmpty()) {
            return null;
        }
        return (T) deque[rear];
    }

    // ------------------------------------------------------------
    // size – returns the current number of elements
    // ------------------------------------------------------------
    public int size() {
        return size;
    }
}
// End of Deque<T> class
