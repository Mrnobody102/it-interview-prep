# React Hooks

Hooks cho phép sử dụng state và các tính năng khác của React trong function components.

## 1. useState

`useState` là hook cơ bản nhất để quản lý state ở cấp độ component trong function components.

### 1.1. Cách sử dụng cơ bản

```tsx
const [count, setCount] = useState(0);
// count: giá trị state hiện tại
// setCount: hàm cập nhật state và kích hoạt re-render
```

### 1.2. Cập nhật State

```tsx
// Cập nhật trực tiếp bằng giá trị
setCount(5);

// Cập nhật kiểu functional — dùng khi state mới phụ thuộc state cũ
setCount(prev => prev + 1);
setCount(prev => prev - 1);

// Canh chừng — việc cập nhật state là bất đồng bộ (async)
// setCount(count + 1); setCount(count + 1); // Chỉ tăng 1 lần!
```

### 1.3. State dạng Object và Array

Khi state là object hoặc array, **luôn truyền một object/array mới** — không bao giờ mutate trực tiếp.

```tsx
// State dạng object — luôn truyền đầy đủ object
const [user, setUser] = useState({ name: '', email: '' });

// Cập nhật một trường — spread tất cả các trường còn lại
setUser(prev => ({ ...prev, name: 'Alice' }));

// Merge với spread
setUser(prev => ({ ...prev, email: 'alice@example.com' }));

// State dạng array
const [items, setItems] = useState([]);

// Thêm phần tử
setItems(prev => [...prev, newItem]);

// Xóa phần tử
setItems(prev => prev.filter(i => i.id !== itemId));

// Cập nhật phần tử
setItems(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i));
```

### 1.4. Lazy Initialization

Truyền một function vào `useState` để trì hoãn việc tính toán giá trị khởi tạo tốn kém.

```tsx
// Tot — state khởi tạo chỉ được tính một lần khi mount
const [data, setData] = useState(() => {
  const saved = localStorage.getItem('data');
  return saved ? JSON.parse(saved) : initialValue;
});

// Xấu — chạy lại sau mỗi lần render
const [data, setData] = useState(JSON.parse(localStorage.getItem('data')));
```

### 1.5. Nhiều biến State

```tsx
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [isLoading, setIsLoading] = useState(false);

// Hoặc gộp các state liên quan lại với nhau
const [form, setForm] = useState({ name: '', email: '' });
```

---

## 2. useEffect

`useEffect` thực hiện **side effects** trong function components: gọi API, thao tác DOM, đăng ký subscription, timer, v.v.

### 2.1. Các mẫu Dependency

```tsx
// 1. Không có dependency array — chạy sau MỌI lần render
useEffect(() => {
  document.title = 'Hello';
});

// 2. Có dependency array — chỉ chạy lại khi deps thay đổi
useEffect(() => {
  fetchData(userId);
}, [userId]);

// 3. Empty array — chạy MỘT LẦN sau mount (tương tự componentDidMount)
useEffect(() => {
  fetchUser();
}, []);

// 4. Với cleanup function — chạy khi mount, cleanup khi unmount
useEffect(() => {
  const subscription = subscribe(id);
  return () => subscription.unsubscribe(); // cleanup function
}, [id]);
```

### 2.2. Các Side Effects Phổ Biến

```tsx
// Gọi API lấy dữ liệu
useEffect(() => {
  let cancelled = false;
  fetch(`/api/users/${userId}`)
    .then(res => res.json())
    .then(data => {
      if (!cancelled) setUser(data);
    });
  return () => { cancelled = true; };
}, [userId]);

// Thao tác DOM
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

// Subscriptions (WebSocket, etc.)
useEffect(() => {
  const ws = new WebSocket('wss://api.example.com');
  ws.onmessage = (event) => setMessages(prev => [...prev, event.data]);
  return () => ws.close();
}, []);
```

### 2.3. Cleanup Function

Cleanup function chạy trước khi component unmount và trước khi effect chạy lại. Nó cần thiết để:
- Hủy subscriptions
- Xóa timers (`setInterval`, `setTimeout`)
- Hủy fetch requests (AbortController)
- Xóa event listeners

```tsx
useEffect(() => {
  const timer = setTimeout(() => {
    setShowBanner(false);
  }, 5000);

  // Cleanup: xóa timer nếu component unmount hoặc user rời đi
  return () => clearTimeout(timer);
}, []);
```

### 2.4. Tránh Các Lỗi Thường Gặp

```tsx
// Vòng lặp vô hạn — effect cập nhật state trong dependency
useEffect(() => {
  setData(newData);  // Kích hoạt re-render, lại kích hoạt effect
}, [data]);

// Đã sửa — tách biệt concerns, dùng ref cho giá trị không phải state
const dataRef = useRef(data);
useEffect(() => {
  dataRef.current = data;
}, [data]);

// Dependency bị thiếu — stale closure
useEffect(() => {
  fetchData(userId); // userId từ scope ngoài có thể bị stale
}, []); // Thiếu userId!

// Đã sửa — đầy đủ dependencies
useEffect(() => {
  fetchData(userId);
}, [userId]);
```

### 2.5. Strict Mode Double-Invocation (React 18+)

Trong môi trường development, React Strict Mode cố tình chạy hai lần:
- Effects ở phase mount (effect + cleanup + effect)
- Hàm render của component

Điều này giúp phát hiện side effects không được cleanup đúng cách.

---

## 3. useRef

`useRef` trả về một ref object có thể thay đổi được với thuộc tính `.current`. Khác với state, **thay đổi ref không kích hoạt re-render**.

### 3.1. Truy Cập DOM

```tsx
const inputRef = useRef(null);

// Sau khi mount, inputRef.current trỏ đến DOM element
<input ref={inputRef} type="text" />

// Focus input
inputRef.current.focus();

// Đọc giá trị
const value = inputRef.current.value;

// Các phương thức imperative qua ref
const videoRef = useRef(null);
<video ref={videoRef} />
// videoRef.current.play();
// videoRef.current.pause();
```

### 3.2. Lưu Trữ Giá Trị Thay Đổi Được

```tsx
// Lưu trữ bất kỳ giá trị thay đổi nào mà không kích hoạt re-render
const timerRef = useRef(null);
const previousValueRef = useRef(initialValue);

// Cập nhật ref (không re-render)
timerRef.current = setInterval(() => tick(), 1000);

// Đọc giá trị trước đó qua các lần render
function Component({ value }) {
  const prevValueRef = useRef(null);

  useEffect(() => {
    prevValueRef.current = value; // Cập nhật sau render
  });

  return (
    <div>
      Hiện tại: {value} | Trước đó: {prevValueRef.current}
    </div>
  );
}
```

### 3.3. useRef vs useState

| Khía cạnh | useRef | useState |
|-----------|--------|----------|
| **Kích hoạt re-render** | Không | Có |
| **Lưu qua các lần render** | Có | Có |
| **Dùng cho** | Truy cập DOM, giá trị thay đổi được, timers | State ảnh hưởng đến UI |
| **Giá trị khi cập nhật** | `.current` thay đổi ngay lập tức | Được lên lịch, re-render theo sau |

### 3.4. Các Pattern Phổ Biến

```tsx
// Lưu giá trị prop/state trước đó
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

// Đếm số lần render
function useRenderCount() {
  const count = useRef(0);
  count.current++;
  return count.current;
}

// Interval timer với cleanup
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

`useContext` truy cập dữ liệu được chia sẻ thông qua Context API mà không cần truyền props qua nhiều cấp (prop drilling).

### 4.1. Tạo và Sử Dụng Context

```tsx
// Bước 1: Tạo context
const ThemeContext = createContext('light'); // giá trị mặc định

// Bước 2: Cung cấp context ở cấp cha
function App() {
  const [theme, setTheme] = useState('light');
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <MainLayout />
    </ThemeContext.Provider>
  );
}

// Bước 3: Sử dụng context ở component con bất kỳ
function Button() {
  const { theme, setTheme } = useContext(ThemeContext);
  return (
    <button className={`btn-${theme}`} onClick={() => setTheme('dark')}>
      Đổi Theme
    </button>
  );
}
```

### 4.2. Context với Reducer

```tsx
// State + dispatch trong context — pattern phổ biến
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

**Vấn đề**: Tất cả consumers đều re-render khi context value thay đổi.

```tsx
// Xấu — tạo object mới sau mỗi render
<ThemeContext.Provider value={{ theme, setTheme }}>

// Tốt hơn — chia context hoặc memoize
const themeValue = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);
<ThemeContext.Provider value={themeValue}>

// Tốt nhất — tách context cho các giá trị thay đổi thường xuyên
const ThemeContext = createContext({ theme: 'light' });
const DispatchContext = createContext(null);
```

---

## 5. Custom Hooks

Custom hooks cho phép trích xuất và tái sử dụng logic có state qua nhiều components. Chúng đơn giản là các JavaScript functions gọi các hooks khác.

### 5.1. useFetch

```tsx
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

// Cách sử dụng
const { data, loading, error } = useFetch('/api/users');
```

### 5.2. useLocalStorage

```tsx
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
      // Hỗ trợ functional update
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}

// Cách sử dụng
const [theme, setTheme] = useLocalStorage('theme', 'light');
```

### 5.3. useDebounce

```tsx
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

// Cách sử dụng — trì hoãn search để tránh gọi API quá nhiều
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

```tsx
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);
  const toggle = useCallback(() => setValue(v => !v), []);
  return [value, toggle];
}

// Cách sử dụng
const [isDarkMode, toggleDarkMode] = useToggle(false);
```

### 5.5. useOnClickOutside

```tsx
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

// Cách sử dụng — đóng dropdown khi click ra ngoài
function Dropdown() {
  const ref = useRef();
  const [isOpen, setIsOpen] = useState(false);
  useOnClickOutside(ref, () => setIsOpen(false));
  return <div ref={ref}>{isOpen && <Menu />}</div>;
}
```

---

## 6. useReducer

`useReducer` quản lý **logic state phức tạp** với nhiều state transitions liên quan. Ưu tiên `useReducer` thay vì `useState` khi state transitions phức tạp hoặc nhiều giá trị state phụ thuộc lẫn nhau.

### 6.1. Pattern Cơ Bản

```tsx
const [state, dispatch] = useReducer(reducer, initialState);
// reducer: (state, action) => newState
// dispatch: gửi một action object để kích hoạt cập nhật state
```

### 6.2. Reducer Pattern

```tsx
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

// Gửi actions
dispatch({ type: 'INCREMENT' });
dispatch({ type: 'SET_USER', payload: { name: 'Alice' } });
dispatch({ type: 'RESET' });
```

### 6.3. Ví Dụ State Phức Tạp

```tsx
// Giỏ hàng với thêm, xóa, cập nhật số lượng
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
  dispatch({ type: 'ADD_ITEM', payload: { id: 1, name: 'Sách', price: 29 } });
}
```

### 6.4. useReducer vs useState

| Tình huống | Khuyến nghị |
|------------|-------------|
| Toggle đơn giản, counter | `useState` |
| Form với nhiều trường | `useState` |
| Form wizard nhiều bước | `useReducer` |
| State phức tạp với giá trị phụ thuộc nhau | `useReducer` |
| Nhiều state transitions (CRUD) | `useReducer` |
| State chia sẻ giữa các components | `useReducer` + Context |

---

## 7. Các Hook Bổ Sung

### 7.1. useMemo

`useMemo` cache giá trị tính toán, tránh tính lại khi các dependencies không thay đổi.

```tsx
const memoizedValue = useMemo(() => {
  return computeExpensiveValue(a, b);
}, [a, b]);
```

### 7.2. useCallback

`useCallback` cache function reference, tránh tạo lại function khi các dependencies không thay đổi.

```tsx
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
```

### 7.3. useLayoutEffect

Giống `useEffect`, nhưng **đồng bộ** chạy sau DOM mutations và trước paint. Dùng khi cần đo hoặc sửa DOM trước khi browser paint.

```tsx
useLayoutEffect(() => {
  // Chạy đồng bộ sau DOM mutations
  // Ưu tiên useEffect cho hầu hết trường hợp
  // Dùng cho: đo elements, scroll position, animations
}, [dependencies]);
```

### 7.4. useImperativeHandle

Tùy chỉnh giá trị được expose bởi component khi sử dụng `ref`.

```tsx
function FancyInput(props, ref) {
  const inputRef = useRef();
  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current.focus(),
    scrollIntoView: () => inputRef.current.scrollIntoView(),
  }));
  return <input ref={inputRef} />;
}
const FancyInput = forwardRef(FancyInput);
```

### 7.5. useDebugValue

Thêm nhãn cho custom hook trong React DevTools để debug dễ hơn.

```tsx
function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  useDebugValue(isOnline ? 'Online' : 'Offline');
  return isOnline;
}
```

---

## 8. Các Quy Tắc của Hooks

Hooks có hai quy tắc nghiêm ngặt mà React thực thi ở runtime.

### 8.1. Chỉ Gọi Hooks ở Top Level

Không gọi hooks trong loops, conditions, hoặc nested functions. Hooks dựa vào thứ tự gọi để duy trì state đúng.

```tsx
// Xấu — gọi hook có điều kiện
if (isLoggedIn) {
  useUserData(); // Sẽ lỗi nếu condition thay đổi — thứ tự gọi hooks bị thay đổi!
}

// Tốt — luôn gọi hooks ở top level
function Component({ isLoggedIn }) {
  const [userData, userLoading] = useUserData(); // Luôn được gọi
  const [guestData, guestLoading] = useGuestData();

  if (!isLoggedIn && guestData) {
    // Logic có điều kiện bên trong hook là OK
  }
}
```

### 8.2. Chỉ Gọi Hooks từ React Functions

Gọi hooks từ:
- Function components (functions bắt đầu bằng chữ hoa)
- Custom hooks (functions bắt đầu bằng "use")

```tsx
// Xấu — function JavaScript thông thường
function handleClick() {
  useState(0); // Không được phép!
}

// Tốt — gọi từ component hoặc custom hook
function MyComponent() {
  const [count, setCount] = useState(0);
  // ...
}

function useCounter() {
  const [count, setCount] = useState(0);
  return { count, increment: () => setCount(c => c + 1) };
}
```

### 8.3. ESLint Plugin

Plugin `eslint-plugin-react-hooks` tự động thực thi các quy tắc này.

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

### 8.4. Cảnh Báo exhaustive-deps

Quy tắc `exhaustive-deps` đảm bảo effect dependencies được khai báo đầy đủ.

```tsx
// Cảnh báo — thiếu 'name' trong dependencies
useEffect(() => {
  document.title = `${name}`;
}, []); // Thiếu 'name'!

// Đã sửa
useEffect(() => {
  document.title = `${name}`;
}, [name]);
```

---

## 9. Các Hook Khác

### 9.1. useId

Tạo unique IDs bền vững giữa server và client, an toàn cho SSR.

```tsx
const id = useId();
// Dùng cho: accessibility labels, form inputs, ARIA attributes
```

### 9.2. useTransition

Đánh dấu state update là non-urgent, cho phép UI tiếp tục phản hồi trong khi chờ.

```tsx
const [isPending, startTransition] = useTransition();

startTransition(() => {
  setTab(tab); // Cập nhật này không blocking
});
```

### 9.3. useDeferredValue

Trì hoãn cập nhật một giá trị không quan trọng bằng cách tạo phiên bản deferred.

```tsx
const deferredQuery = useDeferredValue(query);
// Dùng cho: filtering/lọc danh sách lớn, trì hoãn rendering
```

### 9.4. useInsertionEffect

Chạy trước khi DOM được thay đổi và khi refs được cập nhật. Dùng cho CSS-in-JS libraries.

```tsx
useInsertionEffect(() => {
  // Chèn styles vào <head> — chạy trước khi DOM thay đổi
}, []);
```

---

## 10. Câu Hỏi Phỏng Vấn

### N.1. Khi nào useEffect với dependency array rỗng khác với componentDidMount?

> `useEffect` với `[]` chạy bất đồng bộ sau khi render được commit vào DOM, còn `componentDidMount` chạy đồng bộ sau render ban đầu. Điều này có nghĩa `useEffect` không block browser paint, tốt hơn cho performance. Ngoài ra, `useEffect` với `[]` có thể chạy hai lần trong Strict Mode (React 18+), còn `componentDidMount` chỉ chạy một lần.

### N.2. Làm thế nào để cleanup side effect trong useEffect?

> Trả về một cleanup function từ `useEffect`. Function này chạy trước khi component unmount và trước khi effect chạy lại khi dependency thay đổi. Các cleanup phổ biến bao gồm: xóa timers (`clearInterval`, `clearTimeout`), đóng WebSocket connections, xóa event listeners, và hủy fetch requests dùng AbortController.

### N.3. Sự khác biệt giữa useState và useReducer là gì?

> `useState` đơn giản hơn và phù hợp với các giá trị state độc lập có cập nhật đơn giản. `useReducer` tốt hơn cho logic state phức tạp khi nhiều giá trị state liên quan, hoặc khi state transitions theo một pattern rõ ràng (reducer function). `useReducer` cũng làm state changes dễ dự đoán hơn bằng cách tập trung logic trong một pure reducer function, và làm testing dễ hơn vì reducers là pure functions.

### N.4. Tại sao hooks không nên được gọi có điều kiện?

> Hooks phụ thuộc vào thứ tự gọi để liên kết state với mỗi hook instance. Nếu hook được gọi có điều kiện, thứ tự gọi sẽ thay đổi giữa các lần render, khiến React liên kết sai state và references. Điều này dẫn đến bugs khi state từ một hook xuất hiện ở slot của một hook khác.

### N.5. useRef khác useState ở chỗ nào khi lưu trữ giá trị?

> Thay đổi giá trị `useRef` không kích hoạt re-render — component giữ nguyên render hiện tại. Điều này hữu ích để lưu trữ DOM element references, timer IDs, hoặc các giá trị thay đổi được không cần drive UI updates. `useState` kích hoạt re-render khi giá trị thay đổi, phù hợp cho các giá trị ảnh hưởng đến UI.

### N.6. Stale closure trong useEffect là gì, và cách sửa như thế nào?

> Stale closure xảy ra khi một effect capture các giá trị đã cũ từ render trước đó vì dependency bị thiếu trong dependency array. Ví dụ, nếu một effect sử dụng một biến từ outer scope mà không khai báo nó là dependency, nó sẽ luôn thấy giá trị ban đầu. Cách sửa: (1) thêm tất cả các giá trị được sử dụng vào dependency array, (2) dùng functional updates cho state phụ thuộc state trước đó, hoặc (3) dùng refs để lưu trữ các giá trị thay đổi được không nên kích hoạt re-renders.

### N.7. Sự khác biệt giữa useMemo và useCallback là gì?

> `useMemo` memoize giá trị tính toán (computed value), trả về kết quả của một hàm tính toán tốn kém và chỉ tính lại khi dependencies thay đổi. `useCallback` memoize function reference, trả về một hàm ổn định và chỉ tạo lại khi dependencies thay đổi. `useCallback(fn, deps)` tương đương `useMemo(() => fn, deps)`. Cả hai đều giúp tránh re-computation hoặc re-creation không cần thiết, nhưng `useMemo` dùng cho giá trị, `useCallback` dùng cho functions.

### N.8. Khi nào nên dùng useLayoutEffect thay vì useEffect?

> Dùng `useLayoutEffect` khi cần thao tác DOM đồng bộ sau khi DOM thay đổi nhưng trước khi browser paint. Trường hợp phổ biến: đo dimensions của một element sau khi render để set style, hoặc di chuyển scroll position. Trong hầu hết các trường hợp khác, ưu tiên `useEffect` vì nó không blocking paint và cho trải nghiệm tốt hơn. Nếu thấy warning trong console về SSR, có thể cần dùng `useEffect` thay thế.

### N.9. Custom hooks có thể return bất cứ thứ gì không?

> Có, custom hooks có thể return bất cứ giá trị nào giống như một function thông thường: giá trị đơn, array, object, function, hoặc thậm chí JSX. Pattern phổ biến là return một object để đặt tên cho các giá trị trả về (như `{ data, loading, error }`), hoặc return một array để destructure ngắn gọn (như `[value, setValue]`). Cách nào cũng được, miễn là nhất quán và dễ sử dụng.
