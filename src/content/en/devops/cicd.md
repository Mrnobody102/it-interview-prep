# DevOps — CI/CD

## 1. CI/CD Overview

**CI/CD** stands for **Continuous Integration** and **Continuous Delivery/Deployment**. It is a methodology that automates the process of integrating code changes, testing, and deploying software.

---

## 2. CI — Continuous Integration

**Continuous Integration** automatically builds and tests code on every commit, detecting integration issues early.

### 2.1. Core Principles

- **Commit frequently** — developers merge code changes multiple times per day
- **Automated builds** — every commit triggers an automated build
- **Automated tests** — unit, integration, and E2E tests run automatically
- **Fast feedback** — developers know immediately if their build fails

### 2.2. Benefits

| Benefit | Description |
|---------|-------------|
| Early bug detection | Catch issues before they reach production |
| Reduced integration risk | Frequent small merges are easier than big merges |
| Faster development | Automated pipeline speeds up the release cycle |
| Higher code quality | Enforced testing standards on every commit |

### 2.3. Popular CI Tools

| Tool | Description |
|------|-------------|
| **GitHub Actions** | Native CI/CD built into GitHub |
| **GitLab CI** | Integrated CI/CD in GitLab |
| **Jenkins** | Open-source, highly customizable |
| **CircleCI** | Cloud-based, fast execution |
| **Travis CI** | GitHub-integrated CI service |
| **Azure Pipelines** | Part of Azure DevOps |

---

## 3. CD — Continuous Delivery vs Deployment

### 3.1. Continuous Delivery

> Code is **always ready to deploy** to production after passing all tests. A **manual approval** step triggers the production deployment.

### 3.2. Continuous Deployment

> Code changes are **automatically deployed** to production after passing all stages of the pipeline. No manual intervention needed.

| | Continuous Delivery | Continuous Deployment |
|--|---------------------|-----------------------|
| **Approval step** | Manual | None (fully automated) |
| **Risk** | Lower (human gate) | Higher (full automation) |
| **Frequency** | Per release | Per commit |

---

## 4. Typical CI/CD Pipeline

### 4.1. Pipeline Stages

```
Commit → Build → Test → Security Scan → Staging Deploy → Production Deploy
  1        2       3         4              5               6
```

| Stage | Description |
|-------|-------------|
| **1. Commit** | Developer pushes code to version control |
| **2. Build** | Compile code, bundle assets, create artifacts |
| **3. Test** | Run unit tests, integration tests, linting |
| **4. Security Scan** | Check dependencies for vulnerabilities |
| **5. Staging Deploy** | Deploy to staging environment for QA |
| **6. Production Deploy** | Deploy to production (auto or manual) |

### 4.2. GitHub Actions Example

```yaml
name: CI Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run unit tests
        run: npm test

      - name: Build
        run: npm run build

      - name: Upload artifacts
        uses: actions/upload-artifact@v4
        with:
          name: dist
          path: dist/

  deploy:
    needs: build-and-test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - name: Deploy to production
        run: |
          echo "Deploying to production server..."
          # Add deployment commands here
```

### 4.3. GitLab CI Example

```yaml
stages:
  - build
  - test
  - deploy

variables:
  NODE_VERSION: "20"

before_script:
  - npm ci

build:
  stage: build
  script:
    - npm run build
  artifacts:
    paths:
      - dist/

test:
  stage: test
  script:
    - npm test
    - npm run lint

deploy_production:
  stage: deploy
  script:
    - echo "Deploying to production..."
  only:
    - main
```

---

## 5. Environment Management

### 5.1. Environments

| Environment | Purpose |
|-------------|---------|
| **Development** | Local development and feature testing |
| **Staging** | Pre-production testing mirror of production |
| **Production** | Live environment serving end users |
| **QA** | Dedicated environment for QA testing |

### 5.2. Branching Strategy

| Strategy | Description |
|----------|-------------|
| **Trunk-based** | All developers commit to a single branch (`main`) frequently |
| **GitFlow** | Use `develop`, `feature/*`, `release/*`, `hotfix/*` branches |
| **GitHub Flow** | Simple model: `main` + feature branches, deploy from `main` |

---

## 6. Deployment Strategies

### 6.1. Rolling Deployment

Gradually replace instances of the previous version with the new version.

### 6.2. Blue-Green Deployment

Maintain two identical environments. Switch traffic from blue (old) to green (new) instantly.

### 6.3. Canary Deployment

Deploy to a small subset of users first, then gradually increase.

### 6.4. Feature Flags

Toggle features on/off without redeploying. Enables gradual rollouts and quick rollbacks.

---

## 7. Interview Questions

**Q: What is the difference between CI and CD?**

> **CI** (Continuous Integration) automates building and testing code on every commit. **CD** (Continuous Delivery/Deployment) automates releasing the code to environments. Delivery requires manual approval; Deployment is fully automated.

**Q: How do you handle secrets in CI/CD?**

> Use secret management tools (AWS Secrets Manager, HashiCorp Vault), or inject secrets via CI/CD environment variables that are encrypted at rest. Never hardcode secrets in pipeline configuration files.

**Q: What is a pipeline artifact?**

> An **artifact** is a file or collection of files produced during a pipeline stage (e.g., a compiled binary, a Docker image). Artifacts can be passed between stages or stored for later retrieval.
