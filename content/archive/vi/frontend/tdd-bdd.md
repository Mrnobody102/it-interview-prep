# Frontend - TDD & BDD

## 1. Tổng quan

**TDD (Test-Driven Development)** và **BDD (Behavior-Driven Development)** là hai phương pháp phát triển phần mềm dựa trên việc viết tests trước.

---

## 2. Test-Driven Development (TDD)

### 2.1. Quy trình TDD

```
┌─────────────────────────────────────────┐
│         Red - Green - Refactor          │
└─────────────────────────────────────────┘
        │            │            │
        ▼            ▼            ▼
   Viết test     Viết code    Refactor
   FAIL trước    cho test     code sạch
   (đỏ)          PASS (xanh)  hơn
```

1. **Red:** Viết test cho functionality chưa có, test phải **fail**.
2. **Green:** Viết code tối thiểu để test **pass**.
3. **Refactor:** Cải thiện code mà **giữ nguyên behavior** (tests vẫn pass).

### 2.2. Ví dụ TDD với Jest

```typescript
// TDD Step 1: RED - Viết test TRƯỚC, code chưa có
// calculator.test.ts

describe('Calculator', () => {
  describe('add', () => {
    it('should return 3 when adding 1 and 2', () => {
      const calc = new Calculator();
      expect(calc.add(1, 2)).toBe(3);
    });

    it('should handle negative numbers', () => {
      const calc = new Calculator();
      expect(calc.add(-1, -2)).toBe(-3);
    });

    it('should return the same number when adding zero', () => {
      const calc = new Calculator();
      expect(calc.add(5, 0)).toBe(5);
    });
  });
});
```

```typescript
// TDD Step 2: GREEN - Viết code tối thiểu để test pass
class Calculator {
  add(a: number, b: number): number {
    return a + b;
  }
}
```

```typescript
// TDD Step 3: REFACTOR - Cải thiện code
class Calculator {
  add(a: number, b: number): number {
    if (typeof a !== 'number' || typeof b !== 'number') {
      throw new TypeError('Arguments must be numbers');
    }
    return a + b;
  }

  subtract(a: number, b: number): number {
    return a - b;
  }
}
```

### 2.3. Calculator TDD Example (Full)

```typescript
import { Calculator } from './calculator';

describe('Calculator', () => {
  let calc: Calculator;

  beforeEach(() => {
    calc = new Calculator();
  });

  describe('add', () => {
    it('should add two positive numbers', () => {
      expect(calc.add(1, 2)).toBe(3);
    });

    it('should handle negative numbers', () => {
      expect(calc.add(-1, -2)).toBe(-3);
    });

    it('should return same number when adding zero', () => {
      expect(calc.add(5, 0)).toBe(5);
    });
  });

  describe('subtract', () => {
    it('should subtract two numbers', () => {
      expect(calc.subtract(5, 3)).toBe(2);
    });

    it('should handle negative results', () => {
      expect(calc.subtract(3, 5)).toBe(-2);
    });
  });

  describe('multiply', () => {
    it('should multiply two numbers', () => {
      expect(calc.multiply(3, 4)).toBe(12);
    });

    it('should return zero when multiplying by zero', () => {
      expect(calc.multiply(5, 0)).toBe(0);
    });
  });

  describe('divide', () => {
    it('should divide two numbers', () => {
      expect(calc.divide(10, 2)).toBe(5);
    });

    it('should throw when dividing by zero', () => {
      expect(() => calc.divide(10, 0)).toThrow('Division by zero');
    });
  });
});
```

---

## 3. Behavior-Driven Development (BDD)

### 3.1. Gherkin Syntax (Given-When-Then)

BDD sử dụng **Gherkin**, ngôn ngữ business-readable để viết specifications.

```gherkin
Feature: User Login
  As a user, I want to login to the system
  So that I can access my account

  Scenario: Login with valid credentials
    Given I am on the login page
    When I enter "huy@example.com" as email
    And I enter "password123" as password
    And I click the "Login" button
    Then I should be redirected to the dashboard
    And I should see "Welcome, Huy" message
```

### 3.2. Cucumber (JS/TS)

```bash
npm install --save-dev @cucumber/cucumber
```

```typescript
// features/login.feature
Feature: User Login

  Scenario: Successful login
    Given I am on the login page
    When I fill in "huy@example.com" for email
    And I fill in "password123" for password
    And I press "Login"
    Then I should see "Welcome, Huy"
```

```typescript
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import { loginPage } from '../pages/LoginPage';
import { dashboardPage } from '../pages/DashboardPage';

Given('I am on the login page', async function() {
  await loginPage.open();
});

When('I fill in {string} for email', async function(email: string) {
  await loginPage.fillEmail(email);
});

When('I fill in {string} for password', async function(password: string) {
  await loginPage.fillPassword(password);
});

When('I press {string}', async function(button: string) {
  await loginPage.clickButton(button);
});

Then('I should see {string}', async function(message: string) {
  const text = await dashboardPage.getWelcomeMessage();
  expect(text).to.contain(message);
});
```

### 3.3. BDD với React Testing Library

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { TodoApp } from './TodoApp';

describe('TodoApp - BDD Style', () => {
  describe('Adding todos', () => {
    it('should allow user to add a new todo', () => {
      render(<TodoApp />);

      const input = screen.getByPlaceholderText('What needs to be done?');
      fireEvent.change(input, { target: { value: 'Buy groceries' } });
      fireEvent.keyDown(input, { key: 'Enter' });

      expect(screen.getByText('Buy groceries')).toBeInTheDocument();
    });
  });
});
```

---

## 4. TDD vs BDD

| Khía cạnh | TDD | BDD |
|-----------|-----|-----|
| **Focus** | Technical correctness | Business behavior |
| **Audience** | Developers | Developers + Business analysts |
| **Language** | Developer-centric | Business-readable (Given-When-Then) |
| **Tool** | Jest, Mocha, pytest | Cucumber, Gherkin, SpecFlow |
| **Test style** | Arrange-Act-Assert (AAA) | Given-When-Then |
| **Scope** | Unit tests | Integration/Acceptance tests |
| **Communication** | Less formal | Encourages team collaboration |

### 4.1. Arrange-Act-Assert (AAA)

```typescript
describe('User registration', () => {
  it('should register a new user', () => {
    const userData = { email: 'huy@example.com', password: 'password123' };
    const userService = new UserService();

    const result = userService.register(userData);

    expect(result.success).toBe(true);
    expect(result.user.email).toBe('huy@example.com');
  });
});
```

---

## 5. Test Scenarios

### 5.1. Form Validation

```typescript
describe('Registration Form', () => {
  describe('Email validation', () => {
    it('should reject invalid email formats', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('no@domain')).toBe(false);
      expect(isValidEmail('@nodomain.com')).toBe(false);
    });

    it('should accept valid email formats', () => {
      expect(isValidEmail('user@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
    });
  });
});
```

### 5.2. Shopping Cart

```typescript
describe('Shopping Cart', () => {
  it('should add item to cart', () => {
    const cart = new ShoppingCart();
    cart.addItem({ id: 1, name: 'Laptop', price: 1000, quantity: 1 });

    expect(cart.items).toHaveLength(1);
    expect(cart.total).toBe(1000);
  });

  it('should increase quantity when adding same item', () => {
    const cart = new ShoppingCart();
    cart.addItem({ id: 1, name: 'Laptop', price: 1000, quantity: 1 });
    cart.addItem({ id: 1, name: 'Laptop', price: 1000, quantity: 1 });

    expect(cart.items).toHaveLength(1);
    expect(cart.items[0].quantity).toBe(2);
    expect(cart.total).toBe(2000);
  });
});
```

---

## 6. Common Interview Questions

### Q: Lợi ích của TDD?

1. **Chất lượng code cao hơn**: code luôn có tests.
2. **Phát hiện bug sớm**: fix ngay khi viết code.
3. **Refactoring tự tin**: có tests cover nên refactor không sợ break.
4. **Documentation**: tests là documentation cho code behavior.
5. **Thiết kế tốt hơn**: phải think about interface trước khi implement.

### Q: Nhược điểm của TDD?

1. **Learning curve cao**: cần practice nhiều.
2. **Chậm ban đầu**: viết thêm code (tests) trước khi code chính.
3. **Không phù hợp cho prototype/spikes**: rapid exploration.
4. **Over-testing**: có thể viết quá nhiều tests không cần thiết.

### Q: Khi nào không nên dùng TDD?

- **Prototypes**: code thay đổi liên tục, tests không kịp update.
- **Simple utilities**: code đơn giản, rõ ràng.
- **One-time scripts**: không cần maintain.
- **Legacy code không có tests**: refactor code đã có trước.

### Q: BDD benefits over TDD?

1. **Team alignment**: business và developers cùng hiểu specs.
2. **Living documentation**: specs tự động được test.
3. **Reduces misunderstanding**: ngôn ngữ chung giữa technical và non-technical.
4. **Better requirements**: Given-When-Then buộc phải define scenarios rõ ràng.

### Q: Sự khác biệt giữa Mock, Stub, Spy?

| | Mock | Stub | Spy |
|--|------|------|-----|
| **Purpose** | Verify interactions (mock expectation) | Provide predetermined responses | Record real behavior |
| **Behavior** | Assert method được gọi với params cụ thể | Return fixed values | Partially mock object |
| **Example** | `expect(mockFn).toHaveBeenCalledWith('arg')` | `mockFn.mockReturnValue(42)` | `spyOn(obj, 'method').and.callThrough()` |
