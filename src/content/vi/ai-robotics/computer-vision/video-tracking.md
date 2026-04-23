# Video Understanding & Tracking

## Tổng quan

Nhiều hệ thực tế không xử lý ảnh rời rạc. Chúng xử lý stream.

Điều đó làm bài toán chuyển từ:

- "bây giờ nhìn thấy gì?"

sang:

- "điều gì đang diễn ra theo thời gian?"
- "đây có phải cùng một object như trước không?"
- "tín hiệu có đủ ổn định để hành động không?"

Với robotics, lớp temporal này thường quan trọng hơn việc cố lấy thêm một chút single-frame accuracy.

---

## Các bài toán video cốt lõi

Các task thường gặp:

- multi-object tracking
- re-identification
- action recognition
- temporal event detection
- video segmentation
- future state hoặc motion prediction

Các use case robotics điển hình:

- theo dõi object trong khi thao tác
- theo dõi người hoặc xe nâng trong nhà xưởng
- reason trên contact events
- phát hiện anomaly trong vài giây thay vì một frame

---

## Tracking-by-detection

Một pattern phổ biến:

1. detect object trên từng frame
2. associate detection qua các frame
3. duy trì track identity
4. xử lý occlusion, missed detection, và việc object đi ra khỏi scene

Các thành phần quan trọng:

- motion model như Kalman filter
- appearance embedding cho re-identification
- matching cost dựa trên IoU, motion, và appearance

Đây vẫn là pattern practical phổ biến vì dễ module hóa và dễ debug.

---

## Re-identification và tính nhất quán danh tính

Tracking thường fail khi identity bị đổi dưới các điều kiện:

- occlusion
- đông đối tượng
- viewpoint change
- các object nhìn giống nhau

Re-identification giúp bằng cách học embedding ổn định hơn qua thời gian và góc nhìn.

Điều này quan trọng trong robotics khi:

- robot phải tiếp tục bám theo đúng mục tiêu
- manipulator tạm thời mất tầm nhìn của object
- hệ safety phải phân biệt đúng các agent đang di chuyển gần nhau

Giữ identity nhất quán là một bài toán hệ thống, không chỉ là bài toán model.

---

## Video model và temporal feature

Các cách modeling theo thời gian gồm:

- framewise model cộng smoothing
- 3D CNN
- recurrent model
- temporal transformer
- memory-based architecture

Temporal model lớn hơn có thể cải thiện reasoning, nhưng cũng làm tăng:

- latency
- memory usage
- độ phức tạp đồng bộ
- khó khăn khi deploy real-time

Trong nhiều hệ ứng dụng, detector cộng tracker đơn giản vẫn là lựa chọn thắng.

---

## Đánh giá hệ video

Các metric hữu ích:

- **MOTA / MOTP**
- **IDF1**
- track fragmentation
- identity switch count
- event precision và recall
- temporal stability

Với robotics, còn nên hỏi:

- tracker có chịu được short occlusion không?
- identity giữ ổn định được bao lâu?
- recovery behavior sau khi mất track là gì?

Nhiều khi các câu hỏi này còn ý nghĩa hơn leaderboard metric chung.

---

## Failure modes trong hệ streaming

Các lỗi phổ biến:

- detector flicker
- identity switching
- dropped frames
- camera jitter
- motion blur
- timestamp trễ
- tích lũy stale state

Robot có thể hành động trên perception đã cũ nếu temporal pipeline không được giới hạn cẩn thận.

Đó là lý do hệ streaming mạnh thường dùng:

- xử lý timestamp tường minh
- buffer có giới hạn
- health check
- fallback khi track trở nên không đáng tin

---

## Câu hỏi Phỏng vấn

### 1) Vì sao tracking thường khó hơn detection?

Vì hệ thống phải duy trì identity và temporal consistency dưới điều kiện occlusion, missed detection, và thay đổi góc nhìn, chứ không chỉ detect từng frame.

### 2) Tracking-by-detection là gì?

Đó là pipeline module hóa trong đó object được detect trên từng frame rồi sau đó được associate theo thời gian bằng cue về motion và appearance.

### 3) Vì sao tracker đơn giản có thể thắng video model lớn trong production?

Vì nó có thể có latency thấp hơn, dễ debug hơn, và hành vi dễ dự đoán hơn dưới ràng buộc real-time.
