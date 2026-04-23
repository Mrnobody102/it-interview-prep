# Detection, Segmentation & Recognition

## Tổng quan

Các bài toán recognition trả lời những câu hỏi như:

- object nào đang xuất hiện?
- nó ở đâu?
- pixel nào thuộc về nó?
- instance nào là instance nào?

Các task này là lõi của robotics vì chúng cung cấp lớp semantics nằm trên raw sensing.

---

## Phân loại bài toán

Các nhóm task quan trọng:

- **Image classification:** dự đoán nhãn cho toàn ảnh
- **Object detection:** dự đoán boxes và classes
- **Semantic segmentation:** dự đoán class cho từng pixel
- **Instance segmentation:** dự đoán mask theo từng instance
- **Panoptic segmentation:** kết hợp "stuff" và "things"

Robot càng cần tương tác vật lý thì pixel-level và instance-level understanding thường càng quan trọng.

---

## Metrics thực sự quan trọng

Các metric thường gặp:

- **Top-1 / Top-5 accuracy** cho classification
- **IoU** cho overlap về localization
- **AP / mAP** cho detection
- **mIoU** cho semantic segmentation
- **PQ** cho panoptic segmentation

Nhưng deploy trong robotics còn cần thêm:

- latency trên đúng phần cứng mục tiêu
- small-object recall
- false positive rate trong clutter
- calibration của confidence
- temporal stability

Một detector benchmark đẹp vẫn có thể vô dụng nếu output bị flicker hoặc thường bỏ sót vật nhỏ quan trọng về safety.

---

## Các họ detector

Các nhóm detector lớn:

- **Two-stage detectors** như Faster R-CNN
- **One-stage detectors** như SSD và YOLO
- **Transformer-based detectors** như các biến thể DETR

Tradeoff điển hình:

- hai giai đoạn thường tối đa hóa accuracy
- một giai đoạn thường thắng về tốc độ và độ đơn giản khi deploy
- detector kiểu transformer làm đơn giản hóa vài lựa chọn thiết kế nhưng có thể nặng hơn và khó tune cho real-time

Trong robotics, họ YOLO vẫn rất phổ biến vì cân bằng tốt giữa tốc độ và chất lượng trên phần cứng thực tế.

---

## Các họ segmentation

Các kiểu segmentation quan trọng:

- encoder-decoder CNN như U-Net
- kiến trúc kiểu DeepLab với atrous convolution
- model segmentation kiểu transformer nhẹ
- hệ segmentation có thể prompt để dùng tương tác hoặc theo ngôn ngữ

Segmentation đặc biệt giá trị khi:

- biên object quan trọng
- vùng có thể grasp quan trọng
- free space quan trọng
- cần đo đạc ở mức pixel

Với nhiều task robot, segmentation hữu ích về mặt vận hành hơn bounding box.

---

## Recognition trong điều kiện long-tail

Recognition fail nặng nhất trên:

- category hiếm
- object nhìn giống nhau
- object nhỏ hoặc mảnh
- object bị che khuất
- góc nhìn lạ
- background và ánh sáng bị domain shift

Đó là lý do thiết kế dataset rất quan trọng:

- cân bằng class
- hard negatives
- long-tail coverage
- boxes và masks chính xác
- scene giống môi trường deploy

Label tốt và data thực tế thường quan trọng hơn việc thử mù hàng loạt kiến trúc.

---

## Quyết định train mang tính thực tế

Các quyết định quan trọng:

- input resolution
- anchor-free hay anchor-based
- độ hạt của class taxonomy
- tiêu chuẩn chất lượng label
- chiến lược augmentation
- confidence threshold và NMS threshold

Với segmentation còn phải quan tâm:

- độ phân giải của mask
- chất lượng vùng biên
- class imbalance
- thiết kế loss như cross-entropy, Dice, hoặc focal loss

Train không chỉ là tối đa hóa một metric. Nó là chuyện khớp với operating regime thật.

---

## Recognition cho robotics

Robotics làm mục tiêu thay đổi:

- inference real-time quan trọng
- class có thể được định nghĩa theo task chứ không theo benchmark
- pose và affordance có thể quan trọng hơn taxonomy
- tính nhất quán theo thời gian quan trọng
- false positive có thể kích hoạt hành động xấu

Ví dụ:

- robot kho có thể quan tâm mép pallet và fork pocket hơn là taxonomy object chung
- mobile manipulator có thể quan tâm grasp region hơn là image-level label
- home robot có thể cần open-set handling vì môi trường luôn thay đổi

Chất lượng recognition nên được đánh giá bằng chất lượng của quyết định downstream.

---

## Câu hỏi Phỏng vấn

### 1) Vì sao mAP có thể chưa đủ làm deployment metric?

Vì nó không phản ánh latency, temporal stability, confidence calibration, hay chi phí failure theo task trong môi trường deploy.

### 2) Khi nào segmentation hữu ích hơn detection?

Khi biên object, vùng chiếm chỗ, free space, hoặc vùng thao tác tinh quan trọng hơn bounding box thô.

### 3) Vì sao hệ robotics thường thích one-stage detector?

Vì chúng thường cho real-time performance tốt hơn và tradeoff deploy đơn giản hơn, trong khi accuracy vẫn đủ mạnh cho nhiều task thực tế.
