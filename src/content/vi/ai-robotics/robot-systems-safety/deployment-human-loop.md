# Deployment Patterns & Human-in-the-Loop

## Tổng quan

Deployment không nên nhảy từ lab success sang unrestricted autonomy.

Mục này tập trung vào:

- staged rollout
- shadow và limited autonomy modes
- operator involvement
- safe escalation of autonomy

---

## Các Deployment Pattern

Những pattern hữu ích:

- simulation-only validation
- replay-backed comparison
- shadow mode
- canary rollout
- limited autonomy có operator override

Deployment pattern nên phù hợp với mức rủi ro của task.

---

## Human-in-the-Loop Design

Con người có thể ở trong loop để:

- phê duyệt hành động rủi ro
- teleoperation fallback
- failure recovery
- labeling và postmortem review

Thiết kế HITL tốt phải giảm cognitive overload chứ không chỉ ném mọi ca khó về cho con người.

---

## Safe Escalation

Autonomy thường nên scale dần thông qua:

- bounded environments
- constrained tasks
- measured confidence thresholds
- bằng chứng vận hành tích lũy

Cách này an toàn hơn nhiều so với việc cố deploy mức autonomy tối đa ngay từ ngày đầu.

---

## Câu hỏi Phỏng vấn

### 1) Vì sao nên dùng staged rollout cho robot?

Vì rủi ro deployment vật lý cao và việc tăng dần mức phơi nhiễm giúp giảm khả năng failure không an toàn trên diện rộng.

### 2) Vì sao human-in-the-loop vẫn có giá trị?

Vì con người có thể giám sát edge cases, recovery failures, và đưa ra judgment khi confidence của model hoặc mức risk còn quá bất định.

### 3) Shadow mode là gì?

Đó là chế độ deploy mà hệ mới vẫn chạy và được quan sát, nhưng chưa được phép điều khiển hành động thật.
