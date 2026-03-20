# Frontend - Async JavaScript

## 1. Callback

**Callback** là một **hàm truyền vào hàm khác** làm tham số, được gọi lại khi tác vụ bất đồng bộ hoàn thành.

```javascript
// Basic callback
function getData(callback) {
  setTimeout(() => {
    callback(null, { name: 'Huy', age: 25 });
  }, 1000);
}

getData(function(error, data) {
  if (error) {
    console.error('Error:', error);
    return;
  }
  console.log('Data:', data);
});
```

```javascript
// Callback hell — nested callbacks
getData(function(error, data) {
  if (error) handle(error);
  else {
    getUser(data.userId, function(error, user) {
      if (error) handle(error);
      else {
        getPosts(user.id, function(error, posts) {
          if (error) handle(error);
          else {
            getComments(posts[0].id, function(error, comments) {
              if (error) handle(error);
              else {
                console.log(comments);
              }
            });
          }
        });
      }
    });
  }
});
```

> **Nhược điểm của Callback:** Dễ gây **callback hell** (nhiều callback lồng nhau), code khó đọc, khó debug, và error handling không nhất quán.

---

## 2. Promise

**Promise** đại diện cho một tác vụ bất đồng bộ có thể **hoàn thành** hoặc **thất bại**.

### 2.1. Promise States

```
Pending (đang chờ)
    ↓
Fulfilled (thành công) — resolved()
    hoặc
Rejected (thất bại) — rejected()
```

### 2.2. Basic Usage

```javascript
const promise = new Promise((resolve, reject) => {
  // Async operation
  fetch('/api/user')
    .then(res => res.json())
    .then(data => resolve(data))
    .catch(err => reject(err));
});

// Consuming
promise
  .then(data => console.log(data))
  .catch(error => console.error(error));
```

### 2.3. Chaining

```javascript
fetch('/api/users')
  .then(res => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  })
  .then(users => users.filter(u => u.active))
  .then(activeUsers => activeUsers.map(u => u.name))
  .then(names => console.log(names.join(', ')))
  .catch(error => console.error(error))
  .finally(() => hideLoader());
```

### 2.4. Promise Combinators

```javascript
// Promise.all — tất cả phải thành công
const [users, posts, comments] = await Promise.all([
  fetch('/api/users').then(r => r.json()),
  fetch('/api/posts').then(r => r.json()),
  fetch('/api/comments').then(r => r.json())
]);

// Promise.allSettled — không fail nếu một cái fail
const results = await Promise.allSettled([
  fetch('/api/users').then(r => r.json()),
  fetch('/api/old').then(r => r.json())  // Sẽ fail nhưng không ảnh hưởng
]);
results.forEach(result => {
  if (result.status === 'fulfilled') {
    console.log('Value:', result.value);
  } else {
    console.log('Reason:', result.reason);
  }
});

// Promise.race — ai về trước
const result = await Promise.race([
  fetch('/api/fast').then(r => r.json()),
  new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
]);

// Promise.any — bất kỳ ai thành công trước
const result = await Promise.any([
  fetch('/api/primary').then(r => r.json()),
  fetch('/api/backup').then(r => r.json())
]);
```

### 2.5. Creating Promises

```javascript
// From callback API
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// From value
Promise.resolve(value);

// From error
Promise.reject(new Error('Something went wrong'));

// From thenable
const thenable = {
  then(resolve, reject) {
    resolve(42);
  }
};
```

---

## 3. Async/Await

**Async/await** là cú pháp viết code bất đồng bộ **trông giống đồng bộ**, giúp code dễ đọc và dễ debug hơn Promise chaining.

### 3.1. Basic Usage

```javascript
async function fetchUser(id) {
  try {
    const res = await fetch(`/api/users/${id}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const user = await res.json();
    return user;
  } catch (error) {
    console.error('Fetch failed:', error);
    throw error;
  }
}

// Async arrow function
const fetchUser = async (id) => {
  const res = await fetch(`/api/users/${id}`);
  return res.json();
};
```

### 3.2. Error Handling

```javascript
async function getData() {
  try {
    const res = await fetch('/api/data');
    const data = await res.json();
    return data;
  } catch (error) {
    // Handle network error, JSON parse error
    console.error('Failed:', error);
    return null;
  } finally {
    // Always runs — cleanup
    hideLoader();
  }
}

// Multiple awaits
async function getDashboard() {
  try {
    const [user, posts, stats] = await Promise.all([
      fetchUser(1),
      fetchPosts(1),
      fetchStats()
    ]);
    return { user, posts, stats };
  } catch (error) {
    console.error('Dashboard load failed:', error);
    throw error;
  }
}
```

### 3.3. Rules

- `async` function luôn trả về **Promise**.
- Dùng `await` **chỉ bên trong** `async` function.
- Dùng `try/catch` để xử lý lỗi.
- `await` đợi Promise resolve trước khi tiếp tục.

---

## 4. Event Loop

**Event Loop** là cơ chế giúp JavaScript (single-threaded) xử lý các tác vụ bất đồng bộ (callback, promise, timer...) mà không block execution.

### 4.1. Call Stack

- Nơi JS xếp các hàm cần thực thi theo thứ tự **LIFO** (Last In, First Out).
- Khi hàm chạy xong → bị **pop** khỏi stack.

### 4.2. Task Queue (Macrotasks)

- Callback của `setTimeout`, `setInterval`, I/O, UI rendering, `requestAnimationFrame`.
- Được đưa vào queue sau khi **Call Stack trống**.

### 4.3. Microtask Queue

- Callback của `Promise.then()`, `Promise.catch()`, `Promise.finally()`, `queueMicrotask()`, `MutationObserver`.
- **Ưu tiên cao hơn macrotask** — chạy hết microtasks trước khi lấy macrotask tiếp theo.

### 4.4. Thứ tự thực thi

```
1. Call Stack (đồng bộ)
2. Microtasks Queue (Promise.then, queueMicrotask)
3. Macrotasks Queue (setTimeout, setInterval, I/O, Rendering)
4. → Lặp lại
```

### 4.5. Visualization

```javascript
console.log('1');                           // sync → Call Stack

setTimeout(() => console.log('2'), 0);      // macrotask → Task Queue

Promise.resolve().then(() => {              // microtask → Microtask Queue
  console.log('3');
});

console.log('4');                           // sync → Call Stack

// Output: 1 → 4 → 3 → 2
//         ↑     ↑
//       sync  sync
//                              ↑ microtask
//                                            ↑ macrotask
```

```javascript
// More complex example
console.log('1');                 // 1

setTimeout(() => console.log('2'), 0);      // macrotask

Promise.resolve()
  .then(() => {
    console.log('3');
    Promise.resolve().then(() => console.log('4'));  // nested microtask
  })
  .then(() => console.log('5'));

setTimeout(() => console.log('6'), 0);      // macrotask

console.log('7');                 // 7

// Output: 1 → 7 → 3 → 4 → 5 → 2 → 6
```

---

## 5. Error Handling

| Phương thức | Cách xử lý |
|-------------|-----------|
| **Callback** | Lỗi truyền qua tham số đầu tiên: `callback(error, data)` |
| **Promise** | `.catch()` hoặc `try/catch` bên trong async function |
| **Async/Await** | `try/catch` |

```javascript
// Bad: unhandled rejection
fetch('/api/data')
  .then(res => res.json())
  .then(data => process(data));
// Lỗi ở .then() không được handle!

// Good: always handle
fetch('/api/data')
  .then(res => res.json())
  .then(data => process(data))
  .catch(error => console.error(error));

// Async/await
async function fetchData() {
  try {
    const res = await fetch('/api/data');
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;  // Re-throw if needed
  }
}

// Global unhandled rejection handler
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});
```

---

## 6. Array Methods

### 6.1. Map, Filter, Reduce

```javascript
const numbers = [1, 2, 3, 4, 5];

// map: trả mảng mới với phần tử đã biến đổi
const doubled = numbers.map(x => x * 2);  // [2, 4, 6, 8, 10]

// filter: trả mảng mới với phần tử thỏa điều kiện
const evens = numbers.filter(x => x % 2 === 0);  // [2, 4]

// reduce: duyệt, tính toán ra một giá trị duy nhất
const sum = numbers.reduce((acc, x) => acc + x, 0);  // 15
const product = numbers.reduce((acc, x) => acc * x, 1);  // 120

// Chain
const result = numbers
  .filter(x => x > 2)           // [3, 4, 5]
  .map(x => x * 2)              // [6, 8, 10]
  .reduce((acc, x) => acc + x, 0);  // 24
```

### 6.2. Find, Some, Every

```javascript
const users = [
  { name: 'Huy', age: 25, active: true },
  { name: 'Hieu', age: 30, active: false },
  { name: 'Minh', age: 22, active: true }
];

const found = users.find(u => u.age > 25);    // { name: 'Hieu', age: 30 }
const index = users.findIndex(u => u.age > 25);  // 1
const hasEven = [1, 2, 3].some(x => x % 2 === 0);  // true
const allPositive = [1, 2, 3].every(x => x > 0);     // true
const allActive = users.every(u => u.active);        // false
const hasHieu = users.some(u => u.name === 'Hieu');  // true
```

### 6.3. Flat & FlatMap

```javascript
const nested = [1, [2, 3], [4, [5, 6]]];
nested.flat();              // [1, 2, 3, 4, [5, 6]]
nested.flat(2);             // [1, 2, 3, 4, 5, 6]

const words = ['Hello', 'World'];
words.flatMap(w => w.split(''));  // ['H','e','l','l','o','W','o','r','l','d']

// Tương đương với:
words.map(w => w.split('')).flat();
```

### 6.4. Sort

```javascript
const nums = [3, 1, 4, 1, 5, 9];
nums.sort((a, b) => a - b);    // ascending: [1, 1, 3, 4, 5, 9]
nums.sort((a, b) => b - a);    // descending: [9, 5, 4, 3, 1, 1]

const users = [{ name: 'Huy' }, { name: 'Anh' }, { name: 'Binh' }];
users.sort((a, b) => a.name.localeCompare(b.name));  // alphabetical
```

---

## 7. Variables & Hoisting

| Từ khóa | Scope | Khai báo lại | Gán lại | Hoisting |
|---------|-------|-------------|---------|---------|
| `var` | Function | Được | Được | Hoisted (undefined) |
| `let` | Block `{}` | Không | Được | Hoisted (TDZ) |
| `const` | Block `{}` | Không | Không | Hoisted (TDZ) |

> **TDZ (Temporal Dead Zone):** `let`/`const` được hoisted nhưng không thể truy cập trước khi khai báo (sẽ gây `ReferenceError`).

### 7.1. Hoisting Examples

```javascript
// var hoisting
console.log(x);  // undefined (không phải Error)
var x = 5;
// JavaScript hiểu:
// var x;
// console.log(x);
// x = 5;

// let/const TDZ
console.log(y);  // ReferenceError: Cannot access 'y' before initialization
let y = 10;

// Function declaration hoisting
greet();  // "Hello!" — hoisting hoàn toàn
function greet() {
  console.log("Hello!");
}

// Function expression KHÔNG hoist
sayHi();  // TypeError: sayHi is not a function
var sayHi = function() {
  console.log("Hi!");
};
```

---

## 8. Arrow Function vs Normal Function

| | Arrow Function | Normal Function |
|--|---------------|----------------|
| `this` | **Lexical** (lấy từ outer scope) | Dynamic (bind theo cách gọi) |
| `arguments` | Không có | Có |
| `super` | Lexical | Dynamic |
| `new` | Không thể dùng với `new` | Có thể dùng với `new` |
| `prototype` | Không có | Có |
| Hoisting | Giống | Giống |

```javascript
// this binding
function Timer() {
  this.seconds = 0;
  setInterval(() => {
    this.seconds++;  // this = Timer instance (lexical)
  }, 1000);

  // Vs normal function:
  // setInterval(function() {
  //   this.seconds++;  // this = undefined (strict) / window (sloppy)
  // }, 1000);
}

// Not usable as constructor
const Person = (name) => {
  this.name = name;  // Error: Cannot set property 'name' on undefined
};
// new Person('Huy');  // Error
```

---

## 9. Optional Chaining & Nullish Coalescing

```javascript
const user = { profile: { address: { city: 'Hanoi' } } };

// Optional chaining (?.) — truy cập nested properties an toàn
const city = user?.profile?.address?.city;     // 'Hanoi'
const zip = user?.profile?.address?.zip;        // undefined (không lỗi)
const street = user?.profile?.work?.street;     // undefined

// Array/item access
const first = arr?.[0];
const second = obj?.items?.[1];

// Method call
const result = obj?.compute?.();

// Nullish coalescing (??) — giá trị mặc định khi null/undefined
const displayName = name ?? 'Guest';     // 'Guest' nếu name là null/undefined
const count = value ?? 0;               // 0 nếu value là null/undefined

// Kết hợp
const city = user?.profile?.address?.city ?? 'Unknown';

// Khác với ||
const a = 0 || 10;     // 10 (vì 0 là falsy)
const b = 0 ?? 10;     // 0 (vì 0 không phải nullish)
const c = '' || 'default';   // 'default' (vì '' là falsy)
const d = '' ?? 'default';   // '' (vì '' không phải nullish)
```

---

## 10. Fetch API

```javascript
// GET request
const res = await fetch('/api/users');
const users = await res.json();

// POST request
const res = await fetch('/api/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({ name: 'Huy', email: 'huy@example.com' })
});
const user = await res.json();

// Error handling
async function fetchData(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }
  return res.json();
}

// With AbortController (cancellation)
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 5000);

try {
  const res = await fetch(url, { signal: controller.signal });
  const data = await res.json();
} catch (error) {
  if (error.name === 'AbortError') {
    console.log('Request cancelled / timed out');
  }
} finally {
  clearTimeout(timeoutId);
}
```

---

## 11. Common Interview Questions

### Q: Event Loop vs Call Stack?

- **Call Stack:** Nơi thực thi code đồng bộ (LIFO).
- **Event Loop:** Cơ chế kiểm tra xem Call Stack có trống không, sau đó đưa microtasks/macrotasks vào execute.

### Q: Microtask vs Macrotask priority?

Microtasks **luôn được ưu tiên** trước macrotasks. Sau khi Call Stack trống, **tất cả** microtasks phải được xử lý trước khi bất kỳ macrotask nào được lấy ra.

### Q: Tạo Promise từ callback?

```javascript
function promisify(fn) {
  return (...args) => new Promise((resolve, reject) => {
    fn(...args, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
  });
}

// Usage
const readFilePromisified = promisify(require('fs').readFile);
const data = await readFilePromisified('./file.txt', 'utf8');
```

### Q: Sự khác biệt giữa `async/await` và Promise?

- `async/await` chỉ là **syntactic sugar** trên Promise.
- Mọi `async` function đều trả về Promise.
- `await` **pause** function execution cho đến khi Promise resolve, nhưng **không block** JavaScript engine (event loop vẫn xử lý tác vụ khác).

### Q: Shallow clone vs Deep clone?

```javascript
// Shallow clone (cấp 1)
const arr2 = [...arr];
const obj2 = { ...obj };
// Nested objects vẫn giữ tham chiếu

// Deep clone
const deepClone = JSON.parse(JSON.stringify(obj));
// Hạn chế: không clone được function, Date, Symbol, undefined

// Modern approach
structuredClone(obj);  // Native, hỗ trợ nhiều types hơn

// Lodash
import { cloneDeep } from 'lodash';
const cloned = cloneDeep(obj);
```
