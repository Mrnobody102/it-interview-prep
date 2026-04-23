# Robot Systems, Safety & Deployment

## Tổng quan

Robot là một cyber-physical system được deploy ngoài đời thật. Vì vậy thành công không chỉ nằm ở chất lượng model, mà còn ở việc toàn bộ stack có hành xử an toàn và dễ dự đoán hay không.

Chủ đề này bao gồm:

- kiến trúc hệ thống
- runtime supervision
- failure handling
- safety layers
- observability
- fleet hoặc field deployment

---

## Kiến trúc robot production

Robot thật thường tách trách nhiệm theo lớp:

- compute latency thấp trên robot
- middleware và control processes
- planning hoặc AI service ở mức cao
- cloud logging, monitoring và fleet management
- teleoperation hoặc đường override của con người

Không phải robot nào cũng nên để cloud nằm trong control loop. Với nhiều hệ, thiết kế an toàn nhất là giữ time-critical behavior ở ngay trên robot.

---

## Các lớp safety

Safety không phải một tính năng đơn lẻ. Nó là nhiều lớp:

1. giới hạn cơ khí
2. giới hạn actuator và controller
3. đường emergency stop
4. software watchdog
5. vùng an toàn dựa trên perception
6. operator override
7. rollout và recovery procedure

Nếu robot chỉ dựa vào một learned model làm lớp safety duy nhất thì kiến trúc đó rất yếu.

---

## Runtime supervision

Robot deploy tốt cần supervisor trả lời được:

- perception có còn khỏe không
- localization có còn đáng tin không
- control loop có ổn định không
- sensor có bị stale hoặc delayed không
- policy có đang đề xuất action không an toàn không
- robot nên degrade, stop hay request help

Supervision thường quan trọng hơn việc làm model chính thông minh hơn một chút.

---

## Observability

Observability tốt trong robotics thường gồm:

- timestamp và clock sync
- structured logs
- rosbag hoặc công cụ replay tương đương
- sensor health metrics
- latency tracing
- controller và actuator diagnostics
- log của intervention và safety event

Nếu không replay được failure thì tốc độ debug sẽ rất chậm.

---

## Deployment patterns

Các pattern rollout phổ biến:

- test nội bộ trong lab
- shadow mode không có quyền actuation
- deploy giới hạn trong geofence
- vận hành có giám sát bởi con người
- rollout tự động hóa theo từng giai đoạn

Nó khá giống distributed systems hiện đại, nhưng hậu quả ở đây là hậu quả vật lý.

---

## Human-in-the-loop design

Con người vẫn giữ vai trò trung tâm trong nhiều hệ robotics tiên tiến:

- teleoperation fallback
- intervention labeling
- demo collection
- approval gate cho hành động rủi ro
- incident review

Mục tiêu không phải là chứng minh robot không bao giờ fail. Mục tiêu là làm cho failure có thể quan sát, recover được và bị giới hạn phạm vi.

---

## Góc nhìn Physical AI

"Physical AI" là thuật ngữ hữu ích ở cấp hệ thống vì nó nhắc rằng:

- model sống bên trong vòng lặp vật lý
- embodiment làm thay đổi data và action interface
- latency, safety và hardware constraint là first-class concern
- thành công phụ thuộc vào integration chứ không chỉ vào model quality

Đây là mental model đúng cho robotics năm 2026.

---

## Câu hỏi Phỏng vấn

### 1. Vì sao deploy robotics khó hơn deploy một ứng dụng LLM web?

Vì hệ thống tương tác với thế giới vật lý, nơi timing, actuation, safety và bất định phần cứng ảnh hưởng trực tiếp tới kết quả.

### 2. Watchdog hoặc supervisor có giá trị gì?

Nó tạo ra một lớp độc lập để phát hiện trạng thái suy giảm và kích hoạt stop, fallback hoặc recovery behavior.

### 3. Vì sao observability đặc biệt quan trọng trong robotics?

Vì lỗi thường là multi-modal và phụ thuộc thời gian. Muốn hiểu chuyện gì xảy ra, thường phải có log, sensor data và action trace được đồng bộ.
