# Frontend - Testing

## 1. Tổng quan

**Testing** là quá trình kiểm tra code để đảm bảo nó hoạt động đúng như mong đợi, phát hiện bugs sớm, và ngăn regression.

### 1.1. Testing Pyramid

```
        ┌─────────┐
        │   E2E   │  ← Few, Slow, Expensive
       ┌┴─────────┴┐
       │ Integration │  ← Some
      ┌┴───────────┴┐
      │    Unit     │  ← Many, Fast, Cheap
     ┌┴─────────────┴┐
     │    Static     │  ← Linting, Type checking
```

| Level | Số lượng | Tốc độ | Chi phí | Mục đích |
|-------|---------|--------|---------|----------|
| **Static** | Nhiều | Rất nhanh | Thấp | Type errors, linting |
| **Unit** | Nhiều | Nhanh | Thấp | Logic riêng lẻ |
| **Integration** | Vừa | Trung bình | Trung bình | Components tương tác |
| **E2E** | Ít | Chậm | Cao | User flows hoàn chỉnh |

---

## 2. Unit Testing

### 2.1. Jest (React)

**Jest** là testing framework phổ biến nhất cho JavaScript/TypeScript.

```bash
# Cài đặt
npm install --save-dev jest @types/jest ts-jest
npx jest --init

# Chạy tests
npm test
npm test -- --watch
npm test -- --coverage
npm test -- file.test.ts
```

```typescript
export function add(a: number, b: number): number {
  return a + b;
}

export function divide(a: number, b: number): number {
  if (b === 0) throw new Error('Division by zero');
  return a / b;
}
```

```typescript
import { add, divide } from './math';

describe('Math operations', () => {
  describe('add', () => {
    it('should add two positive numbers', () => {
      expect(add(2, 3)).toBe(5);
    });
  });

  describe('divide', () => {
    it('should divide two numbers', () => {
      expect(divide(10, 2)).toBe(5);
    });

    it('should throw on division by zero', () => {
      expect(() => divide(10, 0)).toThrow('Division by zero');
    });
  });
});
```

### 2.2. Common Jest Matchers

```typescript
expect(value).toBe(expected);
expect(value).toEqual(expected);
expect(value).toBeTruthy();
expect(value).toBeFalsy();
expect(value).toBeNull();
expect(value).toBeUndefined();
expect(value).toBeGreaterThan(5);
expect(value).toBeLessThan(10);
expect(str).toMatch(/pattern/);
expect(arr).toContain(item);
expect(obj).toHaveProperty('name');
expect(() => { throw new Error(); }).toThrow();
await expect(promise).resolves.toBe(value);
await expect(promise).rejects.toThrow();
expect(value).not.toBe(0);
```

### 2.3. Mocking

```typescript
const mockFn = jest.fn();
mockFn.mockReturnValue(42);
mockFn.mockResolvedValue(42);
mockFn.mockRejectedValue(new Error('Error'));
mockFn('hello');

expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledWith('hello');
expect(mockFn).toHaveBeenCalledTimes(1);
```

---

## 3. React Testing

### 3.1. React Testing Library

**React Testing Library** tập trung vào việc test components **như user sử dụng**, không test implementation details.

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom
```

```tsx
import { useState } from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
}

export function Button({ children, onClick, disabled, variant = 'primary' }: ButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = (): void => {
    setIsLoading(true);
    onClick?.();
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <button
      className={`btn btn-${variant}`}
      onClick={handleClick}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
    >
      {isLoading ? 'Loading...' : children}
    </button>
  );
}
```

```tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Button } from './Button';
import '@testing-library/jest-dom';

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', async () => {
    render(<Button>Click me</Button>);
    fireEvent.click(screen.getByText('Click me'));

    await waitFor(() => {
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });
});
```

### 3.2. Query Priority

```tsx
screen.getByRole('button', { name: /submit/i });
screen.getByRole('textbox', { name: /email/i });
screen.getByLabelText('Email');
screen.getByPlaceholderText('Enter email');
screen.getByText('Hello, World');
screen.getByTestId('submit-button');
```

### 3.3. Testing Form Components

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { LoginForm } from './LoginForm';

describe('LoginForm', () => {
  it('validates email format', async () => {
    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'invalid-email' }
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    expect(await screen.findByText(/invalid email/i)).toBeInTheDocument();
  });
});
```

---

## 4. Vue Testing

### 4.1. Vue Test Utils + Vitest

```bash
npm install --save-dev @vue/test-utils vitest jsdom
```

```vue
<template>
  <div class="counter">
    <button @click="decrement">-</button>
    <span data-testid="count">{{ count }}</span>
    <button @click="increment">+</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const count = ref(0);

function increment(): void {
  count.value++;
}

function decrement(): void {
  count.value--;
}
</script>
```

---

## 5. Integration Testing

Integration tests kiểm tra **nhiều components tương tác với nhau** hoặc **components tương tác với services**.

### 5.1. React Integration Test

```tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { UserList } from './UserList';
import * as userService from '../services/userService';

jest.mock('../services/userService', () => ({
  getUsers: jest.fn(),
  deleteUser: jest.fn()
}));

describe('UserList', () => {
  const mockUsers = [
    { id: 1, name: 'Huy', email: 'huy@example.com' },
    { id: 2, name: 'Hieu', email: 'hieu@example.com' }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders list of users', async () => {
    (userService.getUsers as jest.Mock).mockResolvedValue(mockUsers);

    render(<UserList />);

    await waitFor(() => {
      expect(screen.getByText('Huy')).toBeInTheDocument();
      expect(screen.getByText('Hieu')).toBeInTheDocument();
    });
  });
});
```

---

## 6. E2E Testing (End-to-End)

E2E tests kiểm tra **toàn bộ application flow** như user thực tế.

### 6.1. Cypress

```bash
npm install --save-dev cypress
npx cypress open
```

```typescript
describe('Login Flow', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should login with valid credentials', () => {
    cy.get('[data-testid="email-input"]').type('huy@example.com');
    cy.get('[data-testid="password-input"]').type('password123');
    cy.get('[data-testid="login-button"]').click();

    cy.url().should('include', '/dashboard');
    cy.contains('Welcome').should('be.visible');
  });
});
```

### 6.2. Playwright

```bash
npm install --save-dev @playwright/test
npx playwright install
```

```typescript
import { test, expect } from '@playwright/test';

test.describe('Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('successful login', async ({ page }) => {
    await page.getByTestId('email-input').fill('huy@example.com');
    await page.getByTestId('password-input').fill('password123');
    await page.getByTestId('login-button').click();

    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByText('Welcome')).toBeVisible();
  });
});
```

---

## 7. Test Coverage

```bash
npm test -- --coverage
```

### 7.1. Coverage Metrics

| Metric | Mô tả | Target |
|--------|-------|--------|
| **Statements** | Lines of code executed | >80% |
| **Branches** | If/else branches executed | >80% |
| **Functions** | Functions called | >90% |
| **Lines** | Source lines executed | >80% |

### 7.2. Coverage Report

```
----------|---------|----------|---------|---------|
File      | % Stmts | % Branch | % Funcs | % Lines |
----------|---------|----------|---------|---------|
math.ts   | 100.00  | 100.00   | 100.00  | 100.00 |
user.ts   | 85.71   | 75.00    | 80.00   | 85.71  |
app.ts    | 50.00   | 33.33    | 50.00   | 50.00  |
----------|---------|----------|---------|---------|
```

> **Tip:** 100% coverage không có nghĩa là code không có bug, coverage chỉ measure **execution**, không measure **correctness**.

---

## 8. Common Interview Questions

### Q: Sự khác biệt giữa Jest và React Testing Library?

| | Jest | React Testing Library |
|--|------|----------------------|
| **Jest** | Testing framework: runs tests, assertions, mocking | Testing library: DOM querying, event simulation |
| **Use** | Chạy tests, provide `describe`, `it`, `expect` | Query elements, simulate user interactions |
| **Together** | Jest là engine, RTL là helper | RTL build on top of Jest |

### Q: Test-driven development (TDD) vs BDD?

- **TDD:** Viết tests **trước** code. Red -> Green -> Refactor cycle.
- **BDD:** Viết tests với ngôn ngữ **business-readable** (Gherkin: Given-When-Then).

### Q: Khi nào dùng mocking?

- Khi test phụ thuộc vào external services (API, database).
- Khi muốn isolate unit test, không test dependencies.
- Khi tạo deterministic test cases.

### Q: Smoke test vs Sanity test?

| | Smoke Test | Sanity Test |
|--|-----------|-------------|
| **Scope** | Kiểm tra core functionality đủ để deploy | Kiểm tra nhanh specific feature sau change |
| **When** | Sau mỗi build | Sau regression |
| **Coverage** | Broad, shallow | Narrow, deep |

### Q: Snapshot testing: ưu và nhược?

- **Ưu:** Nhanh, detect unintended changes.
- **Nhược:** Không test behavior, dễ bỏ qua changes, flaky với dynamic content.
- **Nên dùng cho:** Static UI (version, badge, configuration display).
- **Không nên dùng cho:** Dynamic content, complex UIs.
