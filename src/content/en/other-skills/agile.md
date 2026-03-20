# Other Skills — Agile / Scrum

## 1. Agile Manifesto

**Agile** is a set of principles for software development under which requirements and solutions evolve through the collaborative effort of self-organizing and cross-functional teams.

### 1.1. The Four Values

| Instead of... | We value... |
|--------------|-------------|
| Processes and tools | **Individuals and interactions** |
| Comprehensive documentation | **Working software** |
| Contract negotiation | **Customer collaboration** |
| Following a plan | **Responding to change** |

### 1.2. The Twelve Principles

1. Satisfy the customer through **early and continuous delivery** of valuable software
2. **Welcome changing requirements**, even late in development
3. Deliver working software **frequently**
4. Business people and developers must **work together daily**
5. Build projects around **motivated individuals** and trust them
6. Face-to-face conversation is the most efficient form of communication
7. **Working software** is the primary measure of progress
8. Promote **sustainable development** — maintain a constant pace indefinitely
9. Continuous attention to **technical excellence** and good design
10. **Simplicity** — maximize the amount of work not done
11. Self-organizing teams produce the best designs
12. Regular reflection and adjustment of team behavior

---

## 2. Scrum Framework

**Scrum** is the most popular Agile framework. It uses fixed-length iterations called **Sprints** (usually 1-4 weeks).

---

## 3. Scrum Roles

| Role | Responsibility |
|------|---------------|
| **Product Owner** | Defines features, prioritizes the backlog, maximizes product value |
| **Scrum Master** | Facilitates Scrum events, removes impediments, coaches the team |
| **Development Team** | Self-organizing, cross-functional group that delivers potentially shippable increments |

---

## 4. Scrum Artifacts

| Artifact | Description |
|----------|-------------|
| **Product Backlog** | Ordered list of everything that might be in the product |
| **Sprint Backlog** | Product Backlog items selected for the Sprint + Sprint Goal |
| **Increment** | The sum of all completed Product Backlog items during a Sprint |

---

## 5. Scrum Events

### 5.1. Sprint

A time-boxed iteration (1-4 weeks) during which an **Increment** is created. The Sprint has a consistent duration throughout development.

### 5.2. Sprint Planning

| Aspect | Description |
|--------|-------------|
| **Duration** | Max 8 hours for a 1-month Sprint |
| **Purpose** | Define the Sprint Goal and plan the work |
| **Inputs** | Product Backlog, velocity, team capacity |
| **Output** | Sprint Backlog with a plan to deliver the goal |

### 5.3. Daily Standup

| Aspect | Description |
|--------|-------------|
| **Duration** | 15 minutes max |
| **Purpose** | Synchronize the team and identify blockers |
| **Format** | Each team member answers: What did I do? What will I do? Any blockers? |

> **Note**: Standups are for coordination, not status reporting to a manager. The team self-manages.

### 5.4. Sprint Review

| Aspect | Description |
|--------|-------------|
| **Duration** | Max 4 hours for a 1-month Sprint |
| **Purpose** | Inspect the Increment and adapt the Product Backlog |
| **Participants** | Development Team, Product Owner, stakeholders |
| **Output** | Shared understanding of what was built and feedback for next Sprint |

### 5.5. Sprint Retrospective

| Aspect | Description |
|--------|-------------|
| **Duration** | Max 3 hours for a 1-month Sprint |
| **Purpose** | Inspect and adapt the team's process |
| **Focus** | What went well? What could improve? What will we commit to improving? |

---

## 6. User Stories

### 6.1. Format

```
As a [role]
I want [goal]
so that [benefit/value]
```

### 6.2. Example User Stories

```
As a user,
I want to reset my password via email,
so that I can regain access to my account if I forget it.

As an admin,
I want to view usage reports,
so that I can understand how users interact with the product.
```

### 6.3. Acceptance Criteria

Clear, testable conditions that define when a user story is "done."

```
User Story: Password Reset
Acceptance Criteria:
  [ ] User receives email within 2 minutes
  [ ] Reset link expires after 24 hours
  [ ] User can set new password meeting complexity requirements
  [ ] Existing sessions are invalidated after reset
```

### 6.4. Story Points vs Hours

| | Story Points | Hours |
|--|-------------|-------|
| **Unit** | Relative size (Fibonacci: 1, 2, 3, 5, 8, 13...) | Absolute time |
| **Advantage** | Less pressure, focuses on complexity | More predictable |
| **Common use** | Planning Poker | Kanban, capacity planning |

---

## 7. Kanban

**Kanban** is another Agile method (often combined with Scrum as "Scrumban") that focuses on visualizing work and limiting work in progress.

### 7.1. Core Practices

| Practice | Description |
|----------|-------------|
| **Visualize workflow** | Use a Kanban board with columns |
| **Limit WIP** | Maximum items per column/stage |
| **Manage flow** | Focus on throughput, not utilization |
| **Make policies explicit** | Clear rules for each column |
| **Feedback loops** | Regular reviews and adjustments |

### 7.2. Kanban Metrics

| Metric | Description |
|--------|-------------|
| **Lead Time** | Time from request to delivery |
| **Cycle Time** | Time from start to completion |
| **Throughput** | Items completed per time period |
| **WIP** | Work In Progress count |

---

## 8. Sprint ceremonies reminder

```
Monday  Sprint Planning       (2-4 hours)
Daily   Standup               (15 minutes)
Friday  Sprint Review        (1-2 hours)
Friday  Retrospective         (1-2 hours)
```

---

## 9. Interview Questions

**Q: What is the difference between Scrum and Kanban?**

> **Scrum** uses fixed-length Sprints with defined roles and ceremonies. **Kanban** is continuous flow with no fixed iterations, focusing on WIP limits and visualization. Scrum has roles (PO, SM, Dev); Kanban doesn't mandate roles.

**Q: What makes a good Sprint Goal?**

> A good Sprint Goal is **specific** (clear deliverable), **achievable** (within team's capacity), **valuable** (meaningful to stakeholders), and **collaborative** (created by the whole team).

**Q: How do you handle scope changes mid-Sprint?**

> The general rule is: **no scope changes mid-Sprint**. If a change is critical, discuss with the Product Owner to either remove lower-priority items from the Sprint Backlog or extend the Sprint (both are undesirable). Changes should go back to the Product Backlog for prioritization in the next Sprint.
