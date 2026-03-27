# React Core Concepts

## Tổng quan

React là thư viện JavaScript để xây dựng giao diện người dùng (UI) theo cách declarative và component-based.

## JSX

JSX là cú pháp mở rộng của JavaScript, cho phép viết HTML-like code trong JavaScript.

```jsx
// JSX
const element = <h1 className="title">Hello, World!</h1>;

// JSX được compile thành React.createElement
const element = React.createElement("h1", { className: "title" }, "Hello, World!");
```

### Quy tắc quan trọng

- Luôn có một root element (dùng `<>` hoặc `<div>`)
- Dùng `className` thay vì `class`
- Biểu thức JavaScript trong JSX dùng `{}`
- Self-closing tags phải có `/`

```jsx
// Đúng
const element = <img src={url} />;

// Sai
const element = <img src={url}>;
```

### Conditional Rendering

```jsx
// Ternary operator
{isLoggedIn ? <UserGreeting /> : <GuestGreeting />}

// Logical AND
{showMessage && <Message text="Hello" />}

// If-else (phải trả về null hoặc element)
{isLoading ? <Spinner /> : null}
```

### Rendering Lists

```jsx
const users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 3, name: "Charlie" }
];

function UserList() {
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

## Virtual DOM

Virtual DOM là bản sao của DOM thật, được React quản lý trong bộ nhớ.

### Cơ chế hoạt động

1. **State thay đổi** -> React tạo Virtual DOM mới
2. **So sánh (Reconciliation/Diffing)** -> React so sánh Virtual DOM mới với DOM thật
3. **Cập nhật DOM thật** -> Chỉ cập nhật những phần thực sự khác nhau

### Reconciliation Algorithm

React dùng **diffing algorithm** để so sánh:
- Hai DOM có cùng type -> cập nhật attributes
- Hai DOM có type khác -> thay thế hoàn toàn
- List items -> dùng `key` để match đúng items

```jsx
// KHONG dung index lam key khi list co the thay doi
users.map((user, index) => <li key={index}>)

// Dung - dung unique ID
users.map(user => <li key={user.id}>)
```

## Components

### Function Component vs Class Component

```jsx
// Function Component (hien dai)
function Welcome({ name }) {
  return <h1>Hello, {name}!</h1>;
}

// Class Component (legacy)
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

### Props

Props là cách truyền dữ liệu từ component cha xuống con (read-only).

```jsx
// Component con
function UserCard({ name, age, isActive }) {
  return (
    <div>
      <h2>{name}</h2>
      <p>Age: {age}</p>
      {isActive ? <span>Online</span> : <span>Offline</span>}
    </div>
  );
}

// Component cha
<UserCard name="Alice" age={25} isActive={true} />
```

### Props Types với TypeScript

```tsx
interface UserCardProps {
  name: string;
  age: number;
  isActive?: boolean; // optional
  onClick?: () => void;
  children?: React.ReactNode;
}

function UserCard({ name, age, isActive = false, onClick }: UserCardProps) {
  return (
    <div onClick={onClick}>
      <h2>{name}</h2>
      <p>{age} years old</p>
      {isActive && <span>Online</span>}
    </div>
  );
}
```

## Rendering Optimization

### React.memo

```tsx
const MemoizedComponent = React.memo(function MyComponent({ data }) {
  return <div>{data}</div>;
});

// Chi re-render khi props thay doi
```

### useMemo

```tsx
const sortedList = useMemo(() => {
  return expensiveSort(items);
}, [items]); // Chi tinh lai khi items thay doi
```

### useCallback

```tsx
const handleClick = useCallback(() => {
  console.log("Clicked");
}, []); // Cung reference neu dependencies khong doi

<Button onClick={handleClick} />
```

## Cau hoi phong van

### 1. Virtual DOM là gì? Tại sao React dùng nó?

Virtual DOM là bản sao nhẹ của DOM thực. Khi state thay đổi, React tạo Virtual DOM mới, so sánh (diff) với phiên bản cũ, rồi chỉ cập nhật DOM thật những phần cần thay đổi. Điều này tránh expensive DOM operations và cho phép viết code declarative.

### 2. Key trong list render có tác dụng gì?

Key giúp React xác định chính xác item nào đã thay đổi, được thêm, hoặc bị xóa. Dùng key duy nhất (ID) giúp reconciliation hiệu quả. KHONG dung index vì nó gây bugs khi list thay đổi.

### 3. Props vs State khác nhau thế nào?

**Props**: truyền từ component cha, read-only, dùng để component nhận dữ liệu. **State**: quản lý trong component, có thể thay đổi qua setState, khi state thay đổi -> re-render.

### 4. Khi nào component re-render?

- State thay đổi
- Props thay đổi
- Parent re-render
- Context value thay đổi
- Force update được gọi
