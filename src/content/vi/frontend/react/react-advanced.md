# Các Pattern Nâng Cao trong React

## 1. Code Splitting & Lazy Loading

Code splitting giúp giảm kích thước bundle ban đầu bằng cách chia nhỏ ứng dụng thành các chunk nhỏ hơn, được tải theo yêu cầu.

### 1.1. React.lazy và Suspense

```tsx
import { lazy, Suspense } from 'react';

// Lazy load một component — code được tách thành chunk riêng
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

```tsx
// Với named exports, cần một wrapper
const Modal = lazy(() =>
  import('./components').then(module => ({ default: module.Modal }))
);
```

### 1.3. Tách Code Theo Route

```tsx
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

```tsx
const HeavyChart = lazy(() => import('./HeavyChart'));

// Preload khi hover
<div onMouseEnter={() => HeavyChart()}><ChartPreview /></div>

// Preload khi rảnh rỗi
useEffect(() => {
  requestIdleCallback(() => import('./HeavyChart'));
}, []);
```

### 1.5. Xử lý Lỗi với Error Boundaries

```tsx
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

Pattern trong đó component cha và các component con cùng chia sẻ state ngầm và logic. Các component con có thể thuộc nhiều loại khác nhau nhưng chia sẻ context bên dưới.

### 2.1. Pattern Cơ Bản

```tsx
// Component cha quản lý state, các component con xử lý việc render
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

// Cách sử dụng
<Tabs defaultTab="overview">
  <Tabs.List>
    <Tabs.Tab label="Tổng quan" value="overview" />
    <Tabs.Tab label="Cài đặt" value="settings" />
  </Tabs.List>
  <Tabs.Panel value="overview">Nội dung tổng quan</Tabs.Panel>
  <Tabs.Panel value="settings">Nội dung cài đặt</Tabs.Panel>
</Tabs>
```

### 2.2. Với Tabs (Mở rộng)

```tsx
// Mở rộng pattern cơ bản với điều hướng bàn phím và accessibility
function Tabs({ defaultTab, children }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [tabs, setTabs] = useState([]);

  // Đăng ký tabs tự động
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

### 2.3. Pattern Select/Option

```tsx
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

// Cách sử dụng
<Select value={selected} onChange={setSelected}>
  <Select.Option value="apple">Táo</Select.Option>
  <Select.Option value="banana">Chuối</Select.Option>
</Select>
```

---

## 3. Render Props

Kỹ thuật chia sẻ code giữa các component bằng cách sử dụng một prop có giá trị là một hàm.

### 3.1. Render Props Cơ Bản

```tsx
function MouseTracker({ render }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e) => setPosition({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return render(position);
}

// Cách sử dụng
<MouseTracker render={({ x, y }) => (
  <div>
    Chuột đang ở ({x}, {y})
  </div>
)} />
```

### 3.2. children như Render Prop

```tsx
function MouseTracker({ children }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e) => setPosition({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return children(position);
}

// Cách sử dụng — JSX tự nhiên hơn
<MouseTracker>
  {({ x, y }) => <div>Chuột tại ({x}, {y})</div>}
</MouseTracker>
```

### 3.3. Render Props vs Compound Components

| Khía cạnh | Render Props | Compound Components |
|-----------|-------------|---------------------|
| **API** | Props có giá trị là hàm | Component con lồng nhau |
| **Tính linh hoạt** | Linh hoạt hơn — bất kỳ tên prop nào | Có cấu trúc — các loại con cụ thể |
| **TypeScript** | Kiểu prop rõ ràng | Cần context hoặc kiểu compound phức tạp |
| **Phù hợp cho** | Reuse behaviors/logic | UI component có cấu trúc cố định |

### 3.4. Cân nhắc về Performance

Render props có thể gây re-render không cần thiết nếu hàm render tạo ra reference mới ở mỗi lần parent render. Hãy memoize render prop khi cần:

```tsx
// Cảnh báo — hàm mới ở mỗi lần render
<DataFetcher render={data => <List data={data} />} />

// Đã sửa — memoize render prop
const renderList = useCallback(data => <List data={data} />, []);
<DataFetcher render={renderList} />
```

---

## 4. Error Boundaries

Error boundaries là các React component bắt các lỗi JavaScript ở bất kỳ đâu trong cây component con, ghi log các lỗi đó, và hiển thị UI fallback thay vì crash toàn bộ ứng dụng.

### 4.1. Error Boundary dạng Class

Error boundaries phải là **class components** vì React's error boundary API sử dụng lifecycle methods.

```tsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Cập nhật state để hiển thị UI fallback
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Ghi log lỗi vào service báo lỗi
    logErrorToService(error, errorInfo);
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // UI fallback tùy chỉnh
      return (
        <div className="error-fallback">
          <h2>Đã xảy ra lỗi.</h2>
          <p>{this.state.error?.message}</p>
          <button onClick={() => this.setState({ hasError: false })}>
            Thử lại
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
```

### 4.2. Error Boundary dạng Function (Hook)

```tsx
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
    // Error boundaries hoạt động với class components
    // Với cách tiếp cận function, cần bọc trong class
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

### 4.3. Sử dụng Error Boundaries

```tsx
// Bọc các component cụ thể dễ gây lỗi
<ErrorBoundary fallback={<DashboardErrorFallback />}>
  <DashboardChart data={chartData} />
</ErrorBoundary>

// Error boundary toàn cục ở root của ứng dụng
<ErrorBoundary fallback={<GlobalErrorFallback />}>
  <App />
</ErrorBoundary>

// Nhiều error boundaries cho phục hồi lỗi chi tiết
<ErrorBoundary fallback={<NavigationError />}>
  <Navigation />
  <ErrorBoundary fallback={<ContentError />}>
    <MainContent />
  </ErrorBoundary>
</ErrorBoundary>
```

### 4.4. Error Boundaries không bắt được gì

Error boundaries **không** bắt được các lỗi trong:
- Event handlers (dùng `try/catch`)
- Code bất đồng bộ (`setTimeout`, `requestAnimationFrame`)
- Server-side rendering
- Lỗi ném ra từ chính error boundary
- Code không phải React

---

## 5. Portals

Portals render children vào một DOM node khác, bên ngoài DOM hierarchy của parent.

### 5.1. Portal Cơ Bản

```tsx
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

// index.html cần có: <div id="modal-root"></div>
```

### 5.2. Portal có Controlled State

```tsx
function App() {
  const [showModal, setShowModal] = useState(false);
  return (
    <div className="app">
      <button onClick={() => setShowModal(true)}>Mở Modal</button>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <h2>Tiêu đề Modal</h2>
        <p>Nội dung modal được render qua portal.</p>
      </Modal>
    </div>
  );
}
```

### 5.3. Portal với Điều hướng Bàn phím

```tsx
function Modal({ isOpen, onClose, children }) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      // Khóa focus bên trong modal
      if (e.key === 'Tab') trapFocus(e);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden'; // Ngăn cuộn nền

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

`Suspense` cho phép các component "chờ" điều gì đó trước khi render, chủ yếu dùng với `React.lazy` để code splitting.

### 6.1. Suspense Cơ Bản

```tsx
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

### 6.2. Nhiều Suspense Boundaries

```tsx
// Trạng thái loading riêng cho từng phần của trang
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

### 6.3. Suspense với Data Fetching

Trong React 18+, Suspense có thể dùng với các framework như Relay hoặc TanStack Query cho việc fetch dữ liệu:

```tsx
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
  // Suspends trong khi loading
  const { data } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    suspense: true,
  });
  return <div>{data.name}</div>;
}
```

### 6.4. Các tính năng Concurrent

Suspense tích hợp với các tính năng concurrent của React 18:

```tsx
// useDeferredValue với Suspense cho UI không block
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

`forwardRef` cho phép component cha truy cập DOM node hoặc React element của component con thông qua một ref.

### 7.1. Forward Ref Cơ Bản

```tsx
const Button = forwardRef(({ variant = 'primary', children }, ref) => (
  <button ref={ref} className={`btn btn-${variant}`}>
    {children}
  </button>
));

// Component cha giờ có thể truy cập DOM element của button
function Parent() {
  const buttonRef = useRef(null);
  return <Button ref={buttonRef}>Nhấn vào đây</Button>;
}
```

### 7.2. Forward Ref với TypeScript

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

### 7.3. Truyền Refs Qua HOCs

```tsx
// Higher-order component với forwarded ref
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

Tùy chỉnh giá trị được expose bởi ref.

```tsx
const FancyInput = forwardRef(({ label }, ref) => {
  const inputRef = useRef(null);

  // Expose các method tùy chỉnh thay vì expose DOM element trực tiếp
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

// Cách sử dụng
function Parent() {
  const fancyRef = useRef(null);
  return (
    <>
      <FancyInput ref={fancyRef} label="Tên" />
      <button onClick={() => fancyRef.current.focus()}>Focus Input</button>
    </>
  );
}
```

---

## 8. Higher-Order Components (HOCs)

HOCs là các hàm nhận vào một component và trả về một component mới với behavior được nâng cao. Chúng là một pattern để reuse logic component.

### 8.1. HOC Cơ Bản

```tsx
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

// Cách sử dụng
const EnhancedButton = withLogger(Button);
<EnhancedButton onClick={handleClick}>Log me</EnhancedButton>
```

### 8.2. HOC với Cấu hình

```tsx
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

// Cách sử dụng
const ProtectedDashboard = withAuthentication(Dashboard, { redirectTo: '/login' });
```

### 8.3. HOC vs Render Props vs Custom Hooks

| Pattern | Phù hợp cho | Ưu điểm | Nhược điểm |
|---------|-------------|---------|------------|
| **HOC** | Thêm behavior vào component | Có thể compose, API rõ ràng | Wrapper hell, prop collision |
| **Render Props** | Chia sẻ logic reusable | Linh hoạt, data flow rõ ràng | Callback hell, prop drilling |
| **Custom Hooks** | Trích xuất logic reusable | Không có wrapper overhead, linh hoạt | Không dùng được trong class components |

---

## 9. React Server Components (RSC)

React Server Components chạy trên server và chỉ gửi output đã render đến client, giảm kích thước JavaScript bundle phía client.

### 9.1. Server vs Client Components

```tsx
// Server Component (mặc định trong Next.js App Router)
// Có thể: truy cập DB trực tiếp, đọc files, dùng server-only APIs
// Không thể: dùng hooks, dùng browser APIs, xử lý events
async function UserList() {
  const users = await db.query('SELECT * FROM users'); // Truy cập DB trực tiếp
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}

// Client Component — cần opt-in rõ ràng
'use client';
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

### 9.2. Kết hợp Server và Client Components

```tsx
// Server Component sử dụng Client Component
async function Dashboard() {
  const data = await fetchDashboardData(); // Fetch phía server

  return (
    <div>
      <ServerDataPanel data={data} />
      <InteractiveCounter /> {/* Client Component với hooks */}
    </div>
  );
}

// Client Component nhận data từ server qua props
'use client';
function InteractiveCounter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>Số lần click: {count}</button>;
}
```

---

## 10. Câu Hỏi Phỏng Vấn

### N. Sự khác biệt giữa code splitting và lazy loading là gì?

> Code splitting là kỹ thuật chia một ứng dụng thành các chunk nhỏ hơn có thể được tải theo yêu cầu. Lazy loading là hành động tải các chunk đó chỉ khi cần thiết. `React.lazy()` thực hiện code splitting bằng cách dynamically import một component, và `Suspense` hiển thị fallback trong khi chunk đang được tải. Cùng nhau, chúng giảm kích thước bundle ban đầu và cải thiện thời gian time-to-interactive.

### N. Khi nào nên dùng render props thay vì compound component?

> Dùng render props khi bạn cần chia sẻ một behavior hoặc một phần state với component và muốn sự linh hoạt tối đa trong cách render dữ liệu đó. Dùng compound components khi bạn có một cấu trúc UI cố định với các phần được định nghĩa rõ ràng (như Tabs, Select, Dialog) trong đó các component con có vai trò cụ thể. Compound components cung cấp API khai báo, thân thiện với JSX hơn.

### N. Hạn chế của error boundaries là gì?

> Error boundaries không bắt được: lỗi trong event handlers (dùng try/catch), code bất đồng bộ (`setTimeout`, `requestAnimationFrame`), lỗi server-side rendering, hoặc lỗi ném ra từ chính error boundary. Chúng chỉ hoạt động với class components (không phải function components) và chỉ bắt lỗi trong cây component bên dưới chúng.

### N. Portals giải quyết vấn đề z-index và overflow như thế nào?

> Khi một component render modal hoặc tooltip, CSS context của nó (z-index, overflow) có thể che hoặc cắt nó một cách không mong muốn. Portals render children của component vào một DOM node riêng biệt (như `document.body` hoặc `#modal-root`), hoàn toàn bên ngoài CSS context của parent. Điều này cho phép modals và tooltips hiển thị overlay trên toàn bộ trang bất kể các stacking contexts của parent.

### N. Mục đích của forwardRef là gì?

> Mặc định, refs chỉ có thể gắn vào DOM elements. `forwardRef` cho phép một component cha truyền ref qua một component đến một trong các component con của nó, thường là một DOM element hoặc một class component. Điều này cần thiết cho việc truy cập imperative (focus, scroll, selection) và để tích hợp với các thư viện third-party đòi hỏi DOM references.

### N. HOCs so sánh với custom hooks cho việc reuse code như thế nào?

> Higher-order components (HOCs) bọc các component và truyền các props đã được enhance, điều này có thể dẫn đến "wrapper hell" (các HOCs lồng nhau) và xung đột tên props. Custom hooks trích xuất logic reusable thành các hàm có thể gọi hooks, không có wrapper overhead và linh hoạt hơn. Custom hooks là cách tiếp cận hiện đại, được khuyến nghị để reuse stateful logic. HOCs vẫn hữu ích cho các cross-cutting concerns như authentication cần sửa đổi component API.

### N. Sự khác biệt giữa React Server Components và Client Components là gì?

> Server Components thực thi trên server và gửi output đã render (không phải JavaScript) đến client, giảm kích thước bundle và cho phép truy cập trực tiếp database/filesystem. Client Components sử dụng JavaScript phía client, có thể dùng hooks và browser APIs, và xử lý tính tương tác. React Server Components là mặc định trong Next.js 13+ App Router. Client Components được đánh dấu bằng `'use client'`.
