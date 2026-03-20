# Java Collections Framework

## 1. Overview

The Java Collections Framework provides classes and interfaces for working with **dynamic groups of objects** (collections).

> **Note:** `Collection` (with capital C) is an **interface** — the root of the collection hierarchy. `Collections` (with capital C + s) is a **utility class** with static methods for sorting, searching, and synchronizing collections.

### 1.1. Core Interfaces Hierarchy

```
Iterable
  └── Collection
        ├── List      (ordered, index-based, allows duplicates)
        ├── Set       (no duplicates)
        └── Queue     (FIFO or priority-based)
              └── Deque (double-ended queue)

Map  (key-value pairs, keys are unique — NOT part of Collection interface)
```

---

## 2. Iterator vs ListIterator

| Aspect | `Iterator` | `ListIterator` |
|--------|-----------|----------------|
| **Direction** | One-way (forward only) | Bidirectional (forward + backward) |
| **Add/Set/Remove** | `remove()` only | `add()`, `set()`, `remove()` |
| **Index access** | No | Yes (`previousIndex()`, `nextIndex()`) |
| **Use with** | All `Collection` types | `List` only |

```java
List<String> list = Arrays.asList("A", "B", "C");

// Iterator
Iterator<String> it = list.iterator();
while (it.hasNext()) {
    String item = it.next();
    if ("B".equals(item)) {
        it.remove();
    }
}

// ListIterator (bidirectional)
ListIterator<String> li = list.listIterator();
while (li.hasNext()) {
    if (li.nextIndex() == 1) {
        li.set("X");  // Modify current element
    }
    li.next();
}
while (li.hasPrevious()) {
    System.out.println(li.previous());
}
```

---

## 3. fail-fast vs fail-safe

| Aspect | fail-fast | fail-safe |
|--------|-----------|-----------|
| **Behavior** | Throws `ConcurrentModificationException` on concurrent modification | Works on a copy of the collection |
| **Implementation** | Detects modification during iteration via mod count | No mod-count checking |
| **Performance** | No overhead | Overhead of copying |
| **Examples** | `ArrayList`, `HashMap`, `HashSet`, `LinkedList` | `CopyOnWriteArrayList`, `ConcurrentHashMap`, `ConcurrentLinkedQueue` |

```java
// fail-fast example (don't do this!)
List<String> list = new ArrayList<>(Arrays.asList("A", "B", "C"));
for (String s : list) {  // ConcurrentModificationException
    if ("B".equals(s)) {
        list.remove(s);
    }
}

// fail-safe solution using Iterator remove
Iterator<String> it = list.iterator();
while (it.hasNext()) {
    if ("B".equals(it.next())) {
        it.remove();  // Safe removal through iterator
    }
}
```

---

## 4. List Implementations

| Implementation | Get/Set | Add/Remove End | Add/Remove Middle | Use Case |
|---------------|---------|--------------|-----------------|----------|
| `ArrayList` | O(1) | O(1) amortized | O(n) | Frequent **reads**, infrequent writes |
| `LinkedList` | O(n) | O(1) | O(1) at known position | Frequent **adds/removes** at ends, implement List/Queue/Deque/Stack |
| `Vector` | O(1) | O(1) | O(n) | Legacy, **synchronized** (thread-safe) |
| `Stack` | O(1) | O(1) | N/A | Legacy LIFO stack (extends Vector) |

```java
// ArrayList - best for random access
List<String> arrList = new ArrayList<>();
arrList.add("A");
String first = arrList.get(0);  // O(1)

// LinkedList - best for frequent add/remove at ends
List<String> linked = new LinkedList<>();
linked.addFirst("X");
linked.addLast("Y");
String removed = linked.removeFirst();  // O(1)

// LinkedList as Queue/Deque
Queue<Integer> queue = new LinkedList<>();
queue.offer(1);       // add to tail
queue.poll();         // remove from head

Deque<Integer> deque = new LinkedList<>();
deque.offerFirst(1);  // head
deque.offerLast(2);   // tail
deque.pollFirst();
deque.pollLast();
```

---

## 5. Set Implementations

| Implementation | Ordering | Null | Time Complexity | Internal Structure |
|---------------|----------|------|-----------------|-------------------|
| `HashSet` | Unordered | One null | O(1) average | Hash table |
| `LinkedHashSet` | Insertion order | One null | O(1) average | Hash table + doubly linked list |
| `TreeSet` | Sorted (natural/comparator) | **No null** | O(log n) | Red-black tree |

```java
// HashSet - unordered, O(1) lookup
Set<String> hashSet = new HashSet<>();
hashSet.add("Banana");
hashSet.add("Apple");
hashSet.add("Banana");  // Duplicate, ignored
System.out.println(hashSet);  // Unordered output

// LinkedHashSet - maintains insertion order
Set<String> linkedSet = new LinkedHashSet<>();
linkedSet.add("First");
linkedSet.add("Second");
linkedSet.add("Third");  // Output: [First, Second, Third]

// TreeSet - sorted, no null allowed
Set<Integer> treeSet = new TreeSet<>();
treeSet.add(3);
treeSet.add(1);
treeSet.add(2);
System.out.println(treeSet);  // Output: [1, 2, 3]

// TreeSet with custom comparator
Set<String> descSet = new TreeSet<>(Comparator.reverseOrder());
descSet.add("Apple");
descSet.add("Banana");
descSet.add("Cherry");  // Output: [Banana, Cherry, Apple]
```

---

## 6. Queue & Deque

### 6.1. Queue Interface

| Method | Throws Exception | Returns null/false |
|--------|-----------------|-------------------|
| Insert | `add(e)` | `offer(e)` |
| Remove | `remove()` | `poll()` |
| Examine | `element()` | `peek()` |

### 6.2. Deque Interface (Double-Ended Queue)

Supports both **FIFO** (Queue) and **LIFO** (Stack) operations.

| Queue Operation | Deque Equivalent |
|----------------|-----------------|
| `add(e)` / `offer(e)` | `offerLast(e)` |
| `remove()` / `poll()` | `pollFirst()` |
| `element()` / `peek()` | `peekFirst()` |
| — | `offerFirst(e)`, `pollLast()` |
| — | `push(e)` (LIFO stack) |
| — | `pop()` (LIFO stack) |

### 6.3. Key Implementations

| Implementation | Null | Bounded | Internal |
|---------------|------|---------|----------|
| `PriorityQueue` | **No null** | No | Min-heap (natural order) |
| `ArrayDeque` | **No null** | Yes (resizable array) | Array |
| `LinkedList` | Allows null | No | Doubly linked list |

```java
// PriorityQueue - heap-based, min element at head by default
Queue<Integer> pq = new PriorityQueue<>();
pq.offer(5);
pq.offer(2);
pq.offer(8);
System.out.println(pq.peek());  // 2 (smallest)

// PriorityQueue with reverse order (max-heap)
Queue<Integer> maxPq = new PriorityQueue<>(Comparator.reverseOrder());
maxPq.offer(5);
maxPq.offer(2);
SystemPq.peek());  // 8 (largest)

// ArrayDeque - fast double-ended operations
Deque<String> deque = new ArrayDeque<>();
deque.offerFirst("A");
deque.offerLast("B");
deque.pollFirst();  // A
deque.pollLast();   // B

// ArrayDeque as Stack (faster than Stack class)
Deque<Integer> stack = new ArrayDeque<>();
stack.push(1);
stack.push(2);
stack.push(3);
stack.pop();  // 3
stack.peek(); // 2
```

---

## 7. Map (Not Part of Collection Interface)

Maps store **key-value pairs**. Keys are unique (one `null` key allowed unless stated), values can be duplicated.

### 7.1. Map Interface Methods

```java
Map<String, Integer> map = new HashMap<>();

map.put("A", 1);        // Add/update
map.get("A");           // Get by key
map.remove("A");        // Remove by key
map.containsKey("A");   // Key exists?
map.containsValue(1);  // Value exists?
map.keySet();           // Set of keys
map.values();           // Collection of values
map.entrySet();         // Set of key-value pairs
map.getOrDefault("B", 0);  // Get with default
map.merge("A", 1, Integer::sum);  // Merge if exists
```

### 7.2. Map Implementations

| Implementation | Ordering | Null Key | Null Values | Time (get/put) | Notes |
|---------------|----------|----------|-------------|----------------|-------|
| `HashMap` | Unordered | One null | Multiple null | O(1) avg | Uses **red-black tree** for collisions from Java 8+ |
| `LinkedHashMap` | Insertion order | One null | Multiple null | O(1) avg | HashMap + doubly linked list |
| `TreeMap` | Sorted | **No null** | Multiple null | O(log n) | Red-black tree, navigable |
| `ConcurrentHashMap` | Unordered | **No null** | **No null** | O(1) avg | Thread-safe, segmented locking |

```java
// HashMap - basic key-value store
Map<String, Integer> hashMap = new HashMap<>();
hashMap.put("Alice", 25);
hashMap.put("Bob", 30);
hashMap.put("Alice", 26);  // Updates Alice's value
System.out.println(hashMap.get("Bob"));  // 30

// LinkedHashMap - insertion order
Map<String, Integer> linkedMap = new LinkedHashMap<>();
linkedMap.put("First", 1);
linkedMap.put("Second", 2);
linkedMap.put("Third", 3);  // Iterates in insertion order

// TreeMap - sorted by keys
Map<String, Integer> treeMap = new TreeMap<>();
treeMap.put("Banana", 2);
treeMap.put("Apple", 1);
treeMap.put("Cherry", 3);
System.out.println(treeMap.keySet());  // [Apple, Banana, Cherry]

// TreeMap - navigation methods
treeMap.lowerKey("Cherry");  // Banana
treeMap.higherKey("Apple");   // Banana
treeMap.subMap("Apple", "Cherry");  // {Apple=1, Banana=2}

// ConcurrentHashMap - thread-safe
ConcurrentHashMap<String, Integer> concurrent = new ConcurrentHashMap<>();
concurrent.putIfAbsent("Lock", 1);  // Only if key absent
concurrent.computeIfAbsent("Key", k -> 1);  // Lazy compute
```

### 7.3. Choosing a Map

| Use Case | Recommended Map |
|----------|----------------|
| General purpose, fast lookups | `HashMap` |
| Need insertion order | `LinkedHashMap` |
| Need sorted keys | `TreeMap` |
| Multi-threaded environment | `ConcurrentHashMap` |
| Thread-safe but need null support | `Collections.synchronizedMap()` (legacy) |

---

## 8. Legacy Collections

| Class | Description | Modern Alternative |
|-------|-------------|-------------------|
| `Vector` | Synchronized `ArrayList` | `ArrayList` + `Collections.synchronizedList()` |
| `Stack` | LIFO stack (extends `Vector`) | `ArrayDeque` |
| `Hashtable` | Synchronized `HashMap` | `ConcurrentHashMap` |
| `Enumeration` | Legacy iterator | `Iterator` |

---

## 9. Choosing the Right Collection

| Goal | Best Choice |
|------|-------------|
| Fast random access by index | `ArrayList` |
| Fast add/remove at ends | `ArrayDeque`, `LinkedList` |
| Unique elements, no ordering | `HashSet` |
| Unique elements, insertion order | `LinkedHashSet` |
| Unique elements, sorted | `TreeSet` |
| Key-value pairs | `HashMap` |
| Key-value, insertion order | `LinkedHashMap` |
| Key-value, sorted | `TreeMap` |
| Thread-safe collections | `ConcurrentHashMap`, `CopyOnWriteArrayList` |
| Producer-consumer queue | `BlockingQueue` |
