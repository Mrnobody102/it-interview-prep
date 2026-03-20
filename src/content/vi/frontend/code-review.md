# Frontend - Code Review

## 1. Tổng quan

**Code Review** là quá trình **review code** do teammate viết trước khi merge vào codebase chính. Mục đích: phát hiện bugs, đảm bảo chất lượng, chia sẻ kiến thức, và maintain coding standards.

---

## 2. Best Practices

### 2.1. Cho Author

- **PR nhỏ, tập trung** — mỗi PR nên < 400 dòng thay đổi. PR lớn khó review kỹ.
- **Viết description rõ ràng** — tại sao thay đổi, làm gì, test như thế nào.
- **Tự review trước** — đọc lại code của mình trước khi gửi.
- **Gắn ticket/issue liên quan** — để reviewer hiểu context.
- **Self-review checklist:**
  - [ ] Code chạy và pass all tests?
  - [ ] Đã handle edge cases?
  - [ ] Không có console.log/debug code?
  - [ ] Comments rõ ràng, cần thiết?
  - [ ] Performance đã consider?
  - [ ] Security đã consider?

### 2.2. Cho Reviewer

- **Review trong 24-48 giờ** — tránh block team.
- **Be kind, be constructive** — focus vào code, không phải người.
- **Explain the "why"** — không chỉ nói "đổi cái này", mà giải thích tại sao.
- **Nhiệm kỳ:** Approve, Request Changes, Comment.
- **Prioritize** — critical issues trước, nitpicks cuối.

### 2.3. Review Guidelines

| Priority | Mô tả | Ví dụ |
|----------|-------|-------|
| **MUST FIX** | Bug, security, breaking change | SQL injection, crash, data loss |
| **SHOULD FIX** | Nên sửa | Performance, readability |
| **NICE TO HAVE** | Có thể improve | Style, naming |
| **NIT** | Minor style | Spacing, formatting |

> **Quy tắc 80/20:** 80% thời gian cho 20% issues quan trọng nhất.

---

## 3. Security Review

### 3.1. Common Security Issues

```typescript
// BAD: XSS — Cross-Site Scripting
// Không bao giờ dùng innerHTML với user input
document.getElementById('content').innerHTML = userInput;

// GOOD: Sanitize hoặc dùng textContent
document.getElementById('content').textContent = userInput;

// React: mặc định escape, nhưng dùng dangerouslySetInnerHTML cẩn thận
// <div dangerouslySetInnerHTML={{ __html: userInput }} />  // BAD!

// BAD: SQL Injection
const query = `SELECT * FROM users WHERE name = '${userInput}'`;

// GOOD: Parameterized queries
const query = 'SELECT * FROM users WHERE name = ?';
db.query(query, [userInput]);
```

```typescript
// BAD: Hardcoded secrets
const apiKey = 'sk-1234567890abcdefghijklmnopqrstuvwxyz';

// GOOD: Environment variables
const apiKey = process.env.API_KEY;

// BAD: eval()
eval(userInput);

// GOOD: JSON.parse() hoặc structured parsing
JSON.parse(userInput);
```

### 3.2. Security Checklist

- [ ] **Input validation** — validate tất cả user input phía client và server.
- [ ] **Output encoding** — escape output khi hiển thị.
- [ ] **Authentication** — user đã authenticated và authorized đúng?
- [ ] **Secrets** — không có hardcoded secrets trong code?
- [ ] **Dependencies** — dependencies đã scan security?
- [ ] **HTTPS** — sensitive data chỉ truyền qua HTTPS?
- [ ] **CORS** — CORS configuration đúng?
- [ ] **CSRF** — CSRF tokens cho state-changing operations?
- [ ] **Rate limiting** — API có rate limiting?

---

## 4. Code Quality Checklist

### 4.1. Readability

```typescript
// BAD: Magic numbers
if (user.age > 18 && user.score > 75) { ... }

// GOOD: Named constants
const MIN_AGE = 18;
const PASSING_SCORE = 75;
if (user.age > MIN_AGE && user.score > PASSING_SCORE) { ... }

// BAD: Nested callbacks
getUser(id, (err, user) => {
  getPosts(user.id, (err, posts) => {
    getComments(posts[0].id, (err, comments) => { ... });
  });
});

// GOOD: Flat async/await
const user = await getUser(id);
const posts = await getPosts(user.id);
const comments = await getComments(posts[0].id);

// BAD: Vague naming
function calc(d, f) { ... }

// GOOD: Descriptive naming
function calculateDiscount(price, discountRate) { ... }

// BAD: Long function
function processOrder(order) {
  // 200 lines of code
}

// GOOD: Small, focused functions
function processOrder(order) {
  validateOrder(order);
  applyDiscount(order);
  calculateTotal(order);
  saveOrder(order);
  sendConfirmation(order);
}
```

### 4.2. TypeScript Quality

```typescript
// BAD: any type
function processData(data: any) { ... }

// GOOD: Proper types
interface User {
  id: number;
  name: string;
  email: string;
}
function processData(data: User) { ... }

// BAD: Missing null checks
const city = user.address.city;  // user.address có thể undefined

// GOOD: Optional chaining + nullish coalescing
const city = user.address?.city ?? 'Unknown';

// BAD: Non-specific return type
function getUser(): any { ... }

// GOOD: Specific return type
function getUser(): Promise<User | null> { ... }
```

### 4.3. Performance

```typescript
// BAD: Re-computing in render
function Component({ items }) {
  const sorted = items.sort((a, b) => a.name.localeCompare(b.name));  // Mỗi render
  return <List items={sorted} />;
}

// GOOD: Memoize
function Component({ items }) {
  const sorted = useMemo(
    () => [...items].sort((a, b) => a.name.localeCompare(b.name)),
    [items]
  );
  return <List items={sorted} />;
}

// BAD: Unnecessary re-renders
class Parent extends React.Component {
  render() {
    return <Child onClick={() => this.handleClick()} />;
  }
}

// GOOD: Stable callbacks
class Parent extends React.Component {
  handleClick = () => { ... };  // Arrow function trong class field
  render() {
    return <Child onClick={this.handleClick} />;
  }
}
```

---

## 5. React/TypeScript Review Points

### 5.1. Components

| Checkpoint | Mô tả |
|-----------|--------|
| **Single responsibility** | Component làm một việc? |
| **Props typing** | Tất cả props có type? |
| **State management** | Dùng local state đúng chỗ? |
| **Side effects** | useEffect có dependencies đúng? |
| **Cleanup** | Subscriptions, timers đã cleanup? |
| **Error boundaries** | Error boundaries cho component trees? |

### 5.2. Hooks

```typescript
// BAD: Missing dependency
useEffect(() => {
  fetchData(userId);
}, []);  // userId thay đổi nhưng effect không re-run

// GOOD: Complete dependencies
useEffect(() => {
  fetchData(userId);
}, [userId]);

// BAD: Infinite loop
useEffect(() => {
  setCount(count + 1);  // setCount trigger re-render → infinite loop
}, [count]);

// BAD: Missing cleanup
useEffect(() => {
  const ws = new WebSocket(url);
  ws.onmessage = handler;
}, []);  // WebSocket không close khi unmount

// GOOD: Cleanup
useEffect(() => {
  const ws = new WebSocket(url);
  ws.onmessage = handler;
  return () => ws.close();
}, []);
```

### 5.3. State Updates

```typescript
// BAD: Mutating state
const [items, setItems] = useState([]);
items.push(newItem);  // Không trigger re-render!

// GOOD: Functional state update
setItems(prev => [...prev, newItem]);

// BAD: Stale closure
useEffect(() => {
  setTimeout(() => console.log(count), 1000);
}, []);  // count luôn là 0

// GOOD: Functional update hoặc include in deps
useEffect(() => {
  const id = setTimeout(() => console.log(count), 1000);
  return () => clearTimeout(id);
}, [count]);
```

---

## 6. Git Etiquette

### 6.1. Commit Messages

```bash
# BAD
fix bug
update
asdf

# GOOD (Conventional Commits)
feat: add user registration form
fix: resolve login redirect loop on mobile
docs: update API documentation
refactor: extract user validation into separate module
test: add unit tests for cart calculation
chore: upgrade dependencies
perf: optimize image loading with lazy loading
style: fix linting issues

# Format: type(scope): description
# - type: feat, fix, docs, refactor, test, chore, perf, style
# - scope: (optional) module/component affected
# - description: imperative mood, lowercase, no period
```

### 6.2. Branch Naming

```bash
# BAD
fix
new-feature
updates

# GOOD
feature/user-registration
feature/add-shopping-cart
bugfix/login-redirect-loop
hotfix/security-patch-cve-2024
refactor/extract-validation
chore/upgrade-react-18
```

### 6.3. Pull Request Title

```bash
# BAD
fix
changes
update

# GOOD
feat(auth): add password reset functionality
fix(cart): resolve quantity update bug
refactor(api): extract HTTP client into service
docs(readme): update installation instructions
```

---

## 7. Review Comment Examples

### 7.1. Constructive Comments

```markdown
<!-- BAD: Blunt -->
This is wrong. Rewrite it.

<!-- GOOD: Specific + Explain -->
Consider using `useMemo` here since `sortedItems` is recalculated
on every render even though `items` hasn't changed. This could cause
performance issues with large lists.

WDYT? Happy to discuss alternatives if you see issues with this approach.
```

```markdown
<!-- BAD: Prescriptive without explanation -->
You should use a guard clause here.

<!-- GOOD: Explain the benefit -->
Using a guard clause (early return) here would reduce nesting and make
the happy path easier to follow. Something like:

```typescript
if (isLoading) return <Loading />;
if (error) return <Error error={error} />;
// rest of the logic...
```

What do you think?
```

### 7.2. Questioning

```markdown
I'm curious about the choice of `setInterval` here instead of
`requestAnimationFrame`. Is there a specific reason? Performance?

Or if this is intentional, could you add a comment explaining the rationale?
It would help future maintainers.
```

### 7.3. Approving

```markdown
<!-- Approval with nit -->
LGTM! Just two small nits:
- Line 42: trailing space
- Line 158: could use a type alias for `Record<string, number>`

Feel free to merge after fixing these.
```

---

## 8. Common Interview Questions

### Q: Review checklist thường gặp?

1. **Correctness** — Code có hoạt động đúng không?
2. **Security** — Có vulnerabilities không?
3. **Performance** — Có bottlenecks không?
4. **Readability** — Code có dễ đọc, maintain không?
5. **Testing** — Có đủ tests không?
6. **Error handling** — Edge cases đã handle chưa?
7. **Naming** — Variables/functions có đặt tên rõ ràng không?
8. **Dependencies** — Dependencies có cần thiết không?

### Q: Làm sao để review hiệu quả?

1. **Understand context** — đọc PR description và related issues.
2. **Focus on essentials** — correctness, security, architecture, trước style.
3. **Use tools** — linters, type checkers tự động bắt style issues.
4. **Be timely** — review trong 24 giờ.
5. **Be respectful** — construct feedback tích cực.

### Q: Khi nào nên approve vs request changes?

- **Approve:** Code OK, chỉ có nits hoặc suggestions.
- **Request Changes:** Có bugs, security issues, hoặc architectural problems.

### Q: Review không nên làm gì?

- **Không bikeshedding** — không tranh luận về style issues khi có linter.
- **Không micromanage** — trust teammate's judgment về minor choices.
- **Không gatekeep** — nếu code đủ good, merge đi.
- **Không personal** — "this code is bad" vs "this approach could be improved".

### Q: Security vulnerabilities thường gặp?

1. **XSS** — Cross-Site Scripting (innerHTML, dangerouslySetInnerHTML)
2. **SQL/NoSQL Injection** — raw queries
3. **CSRF** — missing tokens for state-changing operations
4. **Sensitive data exposure** — logging secrets, storing in localStorage
5. **Dependency vulnerabilities** — outdated packages
6. **Improper authentication** — missing auth checks
7. **idor** — insecure direct object references (accessing others' data)
