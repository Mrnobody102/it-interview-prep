# ROS 2 Communication, QoS & Lifecycle

## Tổng quan

ROS 2 có giá trị chủ yếu như một distributed systems framework cho robot.

Để dùng tốt, bạn cần hiểu:

- các pattern tương tác giữa nodes
- QoS semantics
- lifecycle-managed behavior
- tooling cho launch và replay

---

## Các primitive giao tiếp cốt lõi của ROS 2

Các primitive chính:

- **topics** cho luồng dữ liệu pub/sub
- **services** cho tương tác request-response
- **actions** cho tác vụ kéo dài, có goal
- **parameters** cho cấu hình runtime

Chọn sai primitive sẽ dẫn đến API giòn và hành vi runtime khó chịu.

Ví dụ:

- camera frames nên đi bằng topics
- cấu hình hoặc one-shot queries thường hợp với services
- navigation goals thường hợp với actions

---

## QoS là vấn đề vận hành thật sự

Quality of Service tác động trực tiếp tới hành vi giao tiếp và timing.

Các núm chính:

- reliability
- durability
- history depth
- deadline
- liveliness

Đây không phải chi tiết học thuật. Chúng quyết định hệ hành xử thế nào khi mạng yếu, subscriber tới muộn, hoặc sensor bắn burst.

---

## Lifecycle Nodes và Launch

Lifecycle nodes giúp quản lý startup, shutdown, và recovery đáng tin hơn.

Các state hữu ích gồm:

- unconfigured
- inactive
- active
- finalized

Điều này quan trọng khi robot cần điều phối:

- hardware initialization
- map loading
- planner bring-up
- safe restart sau khi fail

Launch files và parameterization cũng quan trọng vì robot systems hiếm khi được khởi động thủ công từng lệnh một.

---

## Tooling thật sự quan trọng

Kiến thức tooling thực dụng nên gồm:

- topic và service introspection
- `rosbag` recording và replay
- parameter inspection
- TF inspection
- launch debugging

Replayable logs đặc biệt có giá trị vì nhiều bug robotics là bug ngắt quãng và phụ thuộc timing.

---

## Câu hỏi Phỏng vấn

### 1) Khi nào nên dùng action thay vì service?

Khi tác vụ kéo dài, cần feedback, hoặc có thể bị cancel, ví dụ navigation hay manipulation goals.

### 2) Vì sao QoS quan trọng như vậy trong robotics?

Vì robot systems phụ thuộc vào message delivery và timing có thể dự đoán được dưới điều kiện mạng và compute thật.

### 3) Lợi ích của lifecycle nodes là gì?

Chúng cung cấp quản lý trạng thái runtime tường minh, làm bring-up, shutdown, validation, và recovery đáng tin hơn.

### 4) Vì sao rosbag replay hữu ích?

Vì nó cho phép tái hiện các failure phụ thuộc timing và debug perception hoặc coordination issues mà không phải dựng lại đúng cảnh vật lý mỗi lần.
