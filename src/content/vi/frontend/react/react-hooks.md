# React Hooks

## Tổng quan

Hooks cho phép sử dụng state và các tính năng React khác trong function components.

## useState

```tsx
const [state, setState] = useState(initialValue);

// Object state
const [form, setForm] = useState({ name: "", email: "" });

// Functional update (khi new state phu thuoc state cu)
setCount(prev => prev + 1);

// Lazy initialization
const [data, setData] = useState(() => {
  const saved = localStorage.getItem("data");
  return saved ? JSON.parse(saved) : initialData;
});
```

## useEffect

```tsx
useEffect(() => {
  // Side effect code
  document.title = `Count: ${count}`;

  return () => {
    // Cleanup code (chay truoc khi component unmount hoac truoc khi effect chay lai)
    document.title = "React App";
  };
}, [count]); // Dependency array
```

### Các trường hợp

```tsx
// Chay sau moi render
useEffect(() => {});

// Chay mot lan sau mount
useEffect(() => {}, []);

// Cleanup function
useEffect(() => {
  const subscription = subscribe(id);
  return () => subscription.unsubscribe();
}, [id]);
```

## useRef

```tsx
// DOM reference
const inputRef = useRef<HTMLInputElement>(null);

useEffect(() => {
  inputRef.current?.focus();
}, []);

<input ref={inputRef} />

// Mutable value khong gay re-render
const timerRef = useRef<number>();
timerRef.current = setInterval(() => {}, 1000);
```

## useContext

```tsx
const ThemeContext = createContext<{ theme: string }>({ theme: "light" });

// Provider
<ThemeContext.Provider value={{ theme: "dark" }}>
  <App />
</ThemeContext.Provider>

// Consumer
const { theme } = useContext(ThemeContext);
```

## Custom Hooks

```tsx
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// Usage
const debouncedSearch = useDebounce(searchTerm, 300);
```

## useReducer

```tsx
const initialState = { count: 0 };

type Action = { type: "increment" } | { type: "decrement"; payload: number };

function reducer(state: typeof initialState, action: Action) {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };
    case "decrement":
      return { count: state.count - action.payload };
    default:
      return state;
  }
}

const [state, dispatch] = useReducer(reducer, initialState);
dispatch({ type: "increment" });
dispatch({ type: "decrement", payload: 5 });
```

## Rules of Hooks

1. Chi goi hooks o top level - khong goi trong loops, conditions, nested functions
2. Chi goi hooks tu React functions - function components hoac custom hooks

```tsx
// Sai
if (isLoggedIn) {
  useUserData(); // Khong goi trong condition!
}

// Dung
useUserData(); // Luon goi o top level
```

## Cau hoi phong van

### 1. useEffect cleanup function chạy khi nào?

Cleanup function chạy:
- Truoc khi component unmount
- Truoc khi effect chay lai (sau render moi)

```tsx
useEffect(() => {
  const id = setInterval(() => {}, 1000);
  return () => clearInterval(id); // Cleanup
}, []);
```

### 2. Dependency array [] vs có deps vs không có?

- `[]`: effect chạy sau mount, cleanup chạy trước unmount
- `[dep]`: effect chạy sau mount và khi `dep` thay đổi
- Không có: effect chạy sau MỌI render
- THƯỜNG GÂY INFINITE LOOP nếu tạo objects/functions làm deps

### 3. useMemo vs useCallback khác nhau?

`useMemo` memoize giá trị tính toán, `useCallback` memoize function reference. Cả hai đều tránh re-computation/re-creation không cần thiết.

### 4. Custom hook là gì?

Custom hook là function bắt đầu bằng "use", có thể gọi các hooks khác. Dùng để extract logic tái sử dụng giữa components.
