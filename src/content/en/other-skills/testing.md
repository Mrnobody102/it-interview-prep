# Other Skills — Testing

## 1. Testing Pyramid

The **Test Pyramid** guides the distribution of tests in a project — more unit tests, fewer integration and E2E tests.

```
       /\
      /E2E\         ← Few (slow, expensive, realistic)
     /------\
    /Integr. \      ← Some (medium speed)
   /----------\
  /   Unit     \   ← Many (fast, cheap, isolated)
 /--------------\
```

| Level | Speed | Scope | Confidence |
|-------|-------|-------|-----------|
| **Unit** | Fast (ms) | Single function/class | Low (isolated) |
| **Integration** | Medium (s) | Component interactions | Medium |
| **E2E** | Slow (min) | Full application | High (realistic) |

---

## 2. Unit Testing

### 2.1. What is a Unit Test?

> A **unit test** verifies the behavior of a single unit (function, class, or component) in isolation, without external dependencies.

### 2.2. Characteristics

- **Fast** — runs in milliseconds
- **Isolated** — uses mocks/stubs for dependencies
- **Repeatable** — same result every time
- **Independent** — tests don't depend on each other

### 2.3. Test Structure (AAA Pattern)

```javascript
// Arrange — set up test data and dependencies
const input = 5;
const expected = 25;

// Act — execute the function being tested
const result = square(input);

// Assert — verify the result
expect(result).toBe(expected);
```

### 2.4. Tools by Language

| Language | Framework | Assertion |
|----------|-----------|-----------|
| JavaScript/TypeScript | **Jest**, Mocha, Vitest | Jest matchers, Chai |
| Java | **JUnit 5**, TestNG | AssertJ |
| Python | **pytest**, unittest | pytest assertions |
| Go | **testing** package | testing package |
| C# | **xUnit**, NUnit, MSTest | xUnit assertions |

### 2.5. Example (Jest)

```javascript
// sum.js
export function sum(a, b) {
  return a + b;
}

// sum.test.js
import { sum } from './sum';

describe('sum', () => {
  it('adds two positive numbers', () => {
    expect(sum(2, 3)).toBe(5);
  });

  it('handles negative numbers', () => {
    expect(sum(-1, -1)).toBe(-2);
  });

  it('returns zero when adding zero', () => {
    expect(sum(0, 5)).toBe(5);
  });
});
```

### 2.6. Mocking

```javascript
// Mock a module
jest.mock('./api', () => ({
  fetchUser: jest.fn()
}));

// Mock return value
import { fetchUser } from './api';
fetchUser.mockResolvedValue({ id: 1, name: 'Alice' });

// Mock implementation
jest.mock('./utils', () => ({
  formatDate: jest.fn(date => `2024-01-01`)
}));
```

---

## 3. Integration Testing

### 3.1. What is an Integration Test?

> An **integration test** verifies that multiple components or modules work together correctly — testing the interactions between units.

### 3.2. What It Tests

- Database operations (read/write)
- API calls (HTTP requests/responses)
- Integration between services
- File system operations
- Message queues

### 3.3. Example (React Testing Library)

```jsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from './LoginForm';

// Test component integration
describe('LoginForm', () => {
  it('submits form with valid credentials', async () => {
    const user = userEvent.setup();
    render(<LoginForm onSubmit={mockSubmit} />);

    await user.type(screen.getByLabelText('Email'), 'alice@example.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        email: 'alice@example.com',
        password: 'password123'
      });
    });
  });
});
```

### 3.4. Database Testing

```javascript
// Use a test database (not production)
beforeAll(async () => {
  await testDb.connect();
});

afterAll(async () => {
  await testDb.disconnect();
});

beforeEach(async () => {
  await testDb.clear();  // Reset data between tests
});

it('creates a user in the database', async () => {
  const user = await UserService.create({ name: 'Alice', email: 'alice@example.com' });
  const found = await User.findById(user.id);
  expect(found.name).toBe('Alice');
});
```

---

## 4. E2E Testing (End-to-End)

### 4.1. What is an E2E Test?

> An **E2E test** simulates real user interactions with the complete application — from the browser through the UI, backend, and database.

### 4.2. Characteristics

- **Slowest** — runs in minutes
- **Most realistic** — tests the entire stack
- **Most expensive** — requires full environment
- **Brittle** — can be sensitive to UI changes

### 4.3. Tools

| Tool | Description |
|------|-------------|
| **Playwright** | Modern, cross-browser, Microsoft |
| **Cypress** | Developer-friendly, great DX |
| **Selenium** | Mature, supports many languages |
| **Puppeteer** | Node.js, Google Chrome only |

### 4.4. Example (Playwright)

```typescript
import { test, expect } from '@playwright/test';

test.describe('User Login', () => {
  test('logs in successfully with valid credentials', async ({ page }) => {
    await page.goto('/login');

    await page.fill('[name="email"]', 'alice@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('h1')).toContainText('Welcome');
  });
});
```

### 4.5. Example (Cypress)

```javascript
describe('Login', () => {
  it('logs in successfully', () => {
    cy.visit('/login');
    cy.get('[name="email"]').type('alice@example.com');
    cy.get('[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
    cy.contains('Welcome').should('be.visible');
  });
});
```

---

## 5. Test-Driven Development (TDD)

> **TDD** (covered in detail in the TDD/BDD section) follows the cycle: **Red** (write failing test) -> **Green** (write minimal code to pass) -> **Refactor**.

---

## 6. Testing Best Practices

| Practice | Why it matters |
|----------|---------------|
| **Test behavior, not implementation** | Tests remain stable when refactoring |
| **One assertion per test** (ideally) | Clearer failures, easier debugging |
| **Use descriptive test names** | `it('should return 404 for non-existent user')` |
| **Keep tests fast** | Fast tests run more often, catch issues sooner |
| **Avoid test interdependencies** | Each test should run independently |
| **Use test doubles (mocks)** appropriately | Isolate units under test |
| **Test edge cases** | Empty arrays, null values, boundary conditions |

---

## 7. Code Coverage

| Metric | Description |
|--------|-------------|
| **Line coverage** | Percentage of code lines executed |
| **Branch coverage** | Percentage of branches (if/else) executed |
| **Function coverage** | Percentage of functions called |

```bash
# Jest coverage
npx jest --coverage

# Playwright coverage
# Use istanbul or v8 coverage
```

> **Note**: High coverage does not mean good tests. 80% coverage with well-written behavior tests is better than 100% coverage with weak tests.

---

## 8. Interview Questions

**Q: What is the difference between a stub and a mock?**

> A **stub** provides pre-programmed responses to method calls (used to control the test environment). A **mock** also verifies interactions — whether specific methods were called with expected arguments. Stubs assert state; mocks assert behavior.

**Q: When should you write a test?**

> Write tests for: critical business logic, complex algorithms, regression prevention, and documentation of expected behavior. Consider ROI — very simple code or frequently-changing UI may not need comprehensive tests.

**Q: What is snapshot testing?**

> **Snapshot testing** saves the rendered output of a component to a file and compares future renders against it. Useful for preventing unintended UI changes. However, it can produce flaky tests if snapshots are too large or change frequently.
