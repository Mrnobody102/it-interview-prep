# Frontend — React.js

## 1. Virtual DOM

**Virtual DOM** is a lightweight copy of the real DOM kept in memory by React.

### 1.1. How It Works

1. **Diffing**: When state changes, React creates a new Virtual DOM and compares it with the previous version.
2. **Reconciliation**: React determines the minimal set of changes needed.
3. **Selective Updates**: Only the changed elements are updated in the real DOM.

> **Note**: Virtual DOM is not always faster than direct DOM manipulation. Its strength is enabling developers to write **declaratively** — you describe what the UI should look like, and React handles the updates.

---

## 2. Component Lifecycle

### 2.1. Mounting

| Method | Description |
|--------|------------|
| `constructor(props)` | Initialize state, bind methods |
| `componentDidMount()` | Runs after component is first rendered to DOM. Use for API calls, subscriptions, timers |

### 2.2. Updating

| Method | Trigger | Description |
|--------|---------|-------------|
| `componentDidUpdate(prevProps, prevState)` | Props/state change | Runs after component updates |
| `shouldComponentUpdate(nextProps, nextState)` | Props/state change | Decides whether to re-render. Used for performance optimization |
| `render()` | Every update | Returns JSX describing the UI |

### 2.3. Unmounting

| Method | Description |
|--------|-------------|
| `componentWillUnmount()` | Runs just before component is removed from DOM. Use for cleanup: clear timers, cancel subscriptions, abort requests |

---

## 3. Functional Components & Hooks

### 3.1. useState

```jsx
const [count, setCount] = useState(0);
// count: current state value
// setCount: function to update state
```

- Calling `setCount` triggers a **re-render**
- If new state depends on old state: `setCount(prev => prev + 1)`

```jsx
// Object state — always pass full object
const [user, setUser] = useState({ name: '', email: '' });
setUser(prev => ({ ...prev, name: 'Alice' }));
```

### 3.2. useEffect

Performs **side effects**: API calls, DOM updates, subscriptions, timers.

```jsx
// 1. No dependency — runs after EVERY render
useEffect(() => {
  document.title = 'Hello';
});

// 2. With dependency array — only re-runs when deps change
useEffect(() => {
  fetchData(userId);
}, [userId]);

// 3. Mount + Cleanup — runs on mount, cleanup on unmount
useEffect(() => {
  const subscription = subscribe(id);
  return () => subscription.unsubscribe(); // cleanup function
}, [id]);

// 4. Empty array — runs ONCE on mount
useEffect(() => {
  fetchUser();
}, []); // Equivalent to componentDidMount
```

### 3.3. useContext

Access data shared through **Context API**.

```jsx
const value = useContext(MyContext);
// When context value changes, this component re-renders
```

### 3.4. useMemo

Memoize (cache) **computed values** to avoid expensive recalculation on re-render.

```jsx
const expensiveValue = useMemo(
  () => computeExpensiveValue(a, b),
  [a, b]
);
// Only recalculates when a or b changes
```

### 3.5. useCallback

Memoize (cache) **functions** to avoid creating new references on re-render.

```jsx
const handleClick = useCallback(
  () => { doSomething(id); },
  [id]
);
// Useful when passing callbacks to child components wrapped in React.memo
```

### 3.6. useReducer

Manage **complex state logic** with multiple related state transitions.

```jsx
const [state, dispatch] = useReducer(reducer, initialState);
// reducer: (state, action) => newState
// dispatch: sends action to trigger state update

function reducer(state, action) {
  switch (action.type) {
    case 'INCREMENT': return { ...state, count: state.count + 1 };
    case 'SET_USER': return { ...state, user: action.payload };
    default: return state;
  }
}
```

### 3.7. useRef

Store mutable values that **do not trigger re-render**.

```jsx
const inputRef = useRef(null);
// .current: access DOM element or store mutable value

// Focus input
inputRef.current.focus();

// Store previous value without re-rendering
const prevValueRef = useRef(value);
prevValueRef.current = value; // Won't trigger re-render
```

| Use Case | Example |
|----------|---------|
| DOM access | `inputRef.current.focus()` |
| Timer IDs | `clearInterval(timerRef.current)` |
| Previous values | Store previous prop value |

---

## 4. Component Architecture

### 4.1. Smart vs Dumb Components

| Type | Other Name | Responsibility |
|------|------------|----------------|
| **Smart** | Container | Manage state, handle logic, call APIs, pass props down |
| **Dumb** | Presentational | Receive props, render UI, no complex logic |

### 4.2. Props Drilling vs Context

| Approach | Description | When to use |
|----------|-------------|-------------|
| **Prop drilling** | Pass props through multiple levels | Simple apps, props truly needed by intermediate level |
| **Context API** | Share global state without prop chains | Theme, auth, locale, shared configuration |

### 4.3. Custom Hooks

Reuse stateful logic across components.

```jsx
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(setData)
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }, [url]);

  return { data, loading, error };
}
```

---

## 5. Routing & Navigation

### 5.1. React Router (v6)

```jsx
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';

<BrowserRouter>
  <nav>
    <Link to="/">Home</Link>
    <Link to="/products">Products</Link>
  </nav>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/products" element={<ProductLayout />}>
      <Route index element={<ProductList />} />
      <Route path=":id" element={<ProductDetail />} />
    </Route>
    <Route path="/admin" element={<PrivateRoute><AdminPanel /></PrivateRoute>} />
    <Route path="*" element={<Navigate to="/" />} />
  </Routes>
</BrowserRouter>
```

### 5.2. Private Route

```jsx
function PrivateRoute({ children, isAuthenticated }) {
  return isAuthenticated ? children : <Navigate to="/login" />;
}
```

---

## 6. API Integration

### 6.1. Axios vs Fetch

**Axios** is preferred over `fetch` because it provides automatic JSON transformation, request/response interceptors, and better error handling.

### 6.2. Axios Interceptors

```jsx
// Request interceptor — add token to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor — handle token refresh
api.interceptors.response.use(
  res => res,
  async error => {
    if (error.response?.status === 401) {
      const newToken = await refreshToken();
      error.config.headers.Authorization = `Bearer ${newToken}`;
      return api.request(error.config); // Retry request
    }
    return Promise.reject(error);
  }
);
```

### 6.3. TanStack Query (React Query)

```jsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Fetch data
const { data, isLoading, error, refetch } = useQuery({
  queryKey: ['users', userId],
  queryFn: () => fetchUser(userId),
  staleTime: 5 * 60 * 1000,    // 5 minutes
  retry: 3                      // Retry failed requests
});

// Mutate data
const mutation = useMutation({
  mutationFn: createUser,
  onSuccess: () => queryClient.invalidateQueries(['users'])
});

mutation.mutate({ name: 'Alice' });
```

**Key features**: Automatic loading/error states, caching, background refetch on window focus, optimistic updates.

---

## 7. Performance Optimization

### 7.1. Preventing Unnecessary Re-renders

| Technique | Purpose |
|-----------|---------|
| `React.memo(Component)` | Only re-render when props change |
| `useMemo(() => value, [deps])` | Memoize computed values |
| `useCallback(() => fn, [deps])` | Memoize functions |

### 7.2. Code Splitting

```jsx
import { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

<Suspense fallback={<Loading />}>
  <HeavyComponent />
</Suspense>
```

### 7.3. Virtualization (Large Lists)

Only render visible items for large lists.

```jsx
import { FixedSizeList } from 'react-window';
// 10,000 items but only renders 20-30 at a time
```

### 7.4. Debouncing & Throttling

```jsx
// Debounce — wait for user to stop typing before searching
import { useDebounce } from './hooks/useDebounce';
const debouncedSearch = useDebounce(searchTerm, 300);

// Throttle — limit scroll handler calls
import { useThrottle } from './hooks/useThrottle';
const throttledScroll = useThrottle(handleScroll, 100);
```

---

## 8. Event Handling

### 8.1. Synthetic Event

React wraps native events in a **SyntheticEvent** for cross-browser consistency.

```jsx
function handleClick(e) {
  e.preventDefault();  // Prevent default behavior
  e.stopPropagation(); // Stop event bubbling to parent
}

function handleChange(e) {
  setValue(e.target.value);  // e.target.value for inputs
}
```

### 8.2. Event Delegation

React automatically uses event delegation at the root — **no need to implement it manually**.

---

## 9. State Management

### 9.1. Context API

- **Pros**: Simple, built-in, suitable for theme/auth/locale
- **Cons**: All consumers re-render when context changes

### 9.2. Redux Toolkit

```jsx
// store.ts
import { configureStore } from '@reduxjs/toolkit';
const store = configureStore({
  reducer: { cart: cartSlice.reducer }
});

// cartSlice.ts
import { createSlice } from '@reduxjs/toolkit';
const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [] },
  reducers: {
    addItem: (state, action) => { state.items.push(action.payload); },
    removeItem: (state, action) => {
      state.items = state.items.filter(i => i.id !== action.payload);
    }
  }
});

// Component
import { useDispatch, useSelector } from 'react-redux';
const dispatch = useDispatch();
const items = useSelector(state => state.cart.items);
dispatch(addItem({ id: 1, name: 'Product' }));
```

### 9.3. Redux Thunk vs Saga

| | Redux Thunk | Redux Saga |
|--|------------|------------|
| **Best for** | Small/medium projects, simple async | Complex async workflows |
| **Syntax** | Return functions from actions | Use generator functions |
| **Example use** | Fetch user, simple CRUD | Sequential: Login -> Fetch Profile -> Fetch Messages |

---

## 10. Immutable Updates (Critical)

> **Rule**: Never mutate state directly. Always create a new copy.

```jsx
// Wrong — direct mutation
state.items.push(newItem);

// Correct — new array reference
setItems([...items, newItem]);

// Correct — filter without mutation
setItems(items.filter(i => i.id !== action.payload));

// Correct — update object immutably
setUser({ ...user, name: 'New Name' });

// Correct — nested immutability
setCart({
  ...cart,
  items: [...cart.items, newItem]
});
```

> **Why?** React uses **reference equality** to detect changes. Direct mutation doesn't change the reference, so React doesn't re-render.

---

## 11. Advanced Patterns

### 11.1. Compound Components

```jsx
// Parent manages state, children handle rendering
function Tabs({ children, defaultTab }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabsContext.Provider>
  );
}
Tabs.Panel = function TabPanel({ label, children }) {
  const { activeTab } = useContext(TabsContext);
  return activeTab === label ? <div>{children}</div> : null;
};
```

### 11.2. Render Props

```jsx
function MouseTracker({ render }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handleMove = e => setPosition({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);
  return render(position);
}

<MouseTracker render={({ x, y }) => (
  <div>Mouse at {x}, {y}</div>
)} />
```

### 11.3. Error Boundaries

```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error, info) { logError(error, info); }

  render() {
    if (this.state.hasError) return <h1>Something went wrong.</h1>;
    return this.props.children;
  }
}
```

---

## 12. Interview Questions

**Q: What is the difference between controlled and uncontrolled components?**

> A **controlled component** has its value managed by React state (via `onChange` handlers). An **uncontrolled component** manages its own internal state (reads value with a ref on submit). Controlled components are the React best practice for form handling.

**Q: How does React.memo differ from useMemo?**

> `React.memo` is a **higher-order component** that memoizes an entire component (prevents re-render when props haven't changed). `useMemo` memoizes a **computed value** within a component. Both use memoization but serve different purposes.

**Q: What are React Server Components?**

> **React Server Components (RSC)** run on the server and send only the rendered output to the client. They reduce client-side JavaScript bundle size, enable direct database access, and are the default in Next.js 13+ App Router. Client Components (`'use client'`) still use JavaScript on the client.
