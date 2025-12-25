import { Category } from "./types";

export const otherSkills: Category = {
  id: "other-skills",
  name: { vi: "Kĩ năng khác", en: "Other Skills" },
  description: {
    vi: 'Phân biệt dev "code được" và "làm được việc"',
    en: 'Differentiates "can code" vs "can work"',
  },
  icon: "🛡️",
  topics: [
    {
      id: "testing",
      name: {
        vi: "Unit / Integration / E2E Testing",
        en: "Unit / Integration / E2E Testing",
      },
      content: {
        vi: `# Testing Levels

## Unit Testing

### What?
Test individual units/components in isolation

### Characteristics
- Fast
- Isolated (use mocks)
- Many tests

### Example
Test a single function/method

### Tools
JUnit, pytest, Jest, Mocha

## Integration Testing

### What?
Test interaction between components

### Characteristics
- Slower than unit tests
- Test real integrations
- Database, API calls

### Example
Test service + repository + database

## E2E (End-to-End) Testing

### What?
Test entire application flow from user perspective

### Characteristics
- Slowest
- Most realistic
- Cover complete scenarios

### Example
User login → browse products → checkout

### Tools
Selenium, Cypress, Playwright

## Test Pyramid

**E2E (Few)**  
↑  
**Integration (Some)**  
↑  
**Unit (Many)**

More unit tests, fewer E2E tests`,
        en: `# Testing Levels

## Unit Testing

### What?
Test individual units/components in isolation

### Characteristics
- Fast
- Isolated (use mocks)
- Many tests

### Example
Test a single function/method

### Tools
JUnit, pytest, Jest, Mocha

## Integration Testing

### What?
Test interaction between components

### Characteristics
- Slower than unit tests
- Test real integrations
- Database, API calls

### Example
Test service + repository + database

## E2E (End-to-End) Testing

### What?
Test entire application flow from user perspective

### Characteristics
- Slowest
- Most realistic
- Cover complete scenarios

### Example
User login → browse products → checkout

### Tools
Selenium, Cypress, Playwright

## Test Pyramid

**E2E (Few)**  
↑  
**Integration (Some)**  
↑  
**Unit (Many)**

More unit tests, fewer E2E tests`,
      },
    },
    {
      id: "tdd-bdd",
      name: { vi: "TDD / BDD", en: "TDD / BDD" },
      content: {
        vi: `# TDD / BDD

## TDD (Test-Driven Development)

### Process
1. **Red:** Write failing test
2. **Green:** Write minimal code to pass
3. **Refactor:** Improve code

### Benefits
- Better design
- High test coverage
- Confidence in changes

### Challenges
- Time investment
- Learning curve

## BDD (Behavior-Driven Development)

### What?
Extension of TDD, focus on business behavior

### Gherkin Syntax
\`\`\`gherkin
Feature: User Login
  Scenario: Successful login
    Given user is on login page
    When user enters valid credentials
    Then user should see dashboard
\`\`\`

### Tools
Cucumber, SpecFlow, Behave

### Benefits
- Collaboration với non-technical stakeholders
- Executable specifications
- Living documentation

## TDD vs BDD
- TDD: Technical, unit level
- BDD: Business, feature level`,
        en: `# TDD / BDD

## TDD (Test-Driven Development)

### Process
1. **Red:** Write failing test
2. **Green:** Write minimal code to pass
3. **Refactor:** Improve code

### Benefits
- Better design
- High test coverage
- Confidence in changes

### Challenges
- Time investment
- Learning curve

## BDD (Behavior-Driven Development)

### What?
Extension of TDD, focuses on business behavior

### Gherkin Syntax
\`\`\`gherkin
Feature: User Login
  Scenario: Successful login
    Given user is on login page
    When user enters valid credentials
    Then user should see dashboard
\`\`\`

### Tools
Cucumber, SpecFlow, Behave

### Benefits
- Collaboration with non-technical stakeholders
- Executable specifications
- Living documentation

## TDD vs BDD
- TDD: Technical, unit level
- BDD: Business, feature level`,
      },
    },
    {
      id: "code-review",
      name: { vi: "Code Review", en: "Code Review" },
      content: {
        vi: `# Code Review

## Benefits

### Quality
- Catch bugs early
- Ensure standards
- Share knowledge

### Collaboration
- Team learning
- Better communication
- Consistent code style

## Best Practices

### For Author
- Keep changes small
- Write clear description
- Self-review first
- Respond constructively

### For Reviewer
- Be respectful và constructive
- Look for logic, not style (use linter)
- Ask questions
- Approve promptly

## What to Review?

### Functionality
- Logic correctness
- Edge cases handled
- Requirements met

### Code Quality
- Readability
- Maintainability
- Performance

### Security
- Input validation
- Authentication/Authorization
- Sensitive data handling

### Tests
- Adequate coverage
- Test quality

## Tools
GitHub PR, GitLab MR, Bitbucket, Gerrit`,
        en: `# Code Review

## Benefits

### Quality
- Catch bugs early
- Ensure standards
- Share knowledge

### Collaboration
- Team learning
- Better communication
- Consistent code style

## Best Practices

### For Author
- Keep changes small
- Write clear description
- Self-review first
- Respond constructively

### For Reviewer
- Be respectful and constructive
- Look for logic, not style (use linter)
- Ask questions
- Approve promptly

## What to Review?

### Functionality
- Logic correctness
- Edge cases handled
- Requirements met

### Code Quality
- Readability
- Maintainability
- Performance

### Security
- Input validation
- Authentication/Authorization
- Sensitive data handling

### Tests
- Adequate coverage
- Test quality

## Tools
GitHub PR, GitLab MR, Bitbucket, Gerrit`,
      },
    },
    {
      id: "owasp",
      name: { vi: "OWASP Top 10", en: "OWASP Top 10" },
      content: {
        vi: `# OWASP Top 10

## Top Security Risks

### 1. Broken Access Control
Users truy cập resources mà không có quyền

**Prevention:** Enforce access controls, deny by default

### 2. Cryptographic Failures
Weak encryption, plain text passwords

**Prevention:** Use strong algorithms, HTTPS, encrypt sensitive data

### 3. Injection
SQL, NoSQL, Command injection

**Prevention:** Parameterized queries, input validation

### 4. Insecure Design
Thiếu security controls từ đầu

**Prevention:** Threat modeling, secure design patterns

### 5. Security Misconfiguration
Default configs, verbose errors, unnecessary features

**Prevention:** Hardening, remove defaults, minimal permissions

### 6. Vulnerable Components
Using libraries với known vulnerabilities

**Prevention:** Keep dependencies updated, monitor CVEs

### 7. Authentication Failures
Weak passwords, no MFA, session issues

**Prevention:** Strong password policy, MFA, secure session management

### 8. Data Integrity Failures
Không verify data integrity

**Prevention:** Digital signatures, integrity checks

### 9. Logging Failures
Insufficient logging, monitoring

**Prevention:** Log security events, monitor, alert

### 10. Server-Side Request Forgery (SSRF)
Server fetches remote resource mà không validate

**Prevention:** Validate URLs, whitelist, network segmentation`,
        en: `# OWASP Top 10

## Top Security Risks

### 1. Broken Access Control
Users access resources without permission

**Prevention:** Enforce access controls, deny by default

### 2. Cryptographic Failures
Weak encryption, plain text passwords

**Prevention:** Use strong algorithms, HTTPS, encrypt sensitive data

### 3. Injection
SQL, NoSQL, Command injection

**Prevention:** Parameterized queries, input validation

### 4. Insecure Design
Lack of security controls from the start

**Prevention:** Threat modeling, secure design patterns

### 5. Security Misconfiguration
Default configs, verbose errors, unnecessary features

**Prevention:** Hardening, remove defaults, minimal permissions

### 6. Vulnerable Components
Using libraries with known vulnerabilities

**Prevention:** Keep dependencies updated, monitor CVEs

### 7. Authentication Failures
Weak passwords, no MFA, session issues

**Prevention:** Strong password policy, MFA, secure session management

### 8. Data Integrity Failures
Not verifying data integrity

**Prevention:** Digital signatures, integrity checks

### 9. Logging Failures
Insufficient logging, monitoring

**Prevention:** Log security events, monitor, alert

### 10. Server-Side Request Forgery (SSRF)
Server fetches remote resource without validation

**Prevention:** Validate URLs, whitelist, network segmentation`,
      },
    },
    {
      id: "agile",
      name: { vi: "Agile / Scrum", en: "Agile / Scrum" },
      content: {
        vi: `# Agile / Scrum

## Agile Manifesto

- Individuals > Processes
- Working software > Documentation
- Customer collaboration > Contract negotiation
- Responding to change > Following plan

## Scrum Framework

### Roles

**Product Owner:** Define features, prioritize backlog

**Scrum Master:** Facilitate, remove impediments

**Development Team:** Self-organizing, cross-functional

### Artifacts

**Product Backlog:** Prioritized list of features

**Sprint Backlog:** Tasks for current sprint

**Increment:** Working product at end of sprint

### Events

**Sprint:** 1-4 weeks iteration

**Sprint Planning:** Plan sprint work

**Daily Standup:** 15-min sync (Yesterday, Today, Blockers)

**Sprint Review:** Demo to stakeholders

**Sprint Retrospective:** Team improvement discussion

## Benefits
- Flexibility
- Fast feedback
- Continuous improvement
- Higher quality`,
        en: `# Agile / Scrum

## Agile Manifesto

- Individuals > Processes
- Working software > Documentation
- Customer collaboration > Contract negotiation
- Responding to change > Following plan

## Scrum Framework

### Roles

**Product Owner:** Define features, prioritize backlog

**Scrum Master:** Facilitate, remove impediments

**Development Team:** Self-organizing, cross-functional

### Artifacts

**Product Backlog:** Prioritized list of features

**Sprint Backlog:** Tasks for current sprint

**Increment:** Working product at end of sprint

### Events

**Sprint:** 1-4 weeks iteration

**Sprint Planning:** Plan sprint work

**Daily Standup:** 15-min sync (Yesterday, Today, Blockers)

**Sprint Review:** Demo to stakeholders

**Sprint Retrospective:** Team improvement discussion

## Benefits
- Flexibility
- Fast feedback
- Continuous improvement
- Higher quality`,
      },
    },
  ],
};
