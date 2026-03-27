# React Core Concepts

## 1. JSX (JavaScript XML)

JSX is a syntax extension that lets you write HTML-like code inside JavaScript. It gets transpiled to `React.createElement()` calls.

### 1.1. JSX Syntax Rules

- **One root element**: Every JSX expression must have a single parent element. Use fragments `<>...</>` when you don't want an extra DOM node.

```jsx
// ❌ Multiple roots — invalid
// return (<div></div><div></div>);

// ✅ Fragment wrapper
return (
  <>
    <Header />
    <Main />
    <Footer />
  </>
);
```

- **Self-closing tags** must end with `/>`:

```jsx
return <img src="logo.png" alt="Logo" />;
return <input type="text" value={name} />;
```

- **className instead of class**: Since `class` is a reserved word in JavaScript.

```jsx
return <div className="container">Content</div>;
```

- **CamelCase for attributes**: React uses camelCase for all attribute names.

```jsx
return (
  <div
    onClick={handleClick}
    tabIndex={0}
    aria-label="Close"
    strokeWidth={2}
  >
    Content
  </div>
);
```

- **Expressions in JSX**: Use curly braces `{}` to embed JavaScript expressions.

```jsx
const name = 'Alice';
const greeting = <h1>Hello, {name}!</h1>;

const user = { firstName: 'Bob', lastName: 'Smith' };
const fullName = <span>{user.firstName} {user.lastName}</span>;

const items = ['Apple', 'Banana', 'Cherry'];
const list = (
  <ul>
    {items.map(item => (
      <li key={item}>{item}</li>
    ))}
  </ul>
);
```

### 1.2. JSX Is Not a String

JSX is syntactic sugar for `React.createElement()`. The transpiled code:

```jsx
// JSX
return <div className="greeting">Hello, {name}!</div>;

// Transpiled (Babel)
return React.createElement('div', { className: 'greeting' }, 'Hello, ', name, '!');
```

### 1.3. Conditional Rendering

```jsx
// Ternary operator
return isLoggedIn ? <Dashboard /> : <Login />;

// Logical AND — render only if condition is true
return showBanner && <Banner message="Welcome!" />;

// Early return — exit component early
function UserProfile({ user }) {
  if (!user) return <div>Please log in.</div>;
  return <div>{user.name}</div>;
}
```

---

## 2. Virtual DOM

**Virtual DOM** is a lightweight copy of the real DOM kept in memory by React.

### 2.1. How It Works

1. **Diffing**: When state changes, React creates a new Virtual DOM and compares it with the previous version (reconciliation algorithm).
2. **Reconciliation**: React determines the minimal set of changes needed using a diffing algorithm.
3. **Selective Updates**: Only the changed elements are updated in the real DOM.

### 2.2. Reconciliation Algorithm

React's reconciliation uses these key heuristics:
- Two elements of different **type** produce different trees.
- Elements of the same **type** are compared by their attributes.
- **Keys** help React identify which children have changed across re-renders.

```jsx
// Always provide a stable key for list items
// ✅ Good key — unique and stable
items.map(item => <li key={item.id}>{item.name}</li>);

// ⚠️ Bad key — index changes when items reorder
items.map((item, index) => <li key={index}>{item.name}</li>);
```

### 2.3. Fiber Architecture (React 16+)

React Fiber refactored the reconciliation process into two phases:
- **Render phase** (interruptible): Diffing and calling render functions. Can be paused, aborted, or restarted.
- **Commit phase** (non-interruptible): Applying changes to the real DOM.

### 2.4. Why Not Direct DOM Manipulation?

| Approach | Pros | Cons |
|---------|------|------|
| **Virtual DOM** | Declarative — describe UI, React handles updates. Easier to write, consistent cross-browser behavior. | Memory overhead, not always faster for trivial changes. |
| **Direct DOM** | Maximum performance for simple updates. | Imperative — manual DOM management, error-prone. |

> **Note**: Virtual DOM is not always faster than direct DOM manipulation. Its strength is enabling developers to write **declaratively** — you describe what the UI should look like, and React handles the updates.

---

## 3. Components

### 3.1. Function Components

Function components are JavaScript functions that accept props and return JSX. Since React 16.8+, they can use hooks and have become the standard.

```jsx
// Basic function component
function Greeting({ name, age }) {
  return (
    <div>
      <h1>Hello, {name}!</h1>
      {age >= 18 && <p>You are an adult.</p>}
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

### 3.2. Class Components

Class components use ES6 classes and extend `React.Component`. They are less common in modern React but still used in older codebases.

```jsx
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
    // Bind methods if using 'this' in callbacks
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState({ count: this.state.count + 1 });
  }

  render() {
    return (
      <div>
        <p>Count: {this.state.count}</p>
        <button onClick={this.handleClick}>Increment</button>
      </div>
    );
  }
}
```

### 3.3. Function vs Class Components

| Feature | Function Component | Class Component |
|---------|-------------------|-----------------|
| **Syntax** | Plain JavaScript function | ES6 class extending React.Component |
| **State** | `useState` hook | `this.state` + `this.setState` |
| **Lifecycle** | `useEffect` hook | Lifecycle methods (`componentDidMount`, etc.) |
| **this keyword** | No binding issues | Requires `.bind(this)` or arrow functions |
| **Code size** | Concise | More boilerplate |
| **Modern best practice** | Yes | Legacy |

### 3.4. Component Composition

```jsx
// Reuse through composition
function Card({ title, children }) {
  return (
    <div className="card">
      <h2>{title}</h2>
      <div className="card-body">{children}</div>
    </div>
  );
}

// Usage
<Card title="Profile">
  <UserInfo name="Alice" />
  <UserStats posts={42} />
</Card>
```

### 3.5. Special Components

```jsx
// Portal — render children to a different DOM node
import { createPortal } from 'react-dom';

function Modal({ children }) {
  return createPortal(
    <div className="modal">{children}</div>,
    document.getElementById('modal-root')
  );
}

// Fragment — group elements without extra DOM node
function TableRow() {
  return (
    <>
      <td>Name</td>
      <td>Age</td>
    </>
  );
}
```

---

## 4. Props and TypeScript

Props (short for "properties") are the mechanism for passing data from parent to child components. They are **read-only**.

### 4.1. Basic Props

```jsx
// Parent
<UserCard name="Alice" age={30} isActive={true} />

// Child — receive via function arguments
function UserCard({ name, age, isActive }) {
  return (
    <div className={isActive ? 'active' : 'inactive'}>
      {name}, {age} years old
    </div>
  );
}
```

### 4.2. Default Props

```jsx
function Button({ label, variant = 'primary', size = 'medium' }) {
  return <button className={`btn btn-${variant} btn-${size}`}>{label}</button>;
}

// Or using defaultProps (legacy)
Button.defaultProps = {
  variant: 'primary',
  size: 'medium',
};
```

### 4.3. Props with TypeScript

```tsx
// Define prop types with an interface
interface UserCardProps {
  name: string;
  age: number;
  email?: string;          // optional prop
  isActive: boolean;
  onClick?: () => void;    // function prop
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

// Function component with TypeScript
function UserCard({ name, age, email, isActive, onClick, children }: UserCardProps) {
  return (
    <div className={isActive ? 'active' : 'inactive'} onClick={onClick}>
      <h2>{name}</h2>
      <p>Age: {age}</p>
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

// Usage
<List items={users} renderItem={user => <li key={user.id}>{user.name}</li>} />
```

### 4.4. Children Props

```tsx
// Wrap children
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

### 4.5. PropTypes (Runtime Validation)

```jsx
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

## 5. Rendering Optimization

### 5.1. React.memo

`React.memo` is a higher-order component that memoizes a component, preventing re-renders when props haven't changed.

```jsx
const Button = React.memo(function Button({ onClick, label }) {
  console.log('Button rendered');
  return <button onClick={onClick}>{label}</button>;
});

// Equivalent with arrow function
const Card = React.memo(({ title, content }) => (
  <div className="card">
    <h3>{title}</h3>
    <p>{content}</p>
  </div>
));
```

> **Important**: `React.memo` does a **shallow comparison** of props. If props are new objects, arrays, or functions on every render, memoization is ineffective.

```jsx
// ⚠️ Problem: new object on every render — memoization ineffective
function Parent() {
  return <Child style={{ color: 'red' }} />;  // New object each render
}

// ✅ Solution: memoize the object or pass primitive values
function Parent() {
  const style = React.useMemo(() => ({ color: 'red' }), []);
  return <Child style={style} />;
}
```

### 5.2. Custom Comparison Function

```jsx
// Provide custom comparison for deep equality
const UserList = React.memo(
  ({ users, sortOrder }) => (
    <ul>
      {users.map(u => <li key={u.id}>{u.name}</li>)}
    </ul>
  ),
  (prevProps, nextProps) => {
    // Return true if props are equal (skip re-render)
    return prevProps.users.length === nextProps.users.length &&
      prevProps.sortOrder === nextProps.sortOrder;
  }
);
```

### 5.3. useMemo

Memoize **computed values** to avoid expensive recalculation on re-render.

```jsx
const expensiveValue = useMemo(
  () => computeExpensiveValue(a, b),
  [a, b]
);
// Only recalculates when a or b changes
```

**When to use useMemo**:
- Expensive calculations (sorting, filtering large arrays, complex math)
- Creating new objects/arrays passed as props to memoized children
- Stable references for useEffect dependencies

### 5.4. useCallback

Memoize **functions** to avoid creating new references on re-render. Essential when passing callbacks to child components wrapped in `React.memo`.

```jsx
const handleClick = useCallback(
  () => { doSomething(id); },
  [id]
);
// Returns the same function reference unless 'id' changes
```

```jsx
// Practical example: memoized handler with useCallback
function ProductList({ products }) {
  const [selectedId, setSelectedId] = useState(null);

  const handleSelect = useCallback((id) => {
    setSelectedId(id);
    analytics.track('product_selected', { id });
  }, []);  // Empty deps — function never changes

  return (
    <div>
      {products.map(p => (
        <ProductItem
          key={p.id}
          product={p}
          isSelected={p.id === selectedId}
          onSelect={handleSelect}  // Stable reference
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

### 5.5. When to Use Each Optimization

| Technique | Purpose | When to Use |
|-----------|---------|-------------|
| `React.memo` | Skip re-rendering a component | Pure component with same props |
| `useMemo` | Cache computed value | Expensive calculation or stable object reference |
| `useCallback` | Cache function reference | Callback passed to memoized child, or in useEffect dependency |

> **Rule of thumb**: Don't optimize prematurely. Add memoization only when profiling shows a performance problem.

### 5.6. Virtualization for Large Lists

Only render items visible on screen for very large lists.

```jsx
import { FixedSizeList } from 'react-window';

// 10,000 items but only renders ~20-30 visible items at a time
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

### 5.7. Debouncing & Throttling

Limit how often a function is called during frequent events.

```jsx
// Debounce — wait for user to stop typing before searching
import { useDebounce } from './hooks/useDebounce';
const debouncedSearch = useDebounce(searchTerm, 300);

// Throttle — limit scroll handler calls
import { useThrottle } from './hooks/useThrottle';
const throttledScroll = useThrottle(handleScroll, 100);
```

---

## 6. Immutable Updates (Critical Rule)

> **Rule**: Never mutate state directly. Always create a **new copy** with changes applied.

React uses **reference equality** (`===`) to detect state changes. Direct mutation doesn't change the reference, so React won't re-render.

### 6.1. Array Updates

```jsx
// ❌ Wrong — direct mutation
items.push(newItem);
setItems(items);

// ✅ Correct — new array reference
setItems([...items, newItem]);

// ✅ Correct — filter without mutation
setItems(items.filter(i => i.id !== action.payload));

// ✅ Correct — map without mutation
setItems(items.map(i => i.id === id ? { ...i, ...updates } : i));

// ✅ Correct — remove item
setItems(items.filter(item => item.id !== itemId));

// ✅ Correct — insert at specific index
setItems([...items.slice(0, index), newItem, ...items.slice(index)]);
```

### 6.2. Object Updates

```jsx
// ❌ Wrong — direct mutation
user.name = 'New Name';
setUser(user);

// ✅ Correct — shallow copy with changes
setUser({ ...user, name: 'New Name' });

// ✅ Correct — nested immutability
setCart({
  ...cart,
  items: [...cart.items, newItem],
  total: cart.total + newItem.price,
});
```

### 6.3. Deep Immutability

```jsx
// Updating a deeply nested property
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

## 7. Interview Questions

**Q: What is the difference between the Virtual DOM and the real DOM?**

> The Virtual DOM is a lightweight JavaScript representation of the real DOM kept in memory. When state changes, React creates a new Virtual DOM tree, diffs it against the previous one, and applies only the minimal changes to the real DOM. This is faster than re-rendering the entire DOM because direct DOM manipulation is expensive and browser APIs are synchronous. The Virtual DOM enables a declarative programming model where you describe what the UI should look like and React handles the updates.

**Q: How does JSX get transformed?**

> JSX is syntactic sugar for `React.createElement()` calls. Tools like Babel or TypeScript transpile JSX into these function calls at build time. For example, `<div className="greeting">Hello</div>` becomes `React.createElement('div', { className: 'greeting' }, 'Hello')`.

**Q: What is the difference between React.memo and useMemo?**

> `React.memo` is a **higher-order component** that memoizes an entire component — it prevents the component from re-rendering when its props haven't changed. `useMemo` is a **hook** that memoizes a **computed value** within a component body. They serve different purposes: one wraps components, the other caches values.

**Q: Why should you not modify state directly?**

> React determines whether to re-render by comparing the old and new state references using `===` (reference equality). If you modify state directly (e.g., `state.count++`), the reference doesn't change, so React won't detect the update and won't re-render. Always create a new object/array reference to trigger re-renders. Additionally, immutable updates enable features like time-travel debugging (Redux DevTools) and change detection optimizations.

**Q: What are controlled vs uncontrolled components?**

> A **controlled component** has its value managed by React state through `onChange` handlers. Every input change updates state, and the UI reflects the state value. An **uncontrolled component** manages its own internal state (typically using a ref), and you only read the value on form submission. Controlled components are the React best practice for form handling because they enable validation, conditional rendering, and dynamic behavior.

**Q: What is reconciliation in React?**

> Reconciliation is the process React uses to update the real DOM efficiently. After a state change, React creates a new Virtual DOM tree and compares (diffs) it with the previous tree. Based on the comparison, React calculates the minimum number of updates needed and applies them to the real DOM in the commit phase. React Fiber (React 16+) further improves this by making the render phase interruptible, allowing React to prioritize urgent updates.

**Q: What is the purpose of the `key` prop in lists?**

> The `key` prop helps React identify which items have changed, been added, or removed across re-renders. React uses keys to match children in the old tree with children in the new tree. Stable keys (like database IDs) enable efficient reconciliation. Using array indices as keys is problematic because they change when items are reordered or removed, causing unnecessary re-renders and potential bugs with stateful components.
