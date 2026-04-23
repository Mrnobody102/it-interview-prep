# CV Fundamentals & Classical Vision

## Tổng quan

Ngay cả trong thời đại của large vision models, engineer CV giỏi vẫn hiểu rõ cơ chế mức thấp của ảnh và các pipeline cổ điển.

Vì sao điều này quan trọng:

- quyết định preprocessing vẫn ảnh hưởng mạnh tới deep model
- artifact của camera thường giải thích failure tốt hơn nhiều so với sơ đồ architecture
- geometric prior và classical prior vẫn hữu ích trong robotics, inspection, và các bài toán ít dữ liệu

Chủ đề này bao phủ các nền tảng giúp các mục CV phía sau dễ reason hơn.

---

## Ảnh như một tín hiệu

Ảnh số là một tín hiệu đã được lấy mẫu theo không gian.

Các khái niệm hữu ích:

- spatial resolution
- dynamic range
- quantization
- noise
- blur
- aliasing

Hệ quả quan trọng:

- nhiều "model failure" thực ra là failure của chất lượng input

Trong robotics, điều này gồm cả:

- motion blur khi robot hoặc camera di chuyển nhanh
- rolling shutter distortion
- thay đổi exposure
- sensor noise trong điều kiện thiếu sáng

---

## Color spaces và preprocessing

Các color space thường gặp:

- **RGB/BGR** cho hiển thị và model input thô
- **HSV** cho color thresholding và rule-based segmentation đơn giản
- **LAB** khi cần tách lightness theo hướng gần với cảm nhận thị giác
- **YUV / YCbCr** trong video pipeline và hệ nén

Các bước preprocessing thường gồm:

- resize và xử lý aspect ratio
- normalization
- histogram equalization hoặc CLAHE
- denoising
- white-balance hoặc color correction

Cảnh báo thực tế:

- nếu preprocessing lúc train và inference không nhất quán, chất lượng deploy có thể sụp dù model không đổi

---

## Filtering, edges và morphology

Trước deep learning, nhiều pipeline dựa rất mạnh vào các toán tử thủ công. Chúng vẫn quan trọng cho:

- debugging
- heuristic region proposal
- làm sạch mask
- hệ đo lường
- các pipeline deterministic hoặc ít compute

Các công cụ thường gặp:

- Gaussian blur
- Sobel và Scharr gradient
- Laplacian
- Canny edge detection
- erosion và dilation
- opening và closing
- connected-component analysis

Morphology đặc biệt hữu ích khi segmentation mask bị nhiễu và cần làm sạch trước khi đưa vào geometry hoặc bước đếm.

---

## Keypoints, descriptors và matching

Classical local features vẫn còn giá trị khi:

- dữ liệu hạn chế
- cần tính giải thích
- cần matching tường minh giữa nhiều góc nhìn
- đang làm pose estimation hoặc visual localization

Các họ phương pháp quan trọng:

- **SIFT** và **SURF** cho floating-point descriptors bền vững
- **ORB** như một lựa chọn binary nhanh
- **BRISK** và **AKAZE** cho matching hiệu quả

Pipeline điển hình:

1. phát hiện keypoints
2. tính descriptors
3. matching descriptors
4. loại outlier bằng RANSAC
5. ước lượng transform hoặc pose

Pattern này vẫn xuất hiện trong visual odometry, pose estimation, và map alignment.

---

## Augmentation và data curation

Augmentation không chỉ là "tăng dữ liệu". Nó còn mã hóa giả định về tính bất biến.

Các augmentation hữu ích:

- flips và rotations
- scale jitter
- crop và resize
- color jitter
- blur và noise injection
- cutout / mixup / mosaic tùy bài toán

Nhưng augmentation phải tôn trọng bản chất bài toán:

- random flips có thể phá text hoặc ý nghĩa bất đối xứng
- resize quá mạnh có thể làm hỏng small-object detection
- blur mô phỏng sai camera thật có thể dạy model prior sai

Trong robotics, augmentation tốt thường cố phản ánh:

- thay đổi pose của camera
- motion blur
- thay đổi ánh sáng
- che khuất một phần
- clutter

---

## Transfer learning và baseline hiệu quả

Với nhiều dự án, baseline mạnh đầu tiên không phải custom architecture mà là pretrained backbone tốt với fine-tuning có kỷ luật.

Các lựa chọn thường gặp:

- ResNet / EfficientNet cho baseline CNN mạnh
- ConvNeXt như một họ convolution hiện đại
- ViT hoặc Swin cho baseline vision kiểu transformer

Công thức baseline thực dụng:

1. bắt đầu từ pretrained weights
2. freeze hoặc partial-freeze backbone trước
3. train head nhỏ
4. unfreeze dần nếu cần
5. theo dõi data quality và label consistency trước khi tăng độ phức tạp của model

Cách này thường tốt hơn việc nhảy vào mô hình phức tạp quá sớm.

---

## OpenCV và debugging ở mức hệ thống

OpenCV vẫn hữu ích vì nó cho khả năng quan sát nhanh:

- raw frames
- color conversions
- thresholding
- contours
- geometry transforms
- overlay để debug

Rất nhiều công việc debug CV trong production vẫn là:

- render input
- render mask hoặc intermediate feature
- so sánh ảnh sau preprocessing với giả định lúc train
- kiểm tra latency từng stage

CV engineering mạnh không chỉ là train model. Nó còn là chẩn đoán nhanh.

---

## Khi nào classical vision vẫn thắng

Classical methods vẫn mạnh khi:

- môi trường được kiểm soát
- task hẹp
- ít labels
- cần tính deterministic
- compute bị giới hạn mạnh

Ví dụ:

- document scanning
- fiducial marker detection
- industrial inspection với camera cố định
- line following hoặc heuristic bin-picking đơn giản

Deep learning rất mạnh, nhưng không phải mọi bài toán con đều cần model lớn.

---

## Câu hỏi Phỏng vấn

### 1) Vì sao các phương pháp CV cổ điển vẫn quan trọng?

Vì chúng dễ giải thích, rẻ, và thường hiệu quả cho các task hẹp, bài toán nặng về geometry, hoặc debugging pipeline deep learning.

### 2) Vì sao augmentation không phải lúc nào cũng có lợi?

Vì augmentation mã hóa giả định. Nếu nó tạo ra biến đổi không thực tế, model sẽ học sai tính bất biến cần thiết.

### 3) Khi nào nên bắt đầu bằng transfer learning thay vì tự thiết kế model?

Gần như luôn luôn với một dự án ứng dụng mới. Pretrained backbone thường cho baseline mạnh hơn và nhanh hơn custom architecture.
