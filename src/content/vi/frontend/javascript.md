# Frontend — JavaScript ES6+

## 1. ES6+ Syntax

### 1.1. Optional Chaining và Nullish Coalescing

```javascript
// Optional chaining (?.) — truy cập thuộc tính lồng nhau an toàn
const city = user?.address?.city;       // undefined nếu bất kỳ link nào là null/undefined
const street = user?.address?.street ?? 'Unknown';

// Nullish coalescing (??) — giá trị mặc định chỉ khi null/undefined
const port = config.port ?? 3000;        // 3000 nếu port là null hoặc undefined
const name = user.name ?? 'Anonymous';   // Khác với ||, 0 hoặc '' là giá trị hợp lệ

// Kết hợp cả hai
const zipCode = user?.address?.zipCode ?? '00000';
```

> Khác với `||`, toán tử nullish coalescing `??` chỉ dùng giá trị mặc định cho `null` hoặc `undefined`, không phải cho falsy values như `0` hay `''`.

### 1.2. Rest và Spread Nâng Cao

```javascript
// Rest — thu thập các argument còn lại thành mảng
function format(template, ...values) {
  return values.map(v => template.replace('%', v));
}
format('Hello % and %', 'Alice', 'Bob'); // ['Hello Alice and Bob']

// Spread trong lời gọi hàm
const nums = [3, 1, 4];
Math.max(...nums);    // 4

// Spread để gộp object (shallow)
const defaults = { theme: 'light', lang: 'en' };
const userPrefs = { theme: 'dark' };
const settings = { ...defaults, ...userPrefs };  // { theme: 'dark', lang: 'en' }
```

### 1.3. Enhanced Object Literals

```javascript
const name = 'Alice';
const age = 30;

// Shorthand property names
const user = { name, age };           // Tương đương { name: name, age: age }

// Computed property keys
const key = 'dynamicKey';
const obj = { [key]: 'value' };        // { dynamicKey: 'value' }

// Method shorthand
const calculator = {
  value: 0,
  add(n) { this.value += n; },
  subtract(n) { this.value -= n; }
};
```

---

## 2. Variables và Hoisting

### 2.1. var vs let vs const

| Đặc điểm | `var` | `let` | `const` |
|---------|-------|-------|--------|
| Scope | Function | Block `{}` | Block `{}` |
| Hoisting | Có (khởi tạo là `undefined`) | Có (TDZ) | Có (TDZ) |
| Redeclare | Cho phép | Không cho phép | Không cho phép |
| Reassign | Cho phép | Cho phép | Không cho phép |
| Global object | Có | Không | Không |

### 2.2. Temporal Dead Zone (TDZ)

```javascript
// var được hoisting và khởi tạo là undefined
console.log(greets);  // undefined (không lỗi)
var greets = 'hello';

// let/const được hoisting nhưng không khởi tạo (TDZ)
console.log(x);        // ReferenceError: Cannot access 'x' before initialization
let x = 10;
```

### 2.3. Các Loại Scope

```javascript
const global = 'Tôi là global';     // Global scope

function outer() {
  const outerVar = 'Tôi là outer';  // Function scope

  if (true) {
    const blockVar = 'Tôi là block';  // Block scope (let/const)
    var functionScoped = 'Tôi lọt ra ngoài'; // Không có block scope với var
    console.log(global);    // ✓ Truy cập được
    console.log(outerVar);  // ✓ Truy cập được
    console.log(blockVar);  // ✓ Truy cập được
  }

  console.log(blockVar);   // ReferenceError — block-scoped
  console.log(functionScoped); // ✓ Truy cập được — var bỏ qua block
}
```

**Lexical scope**: biến được resolve dựa trên nơi function được định nghĩa trong source code. **Dynamic scope** (JS dùng lexical): scope được xác định tại compile time bởi text của chương trình.

---

## 3. Closures Chi Tiết

Closure là khi một function "nhớ" các biến từ outer scope ngay cả sau khi outer function đã thực thi xong.

### 3.1. Các Câu Hỏi Phỏng Vấn Kinh Điển

```javascript
// Câu hỏi: Output là gì?
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Output: 3, 3, 3 (var có function scope, loop kết thúc trước khi callback chạy)

// Giải pháp 1: Dùng let (block-scoped)
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Output: 0, 1, 2 (mỗi iteration có binding riêng)

// Giải pháp 2: IIFE để tạo closure
for (var i = 0; i < 3; i++) {
  ((j) => setTimeout(() => console.log(j), 100))(i);
}
// Output: 0, 1, 2
```

### 3.2. Các Pattern Closure Thực Tế

```javascript
// Private state
function createCounter() {
  let count = 0;  // Private — không truy cập được trực tiếp
  return {
    increment: () => ++count,
    decrement: () => --count,
    getCount: () => count
  };
}
const counter = createCounter();
counter.increment();  // 1
counter.increment();  // 2
counter.getCount();   // 2
// count không truy cập được từ bên ngoài

// Memoization
function memoize(fn) {
  const cache = new Map();
  return (n) => {
    if (cache.has(n)) return cache.get(n);
    const result = fn(n);
    cache.set(n, result);
    return result;
  };
}

const fib = memoize(n => n <= 1 ? n : fib(n - 1) + fib(n - 2));
fib(50);  // Nhanh — kết quả được cache
```

---

## 4. `this` và Function Context

### 4.1. `this` Được Xác Định Như Thế Nào

| Cách gọi | Giá trị `this` |
|------------|-------------|
| Regular function call | Global object (`window`/`global`) hoặc `undefined` (strict mode) |
| Method call | Object trước dấu chấm |
| `call(obj, ...args)` | `obj` |
| `apply(obj, [args])` | `obj` |
| `bind(obj)` | Vĩnh viễn bound với `obj` |
| Arrow function | Lexical `this` (từ enclosing scope) |

### 4.2. call, apply, bind

```javascript
const person = { name: 'Alice', greeting: 'Hello' };
const another = { name: 'Bob', greeting: 'Hi' };

function introduce(city, country) {
  console.log(`${this.greeting}, I'm ${this.name} from ${city}, ${country}`);
}

introduce.call(person, 'Hanoi', 'Vietnam');    // Hello, I'm Alice from Hanoi, Vietnam
introduce.apply(person, ['Hanoi', 'Vietnam']); // Tương tự, args là array
const bound = introduce.bind(another);
bound('Paris', 'France');                      // Hi, I'm Bob from Paris, France
```

### 4.3. Arrow Functions và `this`

```javascript
function Timer() {
  this.seconds = 0;

  // Arrow function — 'this' được lexically bound với Timer
  setInterval(() => {
    this.seconds++;
    console.log(this.seconds);
  }, 1000);

  // Regular function — 'this' sẽ là undefined (strict) hoặc global
  // setInterval(function() { this.seconds++; }, 1000); // Sai!
}
```

---

## 5. Prototype và Inheritance

### 5.1. Prototype Chain

```javascript
const animal = { eats: true };
const rabbit = { jumps: true };
rabbit.__proto__ = animal;  // rabbit's prototype là animal

console.log(rabbit.eats);   // true — inherited từ animal
console.log(rabbit.jumps);  // true — own property

// Object.create() — thiết lập prototype tường minh
const dog = Object.create(animal);
dog.bark = function() { return 'Woof!'; };

// hasOwnProperty — kiểm tra property có phải own (không phải inherited)
console.log(dog.hasOwnProperty('bark'));    // true
console.log(dog.hasOwnProperty('eats'));    // false (inherited)
```

### 5.2. Class Syntax

```javascript
class Vehicle {
  constructor(wheels) {
    this.wheels = wheels;
  }

  describe() {
    return `A vehicle with ${this.wheels} wheels`;
  }
}

class Car extends Vehicle {
  constructor(make, model) {
    super(4);         // Gọi parent constructor
    this.make = make;
    this.model = model;
  }

  describe() {
    return `${this.make} ${this.model} — ${super.describe()}`;
  }

  static info() {
    return 'Cars are motor vehicles.';
  }
}

const civic = new Car('Honda', 'Civic');
civic.describe();        // Honda Civic — A vehicle with 4 wheels
Car.info();              // Cars are motor vehicles.
```

---

## 6. Array Methods Chi Tiết

```javascript
const users = [
  { id: 1, name: 'Alice', active: true },
  { id: 2, name: 'Bob', active: false },
  { id: 3, name: 'Charlie', active: true }
];

// find — phần tử đầu tiên thỏa điều kiện
users.find(u => u.active);           // { id: 1, name: 'Alice', active: true }

// findIndex — index của phần tử đầu tiên thỏa điều kiện (hoặc -1)
users.findIndex(u => u.name === 'Bob'); // 1

// includes — kiểm tra primitive
[1, 2, 3].includes(2);                // true
[1, 2, 3].includes(5);                // false

// flat — làm phẳng mảng lồng nhau
[1, [2, [3, [4]]]].flat(2);           // [1, 2, 3, [4]]
[1, [2, 3]].flat();                  // [1, 2, 3] (depth mặc định 1)

// flatMap — map rồi flatten (1 cấp)
const words = ['hello world', 'foo bar'];
words.flatMap(s => s.split(' '));    // ['hello', 'world', 'foo', 'bar']
// Tương đương: words.map(...).flat() nhưng hiệu quả hơn
```

---

## 7. Object Manipulation

```javascript
const config = { host: 'localhost', port: 3000 };
const user = { name: 'Alice', age: 30 };

// Object.keys / values / entries
Object.keys(user);     // ['name', 'age']
Object.values(user);   // ['Alice', 30]
Object.entries(user);  // [['name', 'Alice'], ['age', 30]]

// Object.assign — gộp objects (shallow)
const merged = Object.assign({}, config, { port: 8080, debug: true });
// { host: 'localhost', port: 8080, debug: true }

// Object.freeze — ngăn chặn thay đổi
const frozen = Object.freeze({ a: 1, b: { nested: 2 } });
frozen.a = 99;           // Strict mode: im lặng hoặc throw
// frozen.b.nested = 99; // Vẫn thay đổi được! (chỉ freeze shallow)

// Deep freeze
function deepFreeze(obj) {
  Object.keys(obj).forEach(key => {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      deepFreeze(obj[key]);
    }
  });
  return Object.freeze(obj);
}
```

---

## 8. Event Loop: Microtasks vs Macrotasks

### 8.1. Thứ Tự Ưu Tiên Tasks

```
Call Stack → Microtasks (Promise.then, queueMicrotask) → Macrotasks (setTimeout, setInterval, I/O) → Render → Lặp lại
```

### 8.2. setTimeout vs setImmediate vs process.nextTick

```javascript
// setTimeout(0) — macrotask, được lên lịch sau call stack hiện tại + tất cả microtasks
setTimeout(() => console.log('timeout'), 0);

// process.nextTick (Node.js only) — ưu tiên cao nhất, chạy trước microtasks khác
process.nextTick(() => console.log('nextTick'));

// queueMicrotask — đặt microtask tường minh
queueMicrotask(() => console.log('microtask'));

// setImmediate (Node.js) — chạy sau I/O callbacks, trước timers
setImmediate(() => console.log('immediate'));
```

### 8.3. Câu Hỏi Output Order

```javascript
console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
queueMicrotask(() => console.log('4'));
setImmediate(() => console.log('5'));

// Sync: 1
// Microtasks (lần 1): 3, 4
// Macrotasks: 2, 5

// Output: 1 → 3 → 4 → 2 → 5
// (thứ tự 2 và 5 có thể khác nhau giữa browser và Node.js)
```

---

## 9. Immutability Patterns

### 9.1. Tại Sao Immutability Quan Trọng

React sử dụng reference equality (`===`) để phát hiện thay đổi. Thay đổi trực tiếp (mutation) không thay đổi object reference, nên component sẽ không re-render.

### 9.2. Array Immutability

```javascript
// Thêm phần tử
setItems([...items, newItem]);          // Spread + phần tử mới

// Xóa phần tử
setItems(items.filter(i => i.id !== id)); // Mảng mới, đã lọc

// Cập nhật phần tử
setItems(items.map(i =>
  i.id === id ? { ...i, ...updates } : i
));

// Cập nhật lồng nhau
setCart({
  ...cart,
  items: cart.items.map(item =>
    item.id === id ? { ...item, quantity: item.quantity + 1 } : item
  )
});
```

### 9.3. Object Immutability

```javascript
// Cập nhật thuộc tính lồng nhau
setUser({ ...user, address: { ...user.address, city: 'Paris' } });

// Utility: immer (cho nested state phức tạp)
import { produce } from 'immer';
setUser(produce(draft => {
  draft.address.city = 'Paris';
  draft.profile.tags.push('developer');
}));
```

---

## 10. Debouncing và Throttling

### 10.1. Debounce — Trì Hoãn Đến Khi Idle

Chỉ thực thi sau khi user ngừng gọi trong một khoảng thời gian.

```javascript
function debounce(fn, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Sử dụng: search input
const handleSearch = debounce((query) => {
  fetchResults(query);
}, 300);

input.addEventListener('input', e => handleSearch(e.target.value));
```

### 10.2. Throttle — Giới Hạn Tần Suất

Thực thi tối đa một lần trong một khoảng thời gian.

```javascript
function throttle(fn, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Sử dụng: scroll handler
const handleScroll = throttle(() => {
  updateProgressBar(window.scrollY);
}, 100);

window.addEventListener('scroll', handleScroll);
```

| | Debounce | Throttle |
|--|----------|----------|
| **Use case** | Search input, form validation | Scroll, resize, button clicks |
| **Behavior** | Reset timer mỗi lần gọi | Bỏ qua các lần gọi trong khoảng |
| **Fires** | Sau lần gọi cuối cùng | Tối đa 1 lần mỗi khoảng |

---

## 11. Câu Hỏi Phỏng Vấn

**Q: Sự khác biệt giữa `Object.create()` và `new Object()`?**

> `new Object()` tạo object từ constructor (set `Object.prototype` làm prototype). `Object.create(proto)` tạo object với `proto` được set làm prototype một cách tường minh, cho phép tạo prototype chain không cần constructor. Nó cũng có thể tạo object với prototype là `null`.

**Q: `structuredClone()` khác gì `JSON.parse(JSON.stringify())`?**

> `structuredClone()` là native browser API xử lý được circular references, `Date` objects, `Map`, `Set`, `ArrayBuffer`, và nhiều hơn nữa. `JSON.parse(JSON.stringify())` mất `undefined`, functions, `Symbol`, và `Date` trở thành string.

**Q: Output là gì?**

```javascript
const arr = [1, 2, 3];
arr[10] = 10;
console.log(arr.length);       // 11 (sparse array: [1,2,3,<7 empty>,10])
console.log(arr.filter(x => x).length); // 4 (empty slots bị bỏ qua)
```

**Q: Giải thích sự khác nhau giữa `__proto__` và `prototype`.**

> `__proto__` là accessor property trên mọi object trỏ đến prototype của nó. `prototype` là property trên constructor function, trở thành `__proto__` của các object được tạo qua `new`. Mọi function đều có `prototype`, nhưng chỉ objects mới có `__proto__`.
