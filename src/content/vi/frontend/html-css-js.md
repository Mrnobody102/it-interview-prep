# Frontend - HTML / CSS / JavaScript Core

## 1. HTML5

### 1.1. Semantic Elements

Các thẻ HTML5 semantic giúp **structure document** rõ ràng, tốt cho **SEO** và **accessibility** (screen readers).

| Thẻ | Mô tả | Use case |
|------|-------|----------|
| `<header>` | Header của page hoặc section | Logo, navigation, intro |
| `<nav>` | Navigation links | Main menu |
| `<main>` | Nội dung chính | Chỉ có 1 per page |
| `<article>` | Nội dung độc lập | Blog post, news article |
| `<section>` | Nhóm nội dung liên quan | Chapters, groupings |
| `<aside>` | Nội dung phụ | Sidebar, related links |
| `<footer>` | Footer của page hoặc section | Copyright, links |
| `<figure>` | Hình ảnh/diagram kèm caption | `<img>` + `<figcaption>` |
| `<time>` | Thời gian/ngày tháng | `<time datetime="2024-01-15">` |

### 1.2. Common HTML Elements

```html
<!-- Document structure -->
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Mô tả trang">
  <title>Tiêu đề trang</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <!-- Content here -->
</body>
</html>
```

### 1.3. Form Elements

```html
<form action="/submit" method="POST">
  <label for="email">Email:</label>
  <input
    type="email"
    id="email"
    name="email"
    placeholder="huy@example.com"
    required
    autocomplete="email"
  >

  <label for="password">Password:</label>
  <input
    type="password"
    id="password"
    name="password"
    minlength="8"
    required
  >

  <select name="role" required>
    <option value="">Chọn vai trò</option>
    <option value="dev">Developer</option>
    <option value="des">Designer</option>
  </select>

  <button type="submit">Gửi</button>
</form>
```

---

## 2. CSS

### 2.1. Box Model

Mọi element trong CSS đều là một **box** với 4 layers:

```
┌─────────────────────────────────────┐
│              MARGIN                 │
│  ┌─────────────────────────────┐    │
│  │          BORDER             │    │
│  │  ┌───────────────────────┐ │    │
│  │  │        PADDING         │ │    │
│  │  │  ┌─────────────────┐  │ │    │
│  │  │  │     CONTENT     │  │ │    │
│  │  │  └─────────────────┘  │ │    │
│  │  └───────────────────────┘ │    │
│  └─────────────────────────────┘    │
└─────────────────────────────────────┘
```

```css
/* Box-sizing */
* {
  box-sizing: border-box;  /* Width = content + padding + border */
}

/* Ví dụ */
.box {
  width: 200px;
  padding: 20px;
  border: 2px solid #333;
  margin: 10px;
}
```

### 2.2. Flexbox

**Flexbox** cho layout **một chiều** (row hoặc column).

```css
.container {
  display: flex;
  flex-direction: row;           /* row | column | row-reverse | column-reverse */
  justify-content: center;       /* main axis alignment */
  align-items: center;           /* cross axis alignment */
  gap: 16px;                     /* Khoảng cách giữa items */
  flex-wrap: wrap;               /* Wrap items khi không đủ không gian */
}

.item {
  flex-grow: 1;                  /* Chiếm không gian thừa */
  flex-shrink: 0;                /* Co lại khi không đủ */
  flex-basis: 200px;             /* Kích thước ban đầu */
  /* shorthand: flex: 1 0 200px */
}

.item:last-child {
  flex-grow: 2;                  /* Item cuối chiếm gấp đôi */
}
```

| Property | Các giá trị | Mô tả |
|----------|------------|-------|
| `justify-content` | flex-start, flex-end, center, space-between, space-around, space-evenly | Main axis |
| `align-items` | stretch, flex-start, flex-end, center, baseline | Cross axis |
| `align-self` | auto, flex-start, flex-end, center, stretch | Item cụ thể |
| `flex-direction` | row, column, row-reverse, column-reverse | Hướng |

### 2.3. CSS Grid

**Grid** cho layout **hai chiều** (rows + columns).

```css
.container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;  /* 3 equal columns */
  grid-template-columns: repeat(3, 1fr);
  grid-template-columns: 200px 1fr 200px;  /* Sidebar + main + sidebar */
  grid-template-rows: auto 1fr auto;
  gap: 20px;
  grid-template-areas:
    "header header header"
    "sidebar main aside"
    "footer footer footer";
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.footer { grid-area: footer; }
```

```css
/* Responsive grid */
.container {
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  /* Tự động tạo columns vừa với min-width 250px */
}
```

### 2.4. CSS Specificity

Khi nhiều rules áp dụng cùng một property, specificity quyết định rule nào thắng.

| Selector | Specificity | Ví dụ |
|----------|------------|-------|
| **Inline styles** | 1,0,0,0 | `<div style="color: red">` |
| **ID** | 0,1,0,0 | `#header` |
| **Class, Attribute, Pseudo-class** | 0,0,1,0 | `.btn`, `[type="email"]`, `:hover` |
| **Element, Pseudo-element** | 0,0,0,1 | `div`, `::before` |
| **Universal (*)** | 0,0,0,0 | `*` |

```css
/* Specificity: 0,1,0,1 */
#nav .btn:hover { color: blue; }

/* Specificity: 0,0,1,0 */
.btn:hover { color: red; }   /* THẮNG vì hover là pseudo-class */

/* !important bypasses everything — AVOID if possible */
```

### 2.5. Responsive Design

```css
/* Mobile-first approach */
.container {
  padding: 16px;
}

/* Tablet */
@media (min-width: 768px) {
  .container { padding: 24px; }
}

/* Desktop */
@media (min-width: 1024px) {
  .container {
    max-width: 1200px;
    padding: 32px;
  }
}

/* Breakpoints thường dùng */
/* 576px  - Small devices */
/* 768px  - Tablet */
/* 992px  - Small desktop */
/* 1200px - Large desktop */
/* 1400px - Extra large */
```

### 2.6. CSS Variables & Custom Properties

```css
:root {
  --primary-color: #3b82f6;
  --secondary-color: #64748b;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --border-radius: 8px;
  --font-family: 'Inter', system-ui, sans-serif;
}

.button {
  background-color: var(--primary-color);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius);
  font-family: var(--font-family);
}

.button:hover {
  --primary-color: #2563eb;  /* Override for hover */
}
```

---

## 3. JavaScript ES6+

### 3.1. let / const

```javascript
// const — không thể reassign (nhưng object properties có thể modify)
const PI = 3.14;
const user = { name: 'Huy' };
user.name = 'Hieu';  // OK — object reference không đổi
// user = {};        // Error — không thể reassign

// let — có thể reassign, block-scoped
let count = 0;
count++;  // OK

// var — function-scoped (tránh dùng)
var old = 'deprecated';
```

### 3.2. Arrow Functions

```javascript
// Basic
const add = (a, b) => a + b;

// Với body block
const greet = (name) => {
  const message = `Hello, ${name}`;
  return message;
};

// Single param — không cần parentheses
const square = x => x * x;

// Implicit return (không có {})
const double = x => x * 2;
```

### 3.3. Destructuring

```javascript
// Object destructuring
const { name, age, city = 'Hanoi' } = { name: 'Huy', age: 25 };
const { name: userName, role: userRole = 'user' } = user;

// Array destructuring
const [first, second, ...rest] = [1, 2, 3, 4, 5];
// first = 1, second = 2, rest = [3, 4, 5]

// Function destructuring
function printUser({ name, age }) {
  console.log(`${name}, ${age}`);
}
printUser({ name: 'Huy', age: 25 });
```

### 3.4. Spread & Rest

```javascript
// Spread operator (...)
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const merged = [...arr1, ...arr2];  // [1, 2, 3, 4, 5, 6]

const obj1 = { a: 1, b: 2 };
const obj2 = { ...obj1, c: 3 };     // { a: 1, b: 2, c: 3 }

// Rest parameters
function sum(...numbers) {
  return numbers.reduce((acc, n) => acc + n, 0);
}
sum(1, 2, 3, 4);  // 10
```

### 3.5. Template Literals

```javascript
const name = 'Huy';
const age = 25;
const greeting = `Hello, ${name}! You are ${age} years old.`;

// Multi-line
const html = `
  <div class="card">
    <h2>${name}</h2>
    <p>Age: ${age}</p>
  </div>
`;
```

### 3.6. Classes

```javascript
class Animal {
  #name;           // Private field
  constructor(name) {
    this.#name = name;
  }

  speak() {
    return `${this.#name} makes a sound.`;
  }

  static create(name) {
    return new Animal(name);
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name);
    this.breed = breed;
  }

  speak() {
    return `${this.#name} barks.`;  // Error: #name is private to Animal
  }

  speak() {
    return `${this.name} barks.`;  // Access via public
  }
}

const dog = new Dog('Buddy', 'Golden Retriever');
console.log(dog.speak());
```

### 3.7. Modules

```javascript
// named-export.js
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;
export default multiply;

// default-export.js
const multiply = (a, b) => a * b;
export default multiply;

// Importing
import multiply, { add, subtract } from './module.js';
import * as utils from './module.js';
import { add as sum } from './module.js';
```

### 3.8. Nullish Coalescing & Optional Chaining

```javascript
// Optional chaining (?.) — truy cập nested properties an toàn
const name = user?.profile?.name;   // undefined thay vì lỗi
const city = user?.address?.city ?? 'Unknown';

// Nullish coalescing (??) — giá trị mặc định khi null/undefined
const displayName = name ?? 'Guest';  // 'Guest' nếu name là null/undefined
const count = value ?? 0;             // 0 nếu value là null/undefined

// Khác với ||: || dùng falsy values (0, '', false) làm default
const a = 0 || 10;     // 10 (vì 0 là falsy)
const b = 0 ?? 10;     // 0 (vì 0 không phải nullish)
```

---

## 4. DOM Manipulation

### 4.1. Selecting Elements

```javascript
// Single element
const el = document.getElementById('myId');
const el = document.querySelector('.myClass');
const el = document.querySelector('div > p');

// Multiple elements
const els = document.querySelectorAll('.item');
const els = document.getElementsByClassName('item');
const els = document.getElementsByTagName('div');

// Iterate
els.forEach(el => console.log(el.textContent));
```

### 4.2. Modifying Elements

```javascript
const el = document.querySelector('#title');

// Text content
el.textContent = 'New Title';        // Plain text
el.innerHTML = '<strong>Bold</strong>';  // HTML (XSS risk!)

// Attributes
el.setAttribute('data-id', '123');
el.getAttribute('data-id');
el.removeAttribute('disabled');
el.classList.add('active');
el.classList.remove('hidden');
el.classList.toggle('active');
el.classList.contains('active');      // true/false

// Styles
el.style.color = 'blue';
el.style.backgroundColor = '#f0f0f0';
```

### 4.3. Creating & Removing Elements

```javascript
// Create
const div = document.createElement('div');
div.textContent = 'New element';
div.className = 'card';
document.body.appendChild(div);

// Insert
parent.appendChild(el);              // Cuối
parent.prepend(el);                 // Đầu
beforeEl.parentNode.insertBefore(el, beforeEl);
parent.insertAdjacentHTML('beforeend', '<p>New</p>');

// Remove
el.remove();
el.parentNode.removeChild(el);

// Replace
parent.replaceChild(newEl, oldEl);
```

---

## 5. Events

### 5.1. Event Handling

```javascript
// DOM event listener
const btn = document.querySelector('#btn');

btn.addEventListener('click', (event) => {
  console.log('Clicked!', event.target);
  event.preventDefault();  // Prevent default action
});

// Remove listener
const handler = () => console.log('Clicked');
btn.addEventListener('click', handler);
btn.removeEventListener('click', handler);

// One-time listener
btn.addEventListener('click', () => console.log('First click only'), { once: true });
```

### 5.2. Common Events

```javascript
// Mouse
'click', 'dblclick', 'mouseenter', 'mouseleave', 'mousemove', 'mousedown', 'mouseup'

// Keyboard
'keydown', 'keyup', 'keypress'

// Form
'submit', 'change', 'input', 'focus', 'blur', 'reset'

// Window/Document
'load', 'DOMContentLoaded', 'resize', 'scroll', 'beforeunload'
```

### 5.3. Event Propagation

```javascript
// Bubbling (default) — event đi từ target lên parent
// Capturing — event đi từ parent xuống target

element.addEventListener('click', handler, false);  // Bubbling (default)
element.addEventListener('click', handler, true);  // Capturing

// Stop propagation
event.stopPropagation();

// Stop all handlers on element
event.stopImmediatePropagation();

// Delegation — attach listener to parent, handle child events
document.querySelector('.list').addEventListener('click', (e) => {
  if (e.target.matches('.item')) {
    console.log('Clicked:', e.target.textContent);
  }
});
```

---

## 6. Common Interview Questions

### Q: Sự khác biệt giữa `==` và `===`?

| So sánh | `==` | `===` |
|---------|------|-------|
| **Type coercion** | Có (tự convert type) | Không |
| **Example** | `5 == '5'` → `true` | `5 === '5'` → `false` |
| **Recommendation** | Tránh dùng | **Luôn dùng** |

### Q: `null` vs `undefined`?

| | `null` | `undefined` |
|--|--------|------------|
| **Ý nghĩa** | Giá trị được **gán** là "không có giá trị" | Giá trị được **chưa gán** |
| **Type** | `object` | `undefined` |
| **Dùng khi** | Muốn explicit empty value | Variable chưa được gán |

### Q: `var` vs `let` vs `const`?

| | `var` | `let` | `const` |
|--|-------|-------|---------|
| **Scope** | Function | Block `{}` | Block `{}` |
| **Hoisting** | Hoisted (undefined) | Hoisted (TDZ) | Hoisted (TDZ) |
| **Reassign** | Được | Được | Không |
| **Redeclare** | Được | Không | Không |

### Q: Event Loop hoạt động như thế nào?

1. Execute synchronous code (Call Stack)
2. Process all **microtasks** (Promise.then, queueMicrotask)
3. Process **macrotasks** (setTimeout, setInterval, I/O)
4. Render (nếu cần)
5. Lặp lại

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
