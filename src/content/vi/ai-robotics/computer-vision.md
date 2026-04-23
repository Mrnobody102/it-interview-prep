# Computer Vision

## Tổng quan

Computer Vision trong AI và robotics không nên bị xem như một chủ đề lớn duy nhất.

Trong thực tế, kiến thức CV mạnh thường phát triển qua nhiều lớp:

1. nền tảng ảnh và classical vision
2. các bài toán recognition như detection và segmentation
3. temporal reasoning trên video và tracking
4. 3D geometry, depth, và pose
5. open-vocabulary perception và language-conditioned perception
6. các ràng buộc production cho robotics và physical AI

Đó là lý do chủ đề này được tách thành các mục con riêng thay vì giữ tất cả trong một trang.

---

## Vì sao nó quan trọng trong robotics

Với robot, "nhìn thấy" chỉ có ích nếu perception có thể phục vụ hành động.

Điều đó có nghĩa computer vision cho robotics cuối cùng phải nối được với:

- calibration và frame alignment
- depth và geometry
- pose estimation
- tính nhất quán theo thời gian
- confidence và fallback behavior
- ràng buộc latency trong decision loop

Đó cũng là lý do benchmark accuracy thuần là chưa đủ.

---

## Bản đồ các mục con

### 1. CV Fundamentals & Classical Vision

Trọng tâm:

- pixels, color spaces, image transforms
- filtering, edges, morphology
- keypoints, descriptors, matching
- augmentation, transfer learning, workflow với OpenCV

Dùng mục này khi bạn muốn nắm các khối kiến thức nền mà rất nhiều pipeline hiện đại vẫn dựa vào.

### 2. Detection, Segmentation & Recognition

Trọng tâm:

- image classification
- object detection
- semantic / instance / panoptic segmentation
- các metrics như IoU, AP, mAP, mIoU
- tradeoff thực tế giữa YOLO, Faster R-CNN, Mask R-CNN, và các model kiểu transformer

Dùng mục này khi câu hỏi chính là "trong scene có gì và ở đâu?"

### 3. Video Understanding & Tracking

Trọng tâm:

- temporal modeling
- multi-object tracking
- re-identification
- action recognition
- event detection
- smoothing và consistency theo thời gian

Dùng mục này khi hệ thống chạy trên stream thay vì chỉ trên ảnh đơn.

### 4. 3D Vision, Geometry & Pose

Trọng tâm:

- camera intrinsics và extrinsics
- projection model
- stereo và depth
- point clouds
- PnP và pose estimation
- occupancy và geometric grounding

Dùng mục này khi perception phải ăn khớp với thế giới vật lý.

### 5. VLMs, Grounding & Open-Vocabulary Vision

Trọng tâm:

- vision-language models
- open-vocabulary detection
- grounding theo referring expression
- segmentation theo ngôn ngữ
- failure modes của grounding

Dùng mục này khi người dùng mô tả object và mục tiêu bằng natural language.

### 6. Production CV for Robotics

Trọng tâm:

- calibration drift
- synchronization và sensor latency
- confidence estimation
- degraded mode và safety
- các deployment metrics thực sự quan trọng cho robot

Dùng mục này khi bạn quan tâm độ tin cậy trong hệ thật, không chỉ demo model.

---

## Thứ tự học gợi ý

Nếu muốn học theo hướng thực dụng:

1. fundamentals và classical vision
2. detection và segmentation
3. video và tracking
4. 3D geometry và pose
5. VLMs và grounding
6. production constraints cho robotics

Thứ tự này thường cho hiểu biết sâu hơn việc nhảy thẳng vào các demo VLM.

---

## Liên hệ với các topic AI-Robotics khác

Phần Computer Vision này có giao nhau, nhưng không thay thế:

- **Robot Perception, Localization & SLAM** cho state estimation, localization, và mapping
- **Deep Learning** cho các kiến trúc neural cốt lõi
- **Robot Learning & Embodied AI** cho policy learning và action models
- **Simulation, Sim2Real & Synthetic Data** cho data generation và transfer

CV là một trụ của perception, không phải toàn bộ robotics stack.

---

## Câu hỏi Phỏng vấn

### 1) Vì sao nên tách Computer Vision thành nhiều mục nhỏ thay vì một trang lớn?

Vì lĩnh vực này bao gồm nhiều nhóm bài toán rất khác nhau: image processing, recognition, temporal perception, 3D geometry, multimodal grounding, và deployment engineering. Tách ra giúp dễ điều hướng và tư duy hơn.

### 2) Vì sao Computer Vision đặc biệt quan trọng trong robotics?

Vì robot thường cần perception có grounding không gian, nhất quán theo thời gian, và đủ tin cậy để điều khiển hành động thật trong thế giới vật lý.

### 3) Sai lầm lớn nhất khi học CV hiện đại là gì?

Là nhảy thẳng vào demo foundation model mà chưa hiểu geometry, calibration, metrics, và failure modes.
