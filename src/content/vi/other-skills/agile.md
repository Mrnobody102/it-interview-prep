# Chủ đề Agile

## 1. Agile Manifesto

### 1.1. Lịch sử

Agile Manifesto được công bố vào tháng 2 năm 2001 bởi 17 chuyên gia phần mềm tại Snowbird, Utah. Họ gặp nhau để thảo luận về các phương pháp phát triển phần mềm nhẹ hơn, linh hoạt hơn.

### 1.2. Bốn giá trị cốt lõi

| Chúng tôi coi trọng hơn: | Hơn là: |
|---|---|
| **Các cá nhân và sự tương tác** | Quy trình và công cụ |
| **Phần mềm đang hoạt động** | Tài liệu toàn diện |
| **Sự hợp tác với khách hàng** | Đàm phán hợp đồng |
| **Phản hồi với sự thay đổi** | Tuân theo kế hoạch |

### 1.3. 12 Nguyên tắc đằng sau Agile

1. Ưu tiên cao nhất là mang lại giá trị cho khách hàng thông qua việc giao phần mềm sớm và liên tục.

2. Chào đón sự thay đổi, ngay cả ở giai đoạn muộn của dự án. Các quy trình Agile khai thác sự thay đổi để mang lại lợi thế cạnh tranh cho khách hàng.

3. Giao phần mềm hoạt động thường xuyên, từ vài tuần đến vài tháng, ưu tiên khoảng thời gian ngắn hơn.

4. Khách hàng và người phát triển phải làm việc cùng nhau hàng ngày trong suốt dự án.

5. Xây dựng dự án xung quanh những cá nhân có động lực. Cung cấp cho họ môi trường và sự hỗ trợ cần thiết, tin tưởng họ để hoàn thành công việc.

6. Phương pháp hiệu quả nhất để truyền đạt thông tin trong nhóm phát triển là giao tiếp trực tiếp.

7. Phần mềm đang hoạt động là thước đo chính của tiến độ.

8. Các quy trình Agile thúc đẩy sự phát triển bền vững. Các bên liên quan, nhà phát triển và người dùng nên có thể duy trì tốc độ ổn định vô thời hạn.

9. Chú ý liên tục đến sự xuất sắc về kỹ thuật và thiết kế tốt để tăng sự linh hoạt.

10. Sự đơn giản - nghệ thuật tối đa hóa lượng công việc không làm - là điều cần thiết.

11. Các kiến trúc, yêu cầu và thiết kế tốt nhất phát sinh từ các nhóm tự tổ chức.

12. Nhóm phải thường xuyên suy ngẫm về cách trở nên hiệu quả hơn, điều chỉnh và tinh chỉnh hành vi của mình cho phù hợp.

---

## 2. Scrum Framework

### 2.1. Scrum là gì?

Scrum là một framework Agile giúp các nhóm phức tạp phát triển, duy trì và quản lý các sản phẩm phức tạp. Scrum nhấn mạnh vào việc chia nhỏ công việc thành các "sprint" ngắn, có thời hạn cố định.

### 2.2. Ba vai trò trong Scrum

| Vai trò | Trách nhiệm chính |
|---|---|
| **Product Owner** | Định nghĩa và ưu tiên backlog, đại diện cho lợi ích khách hàng |
| **Scrum Master** | Hỗ trợ team, loại bỏ rào cản, đảm bảo tuân thủ Scrum |
| **Development Team** | Tự tổ chức, cross-functional, chịu trách nhiệm giao sản phẩm |

#### Product Owner

```markdown
# Trách nhiệm Product Owner

## Chiến lược
- Định nghĩa tầm nhìn sản phẩm (Product Vision)
- Hiểu rõ thị trường và khách hàng
- Đặt ra product roadmap dài hạn

## Tactical
- Quản lý Product Backlog
- Viết User Stories rõ ràng
- Đặt thứ tự ưu tiên (Prioritization)
- Quyết định features nào cần triển khai
- Chấp nhận/reject sản phẩm increment

## Giao tiếp
- Là bridge giữa stakeholders và development team
- Tham dự Sprint Review để demo sản phẩm
- Giao tiếp với khách hàng và bên liên quan
```

#### Scrum Master

```markdown
# Trách nhiệm Scrum Master

## Hỗ trợ Team
- Đảm bảo team hiểu và tuân thủ Scrum
- Tổ chức và facilitation các Scrum events
- Loại bỏ rào cản (impediments)
- Coach team về Agile practices

## Bảo vệ Team
- Bảo vệ team khỏi các yêu cầu không được lên kế hoạch
- Đảm bảo không có "scope creep" trong sprint
- Giữ team tập trung vào mục tiêu sprint

## Process
- Điều phối các ceremonies (planning, daily, review, retro)
- Đảm bảo documentation được giữ ở mức cần thiết
- Facilitate continuous improvement
```

#### Development Team

```markdown
# Đặc điểm Development Team

## Tự tổ chức
- Tự quyết định cách hoàn thành công việc
- Không có manager chỉ huy
- Mọi người có thể làm bất kỳ công việc nào cần thiết

## Cross-functional
- Có đủ skills để hoàn thành backlog
- Bao gồm testers, developers, designers, DevOps

## Kích thước
- Lý tưởng: 3-9 người
- Too small: thiếu skills, năng suất thấp
- Too large: giao tiếp phức tạp
```

### 2.3. Scrum Artifacts

#### Product Backlog

```markdown
# Product Backlog Structure

## Level 1: Epics (Các tính năng lớn)
- As a [user type], I want [capability] so that [benefit]
- Ví dụ: "As a customer, I want to pay with credit card so that I can purchase items"

## Level 2: Features (Tính năng)
- Phân rã epic thành các tính năng cụ thể
- "Payment gateway integration"

## Level 3: User Stories
- As a [role], I want [feature] so that [benefit]
- Acceptance Criteria
- Story Points

## Level 4: Tasks (Công việc cụ thể)
- Technical tasks để hoàn thành user story
- Estimated hours
```

#### Sprint Backlog

```markdown
# Sprint Backlog

## Sprints: 2 tuần (10 working days)

## Sprint Goal: "Users can complete end-to-end checkout process"

## Items committed:
- [ ] US-001: View cart
- [ ] US-002: Update item quantity
- [ ] US-003: Apply coupon code
- [ ] US-004: Checkout flow
- [ ] US-005: Payment integration
- [ ] US-006: Order confirmation email

## Daily tasks (Day 1):
- [ ] Setup checkout page structure
- [ ] Implement cart summary component
- [ ] Write unit tests for cart service
```

### 2.4. Sprint Events (Ceremonies)

| Event | Thời lượng | Tần suất | Mục đích |
|---|---|---|---|
| **Sprint Planning** | 2-4 giờ | 1/sprint | Lên kế hoạch sprint |
| **Daily Standup** | 15 phút | Hàng ngày | Sync team, identify blockers |
| **Sprint Review** | 1-2 giờ | 1/sprint | Demo increment, gather feedback |
| **Sprint Retrospective** | 1-1.5 giờ | 1/sprint | Cải thiện process |

#### Sprint Planning

```markdown
# Sprint Planning Checklist

## Phần 1: What can be delivered? (2h max)
1. Product Owner trình bày Sprint Goal và priorities
2. Team review backlog items
3. Team chọn items có thể hoàn thành
4. Break down thành tasks
5. Team ước tính capacity

## Phần 2: How will we do it? (2h max)
1. Team tự tổ chức để hoàn thành work
2. Xác định dependencies
3. Gán tasks cho team members
4. Đặt definition of done

## Outputs:
- Sprint Goal (mục tiêu sprint)
- Sprint Backlog (các items được chọn)
- Sprint Task List
```

#### Daily Standup

```markdown
# Daily Standup Format

## Mỗi người trả lời 3 câu hỏi:
1. "Hôm qua tôi đã làm gì?"
2. "Hôm nay tôi sẽ làm gì?"
3. "Có rào cản nào không?"

## Best Practices:
- Đứng lên để giữ ngắn gọn (15 phút max)
- Không giải quyết vấn đề ở đây - sau đó
- Đi trước/sau standup để discuss chi tiết
- Nếu remote: dùng video thay vì audio only

## Anti-patterns:
- Status report to Scrum Master
- Problem-solving session
- Personal updates
- Late arrivals làm disrupted
```

#### Sprint Review

```markdown
# Sprint Review Agenda

## 1. Introduction (5 min)
- Nhắc lại Sprint Goal
- Tóm tắt mục tiêu sprint

## 2. Demo (30-60 min)
- Demo các tính năng đã hoàn thành
- Không demo incomplete work
- Show real working software

## 3. Feedback Collection (20 min)
- Thu thập phản hồi từ stakeholders
- Ghi nhận các thay đổi cần thiết

## 4. Backlog Review (15 min)
- Cập nhật priorities dựa trên feedback
- Đánh giá upcoming items

## 5. Next Steps (5 min)
- Thảo luận next sprint planning
```

#### Sprint Retrospective

```markdown
# Sprint Retrospective Format (Last 15 Minutes)

## Start-Stop-Continue
| Start (Bắt đầu làm) | Stop (Ngừng làm) | Continue (Tiếp tục làm) |
|---|---|---|
| Weekly demo sessions | Daily overtime | Daily standup |
| Pair programming | Long meetings | Code review |
| Better documentation | Skipping tests | Team lunch Fridays |

## What went well?
- Communication within team improved
- Code review process faster

## What could be improved?
- Sprint planning took too long
- Too many interruptions

## Action items:
- [ ] Try timeboxed planning (2h max)
- [ ] Schedule focus blocks for deep work
```

### 2.5. Sprint Flow

```
Week 1        Week 2
┌─────────────────────────────────────────────────────┐
│                                                     │
│  ┌──────────────┐                                   │
│  │Sprint        │  Mon                             │
│  │Planning      │                                   │
│  │(2-4 hours)   │                                   │
│  └──────┬───────┘                                   │
│         │                                           │
│  ┌──────┴───────┐                                   │
│  │Daily Standup │  Tue/Wed/Thu/Fri                  │
│  │(15 min each) │───────────────────────────────────│
│  └──────┬───────┘                                   │
│         │                                           │
│  ┌──────┴───────┐                                   │
│  │ Development  │                                   │
│  │ Work        │                                   │
│  └──────┬───────┘                                   │
│         │                                           │
│  ┌──────┴───────┐                                   │
│  │Sprint Review │  Fri (hoặc Mon tuần sau)          │
│  │(1-2 hours)   │                                   │
│  └──────┬───────┘                                   │
│         │                                           │
│  ┌──────┴───────┐                                   │
│  │Sprint Retro  │                                   │
│  │(1-1.5 hours) │                                   │
│  └──────┬───────┘                                   │
│         │                                           │
│  ┌──────┴───────┐                                   │
│  │Next Sprint   │  Fri (hoặc Mon tuần sau)          │
│  │Planning      │                                   │
│  └──────────────┘                                   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 3. Kanban

### 3.1. Kanban vs Scrum

| Khía cạnh | Scrum | Kanban |
|---|---|---|
| **Sprint** | Fixed length (1-4 weeks) | Continuous flow |
| **Roles** | Có PO, SM, Dev Team | Không bắt buộc roles |
| **Commitments** | Team cam kết sprint backlog | Không có commitment cố định |
| **Planning** | Số lượng cố định mỗi sprint | Liên tục, pull khi có capacity |
| **Change** | Không thay đổi trong sprint | Thay đổi bất kỳ lúc nào |
| **Metrics** | Velocity | Lead time, Throughput |
| **WIP Limits** | Không bắt buộc | Bắt buộc |

### 3.2. Kanban Board

```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│   Backlog   │    To Do    │ In Progress │    Done     │
│             │ (WIP: 10)   │ (WIP: 5)   │             │
├─────────────┼─────────────┼─────────────┼─────────────┤
│             │             │             │             │
│ US-100      │ US-050      │ US-047      │ US-045      │
│ [Bug] Fix   │ User login  │ Shopping    │ User profile│
│ login bug   │ page        │ cart        │             │
│             │             │             │             │
│             │ US-051      │ US-048      │             │
│ US-101      │ Payment     │ Checkout    │             │
│ Add search  │ page        │ flow        │             │
│              │             │             │             │
│             │ US-052      │ US-049      │             │
│             │ Order       │ Order       │             │
│             │ history     │ history API │             │
│             │             │             │             │
│             │             │ US-050      │             │
│             │             │ (blocked!)  │             │
│             │             │ ⚠️ Waiting  │             │
│             │             │ for API     │             │
│             │             │ spec        │             │
└─────────────┴─────────────┴─────────────┴─────────────┘
```

### 3.3. WIP Limits (Work In Progress)

```markdown
# WIP Limits Best Practices

## Tại sao cần WIP Limits?
- Giảm context switching
- Tăng focus
- Phát hiện bottlenecks sớm
- Cải thiện flow

## Cách đặt WIP Limits:
- Bắt đầu với số items = số người trong team
- Adjust dựa trên observation
- Khi hit limit: team phải hoàn thành items trước khi pull new

## WIP Limit Violation Indicators:
- Items stacking up in "In Progress"
- Blocked items
- Long lead times
- Team stress
```

### 3.4. Kanban Metrics

| Metric | Công thức | Mục tiêu |
|---|---|---|
| **Lead Time** | Time from request to delivery | Càng ngắn càng tốt |
| **Cycle Time** | Time in active development | Càng ngắn càng tốt |
| **Throughput** | Items completed per time period | Ổn định |
| **WIP** | Items currently in progress | Không vượt limit |
| **Cumulative Flow** | Number of items in each state over time | Balanced columns |

```markdown
# Lead Time vs Cycle Time

Lead Time: [Backlog]────────[To Do]─────[In Progress]──[Done]
           ├──────────────────────────────────────────────┤
           Total time from idea to production

Cycle Time:                  [To Do]─────[In Progress]──[Done]
                               ├──────────────────────────────┤
                               Time in active development
```

---

## 4. User Stories

### 4.1. User Story Format

```markdown
# User Story Template

## Format chuẩn
As a [type of user],
I want [goal]
so that [benefit/value]

## Ví dụ
```
As a registered customer,
I want to save my payment methods,
so that I can checkout faster in future purchases.
```

## Components:
1. **Role**: Ai là người dùng?
2. **Goal**: Họ muốn làm gì?
3. **Benefit**: Tại sao họ cần điều này?

## Acceptance Criteria
- Given [context]
- When [action]
- Then [expected result]

### Ví dụ Acceptance Criteria:
```
Given I am logged in
And I have items in my cart
When I click "Checkout"
Then I should see my saved payment methods
And I can select one to complete purchase
```

## Story Points: 5
```

### 4.2. INVEST Checklist

Một user story tốt nên thỏa mãn INVEST:

| Letter | Meaning | Checklist |
|---|---|---|
| **I** | Independent | Không phụ thuộc vào stories khác |
| **N** | Negotiable | Có thể thương lượng, không phải hợp đồng cứng |
| **V** | Valuable | Mang lại giá trị cho user/customer |
| **E** | Estimable | Team có thể ước tính được |
| **S** | Small | Đủ nhỏ để estimate và complete trong 1 sprint |
| **T** | Testable | Có thể viết tests để verify |

### 4.3. Story Splitting

```markdown
# Kỹ thuật chia nhỏ User Stories

## 1. Theo workflow steps
❌ "As a user, I want to place an order"
✅ "As a user, I want to add items to cart"
✅ "As a user, I want to enter shipping address"
✅ "As a user, I want to select payment method"
✅ "As a user, I want to confirm order"

## 2. Theo happy/sad paths
❌ "As a user, I want to login"
✅ "As a user, I want to login with valid credentials" (happy)
✅ "As a user, I want to see error when entering invalid password" (sad)

## 3. Theo data variations
❌ "As admin, I want to manage all users"
✅ "As admin, I want to search users by name"
✅ "As admin, I want to filter users by status"
✅ "As admin, I want to export user list"

## 4. Theo CRUD operations
❌ "As admin, I want to manage products"
✅ "As admin, I want to create products"
✅ "As admin, I want to edit products"
✅ "As admin, I want to delete products"
```

---

## 5. Estimation

### 5.1. Story Points

```markdown
# Story Points là gì?

## Định nghĩa
- Đơn vị ước tính tương đối
- Đo effort, complexity, uncertainty
- KHÔNG phải man-hours

## Fibonacci Scale
| Points | Mô tả | Rough Hours |
|---|---|---|
| 1 | Rất nhỏ, rõ ràng | 1-2h |
| 2 | Nhỏ, đơn giản | 2-4h |
| 3 | Trung bình | 4-8h |
| 5 | Lớn hơn, có một số uncertainty | 8-16h |
| 8 | Lớn, phức tạp | 16-32h |
| 13 | Rất lớn, cần chia nhỏ | 32-64h |
| 21 | Quá lớn, cần epic breakdown | > 64h |

## Tại sao không phải hours?
- Humans are bad at estimating hours
- Story points allow relative comparison
- Velocity normalizes over time
- Focus on delivery, not hours
```

### 5.2. Planning Poker

```markdown
# Planning Poker Process

## Setup
1. Mỗi người có bộ cards với Fibonacci numbers (0, 1, 2, 3, 5, 8, 13, 21, ?)
2. Product Owner đọc user story
3. PO giải thích requirements và acceptance criteria
4. Team có thể hỏi clarifying questions

## Voting
1. Mỗi người chọn card phù hợp
2. Khi mọi người sẵn sàng, flip cards đồng thời
3. Nếu consensus (tất cả cùng số) -> ghi nhận
4. Nếu disagreement -> high/low explain reasons
5. Re-vote cho đến khi reach consensus

## Anti-patterns to avoid:
- Anchor effect (bị ảnh hưởng bởi estimate đầu tiên)
- Groupthink
- Dominant personality taking over
```

### 5.3. Velocity

```markdown
# Velocity Calculation

## Công thức
Velocity = Total Story Points Completed in Sprint

## Ví dụ:
Sprint 1: Completed 21 points, Committed 26 points  → Velocity = 21
Sprint 2: Completed 23 points, Committed 25 points  → Velocity = 23
Sprint 3: Completed 19 points, Committed 24 points  → Velocity = 19

Average Velocity = (21 + 23 + 19) / 3 = 21 points/sprint

## Sử dụng Velocity:
- Forecast future deliveries
- Plan sprints based on capacity
- Identify team performance trends

## Warnings:
- Velocity is NOT a measure of productivity
- Higher velocity ≠ better team
- Use velocity for planning, not comparison between teams
```

### 5.4. Capacity Planning

```markdown
# Capacity Planning

## Factors affecting capacity:
| Factor | Impact |
|---|---|
| Team size | Full-time members count |
| PTO/Holidays | Reduce available days |
| Meetings | ~30% of time typically |
| Context switching | interruptions, p0 issues |
| Onboarding new members | Temporary reduction |

## Calculation:
```
Available hours = Team members × Working days × Hours per day
Capacity (points) = Available hours / Average hours per point
Buffer = Capacity × 0.8  (20% buffer for interrupts)
```

## Ví dụ:
- 5 developers × 10 working days × 6 hours = 300 hours
- Average: 1 point = 4 hours
- Raw capacity: 300 / 4 = 75 points
- With buffer: 75 × 0.8 = 60 points
```

---

## 6. Agile Metrics

### 6.1. Burndown Chart

```
Sprint Burndown Chart
Story Points │
             │
   40       ● ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ (Ideal)
             │    ╲
   30       │      ╲
             │        ╲
   20       │          ╲
             │            ╲── ●── ●
   10       │                │   ╲
             │                │     ╲
    0       ●────────────────●──────● (Actual)
             │                        │
             └────────────────────────┘
             Day 1   Day 5   Day 10  Day 10

Legend:
● = Actual remaining points
─ ─ = Ideal burndown line
```

### 6.2. Burnup Chart

```
Sprint Burnup Chart
Story Points │
   40       │───────────────────────● Total Scope
             │                        │
             │                  ╱ ─ ─ ● Scope Added
   30       │                ╱
             │          ╱ ─ ─ ● Completed
   20       │      ╱ ─ ─ ●
             │  ╱ ─ ─ ●
   10       │╱ ─ ─ ●
             │
    0       ●────────────────────────
             Day 1   Day 5   Day 10
```

### 6.3. Cumulative Flow Diagram

```
Cumulative Flow Diagram
Items    │
         │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│ Done
         │░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│░░░░░│
         │░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│░░░░░│░░░░│
         │░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│░░░░░│░░░░░░░│ In Progress
         │░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│░░░░░│░░░░░░░│░░░░░░░░│ To Do
         │░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│░░░░░│░░░░░░░│░░░░░░░░│░░░░░░░░░░░│ Backlog
         └──────────────────────────────────────────→
              Sprint 1    Sprint 2    Sprint 3

Wider gap = Bottleneck (WIP increasing)
Parallel lines = Healthy flow
Narrowing area = Completing work faster than starting
```

---

## 7. Scrum vs Kanban vs Scrumban

### 7.1. Comparison Table

| Aspect | Scrum | Kanban | Scrumban |
|---|---|---|---|
| **Cadence** | Fixed sprints | Continuous | Mixed |
| **Planning** | Sprint planning | Continuous | Both |
| **Roles** | Required | Optional | Optional |
| **Commitment** | Sprint commitment | No commitment | Team-based |
| **Change** | During sprint: NO | Anytime: YES | Context-dependent |
| **WIP Limits** | Optional | Required | Recommended |
| **Metrics** | Velocity | Lead time, Throughput | Both |
| **Best for** | Product development | Operations, support | Hybrid teams |

### 7.2. When to use what?

| Use Scrum when: | Use Kanban when: | Use Scrumban when: |
|---|---|---|
| Đội ngũ mới học Agile | Continuous delivery required | Mixed product + ops work |
| Clear sprint boundaries needed | Work has varying priorities | Transitioning from Scrum |
| Stakeholders expect sprint demo | Frequent interruptions expected | Team wants flexibility |
| Product with defined milestones | Operational/support work | Incremental improvement |

---

## 8. Agile Anti-patterns

### 8.1. Scrum Anti-patterns

```markdown
# Top Scrum Anti-patterns

## 1. ScrumBut
❌ "We do Scrum, but we have longer sprints"
❌ "We do Scrum, but our manager assigns tasks"
❌ "We do Scrum, but we skip retrospectives"

-> Đây không phải Scrum! Cần quyết định: "Are you doing Scrum or not?"

## 2. Scrum Master as Task Master
❌ SM assigns tasks to team members
❌ SM creates detailed schedules
❌ SM reports status to management

-> Scrum Master là facilitator, không phải manager!

## 3. Sprint as Mini-Waterfall
❌ Sprint 1: All design
❌ Sprint 2: All development
❌ Sprint 3: All testing

-> Mỗi sprint nên có working increment!

## 4. Scope Change During Sprint
❌ PO adds items mid-sprint
❌ Management overrides sprint commitment
❌ "Just one more quick fix"

-> Commitment bị phá vỡ! Nếu cần change, defer đến next sprint.

## 5. No Timeboxing
❌ Planning kéo dài cả ngày
❌ Daily standup 45 phút
❌ Retro không bao giờ kết thúc

-> Giữ timeboxes! Tôn trọng thời gian của mọi người.
```

### 8.2. Fixing Anti-patterns

```markdown
# Solutions

## 1. For ScrumBut
- Honest assessment: "Are we actually doing Agile?"
- Pick framework và commit hoàn toàn
- Hoặc acknowledge hybrid approach

## 2. For SM as Task Master
- Coach SM về servant leadership
- Team tự organize work
- SM remove impediments, not assign tasks

## 3. For Mini-Waterfall
- Definition of Done bao gồm testing
- Cross-functional team members
- Continuous integration

## 4. For Scope Changes
- Clear sprint commitment
- Change Advisory Board process
- Product Owner protects sprint scope

## 5. For No Timeboxing
- Timer cho mỗi ceremony
- Facilitator keeps pace
- "Parking lot" for out-of-scope topics
```
