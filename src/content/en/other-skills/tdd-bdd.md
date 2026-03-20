# Other Skills — TDD / BDD

## 1. TDD — Test-Driven Development

**TDD** is a development methodology where tests are written **before** the code they test.

### 1.1. The Red-Green-Refactor Cycle

```
  Write a failing test
        ↓ (Red)
  Write minimal code to pass
        ↓ (Green)
  Refactor the code
        ↓
      Repeat
```

| Phase | Color | Action |
|-------|-------|--------|
| **Red** | Write failing test | Define expected behavior |
| **Green** | Write minimal code | Make the test pass |
| **Refactor** | Improve code | Maintain functionality, improve design |

### 1.2. Example (TDD Cycle)

```javascript
// Step 1: RED — Write a failing test
describe('Calculator', () => {
  it('should add two numbers', () => {
    const calc = new Calculator();
    expect(calc.add(2, 3)).toBe(5);
  });
});
// Result: ReferenceError: Calculator is not defined

// Step 2: GREEN — Write minimal code to pass
class Calculator {
  add(a, b) {
    return 5;  // Minimal implementation to pass test
  }
}
// Result: Test passes

// Step 3: REFACTOR — Improve implementation
class Calculator {
  add(a, b) {
    return a + b;  // Real implementation
  }
}
// Result: Test still passes, but implementation is correct

// Step 4: Add more tests
it('should subtract two numbers', () => { /* ... */ });
it('should multiply two numbers', () => { /* ... */ });
```

### 1.3. Benefits of TDD

| Benefit | Description |
|---------|-------------|
| **Better design** | Writing tests first forces you to think about the API design |
| **High test coverage** | Every feature has a test |
| **Confidence** | Refactoring is safe — tests catch regressions |
| **Living documentation** | Tests describe expected behavior |
| **Smaller feedback loop** | Errors caught immediately |

### 1.4. TDD Principles

- Tests should be **fast** — run frequently
- Tests should be **independent** — no shared state
- Tests should be **deterministic** — same result every time
- Write the **simplest** code to pass the test, then refactor

---

## 2. BDD — Behavior-Driven Development

**BDD** is an extension of TDD that focuses on **business behavior** and uses natural language to describe tests.

### 2.1. BDD vs TDD

| | TDD | BDD |
|--|-----|-----|
| **Focus** | Technical correctness | Business behavior |
| **Language** | Developer-centric | Natural language (Gherkin) |
| **Audience** | Developers | Developers + Business + QA |
| **Tool** | xUnit, Jest | Cucumber, Behave, SpecFlow |

### 2.2. Gherkin Syntax

BDD uses a structured, human-readable language called **Gherkin** to define scenarios.

```gherkin
Feature: User Login

  As a registered user
  I want to log in with my credentials
  So that I can access my account

  Scenario: Successful login
    Given the user is on the login page
    And the user has entered valid credentials
    When the user clicks the "Login" button
    Then the user should be redirected to the dashboard
    And the user should see a welcome message

  Scenario: Failed login with invalid password
    Given the user is on the login page
    And the user has entered email "alice@example.com"
    And the user has entered password "wrongpassword"
    When the user clicks the "Login" button
    Then the user should see an error message "Invalid credentials"
    And the user should remain on the login page
```

### 2.3. Gherkin Keywords

| Keyword | Purpose |
|---------|---------|
| `Feature` | High-level description of a feature |
| `Scenario` | A specific use case |
| `Given` | Precondition / context |
| `When` | Action / event |
| `Then` | Expected outcome / assertion |
| `And` | Continuation of previous step |
| `But` | Negative assertion continuation |
| `Background` | Steps that run before every scenario |
| `Scenario Outline` | Parameterized scenario with examples |

### 2.4. Scenario Outline (Data-driven)

```gherkin
Scenario Outline: Withdraw money from ATM
  Given my account has a balance of <balance>
  When I withdraw <amount>
  Then my new balance should be <new_balance>
  And I should receive <amount> in cash

  Examples:
    | balance | amount | new_balance |
    | 1000    | 200    | 800          |
    | 500     | 100    | 400          |
    | 100     | 150    | 100          |
```

### 2.5. BDD Tools

| Language | Tool | Framework |
|----------|------|-----------|
| JavaScript/TypeScript | **Cucumber.js**, Jest (BDD-style) | @cucumber/cucumber |
| Python | **Behave**, pytest-bdd | behave |
| Java | **Cucumber**, JBehave | cucumber |
| C# | **SpecFlow** | specflow |
| Ruby | **Cucumber**, RSpec | cucumber |

### 2.6. Example: Cucumber + Playwright

```typescript
// features/login.feature
Feature: User Login

  Scenario: User logs in successfully
    Given I am on the login page
    When I fill in "email" with "alice@example.com"
    And I fill in "password" with "password123"
    And I click "Login"
    Then I should be on the dashboard page
```

```typescript
// step-definitions/login.steps.ts
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

Given('I am on the login page', async function() {
  await this.page.goto('/login');
});

When('I fill in {string} with {string}', async function(field, value) {
  await this.page.fill(`[name="${field}"]`, value);
});

When('I click {string}', async function(buttonText) {
  await this.page.click(`button:has-text("${buttonText}")`);
});

Then('I should be on the dashboard page', async function() {
  await expect(this.page).toHaveURL('/dashboard');
});
```

---

## 3. BDD Benefits

| Benefit | Description |
|---------|-------------|
| **Shared understanding** | Business, developers, and QA all speak the same language |
| **Living documentation** | Feature files serve as documentation |
| **Acceptance criteria** | Scenarios define when a feature is "done" |
| **Executable specs** | Tests double as specifications |

---

## 4. Testing Vocabulary

| Term | Definition |
|------|-----------|
| **Assertion** | A statement that verifies an expected condition |
| **Test double** | Generic term for test replacements (mock, stub, fake, spy) |
| **Mock** | A fake object that verifies interactions and arguments |
| **Stub** | A fake object that provides pre-programmed responses |
| **Spy** | A real object with additional spying capabilities |
| **Fake** | A simplified implementation (in-memory DB) |
| **Fixture** | Setup data for tests |
| **Assertion library** | Tools for writing assertions (Chai, AssertJ) |
| **Test runner** | Tool that executes tests (Jest, Mocha, JUnit) |

---

## 5. Interview Questions

**Q: What are the main advantages of TDD over writing tests after code?**

> TDD forces you to think about the design before implementing — leading to better API design and loosely coupled code. Tests are written with the consumer's perspective in mind. It also ensures tests are actually written (often skipped when done after). However, TDD can slow initial development and may not suit all problem types.

**Q: What is the difference between a fake, a mock, and a stub?**

> A **stub** provides fixed responses to calls. A **mock** additionally verifies that calls happened as expected (asserts interactions). A **fake** is a lightweight implementation of a dependency (e.g., in-memory database) that doesn't simulate the real thing exactly but is simpler.

**Q: What is the Arrange-Act-Assert pattern?**

> **AAA** is a structure for writing tests: **Arrange** sets up test data and dependencies, **Act** executes the code being tested, and **Assert** verifies the result. It makes tests clear and readable.
