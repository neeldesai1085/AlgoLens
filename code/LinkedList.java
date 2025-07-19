/*
 * ------------------------------------------------------------
 * LinkedList<T> – Beginner-Friendly Singly Linked List in Java
 * ------------------------------------------------------------
 *
 * This class implements a simplified version of a singly linked list.
 * It supports the following operations:
 * 
 *  - insertAtHead(T data):    Insert an element at the beginning
 *  - insertAtTail(T data):    Insert an element at the end
 *  - insertAtIndex(int i, T): Insert an element at a specific index
 *  - delete(T data):          Delete the first occurrence of a value
 *  - search(T data):          Return the index of the element (or -1)
 *  - size():                  Return the number of elements in the list
 * 
 * Notes:
 * - This is a generic class using <T>, so it can store any data type.
 * - Designed for educational visualizations and absolute beginners.
 */

public class LinkedList<T> {

    // ------------------------------------------------------------
    // Node class – represents a single node in the linked list
    // ------------------------------------------------------------
    private class Node {
        T data;       // The actual data stored in the node
        Node next;    // Reference to the next node

        // Constructor to initialize a new node with data
        Node(T data) {
            this.data = data;
            this.next = null; // Initially, next is null
        }
    }

    // ------------------------------------------------------------
    // Fields of LinkedList
    // ------------------------------------------------------------
    private Node head;   // Head points to the first node of the list
    private int size = 0; // Tracks total number of elements in the list

    // ------------------------------------------------------------
    // insertAtHead – inserts a new element at the beginning
    // ------------------------------------------------------------
    public void insertAtHead(T data) {
        Node newNode = new Node(data);  // Step 1: Create new node
        newNode.next = head;            // Step 2: Link new node to current head
        head = newNode;                 // Step 3: Update head to the new node
        size++;                         // Step 4: Increase size count
    }

    // ------------------------------------------------------------
    // insertAtTail – inserts a new element at the end
    // ------------------------------------------------------------
    public void insertAtTail(T data) {
        Node newNode = new Node(data);  // Step 1: Create new node

        // Step 2: Handle empty list by inserting at head
        if (head == null) {
            insertAtHead(data);         // Delegates to insertAtHead
            return;
        }

        Node current = head;            // Step 3: Start from the head

        // Step 4: Traverse to the last node (where next is null)
        while (current.next != null) {
            current = current.next;
        }

        current.next = newNode;         // Step 5: Link last node to new node
        size++;                         // Step 6: Increase size count
    }

    // ------------------------------------------------------------
    // insertAtIndex – inserts an element at the given index
    // ------------------------------------------------------------
    public void insertAtIndex(int index, T data) {
        // Step 1: Check for invalid index
        if (index < 0 || index > size) {
            throw new IndexOutOfBoundsException("Invalid index");
        }

        // Step 2: Inserting at the head (position 0)
        if (index == 0) {
            insertAtHead(data);
            return;
        }

        Node newNode = new Node(data);  // Step 3: Create new node
        Node current = head;            // Step 4: Start from the head

        // Step 5: Traverse to the node just before target index
        for (int i = 0; i < index - 1; i++) {
            current = current.next;
        }

        newNode.next = current.next;    // Step 6: Link new node to the next node
        current.next = newNode;         // Step 7: Link previous node to new node
        size++;                         // Step 8: Increase size count
    }

    // ------------------------------------------------------------
    // delete – removes the first node with matching value
    // ------------------------------------------------------------
    public boolean delete(T data) {
        // Step 1: Empty list case
        if (head == null) {
            return false;
        }

        // Step 2: Check if the head node is to be deleted
        if (head.data.equals(data)) {
            head = head.next;   // Move head to the next node
            size--;             // Reduce size
            return true;
        }

        Node current = head;    // Step 3: Start from head

        // Step 4: Traverse the list and look one step ahead
        while (current.next != null) {
            if (current.next.data.equals(data)) {
                current.next = current.next.next; // Skip the matching node
                size--;                           // Reduce size
                return true;
            }
            current = current.next;              // Move forward
        }

        return false; // Step 5: Element not found
    }

    // ------------------------------------------------------------
    // search – returns the index of an element, or -1 if not found
    // ------------------------------------------------------------
    public int search(T data) {
        Node current = head;  // Start from the head
        int index = 0;        // Track index

        // Traverse the list while checking each node’s data
        while (current != null) {
            if (current.data.equals(data)) {
                return index; // Match found
            }
            current = current.next; // Move to next node
            index++;                // Increment index
        }

        return -1; // Element not found
    }

    // ------------------------------------------------------------
    // size – returns the total number of elements in the list
    // ------------------------------------------------------------
    public int size() {
        return size;
    }

}
// End of LinkedList<T> class
