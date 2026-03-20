# Java Core — Collections Framework

## 1. Tổng quan

**Collection Framework** là tập hợp các class và interface hỗ trợ thao tác với tập dữ liệu **động** (List, Set, Map, Queue).

> **Lưu ý:**
> - **`Collection`** là **Interface** — định nghĩa contract cho các collection.
> - **`Collections`** là **Class tiện ích** — chứa method `sort()`, `shuffle()`, `reverse()`, ...

### 1.1. Phân loại

| Giao diện | Mô tả | Triển khai chính |
|---|---|---|
| `List` | Có thứ tự, cho phép trùng lặp | `ArrayList`, `LinkedList`, `Vector` |
| `Set` | Không cho phép trùng lặp | `HashSet`, `LinkedHashSet`, `TreeSet` |
| `Queue` | Hàng đợi (FIFO) | `PriorityQueue`, `ArrayDeque` |
| `Deque` | Hàng đợi 2 đầu | `ArrayDeque`, `LinkedList` |
| `Map` | Key-Value (không thuộc Collection) | `HashMap`, `LinkedHashMap`, `TreeMap` |

## 2. Iterator vs ListIterator

| Tiêu chí | `Iterator` | `ListIterator` |
|---|---|---|
| **Hướng duyệt** | 1 chiều (forward) | 2 chiều (forward/backward) |
| **Dùng được với** | Tất cả Collection | Chỉ List |
| **Thao tác** | `next()`, `hasNext()`, `remove()` | Thêm, sửa, xóa + duyệt ngược |
| **Chỉ mục** | Không | Có (`nextIndex()`, `previousIndex()`) |

### 2.1. Ví dụ

```java
// Iterator — duyệt 1 chiều
List<String> list = List.of("A", "B", "C");
Iterator<String> iter = list.iterator();
while (iter.hasNext()) {
    String item = iter.next();
    if ("B".equals(item)) {
        iter.remove(); // xóa an toàn
    }
}

// ListIterator — duyệt 2 chiều
ListIterator<String> liter = list.listIterator();
while (liter.hasNext()) {
    liter.next();
}
while (liter.hasPrevious()) {
    System.out.println(liter.previous());
}
```

## 3. fail-fast vs fail-safe

| Cơ chế | Hành vi | Ví dụ | Ném exception |
|---|---|---|---|
| **fail-fast** | Phát hiện thay đổi khi duyệt, ném `ConcurrentModificationException` | `ArrayList`, `HashMap`, `HashSet` | Có |
| **fail-safe** | Duyệt trên bản sao hoặc không lock, cho phép thay đổi | `ConcurrentHashMap`, `CopyOnWriteArrayList` | Không |

### 3.1. Ví dụ fail-fast

```java
List<String> list = new ArrayList<>(List.of("A", "B", "C"));

for (String item : list) {
    // ConcurrentModificationException!
    if ("B".equals(item)) {
        list.remove(item);
    }
}

// Cách đúng: dùng Iterator và remove()
Iterator<String> iter = list.iterator();
while (iter.hasNext()) {
    if ("B".equals(iter.next())) {
        iter.remove(); // OK
    }
}
```

## 4. List — có thứ tự, cho phép trùng lặp

### 4.1. So sánh

| Triển khai | Truy cập theo chỉ mục | Thêm/Xóa đầu/cuối | Duyệt ngẫu nhiên | Thread-safe |
|---|---|---|---|---|
| `ArrayList` | O(1) | O(1) cuối, O(n) đầu | O(1) | Không |
| `LinkedList` | O(n) | O(1) đầu/cuối | O(n) | Không |
| `Vector` | O(1) | O(1) | O(1) | **Có** (legacy) |
| `Stack` | O(1) | O(1) push/pop | O(n) | **Có** (legacy) |

### 4.2. Ví dụ

```java
// ArrayList — phù hợp đọc nhiều
List<Integer> arrayList = new ArrayList<>();
arrayList.add(1);        // O(1)
arrayList.get(0);        // O(1)
arrayList.remove(0);     // O(n) vì dời phần tử

// LinkedList — phù hợp thêm/xóa đầu/cuối nhiều
LinkedList<Integer> linkedList = new LinkedList<>();
linkedList.addFirst(1); // O(1)
linkedList.addLast(2);  // O(1)
linkedList.get(0);      // O(n)

// LinkedList làm Stack/Queue/Deque
LinkedList<Integer> stack = new LinkedList<>();
stack.push(1); stack.push(2); // push
stack.pop();                   // pop
stack.peek();                  // xem đỉnh

// Vector — legacy, thread-safe, khuyến nghị dùng
// Collections.synchronizedList() hoặc CopyOnWriteArrayList
List<Integer> syncList = Collections.synchronizedList(new ArrayList<>());
```

> **Tip:** Nên khởi tạo `ArrayList` với capacity nếu biết trước kích thước:
> ```java
> new ArrayList<>(1000); // tránh resize nhiều lần
> ```

## 5. Set — không cho phép trùng lặp

### 5.1. So sánh

| Triển khai | Thứ tự | Time Complexity | Cho phép null | Thread-safe |
|---|---|---|---|---|
| `HashSet` | Không thứ tự | O(1) add/remove/contains | 1 null | Không |
| `LinkedHashSet` | Thứ tự thêm | O(1) | 1 null | Không |
| `TreeSet` | Tự nhiên / Comparator | O(log n) | **Không** null | Không |
| `CopyOnWriteArraySet` | Không thứ tự | O(n) add | Cho phép null | **Có** |

### 5.2. HashSet hoạt động như thế nào?

HashSet dựa trên **HashMap** bên trong. Khi thêm phần tử:

1. Gọi `hashCode()` — xác định bucket.
2. Gọi `equals()` — kiểm tra trùng lặp trong bucket.

```java
Set<String> set = new HashSet<>();
set.add("Java");
set.add("Python");
set.add("Java"); // bị bỏ qua vì trùng

System.out.println(set.size()); // 2

// LinkedHashSet — giữ thứ tự thêm
Set<String> orderedSet = new LinkedHashSet<>();
orderedSet.add("First");
orderedSet.add("Second");
orderedSet.add("Third"); // duyệt theo thứ tự thêm

// TreeSet — sắp xếp tự nhiên
Set<String> treeSet = new TreeSet<>();
treeSet.add("Banana");
treeSet.add("Apple");
treeSet.add("Cherry"); // duyệt theo alphabetical order
```

### 5.3. Tự tạo class dùng trong HashSet

```java
class Person {
    private String name;
    private int age;

    @Override
    public int hashCode() {
        return Objects.hash(name, age);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Person)) return false;
        Person p = (Person) o;
        return age == p.age && Objects.equals(name, p.name);
    }
}
```

> **Quy tắc:** Nếu 2 object `equals()` trả về `true`, chúng **phải** có cùng `hashCode()`.

## 6. Queue và Deque

### 6.1. So sánh

| Triển khai | Hàng đợi | Deque | Cho phép null | Thread-safe |
|---|---|---|---|---|
| `PriorityQueue` | Ưu tiên theo Comparator | Không | **Không** | Không |
| `ArrayDeque` | FIFO | **Có** (2 đầu) | **Không** | Không |
| `LinkedList` | FIFO | **Có** | Cho phép null | Không |
| `BlockingQueue` | Ưu tiên theo Comparator | Có (BlockingDeque) | **Không** | **Có** |

### 6.2. PriorityQueue

```java
// Mặc định: sắp xếp tăng dần theo Comparable
PriorityQueue<Integer> minHeap = new PriorityQueue<>();
minHeap.add(5);
minHeap.add(1);
minHeap.add(3);
System.out.println(minHeap.poll()); // 1
System.out.println(minHeap.poll()); // 3
System.out.println(minHeap.poll()); // 5

// Max-heap: dùng Collections.reverseOrder()
PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());
maxHeap.add(5);
maxHeap.add(1);
maxHeap.add(3);
System.out.println(maxHeap.poll()); // 5

// PriorityQueue với object tùy chỉnh
PriorityQueue<Task> taskQueue = new PriorityQueue<>(
    (t1, t2) -> t1.priority - t2.priority // priority cao hơn xử lý trước
);
taskQueue.add(new Task("Low", 1));
taskQueue.add(new Task("High", 5));
taskQueue.add(new Task("Medium", 3));

while (!taskQueue.isEmpty()) {
    System.out.println(taskQueue.poll().name); // High, Medium, Low
}
```

### 6.3. ArrayDeque

```java
// ArrayDeque làm Queue (FIFO)
ArrayDeque<Integer> queue = new ArrayDeque<>();
queue.addLast(1);  // enqueue
queue.addLast(2);
queue.removeFirst(); // dequeue → 1

// ArrayDeque làm Stack (LIFO)
ArrayDeque<Integer> stack = new ArrayDeque<>();
stack.addLast(1); // push
stack.addLast(2);
stack.removeLast(); // pop → 2
stack.peekLast();   // top → 1
```

## 7. Map — Key-Value

> **Lưu ý:** `Map` **không** thuộc `Collection` interface nhưng là một phần của Collection Framework.

### 7.1. So sánh

| Triển khai | Thứ tự | Truy xuất | Cho phép null key | Cho phép null value | Thread-safe |
|---|---|---|---|---|---|
| `HashMap` | Không thứ tự | O(1) avg | 1 null key | Nhiều null | Không |
| `LinkedHashMap` | Thứ tự thêm | O(1) avg | 1 null key | Nhiều null | Không |
| `TreeMap` | Sorted | O(log n) | **Không** null | Cho null | Không |
| `Hashtable` | Không thứ tự | O(1) avg | **Không** null | **Không** null | **Có** (legacy) |
| `ConcurrentHashMap` | Không thứ tự | O(1) avg | **Không** null | **Không** null | **Có** |

### 7.2. HashMap internals (Java 8+)

```java
// HashMap hoạt động như sau:
// 1. hash = key.hashCode() → xác định bucket
// 2. Nếu bucket có nhiều phần tử (≥ 8) → chuyển sang Red-Black Tree
// 3. Nếu bucket có ít phần tử (< 6) → quay lại LinkedList

Map<String, Integer> map = new HashMap<>();
map.put("Java", 1);
map.put("Python", 2);
map.put("Java", 3); // ghi đè value
System.out.println(map.get("Java")); // 3

// Duyệt Map
for (Map.Entry<String, Integer> entry : map.entrySet()) {
    System.out.println(entry.getKey() + " = " + entry.getValue());
}

map.keySet().forEach(key -> System.out.println(key));
map.values().forEach(val -> System.out.println(val));
```

### 7.3. LinkedHashMap — Cache LRU

```java
// LinkedHashMap với access order cho LRU Cache
LinkedHashMap<Integer, String> cache = new LinkedHashMap<>(10, 0.75f, true) {
    @Override
    protected boolean removeEldestEntry(Map.Entry eldest) {
        return size() > 5; // xóa entry cũ nhất khi vượt 5
    }
};

cache.put(1, "A");
cache.put(2, "B");
cache.get(1);  // access order: 2, 1
cache.put(3, "C");
cache.put(4, "D");
cache.put(5, "E");
cache.put(6, "F"); // xóa entry cũ nhất (key=2)
```

### 7.4. TreeMap — Sorted Map

```java
// TreeMap sắp xếp theo key
TreeMap<String, Integer> treeMap = new TreeMap<>();
treeMap.put("Banana", 2);
treeMap.put("Apple", 1);
treeMap.put("Cherry", 3);
System.out.println(treeMap.firstKey());  // Apple
System.out.println(treeMap.lastKey());  // Cherry
System.out.println(treeMap.lowerKey("Cherry")); // Banana
System.out.println(treeMap.higherKey("Apple")); // Banana
```

## 8. Các câu hỏi phỏng vấn thường gặp

### 8.1. Khi nào dùng ArrayList vs LinkedList?

```java
// ArrayList — đọc nhiều, thêm/xóa cuối
List<Integer> list = new ArrayList<>();
for (int i = 0; i < 1000; i++) {
    list.add(i);       // O(1) amortized
}
list.get(500);         // O(1) ← rất nhanh

// LinkedList — thêm/xóa đầu/cuối nhiều, hoặc cần iterator
LinkedList<Integer> linked = new LinkedList<>();
linked.addFirst(1);   // O(1)
linked.addLast(2);    // O(1)
```

### 8.2. HashMap vs Hashtable vs ConcurrentHashMap?

```java
// Hashtable — synchronized (legacy), chậm
Hashtable<String, Integer> ht = new Hashtable<>();
ht.put("a", 1);
// ht.put(null, 1); // NullPointerException!

// HashMap — không thread-safe, cho phép null
HashMap<String, Integer> hm = new HashMap<>();
hm.put(null, 1); // OK
hm.put("a", null); // OK

// ConcurrentHashMap — thread-safe, hiệu năng cao
ConcurrentHashMap<String, Integer> chm = new ConcurrentHashMap<>();
// chm.put(null, 1); // NullPointerException!
```

### 8.3. HashMap vs TreeMap vs LinkedHashMap?

| Map | Thứ tự | Null key | Hiệu năng |
|---|---|---|---|
| `HashMap` | Vô thứ tự | Cho phép | O(1) — nhanh nhất |
| `LinkedHashMap` | Thứ tự thêm/access | Cho phép | O(1) |
| `TreeMap` | Sorted | Không cho phép | O(log n) |
