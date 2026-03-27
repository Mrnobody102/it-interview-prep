# Advanced React Patterns

## 1. Code Splitting & Lazy Loading

Code splitting reduces initial bundle size by splitting the app into smaller chunks that are loaded on demand.

### 1.1. React.lazy and Suspense

```jsx
import { lazy, Suspense } from 'react';

// Lazy load a component — code split into separate chunk
const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <HeavyComponent />
    </Suspense>
  );
}
```

### 1.2. Named Exports

```jsx
// For named exports, use a wrapper
const Modal = lazy(() =>
  import('./components').then(module => ({ default: module.Modal }))
);
```

### 1.3. Route-Level Splitting

```jsx
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

const Home = lazy(() => import('./pages/Home'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Settings = lazy(() => import('./pages/Settings'));

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Suspense>
  );
}
```

### 1.4. Preloading

```jsx
const HeavyChart = lazy(() => import('./HeavyChart'));

// Preload on hover
<div onMouseEnter={() => HeavyChart()}><ChartPreview /></div>

// Preload on idle
useEffect(() => {
  requestIdleCallback(() => import('./HeavyChart'));
}, []);
```

### 1.5. Error Handling with Error Boundaries

```jsx
import { lazy, Suspense } from 'react';

const Analytics = lazy(() => import('./Analytics'));

<ErrorBoundary fallback={<ErrorMessage />}>
  <Suspense fallback={<Loading />}>
    <Analytics />
  </Suspense>
</ErrorBoundary>
```

---

## 2. Compound Components

A pattern where a parent component and its children work together to share implicit state and logic. Children can be of different types but share context under the hood.

### 2.1. Basic Pattern

```jsx
// Parent manages state, children handle rendering
import { createContext, useContext, useState } from 'react';

const TabsContext = createContext();

function Tabs({ defaultTab, children }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabsContext.Provider>
  );
}

Tabs.List = function TabList({ children }) {
  return <div className="tab-list">{children}</div>;
};

Tabs.Tab = function Tab({ label, value }) {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  const isActive = activeTab === value;
  return (
    <button
      className={`tab ${isActive ? 'active' : ''}`}
      onClick={() => setActiveTab(value)}
    >
      {label}
    </button>
  );
};

Tabs.Panel = function TabPanel({ value, children }) {
  const { activeTab } = useContext(TabsContext);
  return activeTab === value ? <div className="tab-panel">{children}</div> : null;
};

// Usage
<Tabs defaultTab="overview">
  <Tabs.List>
    <Tabs.Tab label="Overview" value="overview" />
    <Tabs.Tab label="Settings" value="settings" />
  </Tabs.List>
  <Tabs.Panel value="overview">Overview content</Tabs.Panel>
  <Tabs.Panel value="settings">Settings content</Tabs.Panel>
</Tabs>
```

### 2.2. with Tabs

```jsx
// Extends the basic pattern with keyboard navigation and accessibility
function Tabs({ defaultTab, children }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [tabs, setTabs] = useState([]);

  // Register tabs automatically
  const registerTab = useCallback((value) => {
    setTabs(prev => [...prev, value]);
  }, []);

  const contextValue = { activeTab, setActiveTab, registerTab };

  return (
    <TabsContext.Provider value={contextValue}>
      {children}
    </TabsContext.Provider>
  );
}
```

### 2.3. Select/Option Pattern

```jsx
const SelectContext = createContext();

function Select({ value, onChange, children }) {
  return (
    <SelectContext.Provider value={{ value, onChange }}>
      <div className="select-wrapper">
        {children}
      </div>
    </SelectContext.Provider>
  );
}

Select.Option = function Option({ value, children }) {
  const { value: selectedValue, onChange } = useContext(SelectContext);
  const isSelected = selectedValue === value;
  return (
    <div
      className={`option ${isSelected ? 'selected' : ''}`}
      onClick={() => onChange(value)}
    >
      {children}
    </div>
  );
};

// Usage
<Select value={selected} onChange={setSelected}>
  <Select.Option value="apple">Apple</Select.Option>
  <Select.Option value="banana">Banana</Select.Option>
</Select>
```

---

## 3. Render Props

A technique for sharing code between components using a prop whose value is a function.

### 3.1. Basic Render Props

```jsx
function MouseTracker({ render }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e) => setPosition({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return render(position);
}

// Usage
<MouseTracker render={({ x, y }) => (
  <div>
    Mouse is at ({x}, {y})
  </div>
)} />
```

### 3.2. children as Render Prop

```jsx
function MouseTracker({ children }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e) => setPosition({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return children(position);
}

// Usage — more idiomatic JSX
<MouseTracker>
  {({ x, y }) => <div>Mouse at ({x}, {y})</div>}
</MouseTracker>
```

### 3.3. Render Props vs Compound Components

| Aspect | Render Props | Compound Components |
|--------|-------------|-------------------|
| **API** | Props with function values | Nested JSX children |
| **Flexibility** | More flexible — any prop name | Structured — specific child types |
| **TypeScript** | Clear prop typing | Requires context or compound typing |
| **Best for** | Reusable behaviors/logic | UI components with fixed structure |

### 3.4. Performance Consideration

Render props can cause unnecessary re-renders if the render function creates new references on every parent render. Memoize the render prop when needed:

```jsx
// ⚠️ Problem — new function on every render
<DataFetcher render={data => <List data={data} />} />

// ✅ Fixed — memoize render prop
const renderList = useCallback(data => <List data={data} />, []);
<DataFetcher render={renderList} />
```

---

## 4. Error Boundaries

Error boundaries are React components that catch JavaScript errors anywhere in their child component tree, log those errors, and display a fallback UI instead of crashing the whole app.

### 4.1. Class-Based Error Boundary

Error boundaries must be **class components** because React's error boundary API uses lifecycle methods.

```jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state to show fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to an error reporting service
    logErrorToService(error, errorInfo);
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      return (
        <div className="error-fallback">
          <h2>Something went wrong.</h2>
          <p>{this.state.error?.message}</p>
          <button onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
```

### 4.2. Function-Based Error Boundary (Hook)

```jsx
import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback: ReactNode | ((error: Error) => ReactNode);
}

interface State {
  hasError: boolean;
  error: Error | null;
}

function ErrorBoundary({ children, fallback }: Props) {
  const [state, setState] = useState<State>({ hasError: false, error: null });

  useEffect(() => {
    // Error boundaries work with class components
    // For function-based approach, wrap in a class
  }, []);

  return <ErrorBoundaryInner fallback={fallback}>{children}</ErrorBoundaryInner>;
}

// Wrapper class component
class ErrorBoundaryInner extends Component<Props, State> {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    logErrorToService(error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      if (typeof this.props.fallback === 'function') {
        return this.props.fallback(this.state.error!);
      }
      return this.props.fallback;
    }
    return this.props.children;
  }
}
```

### 4.3. Using Error Boundaries

```jsx
// Wrap specific components that are prone to errors
<ErrorBoundary fallback={<DashboardErrorFallback />}>
  <DashboardChart data={chartData} />
</ErrorBoundary>

// Global error boundary at app root
<ErrorBoundary fallback={<GlobalErrorFallback />}>
  <App />
</ErrorBoundary>

// Multiple error boundaries for granular error recovery
<ErrorBoundary fallback={<NavigationError />}>
  <Navigation />
  <ErrorBoundary fallback={<ContentError />}>
    <MainContent />
  </ErrorBoundary>
</ErrorBoundary>
```

### 4.4. What Error Boundaries Cannot Catch

Error boundaries do **not** catch errors in:
- Event handlers (use `try/catch`)
- Asynchronous code (`setTimeout`, `requestAnimationFrame`)
- Server-side rendering
- Errors thrown in the error boundary itself
- Non-React code

---

## 5. Portals

Portals render children into a different DOM node, outside the parent DOM hierarchy.

### 5.1. Basic Portal

```jsx
import { createPortal } from 'react-dom';
import { useState } from 'react';

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>X</button>
        {children}
      </div>
    </div>,
    document.getElementById('modal-root') // Target DOM node
  );
}

// index.html needs: <div id="modal-root"></div>
```

### 5.2. Controlled Portal

```jsx
function App() {
  const [showModal, setShowModal] = useState(false);
  return (
    <div className="app">
      <button onClick={() => setShowModal(true)}>Open Modal</button>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <h2>Modal Title</h2>
        <p>Modal content rendered via portal.</p>
      </Modal>
    </div>
  );
}
```

### 5.3. Portal with Keyboard Navigation

```jsx
function Modal({ isOpen, onClose, children }) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      // Trap focus inside modal
      if (e.key === 'Tab') trapFocus(e);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden'; // Prevent background scroll

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.getElementById('modal-root')
  );
}
```

---

## 6. Suspense

`Suspense` lets components "wait" for something before rendering, primarily used with `React.lazy` for code splitting.

### 6.1. Basic Suspense

```jsx
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./Dashboard'));

function App() {
  return (
    <div>
      <Navigation />
      <Suspense fallback={<LoadingSpinner />}>
        <Dashboard />
      </Suspense>
    </div>
  );
}
```

### 6.2. Multiple Suspense Boundaries

```jsx
// Separate loading states for different parts of the page
const Sidebar = lazy(() => import('./Sidebar'));
const Feed = lazy(() => import('./Feed'));
const Recommended = lazy(() => import('./Recommended'));

<>
  <Suspense fallback={<SidebarSkeleton />}>
    <Sidebar />
  </Suspense>
  <Suspense fallback={<FeedSkeleton />}>
    <Feed />
  </Suspense>
  <Suspense fallback={<RecommendedSkeleton />}>
    <Recommended />
  </Suspense>
</>
```

### 6.3. Suspense with Data Fetching

In React 18+, Suspense can be used with frameworks like Relay or TanStack Query for data fetching:

```jsx
import { Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';

function UserProfile({ userId }) {
  return (
    <Suspense fallback={<UserSkeleton />}>
      <UserDetails userId={userId} />
    </Suspense>
  );
}

function UserDetails({ userId }) {
  // Suspends while loading
  const { data } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    suspense: true,
  });
  return <div>{data.name}</div>;
}
```

### 6.4. Concurrent Features

Suspense integrates with React 18's concurrent features:

```jsx
// useDeferredValue with Suspense for non-blocking UI
const SearchResults = lazy(() => import('./SearchResults'));

function Search() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);

  return (
    <div>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      <Suspense fallback={<ResultsSkeleton />}>
        <SearchResults query={deferredQuery} />
      </Suspense>
    </div>
  );
}
```

---

## 7. Forward Refs

`forwardRef` lets a parent component access a child component's DOM node or React element via a ref.

### 7.1. Basic Forward Ref

```jsx
const Button = forwardRef(({ variant = 'primary', children }, ref) => (
  <button ref={ref} className={`btn btn-${variant}`}>
    {children}
  </button>
));

// Parent can now access the button's DOM element
function Parent() {
  const buttonRef = useRef(null);
  return <Button ref={buttonRef}>Click me</Button>;
}
```

### 7.2. Forward Ref with TypeScript

```tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', children, ...props }, ref) => (
    <button ref={ref} className={`btn btn-${variant}`} {...props}>
      {children}
    </button>
  )
);
```

### 7.3. Passing Refs Through HOCs

```jsx
// Higher-order component with forwarded ref
function withLogger(WrappedComponent) {
  function WithLogger(props, ref) {
    useEffect(() => {
      console.log('Component mounted:', WrappedComponent.name);
    });
    return <WrappedComponent ref={ref} {...props} />;
  }
  return forwardRef(WithLogger);
}
```

### 7.4. useImperativeHandle

Customize the value exposed by a ref.

```jsx
const FancyInput = forwardRef(({ label }, ref) => {
  const inputRef = useRef(null);

  // Expose custom methods instead of the DOM element directly
  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current.focus(),
    blur: () => inputRef.current.blur(),
    scrollIntoView: () => inputRef.current.scrollIntoView(),
    value: inputRef.current.value,
  }));

  return (
    <div>
      <label>{label}</label>
      <input ref={inputRef} />
    </div>
  );
});

// Usage
function Parent() {
  const fancyRef = useRef(null);
  return (
    <>
      <FancyInput ref={fancyRef} label="Name" />
      <button onClick={() => fancyRef.current.focus()}>Focus Input</button>
    </>
  );
}
```

---

## 8. Higher-Order Components (HOCs)

HOCs are functions that take a component and return a new component with enhanced behavior. They are a pattern for reusing component logic.

### 8.1. Basic HOC

```jsx
function withLogger(WrappedComponent) {
  function WithLogger(props) {
    useEffect(() => {
      console.log(`Component ${WrappedComponent.name} rendered`);
    });
    return <WrappedComponent {...props} />;
  }
  WithLogger.displayName = `WithLogger(${getDisplayName(WrappedComponent)})`;
  return WithLogger;
}

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

// Usage
const EnhancedButton = withLogger(Button);
<EnhancedButton onClick={handleClick}>Log me</EnhancedButton>
```

### 8.2. HOC with Configuration

```jsx
function withAuthentication(WrappedComponent, options = {}) {
  const { redirectTo = '/login' } = options;

  function WithAuth(props) {
    const { user } = useAuth();
    if (!user) {
      return <Navigate to={redirectTo} />;
    }
    return <WrappedComponent {...props} user={user} />;
  }

  WithAuth.displayName = `WithAuth(${getDisplayName(WrappedComponent)})`;
  return WithAuth;
}

// Usage
const ProtectedDashboard = withAuthentication(Dashboard, { redirectTo: '/login' });
```

### 8.3. HOC vs Render Props vs Custom Hooks

| Pattern | Best For | Pros | Cons |
|---------|---------|------|------|
| **HOC** | Adding behavior to components | Composable, clear API | Wrapper hell, prop collision |
| **Render Props** | Sharing reusable logic | Flexible, explicit data flow | Callback hell, prop drilling |
| **Custom Hooks** | Extracting reusable logic | No wrapper overhead, flexible | Can't use in class components |

---

## 9. React Server Components (RSC)

React Server Components run on the server and send only rendered output to the client, reducing client-side JavaScript bundle size.

### 9.1. Server vs Client Components

```jsx
// Server Component (default in Next.js App Router)
// Can: access DB directly, read files, use server-only APIs
// Cannot: use hooks, use browser APIs, handle events
async function UserList() {
  const users = await db.query('SELECT * FROM users'); // Direct DB access
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}

// Client Component — explicitly opt-in
'use client';
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

### 9.2. Mixing Server and Client Components

```jsx
// Server Component that uses a Client Component
async function Dashboard() {
  const data = await fetchDashboardData(); // Server-side fetch

  return (
    <div>
      <ServerDataPanel data={data} />
      <InteractiveCounter /> {/* Client Component with hooks */}
    </div>
  );
}

// Client Component receiving server data as props
'use client';
function InteractiveCounter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>Clicks: {count}</button>;
}
```

---

## 10. Interview Questions

**Q: What is the difference between code splitting and lazy loading?**

> Code splitting is the technique of breaking an application into smaller chunks that can be loaded on demand. Lazy loading is the act of loading those chunks only when they are needed. `React.lazy()` implements code splitting by dynamically importing a component, and `Suspense` shows a fallback while the chunk loads. Together, they reduce initial bundle size and improve time-to-interactive.

**Q: When would you use a render prop over a compound component?**

> Use render props when you need to share a behavior or piece of state with a component and want maximum flexibility in how that data is rendered. Use compound components when you have a fixed UI structure with well-defined parts (like Tabs, Select, Dialog) where children have specific roles. Compound components provide a more declarative, JSX-friendly API.

**Q: What are the limitations of error boundaries?**

> Error boundaries do not catch: errors in event handlers (use try/catch), asynchronous code (`setTimeout`, `requestAnimationFrame`), server-side rendering errors, or errors thrown in the error boundary itself. They only work with class components (not function components) and only catch errors in the component tree below them.

**Q: How do portals solve the z-index and overflow problem?**

> When a component renders a modal or tooltip, its CSS context (z-index, overflow) can clip or cover it unintentionally. Portals render the component's children into a separate DOM node (like `document.body` or a dedicated `#modal-root`), completely outside the parent's CSS context. This lets modals and tooltips overlay the entire page regardless of parent stacking contexts.

**Q: What is the purpose of forwardRef?**

> By default, refs can only be attached to DOM elements. `forwardRef` allows a parent component to pass a ref through a component to one of its children, typically a DOM element or a class component. This is needed for imperative access (focus, scroll, selection) and for integrating with third-party libraries that require DOM references.

**Q: How do HOCs compare to custom hooks for code reuse?**

> Higher-order components (HOCs) wrap components and pass enhanced props, which can lead to "wrapper hell" (nested HOCs) and prop name collisions. Custom hooks extract reusable logic into functions that can call hooks, with no wrapper overhead and more flexibility. Custom hooks are the modern, recommended approach for reusing stateful logic. HOCs are still useful for cross-cutting concerns like authentication that need to modify the component API.

**Q: What is the difference between React Server Components and Client Components?**

> Server Components execute on the server and send rendered output (not JavaScript) to the client, reducing bundle size and enabling direct database/filesystem access. Client Components use JavaScript on the client, can use hooks and browser APIs, and handle interactivity. React Server Components are the default in Next.js 13+ App Router. Client Components are marked with `'use client'`.
