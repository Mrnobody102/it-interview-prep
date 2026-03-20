# Other Skills

## TDD & BDD — Phát triển hướng kiểm thử

### 1. TDD (Test-Driven Development)

#### 1.1. Khái niệm

**TDD** là một quy trình phát triển where tests được viết **trước** code. Cycle: Red → Green → Refactor.

```
┌──────────────────────────────────────────────┐
│  1. RED    Write a failing test             │
│     ↓                                        │
│  2. GREEN  Write minimal code to pass         │
│     ↓                                        │
│  3. REFACTOR  Improve code, keep tests pass  │
│     ↓                                        │
│  4. Repeat                                   │
└──────────────────────────────────────────────┘
```

#### 1.2. Ví dụ: Tính tổng giỏ hàng

```typescript
// Step 1: RED — Viết test trước
describe('Cart', () => {
  describe('getTotal()', () => {
    it('should return 0 for empty cart', () => {
      const cart = new Cart();
      expect(cart.getTotal()).toBe(0);
    });

    it('should sum item prices', () => {
      const cart = new Cart();
      cart.addItem({ name: 'Book', price: 100 });
      cart.addItem({ name: 'Pen', price: 20 });
      expect(cart.getTotal()).toBe(120);
    });

    it('should multiply price by quantity', () => {
      const cart = new Cart();
      cart.addItem({ name: 'Book', price: 100, quantity: 3 });
      expect(cart.getTotal()).toBe(300);
    });
  });
});

// Step 2: GREEN — Viết minimal code để pass
class Cart {
  private items: { name: string; price: number; quantity: number }[] = [];

  addItem(item: { name: string; price: number; quantity?: number }) {
    this.items.push({ ...item, quantity: item.quantity ?? 1 });
  }

  getTotal(): number {
    return this.items.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);
  }
}
```

#### 1.3. Lợi ích

| Lợi ích | Mô tả |
|---|---|
| **High test coverage** | Mọi feature đều có tests |
| **Better design** | Code phải testable → better design |
| **Confidence** | Refactor thoải mái vì có tests |
| **Fewer bugs** | Phát hiện bug sớm |
| **Living documentation** | Tests mô tả expected behavior |

---

### 2. BDD (Behavior-Driven Development)

#### 2.1. Khái niệm

**BDD** là mở rộng của TDD, tập trung vào **business behavior** thay vì technical tests. Dùng ngôn ngữ tự nhiên (Gherkin).

#### 2.2. Gherkin Syntax

```
Feature: Mô tả feature
  As a [role]
  I want [feature]
  So that [benefit]

  Scenario: Mô tả một scenario
    Given [precondition — trạng thái ban đầu]
    And [thêm điều kiện khác]
    When [action — hành động thực hiện]
    And [thêm actions khác]
    Then [expected outcome — kết quả mong đợi]
    And [thêm outcomes khác]

  Scenario Outline: Kịch bản có parameters
    Given tôi đặt <số lượng> sản phẩm
    When tôi thanh toán
    Then tổng tiền là <tổng>

    Examples:
      | số lượng | tổng |
      | 1        | 100  |
      | 3        | 300  |
```

#### 2.3. Ví dụ: Login Feature

```gherkin
Feature: User Login
  As a registered user
  I want to login with my credentials
  So that I can access my account

  Background:
    Given the user "alice@example.com" exists with password "SecurePass123"
    And the login page is displayed

  Scenario: Successful login
    When I enter "alice@example.com" in the email field
    And I enter "SecurePass123" in the password field
    And I click the "Login" button
    Then I should be redirected to the dashboard
    And I should see "Welcome, Alice" message

  Scenario: Invalid password
    When I enter "alice@example.com" in the email field
    And I enter "WrongPassword" in the password field
    And I click the "Login" button
    Then I should see an error message "Invalid credentials"
    And I should remain on the login page

  Scenario: Account locked after 3 failed attempts
    When I enter "alice@example.com" in the email field
    And I enter "WrongPassword" in the password field
    And I click the "Login" button
    And I repeat the failed login 2 more times
    Then I should see an error message "Account temporarily locked"
```

#### 2.4. Step Definitions (Cucumber)

```typescript
// steps/login.steps.ts
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';

Given('the user {string} exists with password {string}', async function(email, password) {
  await this.db.users.create({ email, passwordHash: await hash(password) });
});

Given('the login page is displayed', async function() {
  await this.page.goto('/login');
});

When('I enter {string} in the email field', async function(email) {
  await this.page.fill('input[name="email"]', email);
});

When('I enter {string} in the password field', async function(password) {
  await this.page.fill('input[name="password"]', password);
});

When('I click the {string} button', async function(buttonText) {
  await this.page.click(`button:has-text("${buttonText}")`);
});

Then('I should be redirected to the dashboard', async function() {
  await this.page.waitForURL('/dashboard');
});

Then('I should see {string} message', async function(message) {
  const content = await this.page.textContent('body');
  expect(content).to.include(message);
});
```

---

### 3. So sánh TDD vs BDD

| Khía cạnh | TDD | BDD |
|---|---|---|
| **Focus** | Technical — "code hoạt động đúng?" | Business — "system làm gì?" |
| **Language** | Test code (assertions) | Natural language (Gherkin) |
| **Audience** | Developers | Developers + Business stakeholders |
| **Tools** | Jest, Mocha, JUnit | Cucumber, SpecFlow, Behave |
| **Test naming** | `it('should return...')` | `Scenario: ...` |

---

### 4. Best Practices

| Practice | Description |
|---|---|
| **Test behavior, not implementation** | Test WHAT, không phải HOW |
| **Test names describe intent** | `it('should reject negative prices')` not `it('test1')` |
| **One assertion per test (preferably)** | Mỗi test nên test một behavior |
| **Arrange-Act-Assert (AAA)** | Setup → Action → Assert |
| **Fast tests** | Unit tests nên chạy trong milliseconds |
| **Isolated tests** | Tests không phụ thuộc nhau |
| **DRY principle** | Test setup có thể share qua beforeEach/hooks |

```typescript
// Arrange-Act-Assert pattern
describe('OrderService', () => {
  it('should apply discount for orders over 1000', async () => {
    // Arrange
    const order = new Order({ total: 1500 });
    const service = new OrderService();

    // Act
    const discountedTotal = service.applyDiscount(order);

    // Assert
    expect(discountedTotal).toBe(1350); // 10% off
  });
});
```

---

### 5. Test Scenarios thường gặp

#### 5.1. Happy Path

Test flow bình thường, không lỗi:

```typescript
it('should create order successfully with valid input', async () => {
  const order = await orderService.create({
    userId: 'user-123',
    items: [{ productId: 'prod-1', quantity: 2, price: 100 }],
    shippingAddress: { city: 'Hanoi', district: 'Ba Dinh' }
  });

  expect(order.status).toBe('PENDING');
  expect(order.total).toBe(200);
});
```

#### 5.2. Edge Cases

```typescript
it('should throw when quantity is zero', async () => {
  await expect(
    orderService.create({
      userId: 'user-123',
      items: [{ productId: 'prod-1', quantity: 0, price: 100 }]
    })
  ).to.be.rejectedWith('Quantity must be greater than 0');
});

it('should handle empty cart', async () => {
  const cart = new Cart();
  expect(cart.getTotal()).toBe(0);
});

it('should handle maximum quantity limit', async () => {
  const cart = new Cart();
  cart.addItem({ productId: 'prod-1', quantity: 1000, price: 10 });
  // System nên reject hoặc cap quantity
  expect(cart.getTotal()).toBe(1000); // Capped at max
});
```

#### 5.3. Error Handling

```typescript
it('should rollback transaction on error', async () => {
  const initialBalance = await user.getBalance();
  try {
    await orderService.createInvalidOrder();
  } catch (error) {
    // Transaction nên được rollback
  }
  const finalBalance = await user.getBalance();
  expect(finalBalance).toBe(initialBalance);
});
```

---

### 6. Coverage Targets

| Test Level | Target Coverage | Speed |
|---|---|---|
| **Unit Tests** | 70-80% | Fast (< 1s total) |
| **Integration Tests** | 30-40% | Medium (< 1min) |
| **E2E Tests** | Critical paths only | Slow |

> **Tip:** 80% coverage không có nghĩa là code tốt. Test những gì quan trọng, không phải chỉ để coverage number. Focus vào **meaningful behavior tests** hơn là coverage percentage.
