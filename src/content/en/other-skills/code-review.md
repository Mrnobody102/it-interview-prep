# Other Skills — Code Review

## 1. What is Code Review?

**Code review** is the systematic examination of source code by one or more developers other than the author, to identify defects, improve quality, and share knowledge.

---

## 2. Benefits of Code Review

### 2.1. Quality

| Benefit | Description |
|---------|-------------|
| **Catch bugs early** | Defects found in review cost 10x less than in production |
| **Code standards** | Enforce style guides, naming conventions, patterns |
| **Security** | Identify vulnerabilities before deployment |
| **Performance** | Spot inefficient algorithms or queries |

### 2.2. Collaboration

| Benefit | Description |
|---------|-------------|
| **Knowledge sharing** | Team members learn from each other's code |
| **Consistency** | Everyone understands the codebase |
| **Mentorship** | Senior developers guide junior developers |
| **Collective ownership** | The team is responsible for all code |

---

## 3. Best Practices

### 3.1. For the Author

| Practice | Description |
|----------|-------------|
| **Keep changes small** | Aim for <400 lines per PR. Large PRs get less scrutiny |
| **Write clear descriptions** | Explain *what* and *why*, not just *what changed* |
| **Self-review first** | Review your own PR before requesting reviews |
| **Test locally** | Ensure tests pass and the app works before requesting review |
| **Respond to feedback** | Address all comments, even if you disagree — discuss it |
| **Don't take it personally** | Code review critiques code, not people |

### 3.2. For the Reviewer

| Practice | Description |
|----------|-------------|
| **Be respectful and constructive** | Use "Consider..." instead of "You should..." |
| **Be specific** | Explain *why* something is an issue and suggest a fix |
| **Focus on logic, not style** | Use linters for style; focus on correctness and design |
| **Ask questions** | "What happens if the input is empty?" rather than "This is wrong" |
| **Distinguish must-fix vs nice-to-have** | Use prefixes: `[blocking]`, `[nit]`, `[suggestion]` |
| **Approve when ready** | Don't approve just to be nice; don't block for trivial changes |

### 3.3. Commenting Conventions

```
[blocking]  — Must be fixed before merge
[nit]       — Minor style/formatting issue (optional fix)
[suggestion] — Optional improvement idea
[question]  — Seeking understanding, not necessarily a change
[praise]    — Acknowledging good work
```

---

## 4. What to Review?

### 4.1. Functionality

| Check | Description |
|-------|-------------|
| **Logic correctness** | Does the code do what it's supposed to? |
| **Edge cases** | Empty inputs, null values, boundary conditions |
| **Requirements met** | Does the implementation match the ticket? |
| **Error handling** | Are errors handled gracefully? |

### 4.2. Code Quality

| Check | Description |
|-------|-------------|
| **Readability** | Is the code easy to understand? |
| **Maintainability** | Will future developers understand this? |
| **Performance** | Any N+1 queries, unnecessary loops, inefficient algorithms? |
| **Reusability** | Duplicated logic that could be extracted? |
| **Single responsibility** | Is each function/module doing one thing? |

### 4.3. Security

| Check | Description |
|-------|-------------|
| **Input validation** | Are all inputs sanitized and validated? |
| **Authentication/Authorization** | Is access properly controlled? |
| **Sensitive data** | No secrets, credentials, or PII in code? |
| **SQL/NoSQL injection** | Are queries parameterized? |
| **XSS prevention** | Is user input properly escaped? |

### 4.4. Tests

| Check | Description |
|-------|-------------|
| **Coverage** | Are critical paths tested? |
| **Test quality** | Are tests testing behavior or implementation? |
| **Edge cases** | Are boundary conditions tested? |
| **No false positives** | Do tests actually fail when code breaks? |

---

## 5. Tools

| Tool | Platform | Description |
|------|----------|-------------|
| **GitHub Pull Requests** | GitHub | Code review with inline comments, approvals |
| **GitLab Merge Requests** | GitLab | Similar to PRs with built-in CI/CD |
| **Bitbucket Pull Requests** | Bitbucket | Code review for Atlassian ecosystem |
| **Gerrit** | Self-hosted | Gerrit code review for large projects |
| **Phabricator** | Self-hosted | Differential for code review |
| **SonarQube** | CI/CD integration | Automated code quality and security analysis |
| **ESLint / Prettier** | IDE / CI | Automatic style and linting checks |

---

## 6. Code Review Checklist

### Pre-Merge Checklist

```
Functionality
  [ ] Logic is correct and matches requirements
  [ ] Edge cases are handled
  [ ] Error handling is appropriate
  [ ] No dead code or commented-out code

Code Quality
  [ ] Code follows project style guide
  [ ] Functions are reasonably sized (<50 lines ideally)
  [ ] Variable and function names are descriptive
  [ ] No code duplication without justification
  [ ] Complex logic has comments explaining "why"

Performance & Security
  [ ] No N+1 query problems
  [ ] No sensitive data exposed in logs or responses
  [ ] User input is validated and sanitized
  [ ] Proper authentication/authorization checks

Tests
  [ ] New functionality has tests
  [ ] Tests cover edge cases
  [ ] Existing tests still pass
  [ ] No test skipped/disabled unnecessarily

Documentation
  [ ] Public APIs have documentation
  [ ] Complex algorithms have explanatory comments
  [ ] CHANGELOG updated if needed
```

---

## 7. Interview Questions

**Q: How do you handle disagreements during code review?**

> Discuss the trade-offs objectively. Reference project standards, performance data, or maintainability concerns. If still unclear, involve a third senior developer for a tiebreaker. The goal is better code, not winning an argument.

**Q: How do you review code you don't understand?**

> Ask clarifying questions in comments. Read related tests, documentation, or the surrounding codebase. Don't approve code you don't understand — it could hide bugs or architectural issues.

**Q: How many reviewers should a PR have?**

> Generally 1-3 reviewers. At least one person with domain expertise. Too many reviewers slow things down; too few misses perspectives. Large changes may need more specialized reviewers.
