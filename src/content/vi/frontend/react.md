# React.js

## 1. Virtual DOM

**Virtual DOM** là một bản sao của DOM thật, được lưu trữ trong bộ nhớ của ứng dụng React.

React sử dụng **Virtual DOM** để tối ưu hóa việc cập nhật giao diện người dùng bằng cách:

1. **So sánh (Diffing)**: Khi state thay đổi, React tạo Virtual DOM mới, so sánh với Virtual DOM cũ.
2. **Chỉ cập nhật thay đổi**: React chỉ cập nhật những phần thực sự thay đổi trong DOM thật, thay vì re-render toàn bộ.

> **Lưu ý**: Virtual DOM không nhanh hơn DOM thật trong mọi trường hợp. Điểm mạnh là giúp developer viết code declaratively (khai báo) mà không cần lo việc tối ưu DOM thủ công.

## 2. Component Lifecycle (Class Component)

### 2.1. Mounting (Khởi tạo)

| Method | Mô tả |
|--------|--------|
| `constructor(props)` | Khởi tạo state, bind các hàm. |
| `componentDidMount()` | Chạy sau khi component được render lên DOM lần đầu. Dùng để gọi API, setup subscription. |

### 2.2. Updating (Cập nhật)

| Method | Trigger | Mô tả |
|--------|--------|--------|
| `componentDidUpdate(prevProps, prevState)` | Props/state thay đổi | Chạy sau khi component được cập nhật. |
| `shouldComponentUpdate(nextProps, nextState)` | Props/state thay đổi | Quyết định có nên re-render không. Dùng để tối ưu performance. |

### 2.3. Unmounting (Xóa bỏ)

| Method | Mô tả |
|--------|--------|
| `componentWillUnmount()` | Chạy khi component sắp bị loại khỏi DOM. Dùng để cleanup: clear timer, unsubscribe. |

## 3. Functional Components & Hooks

### 3.1. useState

Dùng để quản lý **state** của component.

```jsx
const [count, setCount] = useState(0);
// count: giá trị state hiện tại
// setCount: hàm cập nhật state
```

- Khi gọi `setCount`, component sẽ **re-render**.
- Nếu state mới phụ thuộc vào state cũ, dùng: `setCount(prev => prev + 1)`.

### 3.2. useEffect

Dùng để thực hiện các **side effects** (tác động phụ) như gọi API, cập nhật DOM, thiết lập timer.

```jsx
// 1. Không có dependency — chạy sau mỗi lần render
useEffect(() => {
  document.title = 'Hello';
});

// 2. Có dependency — chỉ chạy lại khi deps thay đổi
useEffect(() => {
  fetchData(userId);
}, [userId]);

// 3. Mount + Cleanup — chạy khi mount, cleanup khi unmount
useEffect(() => {
  const subscription = subscribe(id);
  return () => subscription.unsubscribe(); // cleanup
}, [id]);
```

**Side effects phổ biến**:
- Lấy dữ liệu từ server khi component mount.
- Thêm/bỏ event listener (resize, scroll...).
- Thay đổi tiêu đề trang.
- Setup timer, subscription.

### 3.3. useContext

Truy cập dữ liệu được chia sẻ qua **Context API**.

```jsx
const value = useContext(MyContext);
// Khi context thay đổi, component sẽ re-render
```

### 3.4. useMemo

Ghi nhớ (memoize) **giá trị tính toán** phức tạp, tránh tính lại không cần thiết khi component re-render.

```jsx
const expensiveValue = useMemo(
  () => computeExpensiveValue(a, b),
  [a, b]
);
// Chỉ tính lại khi a hoặc b thay đổi
```

### 3.5. useCallback

Ghi nhớ (memoize) **hàm**, tránh tạo mới hàm khi component re-render.

```jsx
const handleClick = useCallback(
  () => { doSomething(id); },
  [id]
);
// Hữu ích khi truyền callback xuống component con (dùng với React.memo)
```

### 3.6. useReducer

Quản lý **logic state phức tạp** (tốt hơn useState khi có nhiều state liên quan).

```jsx
const [state, dispatch] = useReducer(reducer, initialState);
// reducer: (state, action) => newState
// dispatch: gửi action để cập nhật state
```

- Phù hợp: quản lý form nhiều bước, counter phức tạp, state có nhiều hành động cập nhật liên tiếp.

### 3.7. useRef

Lưu trữ giá trị có thể thay đổi mà **không gây re-render**.

```jsx
const inputRef = useRef(null);
// .current: truy cập DOM element hoặc lưu giá trị

// Focus vào input
inputRef.current.focus();

// Lưu giá trị trước đó
const prevValueRef = useRef(value);
// prevValueRef.current sẽ không trigger re-render
```

- Dùng cho: truy cập DOM, lưu timer ID, lưu giá trị trước đó.

## 4. Component Architecture

### 4.1. Smart/Dumb Components

| Loại | Trách nhiệm |
|------|-------------|
| **Smart (Container)** | Quản lý state, xử lý logic, gọi API, truyền props xuống Presentational. |
| **Dumb (Presentational)** | Chỉ nhận props, hiển thị UI, không quản lý logic phức tạp. |

### 4.2. Props Drilling vs Context

- **Prop drilling**: Truyền props qua nhiều cấp component. Tránh bằng cách chỉ truyền props thật sự cần.
- **Context API**: Truyền state toàn cục (theme, auth, language) mà không cần prop drilling.

### 4.3. Custom Hooks

Tái sử dụng logic stateful giữa các component.

```jsx
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(data => { setData(data); setLoading(false); });
  }, [url]);

  return { data, loading };
}
```

## 5. Routing & Navigation

### 5.1. React Router (Common)

```jsx
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

// Nested routes
<Routes>
  <Route path="/products" element={<ProductLayout />}>
    <Route index element={<ProductList />} />
    <Route path=":id" element={<ProductDetail />} />
  </Route>
</Routes>
```

### 5.2. Route Protection (PrivateRoute)

```jsx
function PrivateRoute({ children, isAuthenticated }) {
  return isAuthenticated ? children : <Navigate to="/login" />;
}
```

## 6. API Integration

### 6.1. Axios vs Fetch

**Axios** được khuyến khích hơn fetch vì nhiều tính năng tiện ích hơn.

### 6.2. Axios Interceptors

Chặn request/response để thêm logic chung.

```jsx
// Request interceptor: Thêm token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = \`Bearer \${token}\`;
  return config;
});

// Response interceptor: Xử lý refresh token
api.interceptors.response.use(
  res => res,
  async error => {
    if (error.response?.status === 401) {
      // Gọi refresh token API
      const newToken = await refreshToken();
      // Retry request gốc
    }
    return Promise.reject(error);
  }
);
```

### 6.3. TanStack Query (React Query)

```jsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const { data, isLoading, error } = useQuery({
  queryKey: ['users', userId],
  queryFn: () => fetchUser(userId),
  staleTime: 5 * 60 * 1000, // 5 phút
});

const mutation = useMutation({
  mutationFn: createUser,
  onSuccess: () => queryClient.invalidateQueries(['users'])
});
```

**Tính năng chính**:
- Tự động quản lý **Loading/Error**.
- **Caching**: Dữ liệu cũ hiển thị trong khi fetch dữ liệu mới (stale-while-revalidate).
- Tự động **refetch** khi tab focus hoặc sau interval.
- Giảm boilerplate code.

## 7. Performance Optimization

### 7.1. Tránh Re-render không cần thiết

| Kỹ thuật | Mục đích |
|-----------|-----------|
| `React.memo(Component)` | Component chỉ re-render khi props thay đổi |
| `useMemo(() => value, [deps])` | Ghi nhớ giá trị tính toán |
| `useCallback(() => fn, [deps])` | Ghi nhớ hàm |

### 7.2. Code Splitting

```jsx
const LazyComponent = lazy(() => import('./HeavyComponent'));

<Suspense fallback={<Loading />}>
  <LazyComponent />
</Suspense>
```

### 7.3. Virtualization (Danh sách lớn)

Chỉ render những item đang hiển thị trên màn hình.

```jsx
import { FixedSizeList } from 'react-window';
// Danh sách 10,000 items nhưng chỉ render 20-30 items đang nhìn thấy
```

### 7.4. Debouncing & Throttling

Hạn chế số lần gọi hàm khi sự kiện xảy ra liên tục.

```jsx
// Debounce: Chờ ngừng gõ 300ms mới gọi API
const debouncedSearch = debounce(searchApi, 300);

// Throttle: Tối đa 1 lần gọi mỗi 100ms
const throttledScroll = throttle(handleScroll, 100);
```

## 8. Event Handling

### 8.1. Synthetic Event

React sử dụng **SyntheticEvent** — lớp event bao bọc native event, hoạt động đồng nhất trên mọi trình duyệt.

```jsx
function handleClick(e) {
  e.preventDefault(); // Ngăn hành động mặc định
  e.stopPropagation(); // Ngăn bubbling lên cha
}
```

### 8.2. Event Delegation

React đã tối ưu sẵn event delegation — **không cần** tự viết delegation như DOM thuần.

## 9. State Management

### 9.1. Context API

- **Ưu điểm**: Đơn giản, phù hợp dữ liệu toàn cục ít thay đổi (theme, auth, language).
- **Nhược điểm**: Khi context cập nhật, **tất cả** component con đều re-render.

### 9.2. Redux Toolkit

```jsx
// store.ts
import { configureStore } from '@reduxjs/toolkit';
const store = configureStore({
  reducer: {
    cart: cartSlice.reducer,
  }
});

// cartSlice.ts
import { createSlice } from '@reduxjs/toolkit';
const cartSlice = createSlice({
  name: 'cart',
  initialState: [],
  reducers: {
    addItem: (state, action) => { state.push(action.payload); },
    removeItem: (state, action) => { /* ... */ },
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
|--|-----------|-----------|
| **Dùng cho** | Dự án nhỏ/vừa, async đơn giản | Hệ thống phức tạp, nhiều luồng async |
| **Cách viết** | `dispatch((getDispatch) => {...})` | Dùng generator function |
| **Ví dụ** | Fetch user, CRUD API đơn giản | Chuỗi tuần tự: Login → Fetch Profile → Fetch Messages |

## 10. Immutable Update (Quan trọng)

**Nguyên tắc**: Không thay đổi trực tiếp state. Luôn tạo **bản sao mới** với thay đổi.

```jsx
// ❌ Sai — thay đổi trực tiếp
state.items.push(newItem);

// ✅ Đúng — tạo array mới
setItems([...items, newItem]);

// ✅ Với object
setUser({ ...user, name: 'New Name' });
```

**Tại sao quan trọng?**
- React dùng **reference equality** để phát hiện thay đổi state.
- Thay đổi trực tiếp → reference không đổi → React không re-render.
- Tạo object/mảng mới → reference thay đổi → React re-render đúng.
