# Java Collections Framework

## 1. Overview

The Java Collections Framework provides standard interfaces and implementations for managing groups of objects.

### 1.1. Classification

```
Iterable
  -> Collection
       -> List
       -> Set
       -> Queue
            -> Deque

Map   (separate hierarchy, not a subtype of Collection)
```

`Collection` is an interface. `Collections` is a utility class with helpers such as sorting, searching, and wrappers.

In backend systems, choosing the wrong collection usually does not break correctness first. It breaks performance, memory usage, or concurrency behavior.

## 2. Iterator vs ListIterator

| Feature | `Iterator` | `ListIterator` |
|---|---|---|
| Direction | Forward only | Forward and backward |
| Write support | `remove()` | `add()`, `set()`, `remove()` |
| Works with | Any `Collection` | `List` only |

### 2.1. Example

```java
List<String> items = new ArrayList<>(List.of("A", "B", "C"));

Iterator<String> it = items.iterator();
while (it.hasNext()) {
    if ("B".equals(it.next())) {
        it.remove();
    }
}

ListIterator<String> li = items.listIterator();
while (li.hasNext()) {
    String value = li.next();
    if ("A".equals(value)) {
        li.set("X");
    }
}
```

`ListIterator` is less common in day-to-day code, but it becomes useful when you need in-place bidirectional traversal or replacement logic.

## 3. fail-fast vs fail-safe

Fail-fast iterators detect structural changes during iteration and usually throw `ConcurrentModificationException`. Fail-safe iterators iterate over a snapshot or concurrent structure and tolerate modification.

The key point is that fail-fast is a bug detector, not a synchronization mechanism.

### 3.1. fail-fast Example

```java
List<String> list = new ArrayList<>(List.of("A", "B", "C"));

for (String item : list) {
    if ("B".equals(item)) {
        list.remove(item); // ConcurrentModificationException
    }
}
```

The safe alternatives are:

- remove through the iterator itself
- use a concurrent collection
- collect changes and apply them afterward

## 4. List: Ordered and Allows Duplicates

### 4.1. Comparison

| Implementation | Strength | Weakness | Typical Use |
|---|---|---|---|
| `ArrayList` | Fast random access | Slow middle inserts/removes | Read-heavy lists |
| `LinkedList` | Fast end inserts/removes | Poor random access | Queue/deque style access |
| `Vector` | Synchronized legacy list | Legacy API, overhead | Rarely recommended |

For most business code, `ArrayList` should be the default assumption until profiling proves otherwise.

### 4.2. Example

```java
List<String> arrayList = new ArrayList<>();
arrayList.add("A");
arrayList.add("B");
System.out.println(arrayList.get(1));

LinkedList<String> linkedList = new LinkedList<>();
linkedList.addFirst("start");
linkedList.addLast("end");
```

Although `LinkedList` has attractive asymptotic complexity on paper, modern CPU cache behavior means `ArrayList` still wins surprisingly often in real applications.

## 5. Set: No Duplicates

### 5.1. Comparison

| Implementation | Ordering | Time Complexity | Notes |
|---|---|---|---|
| `HashSet` | Unordered | `O(1)` average | Backed by `HashMap` |
| `LinkedHashSet` | Insertion order | `O(1)` average | Keeps iteration order |
| `TreeSet` | Sorted | `O(log n)` | Backed by a red-black tree |

### 5.2. How Does HashSet Work?

`HashSet` internally stores elements as keys in a `HashMap`. That means `hashCode()` selects a bucket and `equals()` resolves collisions.

In practice, a bad `hashCode()` implementation creates more collisions and degrades performance.

This is why entity and value object equality rules matter so much when those objects are used inside collections.

### 5.3. Custom Classes in HashSet

If a custom class is stored in `HashSet`, it must implement `equals()` and `hashCode()` consistently.

```java
public class User {
    private final Long id;

    public User(Long id) {
        this.id = id;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof User other)) return false;
        return Objects.equals(id, other.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
```

If mutable fields participate in `equals()` or `hashCode()`, changing them after insertion can make the set behave unpredictably.

## 6. Queue and Deque

### 6.1. Comparison

| Structure | Meaning | Common Methods |
|---|---|---|
| `Queue` | FIFO access | `offer`, `poll`, `peek` |
| `Deque` | Double-ended access | `offerFirst`, `offerLast`, `pollFirst`, `pollLast` |

Queue choice matters in backend work for buffering, scheduling, retries, rate limiting, and producer-consumer flows.

### 6.2. PriorityQueue

`PriorityQueue` is heap-based. The head is the smallest element by default, or the highest-priority element according to the comparator.

```java
Queue<Integer> pq = new PriorityQueue<>();
pq.offer(5);
pq.offer(2);
pq.offer(8);
System.out.println(pq.poll()); // 2
```

Important caveat: iteration order of `PriorityQueue` is not sorted order. Only repeated `poll()` gives you priority order.

### 6.3. ArrayDeque

`ArrayDeque` is usually the preferred modern stack/queue implementation for single-threaded code.

```java
Deque<Integer> stack = new ArrayDeque<>();
stack.push(1);
stack.push(2);
System.out.println(stack.pop()); // 2
```

It is generally better than legacy `Stack` and often better than `LinkedList` for queue/deque behavior due to lower object overhead.

## 7. Map: Key-Value

### 7.1. Comparison

| Implementation | Ordering | Null Key | Time Complexity | Best For |
|---|---|---|---|---|
| `HashMap` | Unordered | One | `O(1)` average | General use |
| `LinkedHashMap` | Insertion/access order | One | `O(1)` average | Ordered maps and LRU cache patterns |
| `TreeMap` | Sorted | No | `O(log n)` | Sorted navigation |
| `ConcurrentHashMap` | Unordered | No | `O(1)` average | Concurrent access |

`HashMap` is the default for general use, but map choice becomes architectural when iteration order, concurrency, or range-query behavior matter.

### 7.2. HashMap Internals (Java 8+)

`HashMap` uses buckets, hashing, and collision handling. In Java 8+, heavily-collided buckets may be treeified into red-black trees to avoid long linked-list lookups.

The interview point is simple: `hashCode()` chooses the bucket, `equals()` confirms key identity.

That means a good key type should usually be:

- immutable
- stable in equality semantics
- cheap to hash

### 7.3. LinkedHashMap: LRU Cache

`LinkedHashMap` can be configured in access-order mode, which makes it useful for small in-memory LRU caches.

```java
Map<String, String> cache = new LinkedHashMap<>(16, 0.75f, true) {
    @Override
    protected boolean removeEldestEntry(Map.Entry<String, String> eldest) {
        return size() > 100;
    }
};
```

This is fine for small local caches, but large production caching usually belongs in Caffeine, Redis, or another purpose-built system.

### 7.4. TreeMap: Sorted Map

`TreeMap` keeps keys ordered and exposes navigation APIs such as `firstKey()`, `lastKey()`, `higherKey()`, and `subMap()`.

It is a strong fit when ordering is part of the problem itself, not just a presentation detail.

## 8. Common Interview Questions

### 8.1. When Should I Use ArrayList vs LinkedList?

Use `ArrayList` by default. Reach for `LinkedList` only when you truly benefit from frequent end insertions/removals or need deque semantics.

In interviews, saying "ArrayList by default" is usually the safer and more realistic answer.

### 8.2. HashMap vs Hashtable vs ConcurrentHashMap?

`Hashtable` is legacy. `HashMap` is not thread-safe. `ConcurrentHashMap` is the normal choice for concurrent read/write access.

Also note that `ConcurrentHashMap` does not allow `null` keys or values, which removes ambiguity in concurrent access semantics.

### 8.3. HashMap vs TreeMap vs LinkedHashMap?

Use `HashMap` for speed, `LinkedHashMap` for predictable iteration order or LRU patterns, and `TreeMap` when you need sorted keys and range queries.

That distinction comes up often in API pagination, in-memory indexing, and business rules that depend on natural ordering.
