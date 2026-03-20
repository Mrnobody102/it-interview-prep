# Other Skills

## Code Review

### 1. Tổng quan

**Code Review** là quá trình đánh giá code trước khi merge vào codebase. Mục tiêu: phát hiện bug sớm, đảm bảo chất lượng, chia sẻ kiến thức, và duy trì coding standards.

---

### 2. Lợi ích

#### 2.1. Về chất lượng

| Lợi ích | Mô tả |
|---|---|
| **Phát hiện bug sớm** | Bắt lỗi trước khi vào production |
| **Standard consistency** | Đảm bảo code theo conventions của team |
| **Security** | Phát hiện vulnerabilities trước khi deploy |
| **Performance** | Nhận ra anti-patterns và opportunities |

#### 2.2. Về team

| Lợi ích | Mô tả |
|---|---|
| **Chia sẻ kiến thức** | Team hiểu codebase rộng hơn |
| **Mentoring** | Senior review junior code để học hỏi |
| **Consistency** | Cùng một style giúp maintain dễ hơn |

---

### 3. Checklist Review

#### 3.1. Logic & Functionality

- [ ] Logic có đúng không? Hiểu được intent không?
- [ ] Edge cases đã được xử lý chưa?
- [ ] Input validation đầy đủ chưa?
- [ ] Error handling có phù hợp không?
- [ ] Requirements được đáp ứng đầy đủ không?

#### 3.2. Code Quality

- [ ] Code có clean, dễ đọc không?
- [ ] Tên biến/hàm có mô tả rõ ràng không?
- [ ] Có DRY không? Logic trùng lặp cần refactor?
- [ ] Hàm có quá dài không? Nên tách?
- [ ] Comments có hữu ích không? Tránh comment thừa?

#### 3.3. Performance

- [ ] Có N+1 query problem?
- [ ] Có memory leak hoặc resource leak?
- [ ] Có thuật toán O(n²) có thể cải thiện?
- [ ] Có heavy operation có thể async?

#### 3.4. Security

- [ ] Input đã được sanitize chưa?
- [ ] Có SQL injection, XSS, CSRF vulnerabilities?
- [ ] Authentication và authorization đã đúng?
- [ ] Sensitive data có được handle cẩn thận không?
- [ ] Secrets có hardcoded trong code không?

#### 3.5. Testing

- [ ] Unit tests có đầy đủ không?
- [ ] Test cases cover happy path và edge cases?
- [ ] Tests thực sự test behavior hay chỉ để coverage?

---

### 4. Best Practices

#### 4.1. Cho Author

| Practice | Description |
|---|---|
| **PR nhỏ** | Dưới 400 dòng thay đổi là ideal |
| **Mô tả rõ ràng** | Giải thích WHY, không chỉ WHAT |
| **Self-review trước** | Review chính mình trước khi gửi |
| **Gắn ticket/issue** | Link đến task/bug tương ứng |

```bash
# PR description template hay
## Mục đích
Giải thích WHY cần thay đổi này

## Thay đổi
- Mô tả ngắn gọn các thay đổi

## Test
- Mô tả cách test thay đổi

## Screenshots (nếu có UI)
```

#### 4.2. Cho Reviewer

| Practice | Description |
|---|---|
| **Be kind** | Code là người, không phải người |
| **N问 "why" không phải "what to do"** | Hỏi lý do, gợi ý giải pháp |
| **Priority** | Đánh dấu comments: MUST FIX vs NICE TO HAVE |
| **Nhanh chóng** | Review trong 24 giờ |

```
# Comment format hay
[NIT] Có thể đặt tên biến rõ hơn không?
[Q] Logic này có đúng với requirement không?
[BLOCKER] SQL injection vulnerability ở đây
[SUGGEST] Có thể dùng Array.find() thay vì filter[0]
```

#### 4.3. Team Standards

- Dùng **linter** cho style — review không nên comment về style
- Thiết lập **CI checks** cho tests, linting, security scanning
- Đặt **SLA review**: comment trong 24h, approve trong 48h

---

### 5. Tools

| Tool | Type | Features |
|---|---|---|
| **GitHub PR** | Code hosting | Inline comments, review requests, status checks |
| **GitLab MR** | Code hosting | Code review, CI/CD integration |
| **Bitbucket PR** | Code hosting | Inline comments, merge checks |
| **Phabricator** | Review tool | Differential, strict review workflow |
| **ESLint** | Linter | Auto-format, catch issues pre-review |
| **SonarQube** | SAST | Code smell, bugs, security vulnerabilities |

---

### 6. Common Mistakes

| Mistake | Problem | Solution |
|---|---|---|
| **PR quá lớn** | Reviewer overwhelmed, shallow review | Tách thành nhiều PRs nhỏ |
| **Review surface-level** | Miss bugs | Dành đủ thời gian, đọc kỹ logic |
| **Tập trung style** | Wasted time, missed bugs | Dùng linter cho style |
| **Takess personally** | Author defensive | Remember: review code, not person |
| **Review quá chậm** | Block team progress | Set SLA, treat review as priority |
