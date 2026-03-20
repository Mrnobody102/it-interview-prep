# Frontend — HTML / CSS / JavaScript Core

## 1. HTML5 Semantic Elements

Semantic elements describe their meaning to both the browser and developer.

| Element | Description |
|---------|-------------|
| `<header>` | Introductory content or navigation links |
| `<nav>` | Navigation section (menus, breadcrumbs) |
| `<main>` | Dominant content of the document |
| `<article>` | Self-contained, independently distributable content |
| `<section>` | Thematic grouping of content |
| `<aside>` | Content tangentially related to surrounding content |
| `<footer>` | Footer for a section or page |
| `<figure>` | Self-contained content (illustrations, diagrams) |
| `<time>` | Machine-readable date/time |

> **Why use semantic HTML?** Better SEO, improved accessibility for screen readers, and cleaner code structure.

---

## 2. CSS

### 2.1. Box Model

Every element in CSS is a box with four layers:

```
Content → Padding → Border → Margin
```

```css
/* Box model types */
box-sizing: content-box;  /* Default — width = content only */
box-sizing: border-box;   /* Width includes padding + border */
```

### 2.2. Flexbox

One-dimensional layout model (either row or column).

```css
.container {
  display: flex;
  flex-direction: row;        /* row | column */
  justify-content: center;   /* Main axis */
  align-items: center;       /* Cross axis */
  gap: 1rem;
}
```

| Property | Values |
|----------|--------|
| `flex-direction` | `row`, `column`, `row-reverse`, `column-reverse` |
| `justify-content` | `flex-start`, `center`, `flex-end`, `space-between`, `space-around` |
| `align-items` | `stretch`, `flex-start`, `center`, `flex-end`, `baseline` |
| `flex-wrap` | `nowrap`, `wrap`, `wrap-reverse` |

### 2.3. Grid

Two-dimensional layout system (rows and columns).

```css
.container {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  grid-template-rows: auto;
  gap: 1rem;
}

/* Responsive grid */
.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}
```

### 2.4. CSS Specificity

When multiple rules target the same element, specificity determines which wins.

```
Inline Styles > ID (#) > Class (.) > Element (tag)
  (1000)      (100)     (10)         (1)
```

```css
/* Inline style */
<div style="color: red;">  /* Highest priority */

/* ID selector */
#header { color: blue; }  /* Higher than class */

/* Class selector */
.nav-item { color: green; }

/* Element selector */
div { color: purple; }    /* Lowest priority */
```

### 2.5. CSS Variables

```css
:root {
  --primary-color: #3498db;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
}

.button {
  background-color: var(--primary-color);
  padding: var(--spacing-md);
}
```

### 2.6. Responsive Design

```css
/* Mobile-first approach */

/* Extra small devices (phones) */
body { font-size: 14px; }

/* Small devices (tablets) */
@media (min-width: 576px) {
  body { font-size: 16px; }
}

/* Medium devices (laptops) */
@media (min-width: 768px) {
  body { font-size: 18px; }
}

/* Large devices (desktops) */
@media (min-width: 992px) {
  body { font-size: 20px; }
}
```

### 2.7. Pseudo-classes & Pseudo-elements

```css
/* Pseudo-classes — state-based styles */
:hover { }           /* Mouse over element */
:focus { }           /* Element has focus */
:active { }          /* Element is being activated */
:first-child { }     /* First child of parent */
:nth-child(2) { }    /* Every 2nd child */

/* Pseudo-elements — styled parts of elements */
::before { content: ''; }    /* Insert before element */
::after { content: ''; }    /* Insert after element */
::first-line { }            /* First line of text */
::selection { }              /* Selected text */
```

---

## 3. JavaScript ES6+

### 3.1. Variables: let, const, var

```javascript
// const — block-scoped, cannot be reassigned
const PI = 3.14159;
const user = { name: 'Alice' };
user.name = 'Bob';       // Allowed — object reference unchanged
// user = {};            // Error — cannot reassign

// let — block-scoped, can be reassigned
let count = 0;
count = count + 1;        // OK

// var — function-scoped (avoid using)
function example() {
  var x = 10;           // Function-scoped, not block-scoped
}
```

### 3.2. Arrow Functions

```javascript
// Full syntax
const add = (a, b) => { return a + b; };

// Implicit return (single expression)
const multiply = (a, b) => a * b;

// Single parameter (parentheses optional)
const greet = name => `Hello, ${name}!`;

// Returning an object literal
const createUser = (name, age) => ({ name, age });
```

### 3.3. Destructuring

```javascript
// Array destructuring
const [first, second, ...rest] = [1, 2, 3, 4, 5];
// first = 1, second = 2, rest = [3, 4, 5]

// Object destructuring
const { name, age, city = 'Unknown' } = { name: 'Alice', age: 30 };
// name = 'Alice', age = 30, city = 'Unknown' (default)

// Function parameter destructuring
function printUser({ name, email }) {
  console.log(`${name} - ${email}`);
}
```

### 3.4. Spread & Rest Operators

```javascript
// Spread — expand arrays/objects
const arr1 = [1, 2, 3];
const arr2 = [...arr1, 4, 5];       // [1, 2, 3, 4, 5]

const obj1 = { a: 1, b: 2 };
const obj2 = { ...obj1, c: 3 };      // { a: 1, b: 2, c: 3 }

// Rest — collect remaining elements
function sum(...numbers) {
  return numbers.reduce((a, b) => a + b, 0);
}
```

### 3.5. Template Literals

```javascript
const name = 'Alice';
const age = 30;

// Multi-line strings
const bio = `
  Name: ${name}
  Age: ${age}
  Next year: ${age + 1}
`;

// Expression interpolation
const isAdult = age >= 18 ? 'Adult' : 'Minor';
const greeting = `Welcome, ${name}! You are an ${isAdult}.`;
```

### 3.6. Classes

```javascript
class Animal {
  constructor(name, sound) {
    this.name = name;
    this.sound = sound;
  }

  speak() {
    return `${this.name} says ${this.sound}!`;
  }
}

class Dog extends Animal {
  constructor(name) {
    super(name, 'Woof');
  }

  fetch() {
    return `${this.name} fetches the ball.`;
  }
}

const dog = new Dog('Buddy');
dog.speak();       // "Buddy says Woof!"
dog.fetch();       // "Buddy fetches the ball."
```

### 3.7. Modules

```javascript
// math.js — named exports
export const PI = 3.14159;
export function add(a, b) { return a + b; }
export default class Calculator { }

// main.js — import
import Calculator, { PI, add } from './math.js';
import * as math from './math.js';    // Namespace import
```

---

## 4. Interview Questions

**Q: What is the difference between `==` and `===`?**

> `===` (strict equality) checks both value and type. `==` (loose equality) performs type coercion before comparison.

```javascript
0 == false   // true  (coerced to 0)
0 === false  // false (different types)
'1' == 1     // true
'1' === 1    // false
```

**Q: What is the difference between `null` and `undefined`?**

> `undefined` means a variable has been declared but not assigned. `null` is an intentional absence of value. `typeof null` returns `'object'` (historical bug in JS).

**Q: What is closure?**

> A **closure** is a function that retains access to its outer (enclosing) scope even after the outer function has returned.

```javascript
function createCounter() {
  let count = 0;
  return function() {
    count++;
    return count;
  };
}
const counter = createCounter();
counter(); // 1
counter(); // 2
counter(); // 3
```
