# Frontend — JavaScript ES6+

## 1. ES6+ Syntax

### 1.1. Optional Chaining and Nullish Coalescing

```javascript
// Optional chaining (?.) — safely access nested properties
const city = user?.address?.city;       // undefined if any link is null/undefined
const street = user?.address?.street ?? 'Unknown';

// Nullish coalescing (??) — default only for null/undefined
const port = config.port ?? 3000;       // 3000 if port is null or undefined
const name = user.name ?? 'Anonymous';  // Unlike ||, 0 or '' are valid values

// Chaining together
const zipCode = user?.address?.zipCode ?? '00000';
```

> Unlike `||`, the nullish coalescing operator `??` only falls back to the default for `null` or `undefined`, not for falsy values like `0` or `''`.

### 1.2. Rest and Spread in Depth

```javascript
// Rest — collect remaining arguments into an array
function format(template, ...values) {
  return values.map(v => template.replace('%', v));
}
format('Hello % and %', 'Alice', 'Bob'); // ['Hello Alice and Bob']

// Spread in function calls
const nums = [3, 1, 4];
Math.max(...nums);    // 4

// Spread for object merging (shallow)
const defaults = { theme: 'light', lang: 'en' };
const userPrefs = { theme: 'dark' };
const settings = { ...defaults, ...userPrefs };  // { theme: 'dark', lang: 'en' }
```

### 1.3. Enhanced Object Literals

```javascript
const name = 'Alice';
const age = 30;

// Shorthand property names
const user = { name, age };           // Same as { name: name, age: age }

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

## 2. Variables and Hoisting

### 2.1. var vs let vs const

| Feature | `var` | `let` | `const` |
|---------|-------|-------|--------|
| Scope | Function | Block `{}` | Block `{}` |
| Hoisting | Yes (initialized as `undefined`) | Yes (TDZ) | Yes (TDZ) |
| Redeclare | Allowed | Not allowed | Not allowed |
| Reassign | Allowed | Allowed | Not allowed |
| Global object | Yes | No | No |

### 2.2. Temporal Dead Zone (TDZ)

```javascript
// var is hoisted and initialized as undefined
console.log(greets);  // undefined (no error)
var greets = 'hello';

// let/const are hoisted but not initialized (TDZ)
console.log(x);        // ReferenceError: Cannot access 'x' before initialization
let x = 10;
```

### 2.3. Scope Types

```javascript
const global = 'I am global';     // Global scope

function outer() {
  const outerVar = 'I am outer';  // Function scope

  if (true) {
    const blockVar = 'I am block';  // Block scope (let/const)
    var functionScoped = 'I leak out'; // No block scope for var
    console.log(global);    // ✓ Accessible
    console.log(outerVar);  // ✓ Accessible
    console.log(blockVar);  // ✓ Accessible
  }

  console.log(blockVar);   // ReferenceError — block-scoped
  console.log(functionScoped); // ✓ Accessible — var ignores blocks
}
```

**Lexical scope** (static): variables are resolved based on where functions are defined in the source code. **Dynamic scope** (JS uses lexical, not dynamic): the scope is determined at compile time by the text of the program.

---

## 3. Closures in Depth

A closure is formed when a function "remembers" variables from its outer scope even after the outer function has finished executing.

### 3.1. Classic Interview Questions

```javascript
// Question: What is logged?
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Output: 3, 3, 3 (var is function-scoped, loop finishes before callbacks run)

// Solution 1: Use let (block-scoped)
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Output: 0, 1, 2 (each iteration gets its own binding)

// Solution 2: IIFE to create closure
for (var i = 0; i < 3; i++) {
  ((j) => setTimeout(() => console.log(j), 100))(i);
}
// Output: 0, 1, 2
```

### 3.2. Practical Closure Patterns

```javascript
// Private state
function createCounter() {
  let count = 0;  // Private — cannot be accessed directly
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
// count is not accessible from outside

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
fib(50);  // Fast — cached results
```

---

## 4. `this` and Function Context

### 4.1. How `this` is Determined

| Invocation | `this` value |
|------------|-------------|
| Regular function call | Global object (`window`/`global`) or `undefined` (strict mode) |
| Method call | The object before the dot |
| `call(obj, ...args)` | `obj` |
| `apply(obj, [args])` | `obj` |
| `bind(obj)` | Permanently bound to `obj` |
| Arrow function | Lexical `this` (from enclosing scope) |

### 4.2. call, apply, bind

```javascript
const person = { name: 'Alice', greeting: 'Hello' };
const another = { name: 'Bob', greeting: 'Hi' };

function introduce(city, country) {
  console.log(`${this.greeting}, I'm ${this.name} from ${city}, ${country}`);
}

introduce.call(person, 'Hanoi', 'Vietnam');    // Hello, I'm Alice from Hanoi, Vietnam
introduce.apply(person, ['Hanoi', 'Vietnam']); // Same, args as array
const bound = introduce.bind(another);
bound('Paris', 'France');                      // Hi, I'm Bob from Paris, France
```

### 4.3. Arrow Functions and `this`

```javascript
function Timer() {
  this.seconds = 0;

  // Arrow function — 'this' is lexically bound to Timer
  setInterval(() => {
    this.seconds++;
    console.log(this.seconds);
  }, 1000);

  // Regular function — 'this' would be undefined (strict) or global
  // setInterval(function() { this.seconds++; }, 1000); // Wrong!
}
```

---

## 5. Prototype and Inheritance

### 5.1. Prototype Chain

```javascript
const animal = { eats: true };
const rabbit = { jumps: true };
rabbit.__proto__ = animal;  // rabbit's prototype is animal

console.log(rabbit.eats);   // true — inherited from animal
console.log(rabbit.jumps);  // true — own property

// Object.create() — explicit prototype setting
const dog = Object.create(animal);
dog.bark = function() { return 'Woof!'; };

// hasOwnProperty — check if property is own (not inherited)
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
    super(4);         // Call parent constructor
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

## 6. Array Methods Deep Dive

```javascript
const users = [
  { id: 1, name: 'Alice', active: true },
  { id: 2, name: 'Bob', active: false },
  { id: 3, name: 'Charlie', active: true }
];

// find — first matching element
users.find(u => u.active);           // { id: 1, name: 'Alice', active: true }

// findIndex — index of first match (or -1)
users.findIndex(u => u.name === 'Bob'); // 1

// includes — primitive check
[1, 2, 3].includes(2);                // true
[1, 2, 3].includes(5);                // false

// flat — flatten nested arrays
[1, [2, [3, [4]]]].flat(2);           // [1, 2, 3, [4]]
[1, [2, 3]].flat();                  // [1, 2, 3] (default depth 1)

// flatMap — map then flatten (1 level)
const words = ['hello world', 'foo bar'];
words.flatMap(s => s.split(' '));    // ['hello', 'world', 'foo', 'bar']
// Equivalent to: words.map(...).flat() but more efficient
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

// Object.assign — merge objects (shallow)
const merged = Object.assign({}, config, { port: 8080, debug: true });
// { host: 'localhost', port: 8080, debug: true }

// Object.freeze — prevent modification
const frozen = Object.freeze({ a: 1, b: { nested: 2 } });
frozen.a = 99;           // Strict mode: silently ignored or throws
// frozen.b.nested = 99; // Still mutable! (shallow freeze)

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

### 8.1. Task Priority

```
Call Stack → Microtasks (Promise.then, queueMicrotask) → Macrotasks (setTimeout, setInterval, I/O) → Render → Repeat
```

### 8.2. setTimeout vs setImmediate vs process.nextTick

```javascript
// setTimeout(0) — macrotask, scheduled after current call stack + all microtasks
setTimeout(() => console.log('timeout'), 0);

// process.nextTick (Node.js only) — highest priority, runs before other microtasks
process.nextTick(() => console.log('nextTick'));

// queueMicrotask — explicit microtask scheduling
queueMicrotask(() => console.log('microtask'));

// setImmediate (Node.js) — runs after I/O callbacks, before timers
setImmediate(() => console.log('immediate'));
```

### 8.3. Output Order Question

```javascript
console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
queueMicrotask(() => console.log('4'));
setImmediate(() => console.log('5'));

// Sync: 1
// Microtasks (1st pass): 3, 4
// Macrotasks: 2, 5

// Output: 1 → 3 → 4 → 2 → 5
// (2 and 5 order may vary between browser and Node.js)
```

---

## 9. Immutability Patterns

### 9.1. Why Immutability Matters

React uses reference equality checks (`===`) to detect changes. Direct mutation doesn't change the object reference, so components won't re-render.

### 9.2. Array Immutability

```javascript
// Add element
setItems([...items, newItem]);          // Spread + new item

// Remove element
setItems(items.filter(i => i.id !== id)); // New array, filtered

// Update element
setItems(items.map(i =>
  i.id === id ? { ...i, ...updates } : i
));

// Nested update
setCart({
  ...cart,
  items: cart.items.map(item =>
    item.id === id ? { ...item, quantity: item.quantity + 1 } : item
  )
});
```

### 9.3. Object Immutability

```javascript
// Update nested property
setUser({ ...user, address: { ...user.address, city: 'Paris' } });

// Utility: immer (for complex nested state)
import { produce } from 'immer';
setUser(produce(draft => {
  draft.address.city = 'Paris';
  draft.profile.tags.push('developer');
}));
```

---

## 10. Debouncing and Throttling

### 10.1. Debounce — Delay Until Idle

Execute only after the user stops calling for a specified duration.

```javascript
function debounce(fn, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Usage: search input
const handleSearch = debounce((query) => {
  fetchResults(query);
}, 300);

input.addEventListener('input', e => handleSearch(e.target.value));
```

### 10.2. Throttle — Rate Limiting

Execute at most once per specified interval.

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

// Usage: scroll handler
const handleScroll = throttle(() => {
  updateProgressBar(window.scrollY);
}, 100);

window.addEventListener('scroll', handleScroll);
```

| | Debounce | Throttle |
|--|----------|----------|
| **Use case** | Search input, form validation | Scroll, resize, button clicks |
| **Behavior** | Resets timer on each call | Ignores calls within interval |
| **Fires** | After last call stops | At most once per interval |

---

## 11. Interview Questions

**Q: What is the difference between `Object.create()` and `new Object()`?**

> `new Object()` creates an object from a constructor (setting `Object.prototype` as the prototype). `Object.create(proto)` creates an object with `proto` explicitly set as its prototype, allowing prototype chain creation without constructors. It can also create objects with `null` prototype.

**Q: How does `structuredClone()` differ from `JSON.parse(JSON.stringify())`?**

> `structuredClone()` is a native browser API that handles circular references, `Date` objects, `Map`, `Set`, `ArrayBuffer`, and more. `JSON.parse(JSON.stringify())` loses `undefined`, functions, `Symbol`, and `Date` becomes string.

**Q: What is the output?**

```javascript
const arr = [1, 2, 3];
arr[10] = 10;
console.log(arr.length);       // 11 (sparse array: [1,2,3,<7 empty>,10])
console.log(arr.filter(x => x).length); // 4 (empty slots are skipped)
```

**Q: Explain the difference between `__proto__` and `prototype`.**

> `__proto__` is an accessor property on every object that points to its prototype. `prototype` is a property on constructor functions that becomes the `__proto__` of objects created via `new`. Every function has a `prototype`, but only objects have `__proto__`.
