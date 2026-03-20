# Frontend - Agile

## 1. Tổng quan

**Agile** là một **phương pháp phát triển phần mềm** tập trung vào việc deliver software nhanh chóng, linh hoạt, và liên tục cải thiện.

---

## 2. Agile Manifesto (2001)

### 2.1. 4 Giá trị Cốt lõi

| Chúng ta đánh giá... | Hơn... |
|----------------------|--------|
| **Individuals and interactions** over | Processes and tools |
| **Working software** over | Comprehensive documentation |
| **Customer collaboration** over | Contract negotiation |
| **Responding to change** over | Following a plan |

### 2.2. 12 Nguyên tắc

1. Ưu tiên **customer satisfaction** bằng cách deliver sớm và liên tục.
2. **Chào đón thay đổi** ngay cả ở late stages.
3. Deliver **working software** frequently (tuần thay vì tháng).
4. Business people và developers phải **work together** daily.
5. Xây dựng projects quanh **motivated individuals**.
6. **Face-to-face conversation** là cách hiệu quả nhất để truyền đạt.
7. **Working software** là thước đo chính của tiến độ.
8. Promote **sustainable development** — team có thể duy trì pace vô hạn.
9. **Technical excellence** và good design tăng agility.
10. **Simplicity** — minimize amount of work không cần thiết.
11. Self-organizing teams tạo ra **best architectures** và designs.
12. Regular **reflection and adjustment** để become more effective.

---

## 3. Scrum

### 3.1. Scrum Framework

Scrum là một **Agile framework** dựa trên fixed-length iterations gọi là **Sprints**.

```
┌──────────────────────────────────────────────────────────┐
│                      PRODUCT BACKLOG                      │
│  (Danh sách tất cả features, bugs, improvements)        │
└──────────────────────────────────────────────────────────┘
                    │ (Grooming/PB Refinement)
                    ▼
┌──────────────────────────────────────────────────────────┐
│                   SPRINT BACKLOG                         │
│  (Các items được chọn cho sprint hiện tại)              │
└──────────────────────────────────────────────────────────┘
                    │
    ┌───────────────┼────────────────┐
    │               │                │
    ▼               ▼                ▼
┌────────┐    ┌──────────┐    ┌──────────┐
│ Daily  │    │ SPRINT    │    │ SPRINT   │
│ Standup│    │ PLANNING  │    │ REVIEW   │
│ (15min)│   │ (2-4 hrs) │    │ (1-4 hrs)│
└────────┘    └──────────┘    └──────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │   RETROSPECTIVE  │
                    │   (1-3 hours)    │
                    └──────────────────┘
```

### 3.2. Scrum Roles

| Role | Mô tả | Trách nhiệm |
|------|-------|------------|
| **Product Owner** | Đại diện business | Quản lý Product Backlog, define priorities, maximize value |
| **Scrum Master** | Facilitator/Coach | Đảm bảo Scrum được follow, remove blockers, coach team |
| **Development Team** | Cross-functional team | Self-organizing, deliver working software |

### 3.3. Sprint Planning

**Sprint Planning** là buổi họp để define sprint goal và chọn items từ backlog.

```markdown
## Sprint Planning Checklist

### Trước buổi họp:
- [ ] Product Backlog đã được refine (ước lượng, prioritized)
- [ ] Team members đã review backlog items

### Trong buổi họp:

**Phần 1: Sprint Goal (1-2 giờ)**
- [ ] PO present highest priority items
- [ ] Team discuss và understand requirements
- [ ] Define Sprint Goal — what we want to achieve

**Phần 2: Sprint Backlog (1-2 giờ)**
- [ ] Team chọn items có thể complete
- [ ] Break down items thành tasks
- [ ] Estimate effort (story points hoặc hours)
- [ ] Team commits to Sprint Backlog

**Output:**
- Sprint Goal statement
- Sprint Backlog (committed items + tasks)
- Team's confidence level
```

### 3.4. Sprint Review

Trình bày **working software** cho stakeholders và nhận feedback.

```markdown
## Sprint Review Agenda (60-90 phút)

1. **Welcome & Context** (5 min)
   - Sprint goal
   - What was committed vs delivered

2. **Demo** (30-45 min)
   - Live demonstration of working features
   - Each story demoed

3. **Feedback** (15-30 min)
   - Stakeholder feedback
   - Questions và clarifications

4. **Next Steps** (10 min)
   - Update product backlog based on feedback
   - Preview of next sprint

**Definition of Done:**
- Code review approved
- Tests passing
- Deployed to staging
- PO accepted
```

### 3.5. Sprint Retrospective

Team reflection để **continuous improvement**.

```markdown
## Sprint Retrospective Formats

### Start-Stop-Continue
| Start (bắt đầu làm) | Stop (ngừng làm) | Continue (tiếp tục) |
|---------------------|------------------|---------------------|
| Daily async updates  | Long meetings     | Daily standups      |
| Pair programming    | Context switching | Sprint reviews     |

### 4Ls
- **Liked:** Gì team thích?
- **Learned:** Gì team học được?
- **Lacked:** Gì còn thiếu?
- **Longed for:** Team mong muốn gì?

### Sailboat retrospective
- **Wind (positive):** What propelled us forward?
- **Anchors (negative):** What held us back?
- **Rocks (risks):** What do we need to watch out for?
- **Island (goal):** Where do we want to go next sprint?
```

### 3.6. Daily Standup

**Short daily meeting** để synchronize team và identify blockers.

```markdown
## Daily Standup Rules

**When:** Every day, same time (morning), 15 minutes max
**Who:** Whole team
**Format:** Each person answers 3 questions:

1. **What did I do yesterday?**
2. **What will I do today?**
3. **Any blockers?**

### Anti-patterns to avoid:
- Status report to manager (not a status meeting!)
- Problem-solving during standup (schedule separate discussion)
- Standing while sitting (just start on time!)
```

---

## 4. Kanban

### 4.1. Kanban Board

**Kanban** là method dùng **visual board** để manage work flow.

```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│   BACKLOG   │     TO DO   │  IN PROGRESS│    DONE    │
├─────────────┼─────────────┼─────────────┼─────────────┤
│ ┌─────────┐ │ ┌─────────┐ │ ┌─────────┐ │ ┌─────────┐ │
│ │ Feature A│ │ │ Feature B│ │ │ Feature C│ │ │ Feature D│ │
│ └─────────┘ │ └─────────┘ │ └─────────┘ │ └─────────┘ │
│ ┌─────────┐ │ ┌─────────┐ │             │             │
│ │ Feature E│ │ │ Bug Fix │ │             │             │
│ └─────────┘ │ └─────────┘ │             │             │
└─────────────┴─────────────┴─────────────┴─────────────┘
```

### 4.2. Core Practices

| Practice | Mô tả |
|----------|--------|
| **Visualize workflow** | Use physical/virtual board |
| **WIP Limits** | Giới hạn work-in-progress per column |
| **Manage flow** | Monitor và optimize work flow |
| **Make policies explicit** | Define rules for each column |
| **Feedback loops** | Regular cadences for improvement |
| **Improve collaboratively** | Team-based continuous improvement |

### 4.3. WIP Limits

```
┌──────────────────────────────────────────────────┐
│  WITHOUT WIP LIMIT           │  WITH WIP LIMIT   │
├──────────────────────────────┼───────────────────┤
│ To Do: 10 items             │ To Do: 10 items   │
│ In Progress: 8 items        │ In Progress: 3 ⚠️ │
│ Done: 2 items               │ Done: 7 items     │
│                              │                   │
│ Result: Context switching    │ Result: Focus,    │
│ Bottoleneck at "Done"       │ faster delivery   │
└──────────────────────────────┴───────────────────┘
```

---

## 5. User Stories & Acceptance Criteria

### 5.1. User Story Format

```markdown
## User Story Template

As a [ROLE],
I want [FEATURE],
So that [BENEFIT].

## Example

As a **registered user**,
I want **to reset my password via email**,
So that **I can regain access if I forget my password**.

### Acceptance Criteria

- [ ] User receives password reset email within 1 minute
- [ ] Reset link expires after 24 hours
- [ ] User can set new password (min 8 chars, 1 uppercase, 1 number)
- [ ] Confirmation email sent after successful reset
- [ ] User redirected to login page after reset
```

### 5.2. Story Points

**Story Points** đo **relative complexity** chứ không phải absolute time.

```markdown
## Fibonacci Scale

| Points | Mô tả | Ví dụ |
|--------|--------|-------|
| 1 | Trivial, very quick | Fix typo, add CSS class |
| 2 | Simple, well understood | Simple form field |
| 3 | Moderate effort | Form validation, API integration |
| 5 | Complex, needs thought | Multi-step form |
| 8 | Very complex, risky | Complex business logic |
| 13 | Epic, split if possible | Full feature module |
| 21 | Too large, must split | Major feature |

## Velocity
- Team velocity = total points completed per sprint
- Dùng velocity để forecast future sprints
- DON'T use story points for individual performance!
```

---

## 6. Estimation Techniques

### 6.1. Planning Poker

```markdown
## Planning Poker Process

1. Product Owner presents user story
2. Team discuss requirements
3. Each member privately selects card (0, 1, 2, 3, 5, 8, 13, 21, ?)
4. All reveal cards simultaneously
5. High/low estimators explain reasoning
6. Re-vote until consensus

## Example Conversation
Dev1: "I think this is a 5 — straightforward API call."
Dev2: "I'd say 8 — we need error handling và retries."
Dev3: "I agree with 8 — what about rate limiting edge cases?"
[Re-vote]
All: "8"
```

### 6.2. T-Shirt Sizing

```markdown
| Size  | Relative Effort | Story Points |
|-------|-----------------|--------------|
| XS    | Very easy       | 1            |
| S     | Easy            | 2            |
| M     | Medium          | 3-5          |
| L     | Large           | 8            |
| XL    | Very large      | 13           |
| XXL   | Epic            | 21+          |
```

---

## 7. Sprint Velocity & Burndown

### 7.1. Sprint Burndown Chart

```
Points │                              ● Sprint End
   40  │                    ●
       │               ●
   30  │          ●
       │     ●
   20  │  ●
       │
   10  │════════════════════════════
    0  └───────────────────────────────►
       Day 1  Day 3  Day 5  Day 7  Day 10
```

### 7.2. Velocity Calculation

```markdown
## Velocity Calculation

| Sprint | Committed | Completed | Velocity |
|--------|-----------|-----------|----------|
| 1      | 34 pts    | 28 pts    | 28       |
| 2      | 30 pts    | 31 pts    | 31       |
| 3      | 32 pts    | 29 pts    | 29       |
| 4      | 31 pts    | 30 pts    | 30       |

Average Velocity = (28 + 31 + 29 + 30) / 4 = 29.5 points

## Forecasting
- Next sprint capacity = 29.5 points
- Account for PTO, meetings, holidays
- Over-committing leads to burnout!
```

---

## 8. Common Interview Questions

### Q: Sự khác biệt giữa Scrum và Kanban?

| | Scrum | Kanban |
|--|-------|--------|
| **Cadence** | Fixed sprints (1-4 weeks) | Continuous flow |
| **Roles** | Defined (PO, SM, Team) | No required roles |
| **Ceremonies** | Defined (Planning, Review, Retro) | Optional |
| **Sprints** | Time-boxed iterations | No time-boxing |
| **WIP** | Not explicitly limited | **Key practice** — WIP limits |
| **Planning** | Sprint planning (commit to sprint) | Continuous |
| **Changes** | Typically not during sprint | Welcome anytime |
| **Metrics** | Velocity, burndown | Lead time, throughput |

### Q: Sprint planning checklist?

1. Backlog đã refined và prioritized?
2. Team size và capacity đã calculated?
3. Dependencies đã identified?
4. Definition of Done đã agreed?
5. Sprint Goal đã defined?
6. Items có acceptance criteria?

### Q: Definition of Done (DoD)?

```markdown
## Definition of Done — Frontend

- [ ] Code follows coding standards (lint passing)
- [ ] Unit tests written và passing (> 80% coverage)
- [ ] Code review approved
- [ ] Feature tested on staging environment
- [ ] Responsive design tested (mobile, tablet, desktop)
- [ ] Accessibility tested (WCAG 2.1 AA)
- [ ] No console errors
- [ ] Documentation updated
- [ ] PO acceptance
```

### Q: Agile vs Waterfall?

| | Agile | Waterfall |
|--|-------|-----------|
| **Approach** | Iterative, incremental | Sequential, linear |
| **Requirements** | Evolving, flexible | Fixed upfront |
| **Customer involvement** | Continuous | At beginning and end |
| **Risk** | Distributed, managed | High (front-loaded) |
| **Deliverables** | Incremental releases | Single final release |
| **Changes** | Welcome | Costly, difficult |
| **Best for** | Complex, changing requirements | Well-understood, stable requirements |

### Q: Làm sao để handle scope creep?

1. **Groom backlog regularly** — không để items unrefined quá lâu.
2. **Protect sprint goal** — new items vào backlog, không phải sprint.
3. **Negotiate scope** — với PO, có thể descope non-essential items.
4. **Track velocity** — use velocity để set expectations.
5. **Say no when needed** — team capacity có giới hạn.
