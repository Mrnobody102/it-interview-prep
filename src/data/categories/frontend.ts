import { Category } from "./types";

export const frontend: Category = {
  id: "frontend",
  name: { vi: "Frontend", en: "Frontend" },
  description: {
    vi: "Dành cho frontend dev & full-stack",
    en: "For frontend dev & full-stack",
  },
  icon: "🎨",
  topics: [
    {
      id: "html-css-js",
      name: {
        vi: "HTML / CSS / JavaScript core",
        en: "HTML / CSS / JavaScript core",
      },
      content: {
        vi: `# HTML / CSS / JavaScript Core

## HTML5 Semantic Elements
- **header, nav, main, article, section, aside, footer**
- Better SEO và accessibility

## CSS

### Box Model
Content → Padding → Border → Margin

### Flexbox
One-dimensional layout (row hoặc column)

### Grid
Two-dimensional layout

### CSS Specificity
Inline > ID > Class > Element

## JavaScript ES6+

### let / const
Block-scoped variables

### Arrow Functions
\`\`\`javascript
const add = (a, b) => a + b;
\`\`\`

### Destructuring
\`\`\`javascript
const { name, age } = user;
const [first, second] = array;
\`\`\`

### Spread / Rest
\`\`\`javascript
const newArray = [...oldArray, newItem];
const sum = (...numbers) => numbers.reduce((a, b) => a + b);
\`\`\`

### Template Literals
\`\`\`javascript
const message = \`Hello, \${name}!\`;
\`\`\`

### Modules
\`\`\`javascript
export const value = 42;
import { value } from './module';
\`\`\``,
        en: `# HTML / CSS / JavaScript Core

## HTML5 Semantic Elements
- **header, nav, main, article, section, aside, footer**
- Better SEO and accessibility

## CSS

### Box Model
Content → Padding → Border → Margin

### Flexbox
One-dimensional layout (row or column)

### Grid
Two-dimensional layout

### CSS Specificity
Inline > ID > Class > Element

## JavaScript ES6+

### let / const
Block-scoped variables

### Arrow Functions
\`\`\`javascript
const add = (a, b) => a + b;
\`\`\`

### Destructuring
\`\`\`javascript
const { name, age } = user;
const [first, second] = array;
\`\`\`

### Spread / Rest
\`\`\`javascript
const newArray = [...oldArray, newItem];
const sum = (...numbers) => numbers.reduce((a, b) => a + b);
\`\`\`

### Template Literals
\`\`\`javascript
const message = \`Hello, \${name}!\`;
\`\`\`

### Modules
\`\`\`javascript
export const value = 42;
import { value } from './module';
\`\`\``,
      },
    },
    {
      id: "async-js",
      name: {
        vi: "Async JS (Promise, async/await)",
        en: "Async JS (Promise, async/await)",
      },
      content: {
        vi: `# Async JavaScript

## Callbacks

\`\`\`javascript
getData(function(error, data) {
  if (error) handle(error);
  else process(data);
});
\`\`\`

**Problem:** Callback hell

## Promises

\`\`\`javascript
fetch('/api/users')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));
\`\`\`

**States:** Pending → Fulfilled / Rejected

## Async / Await

\`\`\`javascript
async function getUsers() {
  try {
    const response = await fetch('/api/users');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}
\`\`\`

Cleaner syntax cho Promises

## Promise.all / Promise.race

\`\`\`javascript
// Wait for all
const results = await Promise.all([promise1, promise2]);

// First to complete
const winner = await Promise.race([promise1, promise2]);
\`\`\`

## Error Handling
Always use try/catch với async/await`,
        en: `# Async JavaScript

## Callbacks

\`\`\`javascript
getData(function(error, data) {
  if (error) handle(error);
  else process(data);
});
\`\`\`

**Problem:** Callback hell

## Promises

\`\`\`javascript
fetch('/api/users')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));
\`\`\`

**States:** Pending → Fulfilled / Rejected

## Async / Await

\`\`\`javascript
async function getUsers() {
  try {
    const response = await fetch('/api/users');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}
\`\`\`

Cleaner syntax for Promises

## Promise.all / Promise.race

\`\`\`javascript
// Wait for all
const results = await Promise.all([promise1, promise2]);

// First to complete
const winner = await Promise.race([promise1, promise2]);
\`\`\`

## Error Handling
Always use try/catch with async/await`,
      },
    },
    {
      id: "react",
      name: { vi: "React", en: "React" },
      content: {
        vi: `# React

## Components

### Functional Components
\`\`\`jsx
function Welcome({ name }) {
  return <h1>Hello, {name}</h1>;
}
\`\`\`

## Hooks

### useState
\`\`\`jsx
const [count, setCount] = useState(0);
\`\`\`

### useEffect
\`\`\`jsx
useEffect(() => {
  // Side effect
  return () => {
    // Cleanup
  };
}, [dependencies]);
\`\`\`

### useContext
Share data without prop drilling

### useRef
Access DOM or persist values without re-render

### useMemo / useCallback
Performance optimization

## Virtual DOM
React updates real DOM efficiently by comparing virtual DOM

## JSX
JavaScript XML syntax

## Props vs State
- **Props:** Read-only, passed from parent
- **State:** Mutable, managed within component

## Lifecycle (với hooks)
- **Mount:** useEffect(() => {}, [])
- **Update:** useEffect(() => {})
- **Unmount:** useEffect cleanup`,
        en: `# React

## Components

### Functional Components
\`\`\`jsx
function Welcome({ name }) {
  return <h1>Hello, {name}</h1>;
}
\`\`\`

## Hooks

### useState
\`\`\`jsx
const [count, setCount] = useState(0);
\`\`\`

### useEffect
\`\`\`jsx
useEffect(() => {
  // Side effect
  return () => {
    // Cleanup
  };
}, [dependencies]);
\`\`\`

### useContext
Share data without prop drilling

### useRef
Access DOM or persist values without re-render

### useMemo / useCallback
Performance optimization

## Virtual DOM
React updates real DOM efficiently by comparing virtual DOM

## JSX
JavaScript XML syntax

## Props vs State
- **Props:** Read-only, passed from parent
- **State:** Mutable, managed within component

## Lifecycle (with hooks)
- **Mount:** useEffect(() => {}, [])
- **Update:** useEffect(() => {})
- **Unmount:** useEffect cleanup`,
      },
    },
    {
      id: "angular",
      name: { vi: "Angular", en: "Angular" },
      content: {
        vi: `# Angular

## TypeScript-based
Full-featured framework từ Google

## Components

\`\`\`typescript
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {
  name = 'John';
}
\`\`\`

## Two-way Data Binding
\`\`\`html
<input [(ngModel)]="name">
\`\`\`

## Dependency Injection
\`\`\`typescript
constructor(private userService: UserService) {}
\`\`\`

## Directives
- **ngIf:** Conditional rendering
- **ngFor:** Loop
- **ngClass, ngStyle:** Dynamic classes/styles

## Services
Singleton classes cho business logic, API calls

## RxJS
Reactive programming với Observables

## Modules
Organize code into NgModules`,
        en: `# Angular

## TypeScript-based
Full-featured framework from Google

## Components

\`\`\`typescript
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {
  name = 'John';
}
\`\`\`

## Two-way Data Binding
\`\`\`html
<input [(ngModel)]="name">
\`\`\`

## Dependency Injection
\`\`\`typescript
constructor(private userService: UserService) {}
\`\`\`

## Directives
- **ngIf:** Conditional rendering
- **ngFor:** Loop
- **ngClass, ngStyle:** Dynamic classes/styles

## Services
Singleton classes for business logic, API calls

## RxJS
Reactive programming with Observables

## Modules
Organize code into NgModules`,
      },
    },
    {
      id: "vue",
      name: { vi: "Vue", en: "Vue" },
      content: {
        vi: `# Vue.js

## Progressive Framework
Có thể dùng từng phần hoặc full SPA

## Components

\`\`\`vue
<template>
  <div>{{ message }}</div>
</template>

<script>
export default {
  data() {
    return {
      message: 'Hello Vue!'
    }
  }
}
</script>
\`\`\`

## Reactivity System
Tự động track dependencies và update DOM

## Directives
- **v-if, v-else:** Conditional
- **v-for:** Loop
- **v-model:** Two-way binding
- **v-on (@):** Event handling
- **v-bind (:):** Attribute binding

## Computed Properties
\`\`\`javascript
computed: {
  fullName() {
    return this.firstName + ' ' + this.lastName;
  }
}
\`\`\`

## Composition API (Vue 3)
\`\`\`javascript
import { ref, computed } from 'vue';

setup() {
  const count = ref(0);
  const doubled = computed(() => count.value * 2);
  return { count, doubled };
}
\`\`\``,
        en: `# Vue.js

## Progressive Framework
Can use partially or full SPA

## Components

\`\`\`vue
<template>
  <div>{{ message }}</div>
</template>

<script>
export default {
  data() {
    return {
      message: 'Hello Vue!'
    }
  }
}
</script>
\`\`\`

## Reactivity System
Automatically tracks dependencies and updates DOM

## Directives
- **v-if, v-else:** Conditional
- **v-for:** Loop
- **v-model:** Two-way binding
- **v-on (@):** Event handling
- **v-bind (:):** Attribute binding

## Computed Properties
\`\`\`javascript
computed: {
  fullName() {
    return this.firstName + ' ' + this.lastName;
  }
}
\`\`\`

## Composition API (Vue 3)
\`\`\`javascript
import { ref, computed } from 'vue';

setup() {
  const count = ref(0);
  const doubled = computed(() => count.value * 2);
  return { count, doubled };
}
\`\`\``,
      },
    },
    {
      id: "state-management",
      name: { vi: "State Management", en: "State Management" },
      content: {
        vi: `# State Management

## Why State Management?

### Problems
- Prop drilling
- Shared state across components
- Complex state logic

## Redux (React)

### Principles
- Single source of truth (Store)
- State is read-only
- Changes via pure functions (Reducers)

### Flow
Action → Reducer → Store → View

### Redux Toolkit
Modern Redux với less boilerplate

## Context API (React)
Built-in React, lightweight alternative to Redux

## Vuex (Vue)
Similar to Redux, tailored for Vue

## Zustand / Jotai (React)
Simpler alternatives, less boilerplate

## When to use?
- Large app with complex state
- State shared across many components
- Time-travel debugging needed`,
        en: `# State Management

## Why State Management?

### Problems
- Prop drilling
- Shared state across components
- Complex state logic

## Redux (React)

### Principles
- Single source of truth (Store)
- State is read-only
- Changes via pure functions (Reducers)

### Flow
Action → Reducer → Store → View

### Redux Toolkit
Modern Redux with less boilerplate

## Context API (React)
Built-in React, lightweight alternative to Redux

## Vuex (Vue)
Similar to Redux, tailored for Vue

## Zustand / Jotai (React)
Simpler alternatives, less boilerplate

## When to use?
- Large app with complex state
- State shared across many components
- Time-travel debugging needed`,
      },
    },
  ],
};
