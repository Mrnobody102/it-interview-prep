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

---

## 9. Performance Testing

### 9.1. Types of Performance Testing

| Type | Goal | Scenario |
|------|------|----------|
| **Performance Testing** | Measure system performance under expected load | Validate response time meets SLA |
| **Load Testing** | Verify system behavior at expected/normal load | 1000 concurrent users, steady ramp-up |
| **Stress Testing** | Find the breaking point beyond capacity | 2x, 5x, 10x normal load |
| **Soak Testing** | Detect memory leaks / degradation over time | Sustained load for hours |
| **Spike Testing** | Verify response to sudden load bursts | Instant 10x traffic increase |
| **Scalability Testing** | Measure performance as resources scale | Horizontal/vertical scaling |

### 9.2. Key Metrics

| Metric | Description | Good Target |
|--------|-------------|-------------|
| **TPS / Throughput** | Transactions per second | Depends on system design |
| **Response Time (Avg)** | Average response time | < 200ms for APIs |
| **Response Time (P50)** | Median — 50% of requests | Lower than average |
| **Response Time (P90)** | 90th percentile — SLA target | < 500ms often |
| **Response Time (P99)** | 99th percentile — worst cases | < 1s often |
| **Error Rate** | % of failed requests | < 1% |
| **Concurrent Users** | Simultaneous active users | Match expected peak |
| **CPU / Memory** | Server resource utilization | < 80% sustained |
| **Apdex Score** | User satisfaction index (0-1) | > 0.85 (Good) |

### 9.3. Apache JMeter

JMeter is an open-source tool for load testing. It simulates concurrent users and measures performance.

**Core Concepts:**

- **Thread Group**: Defines number of users, ramp-up time, loop count
- **Samplers**: HTTP Request, JDBC, FTP, etc.
- **Listeners**: View results (Table, Tree, Graph, Summary Report)
- **Controllers**: Logic to control request execution
  - **If Controller**: Conditional execution
  - **Loop Controller**: Repeat requests N times
  - **Random Controller**: Execute one random child per iteration
  - **Transaction Controller**: Group requests as a single transaction

```xml
<!-- JMeter Test Plan (XML) -->
<!-- Key elements: ThreadGroup, HTTP Request Defaults, Samplers, Listeners -->
<!-- View Results Tree: Debug response data -->
<!-- Summary Report: Aggregate TPS, latency, error rate -->

<!-- Example: 100 users, 10s ramp-up, 5 iterations each -->
<ThreadGroup>
  <stringProp name="ThreadGroup.num_threads">100</stringProp>
  <stringProp name="ThreadGroup.ramp_time">10</stringProp>
  <stringProp name="ThreadGroup.loop_count">5</stringProp>
</ThreadGroup>
```

```bash
# Run JMeter in CLI mode
jmeter -n -t test-plan.jmx -l results.jtl -e -o ./html-report

# Flags:
# -n    : Non-GUI mode
# -t    : Test plan file
# -l    : Results file (.jtl)
# -e    : Generate HTML report after test
# -o    : Output folder for report
```

**JMeter Architecture:**

```
ThreadGroup (100 threads)
  └─ Once Only Controller (Login)
  │    └─ HTTP Request: POST /api/auth/login
  │         └─ JSON Extractor: extract token
  │
  └─ Loop Controller (10 iterations)
       └─ HTTP Request: GET /api/products
       └─ HTTP Request: POST /api/cart
       └─ Transaction Controller: Checkout
            ├─ HTTP Request: GET /api/checkout
            └─ HTTP Request: POST /api/order
```

### 9.4. k6 (Grafana k6)

k6 is a modern, developer-friendly load testing tool written in Go. Scripts are written in JavaScript.

```javascript
// k6 script example
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');
const responseTime = new Trend('response_time');

export const options = {
  stages: [
    { duration: '30s', target: 100 },  // Ramp up to 100 VUs
    { duration: '1m', target: 100 },  // Stay at 100 VUs
    { duration: '30s', target: 200 },  // Spike to 200 VUs
    { duration: '30s', target: 0 },    // Ramp down
  ],

  thresholds: {
    // Assertions on metrics
    'http_req_duration': ['p(95)<500', 'p(99)<1000'],  // 95th < 500ms, 99th < 1s
    'http_req_failed': ['rate<0.01'],                    // Error rate < 1%
    'errors': ['rate<0.05'],                             // Custom metric
  },
};

const BASE_URL = 'https://api.example.com';

export default function () {
  // Setup - runs once per VU
  const loginRes = http.post(`${BASE_URL}/auth/login`, JSON.stringify({
    email: `user${__VU}@example.com`,
    password: 'password123',
  }), {
    headers: { 'Content-Type': 'application/json' },
  });

  check(loginRes, {
    'login status 200': (r) => r.status === 200,
    'has token': (r) => r.json('accessToken') !== '',
  }) || errorRate.add(1);

  const token = loginRes.json('accessToken');

  // Main test
  const productsRes = http.get(`${BASE_URL}/products`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  responseTime.add(productsRes.timings.duration);
  check(productsRes, {
    'products loaded': (r) => r.status === 200,
    'has products': (r) => r.json('data').length > 0,
  }) || errorRate.add(1);

  sleep(1);
}
```

```bash
# Run k6 test
k6 run script.js

# Run with cloud (k6 Cloud)
k6 cloud script.js

# Run with config file
k6 run --config k6-config.yaml script.js

# Output to JSON
k6 run --out json=results.json script.js
```

### 9.5. Gatling

Gatling is a load testing tool written in Scala. It uses a DSL for writing test scenarios.

```scala
// Gatling Scala script
package simulations

import io.gatling.core.Predef._
import io.gatling.http.Predef._
import scala.concurrent.duration._

class BasicSimulation extends Simulation {

  // HTTP configuration
  val httpProtocol = http
    .baseUrl("https://api.example.com")
    .acceptHeader("application/json")
    .header("Authorization", "Bearer ${token}")

  // Define scenarios
  val userScenario = scenario("User Journey")
    .exec(
      http("Login")
        .post("/auth/login")
        .body(StringBody("""{"email":"user@example.com","password":"password123"}"""))
        .asJson
        .check(jsonPath("$.accessToken").saveAs("token"))
    )
    .pause(2)
    .exec(
      http("Get Products")
        .get("/products")
        .check(status.is(200))
    )
    .pause(1)
    .exec(
      http("Add to Cart")
        .post("/cart/items")
        .body(StringBody("""{"productId":"p1","quantity":2}"""))
        .asJson
    )
    .exec(
      http("Checkout")
        .post("/orders")
        .body(StringBody("""{"address":"123 Main St"}"""))
        .asJson
        .check(status in 200..299)
    )

  // Load simulation configuration
  setUp(
    userScenario
      .inject(
        // Ramp users over time
        rampUsers(500).during(30.seconds),
        // Constant users for duration
        constantUsersPerSec(100).during(2.minutes),
        // Stress test
        rampUsers(1000).during(30.seconds)
      )
      .protocols(httpProtocol)
  )
  .assertions(
    global.responseTime.percentile(95).lt(500),
    global.responseTime.percentile(99).lt(1000),
    global.successfulRequests.percent.gt(99),
    global.allRequests.count.gt(10000)
  )
}
```

```bash
# Run Gatling
gatling.sh -sf src/test/resources -rf results -s simulations.BasicSimulation

# Maven/Gradle plugin
# mvn gatling:test
# gradle gatlingRun
```

### 9.6. Artillery

Artillery is a modern load testing tool that uses YAML configuration.

```yaml
# artillery.yml
config:
  target: "https://api.example.com"
  phases:
    - duration: 60
      arrivalRate: 10
      name: "Warm up"
    - duration: 120
      arrivalRate: 50
      name: "Sustained load"
    - duration: 30
      arrivalRate: 200
      name: "Stress test"

  plugins:
    expect: {}
    metrics-by-endpoint: {}

  defaults:
    headers:
      Content-Type: application/json
      Authorization: "Bearer {{ token }}"

  environments:
    staging:
      target: "https://staging-api.example.com"
      variables:
        token: "staging-token-xxx"
    production:
      target: "https://api.example.com"
      variables:
        token: "prod-token-xxx"

scenarios:
  - name: "User Journey"
    flow:
      - post:
          url: "/auth/login"
          json:
            email: "user@example.com"
            password: "password123"
          capture:
            - json: "$.accessToken"
              as: "token"

      - think: 1

      - get:
          url: "/products"
          beforeRequest: "generateToken"
          expect:
            - statusCode: 200
            - contentType: application/json

      - post:
          url: "/cart/items"
          json:
            productId: "p1"
            quantity: 2
          expect:
            - statusCode: 201

      - post:
          url: "/orders"
          json:
            address: "123 Main Street"
          expect:
            - statusCode: 201
            - has: "$.orderId"
```

```bash
# Run with YAML
artillery run artillery.yml

# Run with environment
artillery run artillery.yml --environment staging

# Run quick check (1 phase, 1 VU)
artillery quick --duration 10 --rate 10 https://api.example.com/health

# Generate HTML report
artillery report results.json
```

### 9.7. Performance Testing Process

```
1. Requirements Gathering
   ├── Define SLOs / SLAs
   ├── Identify critical user journeys
   └── Set performance criteria (response time, throughput, error rate)

2. Planning
   ├── Choose tools (JMeter, k6, Gatling, Artillery)
   ├── Design test scenarios
   └── Define load profiles (users, ramp-up, duration)

3. Scripting
   ├── Record or script user journeys
   ├── Parameterize data (CSV, random, functions)
   ├── Add assertions / checks
   └── Configure correlation (extract session/token)

4. Execution
   ├── Run smoke test (small load)
   ├── Run load test (expected load)
   ├── Run stress/spike tests (edge cases)
   └── Monitor server metrics (CPU, memory, network)

5. Analysis
   ├── Collect metrics (response time, throughput, errors)
   ├── Analyze bottlenecks (DB, network, GC, thread pool)
   ├── Compare against baselines
   └── Generate report

6. Optimization & Retest
   ├── Tune JVM, DB, cache, connection pools
   ├── Re-run tests
   └── Validate improvements
```

### 9.8. APM Tools

APM (Application Performance Monitoring) tools help identify bottlenecks in production and test environments.

| Tool | Description | Strength |
|------|-------------|----------|
| **New Relic** | Full-stack observability | User-friendly dashboards, APM + infrastructure |
| **Datadog** | Cloud-scale monitoring | Logs, traces, metrics in one platform |
| **Dynatrace** | AI-powered observability | Automatic root cause analysis |
| **Elastic APM** | Open-source APM | Self-hosted, flexible |
| **Pinpoint** | Open-source APM (Naver) | Distributed tracing, low overhead |
| **Jaeger** | Open-source distributed tracing | Request flow visualization |

**New Relic Example:**

```javascript
// New Relic Browser Agent (auto-instrument)
newrelic.setCustomAttribute('userId', userId);
newrelic.setCustomAttribute('plan', 'premium');

// Track AJAX errors
newrelic.noticeError(new Error('API failed'), {
  endpoint: '/api/products',
  statusCode: 500,
});
```

**Datadog APM Example:**

```javascript
// Trace a function
const tracer = require('dd-trace').init();

tracer.trace('my.operation', (span) => {
  span.setTag('user.id', userId);
  span.setTag('feature', 'checkout');
  // ... operation code
  span.finish();
});
```

---

## 10. SonarQube / SonarCloud

### 10.1. What is SonarQube?

> **SonarQube** is an open-source platform for **static code analysis** — it scans source code to detect bugs, vulnerabilities, code smells, security hotspots, and measure code quality over time.

### 10.2. SonarQube Architecture

```
┌──────────────────────────────────────────────────────────┐
│                        Client                             │
│   SonarScanner (Maven, Gradle, CLI, MSBuild, GitHub)     │
└──────────────────────────┬───────────────────────────────┘
                           │ Analyze & Push
                           ▼
┌──────────────────────────────────────────────────────────┐
│                    SonarQube Server                       │
│                                                           │
│  ┌─────────────────┐  ┌─────────────────────────────┐    │
│  │   Web Server    │  │        Compute Engine        │    │
│  │  (Dashboard,    │  │  (Analysis processing,       │    │
│  │   Rules,       │  │   Quality Gates, issues       │    │
│  │   Projects)    │  │   computation)                │    │
│  └────────┬────────┘  └──────────────┬────────────────┘    │
│           │                          │                    │
│           └──────────┬───────────────┘                    │
│                      ▼                                    │
│           ┌─────────────────────┐                          │
│           │      Database       │                         │
│           │  (PostgreSQL/MySQL)  │                         │
│           │  Projects, Issues,   │                         │
│           │  Rules, History      │                         │
│           └─────────────────────┘                          │
└──────────────────────────────────────────────────────────┘
```

### 10.3. Key Concepts

| Concept | Description |
|---------|-------------|
| **Bug** | Coding mistake that will produce wrong behavior |
| **Vulnerability** | Security weakness that can be exploited |
| **Code Smell** | Code that is difficult to maintain (not wrong) |
| **Security Hotspot** | Security-sensitive code that needs human review |
| **Duplications** | Repeated code blocks |
| **Coverage** | Test coverage percentage from unit tests |

### 10.4. Quality Gates

A **Quality Gate** is a set of conditions that a project must meet to be considered release-ready.

| Metric | Rating Thresholds |
|--------|-------------------|
| **Bugs** | 0 (Blocker), open bugs < 5 (Critical) |
| **Vulnerabilities** | 0 (Blocker) |
| **Code Smells** | Maintainability Rating >= A |
| **Coverage** | Line coverage >= 80% (configurable) |
| **Duplications** | Duplicated lines < 3% |
| **Security Hotspots** | Reviewed >= 100% |

**Quality Gate Example:**

```json
{
  "name": "Release Gate",
  "metrics": [
    { "key": "new_bugs", "op": ">", "value": 0, "error": "Must have 0 new bugs" },
    { "key": "new_vulnerabilities", "op": ">", "value": 0, "error": "Must have 0 new vulnerabilities" },
    { "key": "new_code_smells", "op": ">", "value": 50, "error": "Too many code smells" },
    { "key": "coverage", "op": "<", "value": 80, "error": "Coverage must be >= 80%" },
    { "key": "duplicated_lines_density", "op": ">", "value": 3, "error": "Duplication > 3%" }
  ]
}
```

### 10.5. Security Hotspots vs Vulnerabilities

| Category | Description | Action |
|----------|-------------|--------|
| **Vulnerability** | Exploitable weakness (e.g., SQL injection) | Fix before release |
| **Security Hotspot** | Security-sensitive code needing review (e.g., crypto usage) | Review and mark as "Safe" |

**Security Hotspot Review:**

```java
// Security Hotspot: Weak cryptographic algorithm
import javax.crypto.Cipher;
import java.security.Key;

// HOTSPOT: DES is considered insecure
public String decrypt(String data, Key key) {
    // This is a Security Hotspot - needs human review
    // Reviewer should confirm: Is this legacy code? Is DES intentional?
    // Mark as "Safe" if acceptable, or "Fixed" if changed
    Cipher cipher = Cipher.getInstance("DES");
    cipher.init(Cipher.DECRYPT_MODE, key);
    return new String(cipher.doFinal(Base64.decode(data)));
}
```

### 10.6. Maintainability, Reliability, Security Ratings

SonarQube assigns letter grades (A-D) based on metrics:

| Rating | Score Range | Meaning |
|--------|-------------|---------|
| **A** | 0 bugs / 0 vulnerabilities | Excellent |
| **B** | Few issues | Good |
| **C** | Moderate issues | Needs attention |
| **D** | Many issues | Poor |

**Reliability Rating:**

- **A**: 0 bugs
- **B**: at least 1 minor bug
- **C**: at least 1 major bug
- **D**: at least 1 critical bug
- **E**: at least 1 blocker bug

**Maintainability Rating:** Based on code smell debt (in days). E.g., A = debt < 0, B = debt < 5 days.

**Security Rating:** Same A-E scale based on vulnerabilities.

### 10.7. Clean as You Code

**Clean as You Code** is SonarQube's approach to code quality:

> Focus on fixing issues in **new code** rather than addressing all legacy code at once.

- Every pull request / commit should not introduce new issues
- Quality Gate fails if new code has bugs, vulnerabilities, or poor maintainability
- Existing issues are tracked separately (they decay in severity over time conceptually)

**Best Practice:** Set your Quality Gate to fail on **new code** issues, not just overall code.

### 10.8. SonarScanner Integration

```bash
# Install SonarScanner CLI
# Download from https://docs.sonarqube.org/latest/analysis/scan/sonarscanner/

# Run analysis
sonar-scanner \
  -Dsonar.projectKey=my-project \
  -Dsonar.sources=./src \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.token=sqp_xxxxxxxxxxxxxxxxxx
```

**Maven:**

```xml
<!-- pom.xml -->
<properties>
  <sonar.host.url>https://sonarcloud.io</sonar.host.url>
  <sonar.projectKey>my-org_my-project</sonar.projectKey>
  <sonar.organization>my-org</sonar.organization>
  <sonar.token>${SONAR_TOKEN}</sonar.token>
</properties>

<build>
  <plugins>
    <plugin>
      <groupId>org.sonarsource.scanner.maven</groupId>
      <artifactId>sonar-maven-plugin</artifactId>
      <version>3.9.1.2184</version>
    </plugin>
  </plugins>
</build>

<!-- Run -->
mvn verify sonar:sonar
```

**Gradle:**

```groovy
// build.gradle
plugins {
    id "org.sonarqube" version "4.4.0.3356"
}

sonarqube {
    properties {
        property "sonar.projectKey", "my-org_my-project"
        property "sonar.organization", "my-org"
        property "sonar.host.url", "https://sonarcloud.io"
    }
}

// Run
./gradlew sonar
```

**Node.js / npm:**

```bash
# Install
npm install --save-dev sonar-scanner

# package.json scripts
{
  "scripts": {
    "sonar": "sonar-scanner"
  }
}

# .sonarcloud.properties or sonar-project.properties
sonar.projectKey=my-org_my-project
sonar.sources=src
sonar.tests=src/__tests__
sonar.javascript.lcov.reportPath=coverage/lcov.info
sonar.coverage.exclusions=src/**/*.test.ts
```

### 10.9. CI/CD Integration

**GitHub Actions:**

```yaml
# .github/workflows/sonar.yml
name: SonarCloud Analysis

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  sonarcloud:
    name: SonarCloud
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0  # Need full history for true new code analysis

      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Run tests with coverage
        run: npm test -- --coverage

      - name: SonarCloud Scan
        uses: SonarSource/sonarcloud-github-action@master
        env:
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
          SONAR_ORGANIZATION: ${{ secrets.SONAR_ORGANIZATION }}
```

**Jenkins:**

```groovy
// Jenkinsfile
pipeline {
    agent any

    environment {
        SONAR_TOKEN = credentials('sonar-token')
    }

    stages {
        stage('Checkout') {
            steps { checkout scm }
        }

        stage('Build & Test') {
            steps {
                sh 'mvn clean verify'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh '''
                        mvn sonar:sonar \
                            -Dsonar.host.url=http://sonarqube:9000 \
                            -Dsonar.token=$SONAR_TOKEN
                    '''
                }
            }
        }

        stage('Quality Gate') {
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }
    }
}
```

### 10.10. SonarCloud vs SonarQube

| Feature | SonarCloud | SonarQube |
|---------|------------|-----------|
| Hosting | Cloud (SaaS) | Self-hosted |
| Maintenance | None (managed) | You manage server, DB, upgrades |
| Cost | Free for open source, paid plans for private | Free (Community Edition) |
| CI/CD | Native GitHub/GitLab/Bitbucket integration | Any CI via SonarScanner |
| Languages | All major languages | All major languages |

---

## 11. Testing in CI/CD Pipeline

### 11.1. Complete CI/CD Pipeline with Testing

A production CI/CD pipeline typically includes testing at multiple stages:

```
┌─────────────────────────────────────────────────────────────┐
│                     CI/CD Pipeline                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. Checkout                                                │
│     └─ Clone repo, fetch history                            │
│                                                             │
│  2. Lint / Code Quality                                    │
│     ├─ ESLint / Prettier (JS)                               │
│     ├─ Pylint / Black (Python)                              │
│     └─ Checkstyle / SpotBugs (Java)                         │
│     └─ SonarQube Scan (quality gate check)                  │
│                                                             │
│  3. Build                                                   │
│     ├─ Compile / Bundle                                     │
│     ├─ Dependency check (npm audit, Snyk)                  │
│     └─ Docker image build                                   │
│                                                             │
│  4. Unit Tests                                             │
│     ├─ Fast (< 5 min)                                      │
│     ├─ Code coverage collection                            │
│     └─ Coverage gate (e.g., >= 80%)                        │
│                                                             │
│  5. Integration Tests                                      │
│     ├─ API tests (Postman/Newman)                          │
│     ├─ Database integration                                │
│     └─ Service-to-service integration                      │
│                                                             │
│  6. E2E Tests (Playwright/Cypress)                         │
│     ├─ Smoke tests (critical paths only)                   │
│     └─ Run in parallel if possible                          │
│                                                             │
│  7. SonarQube Analysis                                      │
│     ├─ Upload coverage to SonarQube                        │
│     ├─ Quality Gate evaluation                             │
│     └─ Fail pipeline if gate fails                         │
│                                                             │
│  8. Security Scan                                           │
│     ├─ SAST (Static Application Security Testing)          │
│     ├─ Dependency vulnerability scan                       │
│     └─ Container image scan (Trivy, Snyk)                  │
│                                                             │
│  9. Deploy                                                  │
│     ├─ Staging / Pre-production (auto)                    │
│     └─ Production (manual approval or automated)           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 11.2. GitHub Actions Example

```yaml
# .github/workflows/ci.yml
name: CI Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '20'
  COVERAGE_THRESHOLD: 80

jobs:
  # ─── Lint & Type Check ───────────────────────────────────────
  lint:
    name: Lint & Type Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - run: npm ci

      - run: npm run lint
      - run: npm run type-check

  # ─── Unit Tests ──────────────────────────────────────────────
  test-unit:
    name: Unit Tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - run: npm ci

      - name: Run unit tests with coverage
        run: npm test -- --coverage --coverageThreshold='{"global":{"lines":${{ env.COVERAGE_THRESHOLD }}}}'

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          token: ${{ secrets.CODECOV_TOKEN }}

      - name: Upload test results
        uses: actions/upload-artifact@v4
        with:
          name: jest-results
          path: coverage/

  # ─── SonarQube ───────────────────────────────────────────────
  sonar:
    name: SonarCloud Analysis
    runs-on: ubuntu-latest
    needs: test-unit
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - run: npm ci

      - name: Run tests (coverage only, no watchers)
        run: npm run test:ci

      - name: SonarCloud Scan
        uses: SonarSource/sonarcloud-github-action@master
        env:
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}

  # ─── E2E Tests ───────────────────────────────────────────────
  test-e2e:
    name: E2E Tests (Playwright)
    runs-on: ubuntu-latest
    needs: [lint, test-unit]
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Start server
        run: npm start &

      - name: Run E2E tests
        run: npx playwright test

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/

  # ─── Build & Deploy ───────────────────────────────────────────
  build:
    name: Build Docker Image
    runs-on: ubuntu-latest
    needs: [lint, test-unit, sonar]
    steps:
      - uses: actions/checkout@v4

      - name: Build Docker image
        run: |
          docker build -t myapp:${{ github.sha }} .

      - name: Run Trivy vulnerability scanner
        run: |
          docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
            aquasec/trivy:latest image --severity HIGH,CRITICAL \
            myapp:${{ github.sha }}

      - name: Push to registry
        run: |
          echo ${{ secrets.DOCKER_TOKEN }} | docker login -u ${{ secrets.DOCKER_USER }} --password-stdin
          docker push myapp:${{ github.sha }}
```

### 11.3. Code Coverage Reporting in CI

**Collecting coverage from unit tests:**

```bash
# Jest
npm test -- --coverage --coverageReporters=lcov

# This generates:
# coverage/lcov.info  (for SonarQube / Codecov)
# coverage/lcov-report/  (HTML report)
# coverage/coverage-summary.json  (CI gate check)
```

**Coverage Gate in CI:**

```javascript
// threshold-check.js — run after tests
const coverage = require('./coverage/coverage-summary.json');

const thresholds = {
  lines: 80,
  statements: 80,
  functions: 80,
  branches: 70,
};

let failed = false;
for (const [key, value] of Object.entries(thresholds)) {
  const actual = coverage.total[key].pct;
  if (actual < value) {
    console.error(`Coverage ${key}: ${actual}% (expected >= ${value}%)`);
    failed = true;
  } else {
    console.log(`Coverage ${key}: ${actual}% OK`);
  }
}

if (failed) {
  process.exit(1);
}
```

**Uploading to SonarQube from CI:**

```bash
# Generate LCOV coverage report, then:
sonar-scanner \
  -Dsonar.projectKey=my-project \
  -Dsonar.sources=src \
  -Dsonar.tests=src/__tests__ \
  -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info \
  -Dsonar.host.url=https://sonarcloud.io \
  -Dsonar.token=$SONAR_TOKEN
```

### 11.4. Quality Gates in Pipeline

Quality gates act as checkpoints that must pass before proceeding.

```
Pipeline: Build → Test → SonarQube → Security Scan → Deploy

Quality Gate 1 (after Test):
  ✅ Unit test pass rate >= 99%
  ✅ Coverage >= 80%
  ✅ No new critical bugs

Quality Gate 2 (after SonarQube):
  ✅ Quality Gate passed (SonarQube)
  ✅ No new vulnerabilities
  ✅ No unreviewed Security Hotspots
  ✅ Maintainability rating >= B

Quality Gate 3 (after Security Scan):
  ✅ No critical/high CVEs in dependencies
  ✅ No secrets detected in code
  ✅ Container image has no critical vulnerabilities
```

**Enforce in GitHub Actions:**

```yaml
# Gate 1: Unit test pass rate
- name: Check test results
  run: |
    PASS_RATE=$(echo "${{ secrets.TEST_RESULTS }}" | jq '.total.tests' )
    echo "Total tests: $PASS_RATE"
    if [ $PASS_RATE -lt 100 ]; then
      echo "Some tests failed"
      exit 1
    fi

# Gate 2: SonarQube quality gate
- name: Check Quality Gate
  run: |
    # Wait for SonarQube to process
    sleep 30
    # Query quality gate status via API
    curl -s -u $SONAR_TOKEN: \
      "https://sonarcloud.io/api/qualitygates/project_status?projectKey=my-org_my-project" \
      | jq -e '.projectStatus.status == "OK"' || exit 1

# Gate 3: Security scan
- name: Run Snyk security scan
  uses: snyk/actions/node@master
  with:
    args: --severity-threshold=high --fail-on=all
  env:
    SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
```

### 11.5. Best Practices for Testing in CI

| Practice | Description |
|----------|-------------|
| **Fail fast** | Run fastest tests first (lint, unit) |
| **Parallelize** | Run independent jobs in parallel |
| **Caching** | Cache dependencies, node_modules, build artifacts |
| **Short feedback loop** | E2E tests only for critical paths in CI; full suite nightly |
| **Coverage gate** | Fail pipeline if coverage drops below threshold |
| **SonarQube gate** | Fail pipeline if quality gate fails |
| **Immutable artifacts** | Build Docker image once, deploy same image to all environments |
| **Environment parity** | Use same process for staging and production deployments |
| **Test data management** | Use test databases, factories, fixtures — never production data |

