# Frontend — Async JavaScript

## 1. Callback

A **callback** is a function passed as an argument to another function, executed when the async task completes.

```javascript
getData(function(error, data) {
  if (error) {
    handle(error);
  } else {
    process(data);
  }
});
```

### 1.1. Drawback: Callback Hell

Nested callbacks lead to deeply indented, hard-to-read code.

```javascript
// Callback hell — avoid this
getData(function(err, data) {
  if (err) handle(err);
  else {
    getMoreData(data.id, function(err, more) {
      if (err) handle(err);
      else {
        processMore(more, function(err, result) {
          if (err) handle(err);
          else display(result);
        });
      }
    });
  }
});
```

> Callback hell makes code difficult to read, debug, and maintain. **Promises and async/await** solve this problem.

---

## 2. Promise

A **Promise** represents an async operation that may succeed or fail.

### 2.1. Promise States

| State | Description |
|-------|-------------|
| **Pending** | Initial state — operation not yet complete |
| **Fulfilled** | Operation completed successfully |
| **Rejected** | Operation failed |

### 2.2. Promise Methods

```javascript
fetch('/api/data')
  .then(res => res.json())          // Handle success
  .then(data => process(data))      // Chain another async operation
  .catch(error => handle(error))    // Handle error
  .finally(() => hideLoader());     // Always runs (success or failure)
```

### 2.3. Promise States Comparison

| Method | When it runs |
|--------|-------------|
| `.then(onFulfilled)` | When promise resolves |
| `.catch(onRejected)` | When promise rejects |
| `.finally(onFinally)` | Always (regardless of resolve/reject) |

### 2.4. Creating a Promise

```javascript
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

delay(1000).then(() => console.log('Done after 1 second'));
```

### 2.5. Promise.all — Parallel Execution

```javascript
// Run multiple promises in parallel, wait for all
const [users, posts] = await Promise.all([
  fetch('/api/users').then(r => r.json()),
  fetch('/api/posts').then(r => r.json())
]);

// If ANY promise rejects, Promise.all rejects
// Use Promise.allSettled to handle partial failures
const results = await Promise.allSettled([
  fetch('/api/users').then(r => r.json()),
  fetch('/api/posts').then(r => r.json())
]);
```

---

## 3. Async/Await

**Async/await** is syntactic sugar over Promises, making async code look and read like synchronous code.

### 3.1. Basic Usage

```javascript
async function fetchData() {
  try {
    const res = await fetch('/api/data');
    const data = await res.json();
    process(data);
  } catch (error) {
    handle(error);
  }
}
```

### 3.2. Key Rules

- `async` functions **always return a Promise**
- `await` **pauses execution** of the async function until the Promise resolves
- `await` can **only** be used inside `async` functions
- Use `try/catch` for **error handling**

### 3.3. Concurrent Requests

```javascript
// Sequential — slower (each waits for previous)
async function sequential() {
  const user = await getUser();
  const posts = await getPosts(user.id);   // Waits for getUser
}

// Concurrent — faster (both run simultaneously)
async function concurrent() {
  const [user, posts] = await Promise.all([
    getUser(),
    getPosts(userId)
  ]);
}
```

---

## 4. Event Loop

The **Event Loop** is JavaScript's mechanism for handling async tasks while maintaining a single-threaded execution model.

### 4.1. Key Concepts

| Concept | Description |
|---------|-------------|
| **Call Stack** | LIFO stack of functions to execute. Executes until empty. |
| **Heap** | Unstructured memory for objects |
| **Web APIs** | Browser-provided async APIs (setTimeout, fetch, DOM events) |
| **Microtask Queue** | Higher-priority queue for Promise callbacks |
| **Macrotask Queue** | Standard-priority queue for setTimeout, setInterval, I/O |

### 4.2. Execution Order

```
1. Synchronous code (Call Stack)
2. Microtasks (Promise.then, queueMicrotask, MutationObserver)
3. Macrotasks (setTimeout, setInterval, I/O callbacks)
4. Render (if applicable)
5. Repeat
```

### 4.3. Visual Example

```javascript
console.log('1');                                  // Sync → runs first
setTimeout(() => console.log('2'), 0);            // Macrotask → runs 4th
Promise.resolve().then(() => console.log('3'));   // Microtask → runs 3rd
console.log('4');                                  // Sync → runs second

// Output order: 1 → 4 → 3 → 2
```

### 4.4. Deep Dive Example

```javascript
console.log('A');

setTimeout(() => console.log('B'), 0);

Promise.resolve()
  .then(() => {
    console.log('C');
    Promise.resolve().then(() => console.log('D'));
  })
  .then(() => console.log('E'));

setTimeout(() => console.log('F'), 0);

console.log('G');

// Step-by-step:
// 1. Sync: A, G
// 2. Microtasks (1st pass): C, then microtask from C: D
// 3. Microtasks (2nd pass): E
// 4. Macrotasks: B, F

// Output: A → G → C → D → E → B → F
```

> **Key insight**: All microtasks run before the next macrotask, and new microtasks added during microtask processing also run immediately.

---

## 5. Error Handling

| Pattern | Method | Best For |
|---------|--------|---------|
| **Callback** | Error passed as first parameter (`err, data`) | Legacy Node.js code |
| **Promise** | `.catch()` | Chained async operations |
| **Async/Await** | `try/catch` | Sequential async code |

---

## 6. Array Methods

### 6.1. Map, Filter, Reduce

```javascript
// map — transform each element, return new array
const numbers = [1, 2, 3, 4];
const doubled = numbers.map(x => x * 2);          // [2, 4, 6, 8]

const users = [
  { name: 'Alice', age: 30 },
  { name: 'Bob', age: 25 }
];
const names = users.map(u => u.name);              // ['Alice', 'Bob']

// filter — return elements that pass condition
const evens = [1, 2, 3, 4].filter(x => x % 2 === 0);  // [2, 4]
const adults = users.filter(u => u.age >= 18);        // [Alice, Bob]

// reduce — accumulate single value
const sum = [1, 2, 3, 4].reduce((acc, x) => acc + x, 0);  // 10
const max = [3, 1, 4, 1].reduce((a, b) => a > b ? a : b);   // 4
const grouped = users.reduce((acc, u) => {
  acc[u.age >= 30 ? 'senior' : 'junior'].push(u);
  return acc;
}, { senior: [], junior: [] });
```

### 6.2. Find, Some, Every

```javascript
const numbers = [1, 2, 3, 4, 5];

// find — return first element matching condition
const found = numbers.find(x => x > 3);            // 4

// some — true if ANY element passes
const hasEven = numbers.some(x => x % 2 === 0);     // true

// every — true if ALL elements pass
const allPositive = numbers.every(x => x > 0);     // true
```

### 6.3. Chaining Methods

```javascript
const result = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  .filter(x => x % 2 === 0)    // [2, 4, 6, 8, 10]
  .map(x => x * x)             // [4, 16, 36, 64, 100]
  .reduce((sum, x) => sum + x, 0);  // 220
```

---

## 7. Shallow Clone vs Deep Clone

```javascript
// Shallow clone — only copies level 1
const arr2 = [...arr];
const arr3 = arr.slice();
const obj2 = { ...obj };
const obj3 = Object.assign({}, obj);

// Nested levels still share references!
const a = [[1, 2], [3, 4]];
const b = [...a];
b[0][0] = 99;   // a[0][0] is also 99! (shared reference)

// Deep clone
const deepClone = JSON.parse(JSON.stringify(obj));
// Limitations: loses functions, Date becomes string, undefined ignored

// Modern deep clone
structuredClone(obj);   // Native, handles most types

// Lodash deep clone
import { cloneDeep } from 'lodash';
const cloned = cloneDeep(obj);  // Handles functions, Date, etc.
```

---

## 8. Variables & Hoisting

| Keyword | Scope | Redeclare | Reassign | Hoisting |
|---------|-------|-----------|----------|----------|
| `var` | Function | Allowed | Allowed | Hoisted (undefined) |
| `let` | Block `{}` | Not allowed | Allowed | Hoisted (TDZ) |
| `const` | Block `{}` | Not allowed | Not allowed | Hoisted (TDZ) |

> **TDZ (Temporal Dead Zone)**: `let`/`const` are hoisted but cannot be accessed before their declaration. Accessing them causes a `ReferenceError`.

### 8.1. Function Hoisting

```javascript
// Function declarations are fully hoisted
sayHello();   // Works! "Hello!"
function sayHello() { console.log('Hello!'); }

// Function expressions are NOT hoisted
sayHi();      // TypeError! sayHi is undefined
var sayHi = function() { console.log('Hi!'); };
```

---

## 9. Arrow Functions vs Normal Functions

| | Arrow Function | Normal Function |
|--|---------------|----------------|
| `this` | Lexical (inherited from enclosing scope) | Dynamic (bound to how it's called) |
| `arguments` | Not available | Available |
| `super` | Lexical | Dynamic |
| `new` | Cannot be used as constructor | Can be used with `new` |
| Method in class | Not recommended (loses `this`) | Recommended |

---

## 10. Fetch API

```javascript
// GET request
fetch('/api/users')
  .then(res => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  })
  .then(data => console.log(data))
  .catch(err => console.error('Fetch error:', err));

// POST request
fetch('/api/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer token'
  },
  body: JSON.stringify({ name: 'Alice', email: 'alice@example.com' })
});

// AbortController — cancel fetch
const controller = new AbortController();
fetch('/api/data', { signal: controller.signal });

setTimeout(() => controller.abort(), 5000);   // Cancel after 5s
```
