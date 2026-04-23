# Robot Stack Architecture & Middleware

## Tổng quan

Một robotics engineer tốt nhìn robot như một layered distributed system chứ không phải một executable khổng lồ.

Các lớp điển hình gồm:

1. sensors và actuators
2. device drivers và hardware interfaces
3. middleware và messaging
4. state estimation và perception
5. planning và control
6. behavior orchestration
7. safety và supervision

---

## Vì sao Middleware tồn tại

Middleware giải quyết các bài toán lặp đi lặp lại trong robotics:

- giao tiếp giữa các tiến trình
- serialization và transport
- discovery của các thành phần phân tán
- tách biệt responsibility giữa các module
- hỗ trợ replay và debugging

Không có middleware, mỗi robot stack sẽ tự phát minh lại lớp tích hợp mong manh của riêng mình.

---

## Distributed Architecture trong thực tế

Robot thật thường chạy nhiều tiến trình phối hợp:

- camera drivers
- localization nodes
- planners
- controllers
- logging và diagnostics services

Điều này quan trọng vì lỗi hiếm khi chỉ là cục bộ. Một timing issue ở một module có thể làm lệch cả stack.

Vì vậy kiến trúc tốt cần nhấn mạnh:

- contract rõ giữa các modules
- kỳ vọng latency có giới hạn
- fallback behavior
- observability về state và health

---

## Behavior Orchestration

Robot thường cần lớp điều phối rõ ràng phía trên các low-level modules.

Các pattern orchestration phổ biến:

- behavior trees
- finite-state machines
- task graphs
- supervisor nodes với recovery policies

Lớp này quyết định robot nên làm gì khi:

- một goal bị fail
- một sensor biến mất
- độ tin cậy localization tụt
- người vận hành can thiệp

---

## Câu hỏi Phỏng vấn

### 1) Vì sao software robotics thường phân tán thay vì monolithic?

Vì sensing, planning, control, và monitoring có timing, ownership, và failure patterns khác nhau; modularity giúp tích hợp và debug khả thi hơn.

### 2) Middleware cung cấp gì trong robotics?

Nó cung cấp communication tiêu chuẩn, discovery, transport abstraction, và tooling để các module tương tác mà không cần tích hợp cứng từng cặp.

### 3) Vì sao orchestration là concern riêng với control?

Vì orchestration quyết định flow hành vi ở mức task và recovery, còn control tập trung vào actuation và ổn định ở mức thấp.

### 4) Điều gì làm robot architecture khó?

Vì các module vẫn gắn chặt với nhau qua timing, transforms, sensor quality, và safety constraints dù code có được chia module.
