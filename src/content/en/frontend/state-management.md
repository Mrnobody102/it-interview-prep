# Frontend — State Management

## 1. Why State Management?

As applications grow, managing state across many components becomes challenging.

### 1.1. Problems Without State Management

| Problem | Description |
|---------|-------------|
| **Prop drilling** | Passing props through many component levels, even when intermediate components don't need them |
| **Shared state** | Components that need the same data have no clean way to share it |
| **Complex state logic** | Scattered state logic across components makes updates error-prone |
| **Hard to trace** | Difficult to understand how and where state changes happen |

---

## 2. Redux (React)

### 2.1. Core Principles

| Principle | Description |
|-----------|-------------|
| **Single source of truth** | All application state is stored in one central **Store** |
| **State is read-only** | State can only be changed by emitting **Actions** |
| **Changes via pure functions** | **Reducers** are pure functions that take current state + action, return new state |

### 2.2. Data Flow

```
Action → Dispatch → Reducer → Store → View (Component re-renders)
```

```javascript
// Action
const addTodo = (text) => ({
  type: 'ADD_TODO',
  payload: { id: Date.now(), text }
});

// Reducer
const todoReducer = (state = [], action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return [...state, action.payload];
    case 'REMOVE_TODO':
      return state.filter(t => t.id !== action.payload);
    default:
      return state;
  }
};

// Store
import { createStore } from 'redux';
const store = createStore(todoReducer);

// Usage
store.dispatch(addTodo('Learn Redux'));
console.log(store.getState());
```

### 2.3. Redux Toolkit (Recommended)

Redux Toolkit simplifies Redux by reducing boilerplate.

```javascript
// features/todos/todoSlice.js
import { createSlice } from '@reduxjs/toolkit';

const todoSlice = createSlice({
  name: 'todos',
  initialState: [],
  reducers: {
    addTodo: (state, action) => {
      state.push(action.payload);
    },
    removeTodo: (state, action) => {
      return state.filter(t => t.id !== action.payload);
    }
  }
});

export const { addTodo, removeTodo } = todoSlice.actions;
export default todoSlice.reducer;
```

```javascript
// store.js
import { configureStore } from '@reduxjs/toolkit';
import todoReducer from './features/todos/todoSlice';

export const store = configureStore({
  reducer: {
    todos: todoReducer
  }
});
```

```javascript
// Component
import { useDispatch, useSelector } from 'react-redux';
import { addTodo } from './features/todos/todoSlice';

function TodoApp() {
  const dispatch = useDispatch();
  const todos = useSelector(state => state.todos);

  return (
    <div>
      {todos.map(t => <li key={t.id}>{t.text}</li>)}
      <button onClick={() => dispatch(addTodo('New todo'))}>Add</button>
    </div>
  );
}
```

---

## 3. Context API (React)

Built into React — a lightweight solution for sharing state across the component tree.

### 3.1. Creating Context

```javascript
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
```

### 3.2. Using Context

```javascript
import { useTheme } from './ThemeContext';

function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className={theme}>
      <button onClick={toggleTheme}>
        Switch to {theme === 'light' ? 'dark' : 'light'} mode
      </button>
    </header>
  );
}
```

### 3.3. Context vs Redux

| | Context API | Redux |
|--|------------|-------|
| **Boilerplate** | Less | More |
| **Performance** | Re-renders all consumers on change | Fine-grained updates with selectors |
| **DevTools** | Basic | Powerful (time-travel debugging) |
| **Middleware** | Not supported | Middleware ecosystem |
| **Best for** | Simple global data (theme, auth) | Complex state with many updates |

---

## 4. Zustand (React)

A minimal, hook-based state management library with less boilerplate than Redux.

```javascript
import { create } from 'zustand';

const useStore = create((set) => ({
  count: 0,
  user: null,
  increment: () => set(state => ({ count: state.count + 1 })),
  setUser: (user) => set({ user }),
  reset: () => set({ count: 0, user: null })
}));

// In component
function Counter() {
  const { count, increment } = useStore();
  return <button onClick={increment}>{count}</button>;
}
```

---

## 5. Jotai (React)

Atom-based state management — built on the concept of atomic state.

```javascript
import { atom, useAtom } from 'jotai';

// Define atoms
const countAtom = atom(0);
const userAtom = atom({ name: 'Alice', age: 30 });

// Derived atom
const doubledAtom = atom(get => get(countAtom) * 2);

function Counter() {
  const [count, setCount] = useAtom(countAtom);
  const [doubled] = useAtom(doubledAtom);

  return (
    <div>
      <p>Count: {count}</p>
      <p>Doubled: {doubled}</p>
      <button onClick={() => setCount(c => c + 1)}>+</button>
    </div>
  );
}
```

---

## 6. Pinia (Vue)

Pinia is the official state management for Vue 3 (replacement for Vuex).

```javascript
// stores/counter.js
import { defineStore } from 'pinia';

export const useCounterStore = defineStore('counter', {
  state: () => ({ count: 0, user: null }),
  getters: {
    doubled: state => state.count * 2
  },
  actions: {
    increment() { this.count++; },
    async fetchUser() {
      this.user = await api.getUser();
    }
  }
});
```

```javascript
// In component
import { storeToRefs } from 'pinia';
import { useCounterStore } from '@/stores/counter';

const store = useCounterStore();
const { count, doubled } = storeToRefs(store);   // Reactive refs
const { increment } = store;                     // Actions
```

---

## 7. Vuex (Vue 2 / Legacy)

Vuex follows Redux principles but is tailored for Vue's reactivity system.

| Concept | Description |
|---------|-------------|
| **State** | Single source of truth |
| **Getters** | Computed properties (like computed properties in Vue) |
| **Mutations** | Synchronous state changes |
| **Actions** | Async operations, commit mutations |
| **Modules** | Namespace stores into modules |

---

## 8. When to Use What?

| Scenario | Recommended Solution |
|----------|---------------------|
| Small app, simple shared state | Context API |
| Medium app with moderate state complexity | Zustand or Jotai |
| Large app with complex state, time-travel debugging | Redux Toolkit |
| Vue 3 app | Pinia |
| Vue 2 app | Vuex |
| Server state (caching, syncing) | TanStack Query (React Query) |

---

## 9. Key Principles

> **Single Source of Truth** — keep state centralized where possible.

> **Immutability** — never mutate state directly. Always create new copies. This enables React/Vue to detect changes efficiently.

> **Colocation** — keep state as close to where it is used as possible. Global state should only be used for truly global data (auth, theme, locale).

> **Separate Server State from Client State** — use TanStack Query for server state (API data, caching) and a state library for client state (UI state, forms).
