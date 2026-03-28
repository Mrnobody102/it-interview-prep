# Khái niệm cốt lõi về React

## JSX (JavaScript XML)

JSX là một cú pháp mở rộng cho phép bạn viết code giống HTML trực tiếp trong JavaScript. Nó được transpile thành các lời gọi `React.createElement()`.

### Quy tắc cú pháp JSX

- **Một phần tử gốc duy nhất**: Mọi biểu thức JSX phải có một phần tử cha duy nhất. Sử dụng fragment `<>...</>` khi bạn không muốn thêm một DOM node thừa.

```jsx
// Sai — nhiều gốc, không hợp lệ
// return (<div></div><div></div>);

// Đúng — dùng Fragment
return (
  <>
    <Header />
    <Main />
    <Footer />
  </>
);
```

- **Self-closing tags** phải kết thúc bằng `/>`:

```jsx
return <img src="logo.png" alt="Logo" />;
return <input type="text" value={name} />;
```

- **Dùng `className` thay vì `class`**: Vì `class` là từ khóa dành riêng trong JavaScript.

```jsx
return <div className="container">Nội dung</div>;
```

- **CamelCase cho attributes**: React sử dụng camelCase cho tất cả tên attribute.

```tsx
return (
  <div
    onClick={handleClick}
    tabIndex={0}
    aria-label="Đóng"
    strokeWidth={2}
  >
    Nội dung
  </div>
);
```

- **Biểu thức trong JSX**: Sử dụng dấu ngoặc nhọn `{}` để nhúng biểu thức JavaScript.

```jsx
const name = 'Alice';
const greeting = <h1>Xin chào, {name}!</h1>;

const user = { firstName: 'Bob', lastName: 'Smith' };
const fullName = <span>{user.firstName} {user.lastName}</span>;

const items = ['Táo', 'Chuối', 'Cam'];
const list = (
  <ul>
    {items.map(item => (
      <li key={item}>{item}</li>
    ))}
  </ul>
);
```

### JSX không phải là String

JSX là syntactic sugar cho `React.createElement()`. Code sau khi được transpile:

```jsx
// JSX
return <div className="greeting">Xin chào, {name}!</div>;

// Transpiled (Babel)
return React.createElement('div', { className: 'greeting' }, 'Xin chào, ', name, '!');
```

### Render có điều kiện

```jsx
// Toán tử ternary
return isLoggedIn ? <Dashboard /> : <Login />;

// Logical AND — chỉ render nếu điều kiện đúng
return showBanner && <Banner message="Chào mừng!" />;

// Early return — thoát sớm khỏi component
function UserProfile({ user }) {
  if (!user) return <div>Vui lòng đăng nhập.</div>;
  return <div>{user.name}</div>;
}
```

---

## Virtual DOM

**Virtual DOM** là một bản sao nhẹ của DOM thực, được React quản lý trong bộ nhớ.

### Cách thức hoạt động

1. **Diffing**: Khi state thay đổi, React tạo một Virtual DOM mới và so sánh nó với phiên bản trước đó (thuật toán reconciliation).
2. **Reconciliation**: React xác định tập hợp tối thiểu các thay đổi cần thiết bằng thuật toán diffing.
3. **Cập nhật chọn lọc**: Chỉ các phần tử đã thay đổi mới được cập nhật trên DOM thực.

### Thuật toán Reconciliation

React's reconciliation sử dụng các nguyên tắc chính sau:

- Hai phần tử có **type** khác nhau sẽ tạo ra hai cây khác nhau.
- Các phần tử có cùng **type** được so sánh qua các thuộc tính của chúng.
- **Keys** giúp React xác định phần tử con nào đã thay đổi qua các lần re-render.

```jsx
// Luôn cung cấp key ổn định cho các phần tử trong danh sách
// Tốt — unique và stable
items.map(item => <li key={item.id}>{item.name}</li>);

// Xấu — index thay đổi khi các phần tử được sắp xếp lại
items.map((item, index) => <li key={index}>{item.name}</li>);
```

### Fiber Architecture (React 16+)

React Fiber đã tái cấu trúc quá trình reconciliation thành hai giai đoạn:

- **Render phase** (có thể ngắt giữa chừng): Diffing và gọi các hàm render. Có thể tạm dừng, hủy bỏ hoặc khởi động lại.
- **Commit phase** (không thể ngắt giữa chừng): Áp dụng các thay đổi lên DOM thực.

### Tại sao không thao tác DOM trực tiếp?

| Phương pháp | Ưu điểm | Nhược điểm |
|-------------|---------|------------|
| **Virtual DOM** | Declarative — mô tả UI, React xử lý cập nhật. Dễ viết hơn, hoạt động nhất quán cross-browser. | Tốn bộ nhớ, không phải lúc nào cũng nhanh hơn với những thay đổi đơn giản. |
| **DOM trực tiếp** | Hiệu suất tối đa cho các cập nhật đơn giản. | Imperative — quản lý DOM thủ công, dễ gây lỗi. |

> **Lưu ý**: Virtual DOM không phải lúc nào cũng nhanh hơn thao tác DOM trực tiếp. Điểm mạnh của nó là cho phép lập trình viên viết code theo cách **declarative** — bạn mô tả UI nên trông như thế nào, và React xử lý các cập nhật.

---

## Components

### Function Component

Function component là các function JavaScript nhận props và trả về JSX. Từ React 16.8+, chúng có thể sử dụng hooks và đã trở thành tiêu chuẩn.

```jsx
// Function component cơ bản
function Greeting({ name, age }) {
  return (
    <div>
      <h1>Xin chào, {name}!</h1>
      {age >= 18 && <p>Bạn là người trưởng thành.</p>}
    </div>
  );
}

// Arrow function component
const UserCard = ({ username, avatar }) => (
  <div className="card">
    <img src={avatar} alt={username} />
    <span>{username}</span>
  </div>
);
```

### Class Component

Class component sử dụng ES6 class và kế thừa `React.Component`. Chúng ít phổ biến trong React hiện đại nhưng vẫn được sử dụng trong các codebase cũ.

```jsx
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
    // Bind methods nếu dùng 'this' trong callbacks
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState({ count: this.state.count + 1 });
  }

  render() {
    return (
      <div>
        <p>Số lần: {this.state.count}</p>
        <button onClick={this.handleClick}>Tăng</button>
      </div>
    );
  }
}
```

### Function Component vs Class Component

| Tính năng | Function Component | Class Component |
|-----------|---------------------|------------------|
| **Cú pháp** | Function JavaScript thông thường | ES6 class kế thừa React.Component |
| **State** | Hook `useState` | `this.state` + `this.setState` |
| **Lifecycle** | Hook `useEffect` | Các method lifecycle (`componentDidMount`, v.v.) |
| **Từ khóa this** | Không có vấn đề binding | Cần `.bind(this)` hoặc arrow functions |
| **Kích thước code** | Gọn gàng | Nhiều boilerplate |
| **Best practice hiện đại** | Có | Legacy |

### Component Composition

```jsx
// Tái sử dụng thông qua composition
function Card({ title, children }) {
  return (
    <div className="card">
      <h2>{title}</h2>
      <div className="card-body">{children}</div>
    </div>
  );
}

// Sử dụng
<Card title="Hồ sơ">
  <UserInfo name="Alice" />
  <UserStats posts={42} />
</Card>
```

### Các Component đặc biệt

```jsx
// Portal — render children vào một DOM node khác
import { createPortal } from 'react-dom';

function Modal({ children }) {
  return createPortal(
    <div className="modal">{children}</div>,
    document.getElementById('modal-root')
  );
}

// Fragment — nhóm các phần tử mà không tạo DOM node thừa
function TableRow() {
  return (
    <>
      <td>Tên</td>
      <td>Tuổi</td>
    </>
  );
}
```

---

## Props và TypeScript

Props (viết tắt của "properties") là cơ chế truyền dữ liệu từ component cha xuống component con. Chúng là **read-only**.

### Props cơ bản

```jsx
// Component cha
<UserCard name="Alice" age={30} isActive={true} />

// Component con — nhận qua tham số function
function UserCard({ name, age, isActive }) {
  return (
    <div className={isActive ? 'active' : 'inactive'}>
      {name}, {age} tuổi
    </div>
  );
}
```

### Default Props

```jsx
function Button({ label, variant = 'primary', size = 'medium' }) {
  return <button className={`btn btn-${variant} btn-${size}`}>{label}</button>;
}

// Hoặc dùng defaultProps (legacy)
Button.defaultProps = {
  variant: 'primary',
  size: 'medium',
};
```

### Props với TypeScript

```tsx
// Định nghĩa kiểu props bằng interface
interface UserCardProps {
  name: string;
  age: number;
  email?: string;           // prop tùy chọn
  isActive: boolean;
  onClick?: () => void;      // prop là function
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

// Function component với TypeScript
function UserCard({ name, age, email, isActive, onClick, children }: UserCardProps) {
  return (
    <div className={isActive ? 'active' : 'inactive'} onClick={onClick}>
      <h2>{name}</h2>
      <p>Tuổi: {age}</p>
      {email && <p>Email: {email}</p>}
      {children}
    </div>
  );
}

// Generic props
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

function List<T>({ items, renderItem }: ListProps<T>) {
  return <ul>{items.map(renderItem)}</ul>;
}

// Sử dụng
<List items={users} renderItem={user => <li key={user.id}>{user.name}</li>} />
```

### Children Props

```tsx
// Wrapper children
function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <div className="card-content">{children}</div>
    </div>
  );
}

// Render props pattern
function MouseTracker({ render }: { render: (pos: { x: number; y: number }) => React.ReactNode }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  return <div onMouseMove={e => setPos({ x: e.clientX, y: e.clientY })}>{render(pos)}</div>;
}
```

### PropTypes (Xác thực runtime)

```tsx
import PropTypes from 'prop-types';

function UserCard({ name, age }) {
  return <div>{name} - {age}</div>;
}

UserCard.propTypes = {
  name: PropTypes.string.isRequired,
  age: PropTypes.number,
};
```

---

## Rendering Optimization

### React.memo

`React.memo` là một higher-order component memoize một component, ngăn re-render khi props không thay đổi.

```tsx
const Button = React.memo(function Button({ onClick, label }) {
  console.log('Button rendered');
  return <button onClick={onClick}>{label}</button>;
});

// Tương đương với arrow function
const Card = React.memo(({ title, content }) => (
  <div className="card">
    <h3>{title}</h3>
    <p>{content}</p>
  </div>
));
```

> **Quan trọng**: `React.memo` thực hiện **so sánh shallow** trên props. Nếu props là object, array, hoặc function mới ở mỗi lần render, memoization sẽ không hiệu quả.

```tsx
// Vấn đề: object mới mỗi lần render — memoization không hiệu quả
function Parent() {
  return <Child style={{ color: 'red' }} />;  // Object mới mỗi lần render
}

// Giải pháp: memoize object hoặc truyền giá trị nguyên thủy
function Parent() {
  const style = React.useMemo(() => ({ color: 'red' }), []);
  return <Child style={style} />;
}
```

### Custom Comparison Function

```tsx
// Cung cấp hàm so sánh tùy chỉnh cho deep equality
const UserList = React.memo(
  ({ users, sortOrder }) => (
    <ul>
      {users.map(u => <li key={u.id}>{u.name}</li>)}
    </ul>
  ),
  (prevProps, nextProps) => {
    // Trả về true nếu props bằng nhau (bỏ qua re-render)
    return prevProps.users.length === nextProps.users.length &&
      prevProps.sortOrder === nextProps.sortOrder;
  }
);
```

### useMemo

Memoize **giá trị tính toán** để tránh tính lại tốn kém khi re-render.

```tsx
const expensiveValue = useMemo(
  () => computeExpensiveValue(a, b),
  [a, b]
);
// Chỉ tính lại khi a hoặc b thay đổi
```

**Khi nào dùng useMemo**:
- Tính toán tốn kém (sắp xếp, lọc mảng lớn, toán học phức tạp)
- Tạo object/array mới truyền làm props cho memoized children
- Reference ổn định cho useEffect dependencies

### useCallback

Memoize **function** để tránh tạo reference mới khi re-render. Rất quan trọng khi truyền callbacks cho child components được bọc trong `React.memo`.

```tsx
const handleClick = useCallback(
  () => { doSomething(id); },
  [id]
);
// Trả về cùng function reference trừ khi 'id' thay đổi
```

```tsx
// Ví dụ thực tế: memoized handler với useCallback
function ProductList({ products }) {
  const [selectedId, setSelectedId] = useState(null);

  const handleSelect = useCallback((id) => {
    setSelectedId(id);
    analytics.track('product_selected', { id });
  }, []);  // Empty deps — function không bao giờ thay đổi

  return (
    <div>
      {products.map(p => (
        <ProductItem
          key={p.id}
          product={p}
          isSelected={p.id === selectedId}
          onSelect={handleSelect}  // Reference ổn định
        />
      ))}
    </div>
  );
}

const ProductItem = React.memo(({ product, isSelected, onSelect }) => (
  <div className={isSelected ? 'selected' : ''} onClick={() => onSelect(product.id)}>
    {product.name}
  </div>
));
```

### Khi nào dùng từng kỹ thuật tối ưu

| Kỹ thuật | Mục đích | Khi nào dùng |
|----------|----------|--------------|
| `React.memo` | Bỏ qua re-rendering component | Pure component với props giống nhau |
| `useMemo` | Cache giá trị tính toán | Tính toán tốn kém hoặc reference object ổn định |
| `useCallback` | Cache function reference | Callback truyền cho memoized child, hoặc trong useEffect dependency |

> **Nguyên tắc**: Đừng tối ưu hóa sớm. Chỉ thêm memoization khi profiling cho thấy có vấn đề về hiệu suất.

### Virtualization cho danh sách lớn

Chỉ render các items hiển thị trên màn hình cho các danh sách rất lớn.

```tsx
import { FixedSizeList } from 'react-window';

// 10,000 items nhưng chỉ render ~20-30 items hiển thị cùng lúc
function VirtualList({ items }) {
  return (
    <FixedSizeList height={400} itemCount={items.length} itemSize={50}>
      {({ index, style }) => (
        <div style={style}>{items[index].name}</div>
      )}
    </FixedSizeList>
  );
}
```

### Debouncing & Throttling

Giới hạn số lần gọi function trong các sự kiện xảy ra liên tục.

```tsx
// Debounce — đợi người dùng ngừng gõ trước khi tìm kiếm
import { useDebounce } from './hooks/useDebounce';
const debouncedSearch = useDebounce(searchTerm, 300);

// Throttle — giới hạn số lần gọi scroll handler
import { useThrottle } from './hooks/useThrottle';
const throttledScroll = useThrottle(handleScroll, 100);
```

---

## Cập nhật State bất biến (Quy tắc quan trọng)

> **Quy tắc**: Không bao giờ mutate state trực tiếp. Luôn tạo **bản sao mới** với các thay đổi đã áp dụng.

React sử dụng **reference equality** (`===`) để phát hiện state thay đổi. Mutate trực tiếp không thay đổi reference, nên React sẽ không re-render.

### Cập nhật Array

```tsx
// Sai — mutate trực tiếp
items.push(newItem);
setItems(items);

// Đúng — reference array mới
setItems([...items, newItem]);

// Đúng — filter không mutate
setItems(items.filter(i => i.id !== action.payload));

// Đúng — map không mutate
setItems(items.map(i => i.id === id ? { ...i, ...updates } : i));

// Đúng — remove item
setItems(items.filter(item => item.id !== itemId));

// Đúng — insert tại vị trí cụ thể
setItems([...items.slice(0, index), newItem, ...items.slice(index)]);
```

### Cập nhật Object

```tsx
// Sai — mutate trực tiếp
user.name = 'Tên mới';
setUser(user);

// Đúng — shallow copy với thay đổi
setUser({ ...user, name: 'Tên mới' });

// Đúng — nested immutability
setCart({
  ...cart,
  items: [...cart.items, newItem],
  total: cart.total + newItem.price,
});
```

### Deep Immutability

```tsx
// Cập nhật property lồng sâu
const newState = {
  ...state,
  user: {
    ...state.user,
    profile: {
      ...state.user.profile,
      settings: {
        ...state.user.profile.settings,
        theme: 'dark',
      },
    },
  },
};
```

---

## Câu hỏi phỏng vấn

### 1. Virtual DOM là gì? Tại sao React sử dụng nó?

Virtual DOM là một bản sao nhẹ của DOM thực, được React quản lý trong bộ nhớ. Khi state thay đổi, React tạo một cây Virtual DOM mới, so sánh (diff) nó với phiên bản trước, và chỉ áp dụng các thay đổi tối thiểu lên DOM thực. Điều này nhanh hơn việc re-render toàn bộ DOM vì thao tác DOM trực tiếp tốn kém và các browser API là đồng bộ. Virtual DOM cho phép mô hình lập trình declarative, nơi bạn mô tả UI nên trông như thế nào và React xử lý các cập nhật.

### 2. JSX được transpile như thế nào?

JSX là syntactic sugar cho các lời gọi hàm `React.createElement()`. Các công cụ như Babel hoặc TypeScript transpile JSX thành các function call này tại thời điểm build. Ví dụ: `<div className="greeting">Xin chào</div>` trở thành `React.createElement('div', { className: 'greeting' }, 'Xin chào')`.

### 3. React.memo và useMemo khác nhau như thế nào?

`React.memo` là một **higher-order component** memoize toàn bộ component — nó ngăn component re-render khi props không thay đổi. `useMemo` là một **hook** memoize một **giá trị tính toán** bên trong thân component. Chúng phục vụ mục đích khác nhau: một bọc component, cái kia cache giá trị.

### 4. Tại sao không nên mutate state trực tiếp?

React xác định có nên re-render hay không bằng cách so sánh reference cũ và mới của state sử dụng `===` (so sánh reference). Nếu bạn mutate state trực tiếp (ví dụ: `state.count++`), reference không thay đổi, nên React sẽ không phát hiện update và không re-render. Luôn tạo reference object/array mới để trigger re-render. Ngoài ra, immutable updates cho phép các tính năng như time-travel debugging (Redux DevTools) và các tối ưu hóa phát hiện thay đổi.

### 5. Controlled component và uncontrolled component khác nhau thế nào?

**Controlled component** có giá trị được quản lý bởi React state thông qua handlers `onChange`. Mỗi lần input thay đổi, state được cập nhật, và UI phản ánh giá trị state. **Uncontrolled component** quản lý internal state của chính nó (thường dùng ref), và bạn chỉ đọc giá trị khi form được submit. Controlled components là best practice của React cho xử lý form vì chúng cho phép validation, render có điều kiện, và hành vi động.

### 6. Reconciliation trong React là gì?

Reconciliation là quá trình React sử dụng để cập nhật DOM thực một cách hiệu quả. Sau khi state thay đổi, React tạo một cây Virtual DOM mới và so sánh (diff) nó với cây trước đó. Dựa trên so sánh, React tính toán số lượng update tối thiểu cần thiết và áp dụng chúng lên DOM thực trong commit phase. React Fiber (React 16+) cải thiện hơn nữa bằng cách làm cho render phase có thể bị ngắt giữa chừng, cho phép React ưu tiên các update khẩn cấp.

### 7. Mục đích của prop `key` trong danh sách là gì?

Prop `key` giúp React xác định phần tử nào đã thay đổi, được thêm, hoặc bị xóa qua các lần re-render. React sử dụng keys để match các children trong cây cũ với các children trong cây mới. Keys ổn định (như database IDs) cho phép reconciliation hiệu quả. Việc sử dụng index của mảng làm key là vấn đề vì chúng thay đổi khi các phần tử được sắp xếp lại hoặc xóa, gây re-render không cần thiết và có thể gây lỗi với các component có state.
