# Advanced React Patterns

## Performance Optimization

### Code Splitting

```tsx
import { lazy, Suspense } from "react";

const HeavyComponent = lazy(() => import("./HeavyComponent"));

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <HeavyComponent />
    </Suspense>
  );
}
```

### Lazy Loading Routes

```tsx
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
```

## State Management Patterns

### Compound Components

```tsx
interface TabsContextValue {
  activeTab: string;
  setActiveTab: (id: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function Tabs({ children, defaultTab }: { children: React.ReactNode; defaultTab: string }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabsContext.Provider>
  );
}

Tabs.Panel = function Panel({ id, children }: { id: string; children: React.ReactNode }) {
  const ctx = useContext(TabsContext)!;
  return ctx.activeTab === id ? <div>{children}</div> : null;
};

// Usage
<Tabs defaultTab="tab1">
  <Tabs.Button id="tab1">Tab 1</Tabs.Button>
  <Tabs.Button id="tab2">Tab 2</Tabs.Button>
  <Tabs.Panel id="tab1">Content 1</Tabs.Panel>
  <Tabs.Panel id="tab2">Content 2</Tabs.Panel>
</Tabs>
```

### Render Props

```tsx
function MouseTracker({ render }: { render: (pos: { x: number; y: number }) => React.ReactNode }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handler = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  return render(pos);
}

// Usage
<MouseTracker render={({ x, y }) => <div>Mouse at {x}, {y}</div>} />
```

## Error Boundaries

```tsx
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    logError(error, info);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// Usage
<ErrorBoundary fallback={<ErrorPage />}>
  <MyComponent />
</ErrorBoundary>
```

## Portals

```tsx
import { createPortal } from "react-dom";

function Modal({ isOpen, children }: { isOpen: boolean; children: React.ReactNode }) {
  if (!isOpen) return null;

  return createPortal(
    <div className="modal-overlay">
      <div className="modal-content">{children}</div>
    </div>,
    document.body // Render ra ngoài DOM tree cha
  );
}
```

## Suspense

```tsx
function App() {
  return (
    <>
      <Suspense fallback={<ProfileSkeleton />}>
        <ProfileDetails />
      </Suspense>
      <Suspense fallback={<TimelineSkeleton />}>
        <Timeline />
      </Suspense>
    </>
  );
}
```

## Forward Refs

```tsx
const FancyInput = forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => {
    return <input ref={ref} className="fancy" {...props} />;
  }
);

// Usage
const inputRef = useRef<HTMLInputElement>(null);
inputRef.current?.focus();
<FancyInput ref={inputRef} />
```

## Cau hoi phong van

### 1. Reconciliation là gì?

Reconciliation là thuật toán của React để so sánh Virtual DOM mới với DOM thật và cập nhật hiệu quả. Dùng heuristic O(n) algorithm để so sánh hai trees.

### 2. Key trong reconciliation có vai trò gì?

Key giúp React xác định element nào là mới, bị xóa, hay chỉ thay đổi. Key ổn định (stable IDs) giúp React match đúng elements qua các renders.

### 3. Error Boundary có giới hạn gì?

Error Boundary không bắt được:
- Event handlers
- Async code (setTimeout, promises)
- Server-side rendering
- Errors trong chính Error Boundary

### 4. Portal dùng khi nào?

Portal dùng khi cần render component ra ngoài parent DOM tree - modal, tooltip, dropdown menu - để tránh z-index, overflow, và stacking context issues.
