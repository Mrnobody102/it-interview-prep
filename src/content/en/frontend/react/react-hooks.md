# React Hooks Deep Dive

## 1. useState

`useState` is the fundamental hook for managing component-level state in function components.

### 1.1. Basic Usage

```jsx
const [count, setCount] = useState(0);
// count: current state value
// setCount: function to update state and trigger re-render
```

### 1.2. Updating State

```jsx
// Direct value update
setCount(5);

// Functional update — use when new state depends on old state
setCount(prev => prev + 1);
setCount(prev => prev - 1);

// ⚠️ Don't do this — state updates are asynchronous
// setCount(count + 1); setCount(count + 1); // Only increments once!
```

### 1.3. Object and Array State

When state is an object or array, **always pass a new object/array** — never mutate directly.

```jsx
// Object state — always pass full object
const [user, setUser] = useState({ name: '', email: '' });

// Update single field — spread all other fields
setUser(prev => ({ ...prev, name: 'Alice' }));

// Merge with spread
setUser(prev => ({ ...prev, email: 'alice@example.com' }));

// Array state
const [items, setItems] = useState([]);

// Add item
setItems(prev => [...prev, newItem]);

// Remove item
setItems(prev => prev.filter(i => i.id !== itemId));

// Update item
setItems(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i));
```

### 1.4. Lazy Initialization

Pass a function to `useState` to defer expensive initialization.

```jsx
// ✅ Good — initial state computed only once on mount
const [data, setData] = useState(() => {
  const saved = localStorage.getItem('data');
  return saved ? JSON.parse(saved) : initialValue;
});

// ❌ Bad — runs on every render
const [data, setData] = useState(JSON.parse(localStorage.getItem('data')));
```

### 1.5. Multiple State Variables

```jsx
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [isLoading, setIsLoading] = useState(false);

// Or consolidate related state
const [form, setForm] = useState({ name: '', email: '' });
```

---

## 2. useEffect

`useEffect` performs **side effects** in function components: API calls, DOM updates, subscriptions, timers, etc.

### 2.1. Dependency Patterns

```jsx
// 1. No dependency array — runs after EVERY render
useEffect(() => {
  document.title = 'Hello';
});

// 2. With dependency array — only re-runs when deps change
useEffect(() => {
  fetchData(userId);
}, [userId]);

// 3. Empty array — runs ONCE on mount (like componentDidMount)
useEffect(() => {
  fetchUser();
}, []);

// 4. With cleanup function — runs on mount, cleanup on unmount
useEffect(() => {
  const subscription = subscribe(id);
  return () => subscription.unsubscribe(); // cleanup function
}, [id]);
```

### 2.2. Common Side Effects

```jsx
// Data fetching
useEffect(() => {
  let cancelled = false;
  fetch(`/api/users/${userId}`)
    .then(res => res.json())
    .then(data => {
      if (!cancelled) setUser(data);
    });
  return () => { cancelled = true; };
}, [userId]);

// DOM manipulation
useEffect(() => {
  document.title = `${count} items`;
  const timer = setInterval(() => tick(), 1000);
  return () => clearInterval(timer);
}, [count]);

// Event listeners
useEffect(() => {
  function handleResize() {
    setWindowWidth(window.innerWidth);
  }
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);

// Subscriptions
useEffect(() => {
  const ws = new WebSocket('wss://api.example.com');
  ws.onmessage = (event) => setMessages(prev => [...prev, event.data]);
  return () => ws.close();
}, []);
```

### 2.3. Cleanup Function

The cleanup function runs before the component unmounts and before re-running the effect. It is essential for:
- Canceling subscriptions
- Clearing timers (`setInterval`, `setTimeout`)
- Aborting fetch requests
- Removing event listeners

```jsx
useEffect(() => {
  const timer = setTimeout(() => {
    setShowBanner(false);
  }, 5000);

  // Cleanup: clear timer if component unmounts or user leaves
  return () => clearTimeout(timer);
}, []);
```

### 2.4. Avoiding Common Mistakes

```jsx
// ❌ Infinite loop — effect updates state in dependency
useEffect(() => {
  setData(newData);  // Triggers re-render, which triggers effect again
}, [data]);

// ✅ Fixed — separate concerns, use ref for non-state values
const dataRef = useRef(data);
useEffect(() => {
  dataRef.current = data;
}, [data]);

// ❌ Missing dependency — stale closure
useEffect(() => {
  fetchData(userId); // userId from outer scope might be stale
}, []); // Missing userId!

// ✅ Complete dependencies
useEffect(() => {
  fetchData(userId);
}, [userId]);
```

### 2.5. Strict Mode Double-Invocation (React 18+)

In development, React Strict Mode intentionally double-invokes:
- Mount-phase effects (effect + cleanup + effect)
- Component render functions

This helps identify side effects that aren't properly cleaned up.

---

## 3. useRef

`useRef` returns a mutable ref object with a `.current` property. Unlike state, **changing a ref does not trigger a re-render**.

### 3.1. DOM Access

```jsx
const inputRef = useRef(null);

// After mount, inputRef.current points to the DOM element
<input ref={inputRef} type="text" />

// Focus input
inputRef.current.focus();

// Access value
const value = inputRef.current.value;

// Imperative methods via ref
const videoRef = useRef(null);
<video ref={videoRef} />
// videoRef.current.play();
// videoRef.current.pause();
```

### 3.2. Storing Mutable Values

```jsx
// Store any mutable value without triggering re-render
const timerRef = useRef(null);
const previousValueRef = useRef(initialValue);

// Update ref (no re-render)
timerRef.current = setInterval(() => tick(), 1000);

// Read previous value across renders
function Component({ value }) {
  const prevValueRef = useRef(null);

  useEffect(() => {
    prevValueRef.current = value; // Update after render
  });

  return (
    <div>
      Current: {value} | Previous: {prevValueRef.current}
    </div>
  );
}
```

### 3.3. useRef vs useState

| Aspect | useRef | useState |
|--------|--------|----------|
| **Triggers re-render** | No | Yes |
| **Persists across renders** | Yes | Yes |
| **Use for** | DOM access, mutable values, timers | UI-relevant state |
| **Value on update** | `.current` changed immediately | Scheduled, re-render follows |

### 3.4. Common Patterns

```jsx
// Previous prop/state value
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

// Count renders
function useRenderCount() {
  const count = useRef(0);
  count.current++;
  return count.current;
}

// Interval timer with cleanup
function useInterval(callback, delay) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;
    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}
```

---

## 4. useContext

`useContext` accesses data shared through the Context API without prop drilling.

### 4.1. Creating and Using Context

```jsx
// Step 1: Create context
const ThemeContext = createContext('light'); // default value

// Step 2: Provide context at some parent level
function App() {
  const [theme, setTheme] = useState('light');
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <MainLayout />
    </ThemeContext.Provider>
  );
}

// Step 3: Consume context in any child component
function Button() {
  const { theme, setTheme } = useContext(ThemeContext);
  return (
    <button className={`btn-${theme}`} onClick={() => setTheme('dark')}>
      Toggle Theme
    </button>
  );
}
```

### 4.2. Context with Reducer

```jsx
// State + dispatch in context — common pattern
const CounterContext = createContext();

function CounterProvider({ children }) {
  const [state, dispatch] = useReducer(counterReducer, initialState);
  return (
    <CounterContext.Provider value={{ state, dispatch }}>
      {children}
    </CounterContext.Provider>
  );
}

function CounterDisplay() {
  const { state } = useContext(CounterContext);
  return <div>Count: {state.count}</div>;
}

function CounterButton() {
  const { dispatch } = useContext(CounterContext);
  return <button onClick={() => dispatch({ type: 'INCREMENT' })}>+</button>;
}
```

### 4.3. Context Performance

**Problem**: All consumers re-render when context value changes.

```jsx
// ❌ Bad — new object on every render
<ThemeContext.Provider value={{ theme, setTheme }}>

// ✅ Better — split contexts or memoize
const themeValue = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);
<ThemeContext.Provider value={themeValue}>

// ✅ Best — separate contexts for frequently changing values
const ThemeContext = createContext({ theme: 'light' });
const DispatchContext = createContext(null);
```

---

## 5. Custom Hooks

Custom hooks let you extract and reuse stateful logic across multiple components. They are just JavaScript functions that call other hooks.

### 5.1. useFetch

```jsx
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (!cancelled) setData(data);
      })
      .catch(err => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [url]);

  return { data, loading, error };
}

// Usage
const { data, loading, error } = useFetch('/api/users');
```

### 5.2. useLocalStorage

```jsx
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}

// Usage
const [theme, setTheme] = useLocalStorage('theme', 'light');
```

### 5.3. useDebounce

```jsx
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

// Usage — delays search to avoid excessive API calls
function SearchInput() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery) searchApi(debouncedQuery);
  }, [debouncedQuery]);

  return <input value={query} onChange={e => setQuery(e.target.value)} />;
}
```

### 5.4. useToggle

```jsx
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);
  const toggle = useCallback(() => setValue(v => !v), []);
  return [value, toggle];
}

// Usage
const [isDarkMode, toggleDarkMode] = useToggle(false);
```

### 5.5. useOnClickOutside

```jsx
function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}

// Usage — close dropdown when clicking outside
function Dropdown() {
  const ref = useRef();
  const [isOpen, setIsOpen] = useState(false);
  useOnClickOutside(ref, () => setIsOpen(false));
  return <div ref={ref}>{isOpen && <Menu />}</div>;
}
```

---

## 6. useReducer

`useReducer` manages **complex state logic** with multiple related state transitions. Prefer `useReducer` over `useState` when state transitions are complex or when multiple state values are interdependent.

### 6.1. Basic Pattern

```jsx
const [state, dispatch] = useReducer(reducer, initialState);
// reducer: (state, action) => newState
// dispatch: sends an action object to trigger state update
```

### 6.2. Reducer Pattern

```jsx
function reducer(state, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + 1 };
    case 'DECREMENT':
      return { ...state, count: state.count - 1 };
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

// Dispatch actions
dispatch({ type: 'INCREMENT' });
dispatch({ type: 'SET_USER', payload: { name: 'Alice' } });
dispatch({ type: 'RESET' });
```

### 6.3. Complex State Example

```jsx
// Shopping cart with add, remove, update quantity
const initialState = { items: [], total: 0 };

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.id === action.payload.id);
      const items = existing
        ? state.items.map(i => i.id === action.payload.id
            ? { ...i, qty: i.qty + 1 } : i)
        : [...state.items, { ...action.payload, qty: 1 }];
      return { ...state, items, total: items.reduce((sum, i) => sum + i.price * i.qty, 0) };
    }
    case 'REMOVE_ITEM': {
      const items = state.items.filter(i => i.id !== action.payload);
      return { ...state, items, total: items.reduce((sum, i) => sum + i.price * i.qty, 0) };
    }
    case 'UPDATE_QTY': {
      const items = state.items.map(i =>
        i.id === action.payload.id ? { ...i, qty: action.payload.qty } : i
      );
      return { ...state, items, total: items.reduce((sum, i) => sum + i.price * i.qty, 0) };
    }
    default:
      return state;
  }
}

function Cart() {
  const [cart, dispatch] = useReducer(cartReducer, initialState);
  // ...
  dispatch({ type: 'ADD_ITEM', payload: { id: 1, name: 'Book', price: 29 } });
}
```

### 6.4. useReducer vs useState

| Scenario | Recommended |
|----------|-------------|
| Simple toggle, counter | `useState` |
| Form with many fields | `useState` |
| Multi-step form wizard | `useReducer` |
| Complex state with interdependent values | `useReducer` |
| Many state transitions (CRUD operations) | `useReducer` |
| Shared state across components | `useReducer` + Context |

---

## 7. Rules of Hooks

Hooks have two strict rules that React enforces at runtime.

### 7.1. Only Call Hooks at the Top Level

Do not call hooks inside loops, conditions, or nested functions. Hooks rely on call order to maintain state correctly.

```jsx
// ❌ Wrong — conditional hook call
if (isLoggedIn) {
  useUserData(); // Breaks if condition changes — order of hook calls shifts!
}

// ✅ Correct — always call hooks at the top
function Component({ isLoggedIn }) {
  const [userData, userLoading] = useUserData(); // Always called
  const [guestData, guestLoading] = useGuestData();

  if (!isLoggedIn && guestData) {
    // conditional logic is fine inside the hook
  }
}
```

### 7.2. Only Call Hooks from React Functions

Call hooks from:
- Function components (functions starting with uppercase)
- Custom hooks (functions starting with "use")

```jsx
// ❌ Wrong — regular JavaScript function
function handleClick() {
  useState(0); // Not allowed!
}

// ✅ Correct — call from component or custom hook
function MyComponent() {
  const [count, setCount] = useState(0);
  // ...
}

function useCounter() {
  const [count, setCount] = useState(0);
  return { count, increment: () => setCount(c => c + 1) };
}
```

### 7.3. ESLint Plugin

The `eslint-plugin-react-hooks` plugin enforces these rules automatically.

```bash
npm install eslint-plugin-react-hooks --save-dev
```

```json
// .eslintrc
{
  "plugins": ["react-hooks"],
  "rules": {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

### 7.4. exhaustive-deps Warning

The `exhaustive-deps` rule (also known as the Rules of React data fetching) ensures effect dependencies are complete.

```jsx
// ⚠️ Warning — missing 'name' in dependencies
useEffect(() => {
  document.title = `${name}`;
}, []); // Missing 'name'!

// ✅ Fixed
useEffect(() => {
  document.title = `${name}`;
}, [name]);
```

---

## 8. Additional Hooks

### 8.1. useLayoutEffect

Same as `useEffect`, but **synchronously** fires after DOM mutations and before paint. Use when you need to measure or modify the DOM before the browser paints.

```jsx
useLayoutEffect(() => {
  // Runs synchronously after DOM mutations
  // Prefer useEffect for most cases
  // Use for: measuring elements, scroll position, animations
}, [dependencies]);
```

### 8.2. useMemo and useCallback

Covered in the Rendering Optimization section of React Core. In brief:
- `useMemo`: Cache computed values
- `useCallback`: Cache function references

### 8.3. useImperativeHandle

Customize the value exposed by a component when using `ref`.

```jsx
function FancyInput(props, ref) {
  const inputRef = useRef();
  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current.focus(),
    scrollIntoView: () => inputRef.current.scrollIntoView(),
  }));
  return <input ref={inputRef} />;
}
FancyInput = forwardRef(FancyInput);
```

### 8.4. useDebugValue

Add a label to a custom hook in React DevTools for easier debugging.

```jsx
function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  useDebugValue(isOnline ? 'Online' : 'Offline');
  return isOnline;
}
```

---

## 9. Interview Questions

**Q: When does useEffect with an empty dependency array behave differently from componentDidMount?**

> `useEffect` with `[]` runs asynchronously after the render is committed to the DOM, while `componentDidMount` runs synchronously after the initial render. This means `useEffect` does not block the browser paint, which is better for performance. Also, `useEffect` with `[]` may run twice in Strict Mode (React 18+), while `componentDidMount` only runs once.

**Q: How do you clean up a side effect in useEffect?**

> Return a cleanup function from `useEffect`. This function runs before the component unmounts and before the effect re-runs on dependency changes. Common cleanups include: clearing timers (`clearInterval`, `clearTimeout`), closing WebSocket connections, removing event listeners, and aborting fetch requests using AbortController.

**Q: What is the difference between useState and useReducer?**

> `useState` is simpler and best for independent state values with straightforward updates. `useReducer` is better for complex state logic where multiple state values are related, or when state transitions follow a clear pattern (reducer function). `useReducer` also makes state changes more predictable by centralizing logic in a pure reducer function, and makes testing easier since reducers are pure functions.

**Q: Why should hooks not be called conditionally?**

> Hooks rely on their call order to associate state with each hook instance. If a hook is called conditionally, the call order changes between renders, causing React to misassociate state and references. This leads to bugs where state from one hook appears in another hook's slot.

**Q: How does useRef differ from useState for storing values?**

> Changing a `useRef` value does not trigger a re-render — the component keeps its current render. This is useful for storing DOM element references, timer IDs, or mutable values that don't need to drive UI updates. `useState` triggers re-renders when the value changes, making it appropriate for values that affect the UI.

**Q: What is a stale closure in useEffect, and how do you fix it?**

> A stale closure occurs when an effect captures outdated values from a previous render because a dependency is missing from the dependency array. For example, if an effect uses a variable from the outer scope without listing it as a dependency, it will always see the initial value. Fix by: (1) including all used values in the dependency array, (2) using functional updates for state that depends on previous state, or (3) using refs to store mutable values that shouldn't trigger re-renders.
