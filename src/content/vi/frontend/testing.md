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
npm test                  # Chạy tất cả
npm test -- --watch       # Watch mode
npm test -- --coverage    # Coverage report
npm test -- file.test.ts  # Test cụ thể
```

```typescript
// math.ts
export function add(a: number, b: number): number {
  return a + b;
}

export function subtract(a: number, b: number): number {
  return a - b;
}

export function multiply(a: number, b: number): number {
  return a * b;
}

export function divide(a: number, b: number): number {
  if (b === 0) throw new Error('Division by zero');
  return a / b;
}
```

```typescript
// math.test.ts
import { add, subtract, multiply, divide } from './math';

describe('Math operations', () => {
  describe('add', () => {
    it('should add two positive numbers', () => {
      expect(add(2, 3)).toBe(5);
    });

    it('should handle negative numbers', () => {
      expect(add(-1, -1)).toBe(-2);
    });

    it('should handle zero', () => {
      expect(add(5, 0)).toBe(5);
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
// Equality
expect(value).toBe(expected);       // exact equality (===)
expect(value).toEqual(expected);    // deep equality (objects/arrays)

// Truthiness
expect(value).toBeTruthy();
expect(value).toBeFalsy();
expect(value).toBeNull();
expect(value).toBeUndefined();

// Numbers
expect(value).toBeGreaterThan(5);
expect(value).toBeLessThan(10);
expect(value).toBeGreaterThanOrEqual(5);

// Strings
expect(str).toMatch(/pattern/);
expect(str).toContain('substring');

// Arrays
expect(arr).toContain(item);
expect(arr).toHaveLength(3);

// Objects
expect(obj).toHaveProperty('name');
expect(obj).toMatchObject({ name: 'Huy' });

// Exceptions
expect(() => { throw new Error(); }).toThrow();

// Async
await expect(promise).resolves.toBe(value);
await expect(promise).rejects.toThrow();

// Not
expect(value).not.toBe(0);
```

### 2.3. Mocking

```typescript
// Mock functions
const mockFn = jest.fn();
mockFn.mockReturnValue(42);
mockFn.mockResolvedValue(42);
mockFn.mockRejectedValue(new Error('Error'));
mockFn('hello');  // call tracked

expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledWith('hello');
expect(mockFn).toHaveBeenCalledTimes(1);

// Mock modules
jest.mock('./api', () => ({
  fetchUser: jest.fn().mockResolvedValue({ id: 1, name: 'Huy' })
}));

// Mock timers
jest.useFakeTimers();
setTimeout(() => console.log('delayed'), 1000);
jest.runAllTimers();  // Execute all pending timers
jest.useRealTimers();

// Spy
const obj = { method: () => 'real' };
jest.spyOn(obj, 'method').mockReturnValue('mocked');
expect(obj.method()).toBe('mocked');
obj.method.mockRestore();  // Restore original
```

---

## 3. React Testing

### 3.1. React Testing Library

**React Testing Library** tập trung vào việc test components **như user sử dụng**, không test implementation details.

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom
```

```tsx
// Button.tsx
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
// Button.test.tsx
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

  it('is disabled when disabled prop is true', () => {
    const handleClick = jest.fn();
    render(<Button disabled onClick={handleClick}>Click me</Button>);

    const button = screen.getByText('Click me');
    expect(button).toBeDisabled();
    expect(handleClick).not.toHaveBeenCalled();
  });
});
```

### 3.2. Query Priority

```tsx
// TỪ TỐT NHẤT đến ÍT TỐT NHẤT
// 1. Accessible queries (ai dùng cũng thấy được)
screen.getByRole('button', { name: /submit/i });
screen.getByRole('textbox', { name: /email/i });

// 2. Semantic queries
screen.getByLabelText('Email');
screen.getByPlaceholderText('Enter email');
screen.getByText('Hello, World');

// 3. Test IDs (last resort)
screen.getByTestId('submit-button');

// KHÔNG nên dùng:
// - getByClassName
// - getByTagName
// - Snapshot testing (implementation detail)
```

### 3.3. Testing Form Components

```tsx
// LoginForm.test.tsx
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

  it('submits form with valid data', async () => {
    const onSubmit = jest.fn();
    render(<LoginForm onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'huy@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' }
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    expect(onSubmit).toHaveBeenCalledWith({
      email: 'huy@example.com',
      password: 'password123'
    });
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
<!-- Counter.vue -->
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

```typescript
// Counter.test.ts
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Counter from './Counter.vue';

describe('Counter', () => {
  it('renders initial count', () => {
    const wrapper = mount(Counter);
    expect(wrapper.find('[data-testid="count"]').text()).toBe('0');
  });

  it('increments count', async () => {
    const wrapper = mount(Counter);
    await wrapper.find('button:nth-child(3)').trigger('click');
    expect(wrapper.find('[data-testid="count"]').text()).toBe('1');
  });

  it('decrements count', async () => {
    const wrapper = mount(Counter);
    await wrapper.find('button:nth-child(1)').trigger('click');
    expect(wrapper.find('[data-testid="count"]').text()).toBe('-1');
  });
});
```

---

## 5. Integration Testing

Integration tests kiểm tra **nhiều components tương tác với nhau** hoặc **components tương tác với services**.

### 5.1. React Integration Test

```tsx
// UserList.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { UserList } from './UserList';
import * as userService from '../services/userService';

// Mock service
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

  it('deletes user when delete button is clicked', async () => {
    (userService.getUsers as jest.Mock).mockResolvedValue(mockUsers);
    (userService.deleteUser as jest.Mock).mockResolvedValue(undefined);

    render(<UserList />);

    await waitFor(() => screen.getByText('Huy'));
    fireEvent.click(screen.getAllByText('Delete')[0]);

    await waitFor(() => {
      expect(userService.deleteUser).toHaveBeenCalledWith(1);
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
// cypress/e2e/login.cy.ts
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

  it('should show error with invalid credentials', () => {
    cy.get('[data-testid="email-input"]').type('invalid@example.com');
    cy.get('[data-testid="password-input"]').type('wrongpassword');
    cy.get('[data-testid="login-button"]').click();

    cy.contains('Invalid credentials').should('be.visible');
    cy.url().should('include', '/login');
  });

  it('should validate required fields', () => {
    cy.get('[data-testid="login-button"]').click();
    cy.contains('Email is required').should('be.visible');
    cy.contains('Password is required').should('be.visible');
  });
});
```

### 6.2. Playwright

```bash
npm install --save-dev @playwright/test
npx playwright install
```

```typescript
// tests/login.spec.ts
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

  test('failed login shows error', async ({ page }) => {
    await page.getByTestId('email-input').fill('wrong@example.com');
    await page.getByTestId('password-input').fill('wrong');
    await page.getByTestId('login-button').click();

    await expect(page.getByText('Invalid credentials')).toBeVisible();
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
math.ts  |   100.00|   100.00  |  100.00 |  100.00 |
user.ts  |    85.71|    75.00  |   80.00 |   85.71 |
app.ts   |    50.00|    33.33  |   50.00 |   50.00 |
----------|---------|----------|---------|---------|
```

> **Tip:** 100% coverage không có nghĩa là code không có bug — coverage chỉ measure **execution**, không measure **correctness**.

---

## 8. Common Interview Questions

### Q: Sự khác biệt giữa Jest và React Testing Library?

| | Jest | React Testing Library |
|--|------|----------------------|
| **Jest** | Testing framework — runs tests, assertions, mocking | Testing library — DOM querying, event simulation |
| **Use** | Chạy tests, provide `describe`, `it`, `expect` | Query elements, simulate user interactions |
| **Together** | Jest là engine, RTL là helper | RTL build on top of jest |

### Q: Test-driven development (TDD) vs BDD?

- **TDD:** Viết tests **trước** code. Red → Green → Refactor cycle.
- **BDD:** Viết tests với ngôn ngữ **business-readable** (Gherkin: Given-When-Then).

### Q: Khi nào dùng mocking?

- Khi test phụ thuộc vào external services (API, database).
- Khi muốn isolate unit test — không test dependencies.
- Khi tạo deterministic test cases.

### Q: Smoke test vs Sanity test?

| | Smoke Test | Sanity Test |
|--|-----------|-------------|
| **Scope** | Kiểm tra core functionality đủ để deploy | Kiểm tra nhanh specific feature sau change |
| **When** | Sau mỗi build | Sau regression |
| **Coverage** | Broad, shallow | Narrow, deep |

### Q: Snapshot testing — ưu và nhược?

- **Ưu:** Nhanh, detect unintended changes.
- **Nhược:** Không test behavior, dễ bỏ qua changes, flaky với dynamic content.
- **Nên dùng cho:** Static UI (version, badge, configuration display).
- **Không nên dùng cho:** Dynamic content, complex UIs.
