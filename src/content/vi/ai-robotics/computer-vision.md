# Computer Vision

## Tổng quan

Computer Vision (CV) cho phép máy móc trích xuất thông tin có ý nghĩa từ hình ảnh và video. Từ các phương pháp filter-based cổ điển đến deep learning hiện đại, CV đã chuyển đổi các ngành từ y tế (chẩn đoán hình ảnh) đến ô tô (lái xe tự động) đến bán lẻ (tìm kiếm hình ảnh).

Lĩnh vực này tiến triển qua nhiều cấp độ:

1. **Cấp độ hình ảnh:** phân loại, tìm kiếm
2. **Cấp độ vùng:** phát hiện đối tượng, instance segmentation
3. **Cấp độ pixel:** semantic segmentation, ước lượng độ sâu
4. **Cấp độ cảnh:** hiểu cảnh, tái tạo 3D

---

## Nền tảng về Hình ảnh

## Pixels và Color Spaces

Hình ảnh số là một lưới các pixels. Mỗi pixel lưu trữ thông tin màu.

| Color Space | Các kênh | Trường hợp sử dụng |
|---|---|---|
| **RGB** | Red, Green, Blue | Hiển thị tiêu chuẩn, hầu hết cameras |
| **BGR** | Blue, Green, Red | Mặc định của OpenCV (lý do lịch sử) |
| **Grayscale** | Cường độ đơn | Phát hiện khuôn mặt, phát hiện cạnh |
| **HSV** | Hue, Saturation, Value | Segmentation dựa trên màu, tracking |
| **LAB** | Lightness, A (green-red), B (blue-yellow) | Hiệu chỉnh màu, tính nhất quán cảm giác |

HSV đặc biệt hữu ích vì Hue tách màu khỏi độ sáng, khiến nó bền vững với các biến thể về ánh sáng.

## Các Phép Biến đổi Hình ảnh

| Phép biến đổi | Mô tả | Code |
|---|---|---|
| **Resize** | Scale ảnh đến kích thước mong muốn | `cv2.resize(img, (W, H))` |
| **Rotate** | Xoay theo góc | `cv2.getRotationMatrix2D`, `cv2.warpAffine` |
| **Flip** | Lật ngang/dọc | `cv2.flip(img, 0/1/-1)` |
| **Crop** | Trích xuất vùng quan tâm | `img[y:y+h, x:x+w]` |
| **Translate** | Dịch ảnh theo (dx, dy) | `cv2.warpAffine` với ma trận dịch |
| **Perspective** | Áp dụng phép biến đổi 4 điểm | `cv2.getPerspectiveTransform` |

---

## Lọc Ảnh và Phát hiện Cạnh

## Bộ lọc Tuyến tính

Convolution với một kernel:

```python
import cv2
import numpy as np

img = cv2.imread("image.jpg", cv2.IMREAD_GRAYSCALE)

# Box blur (trung bình)
box_blur = cv2.blur(img, (5, 5))

# Gaussian blur (trung bình có trọng số, tốt hơn cho noise)
gaussian = cv2.GaussianBlur(img, (5, 5), sigmaX=1.5)

# Sharpening (tăng cường cạnh)
kernel_sharpen = np.array([[-1,-1,-1],
                           [-1, 9,-1],
                           [-1,-1,-1]])
sharpened = cv2.filter2D(img, -1, kernel_sharpen)
```

## Phát hiện Cạnh

```python
# Sobel: gradient theo hướng X và Y
sobel_x = cv2.Sobel(img, cv2.CV_64F, 1, 0, ksize=3)
sobel_y = cv2.Sobel(img, cv2.CV_64F, 0, 1, ksize=3)
sobel = cv2.magnitude(sobel_x, sobel_y)

# Laplacian: đạo hàm bậc hai (phát hiện zero-crossings)
laplacian = cv2.Laplacian(img, cv2.CV_64F)

# Canny: bộ phát hiện cạnh đa giai đoạn (tổng thể tốt nhất)
# 1. Gaussian blur  2. Gradient magnitude/direction
# 3. Non-maximum suppression  4. Hysteresis thresholding
edges = cv2.Canny(img, threshold1=50, threshold2=150)
```

Canny edge detection là tiêu chuẩn công nghiệp vì nó tạo ra các cạnh mỏng, liên tục với sub-pixel localization.

---

## Phát hiện và Mô tả Đặc trưng

Các đặc trưng CV cổ điển trích xuất các pattern đặc biệt cho matching và recognition.

## SIFT (Scale-Invariant Feature Transform)

- Phát hiện keypoints tại các extrema của Difference-of-Gaussians (DoG) pyramid
- Tính orientation từ gradient histograms
- Tạo descriptors 128 chiều
- Bất biến với scale và rotation
- Đã patent (hiện đã mở, nhưng dùng ORB cho alternatives miễn phí)

## ORB (Oriented FAST and Rotated BRIEF)

- Alternative miễn phí cho SIFT/SURF
- Dùng FAST cho keypoint detection + BRIEF cho descriptors
- Thêm orientation component và rotation correction vào BRIEF
- Nhanh hơn nhiều, độ chính xác cạnh tranh được

## HOG (Histogram of Oriented Gradients)

- Chia ảnh thành cells và tính gradient histograms
- Dùng như input cho SVM (trước deep learning)
- Vẫn hiệu quả cho phát hiện người đi bộ

```python
import cv2
from skimage.feature import hog

# Trích xuất HOG features
features, hog_image = hog(
    img,
    orientations=9,
    pixels_per_cell=(8, 8),
    cells_per_block=(2, 2),
    visualize=True,
    feature_vector=True,
)

# SIFT
sift = cv2.SIFT_create()
keypoints, descriptors = sift.detectAndCompute(img, None)
img_sift = cv2.drawKeypoints(img, keypoints, None)

# ORB
orb = cv2.ORB_create(nfeatures=500)
keypoints_orb, descriptors_orb = orb.detectAndCompute(img, None)
```

---

## Object Detection

Object detection xuất ra bounding boxes và class labels cho tất cả các đối tượng trong ảnh.

## Các Metrics Quan trọng

- **IoU (Intersection over Union):** `Area(gt ∩ pred) / Area(gt ∪ pred)`. Tiêu chuẩn để đo localization accuracy.
- **AP (Average Precision):** Diện tích dưới đường precision-recall cho một class.
- **mAP (mean Average Precision):** Trung bình của AP qua tất cả các classes.

## Cài đặt IoU

```python
def compute_iou(box1, box2):
    """Tính IoU giữa hai boxes [x1, y1, x2, y2]."""
    x1 = max(box1[0], box2[0])
    y1 = max(box1[1], box2[1])
    x2 = min(box1[2], box2[2])
    y2 = min(box1[3], box2[3])

    intersection = max(0, x2 - x1) * max(0, y2 - y1)
    area1 = (box1[2] - box1[0]) * (box1[3] - box1[1])
    area2 = (box2[2] - box2[0]) * (box2[3] - box2[1])
    union = area1 + area2 - intersection
    return intersection / union if union > 0 else 0
```

## NMS (Non-Maximum Suppression)

Loại bỏ các boxes chồng chéo cho cùng một đối tượng:

```python
def nms(boxes, scores, iou_threshold=0.5):
    """Áp dụng Non-Maximum Suppression."""
    # Sắp xếp theo score giảm dần
    indices = np.argsort(scores)[::-1]
    keep = []

    while len(indices) > 0:
        current = indices[0]
        keep.append(current)
        if len(indices) == 1:
            break

        # Tính IoU với tất cả các boxes còn lại
        ious = np.array([compute_iou(boxes[current], boxes[i])
                          for i in indices[1:]])
        # Giữ các boxes có IoU dưới ngưỡng
        indices = indices[1:][ious < iou_threshold]

    return keep
```

## YOLO (You Only Look Once)

YOLO xử lý detection như một bài toán regression đơn lẻ, dự đoán boxes và classes trong một forward pass. Rất nhanh, phù hợp cho các ứng dụng real-time.

| Phiên bản | Thay đổi chính | Tốc độ (V100) |
|---|---|---|
| **YOLOv5** | Anchor-based, CSP backbone, mosaic augmentation | ~140 FPS |
| **YOLOv8** | Anchor-free, improved backbone/neck, better small object detection | ~160 FPS |
| **YOLOv11** | Efficient layer aggregation, C3K2 blocks | ~170 FPS |

```python
from ultralytics import YOLO

# Tải pretrained model
model = YOLO("yolov8n.pt")   # nano (nhỏ nhất); cũng: s, m, l, x

# Inference
results = model.predict(
    source="image.jpg",
    conf=0.25,           # confidence threshold
    iou=0.45,            # NMS IoU threshold
    save=True,
    save_txt=True,       # lưu labels theo định dạng YOLO
)

# Truy cập kết quả
for r in results:
    boxes = r.boxes
    for box in boxes:
        x1, y1, x2, y2 = box.xyxy[0].cpu().numpy()
        conf = float(box.conf[0])
        cls_id = int(box.cls[0])
        label = model.names[cls_id]
        print(f"{label}: {conf:.3f} at [{x1:.0f},{y1:.0f},{x2:.0f},{y2:.0f}]")
```

## SSD (Single Shot Detector)

Dự đoán bounding boxes ở nhiều feature map scales từ một CNN. Cân bằng tốc độ và độ chính xác, dùng trong các kịch bản mobile.

## Faster R-CNN

Two-stage detector:
1. **Region Proposal Network (RPN):** tạo các vùng ứng viên
2. **RoI Head:** phân loại các vùng và tinh chỉnh boxes

Độ chính xác cao hơn single-shot detectors nhưng chậm hơn.

```python
import torch
from torchvision.models.detection import fasterrcnn_resnet50_fpn
from torchvision.transforms import functional as F

model = fasterrcnn_resnet50_fpn(pretrained=True)
model.eval()

# Chuẩn bị ảnh
img_tensor = F.to_tensor(cv2.resize(cv2.imread("image.jpg"), (800, 800)))

with torch.no_grad():
    predictions = model([img_tensor])[0]

# Lọc theo confidence
threshold = 0.5
for i in range(len(predictions["boxes"])):
    score = predictions["scores"][i].item()
    if score > threshold:
        box = predictions["boxes"][i].numpy()
        label = predictions["labels"][i].item()
        print(f"Class {label}: {score:.3f} at {box}")
```

---

## Image Segmentation

## Semantic Segmentation

Gán một class label cho mỗi pixel. Không phân biệt giữa các instances của cùng một class.

| Model | Backbone | mIoU (Cityscapes) | Ghi chú |
|---|---|---|---|
| **FCN** | VGG/AlexNet | ~65% | CNN end-to-end đầu tiên cho segmentation |
| **DeepLabV3+** | ResNet/Xception | ~82% | ASPP module, decoder |
| **U-Net** | Custom | Cao trên dữ liệu y tế | Encoder-decoder với skip connections |
| **SegFormer** | Transformer | ~84% | Nhẹ, hiệu quả |

```python
import segmentation_models_pytorch as smp

# U-Net với ImageNet pretrained ResNet34 encoder
model = smp.Unet(
    encoder_name="resnet34",
    encoder_weights="imagenet",
    in_channels=3,
    classes=21,          # ví dụ: Pascal VOC (20 classes + background)
)

# Inference
model.eval()
with torch.no_grad():
    pred = model(image_tensor.unsqueeze(0))
    mask = pred.argmax(dim=1).squeeze(0).numpy()
```

## Instance Segmentation

Phân biệt các individual object instances trong cùng một class. Cách tiếp cận state-of-the-art là Mask R-CNN, thêm một segmentation branch lên trên Faster R-CNN.

```python
from torchvision.models.detection import maskrcnn_resnet50_fpn

model = maskrcnn_resnet50_fpn(pretrained=True)
model.eval()

with torch.no_grad():
    predictions = model(images)

for pred in predictions:
    boxes = pred["boxes"]
    labels = pred["labels"]
    scores = pred["scores"]
    masks = pred["masks"]   # (N, 1, H, W) binary masks
```

### Semantic vs Instance vs Panoptic Segmentation

| Bài toán | Những gì nó gán nhãn | Ví dụ |
|---|---|---|
| Semantic | Class cho mỗi pixel | Tất cả người được gán nhãn "person" |
| Instance | Class + Instance ID cho mỗi pixel | Mỗi người có ID duy nhất |
| Panoptic | Kết hợp cả hai (stuff + things) | Gán nhãn cả instances và background |

---

## Face Recognition

Face recognition là một CV task chuyên biệt với các giai đoạn riêng biệt:

1. **Face Detection:** định vị khuôn mặt trong ảnh
2. **Face Alignment:** chuẩn hóa pose và ánh sáng
3. **Face Embedding:** ánh xạ khuôn mặt thành một vector compact
4. **Face Verification/Identification:** so sánh embeddings

## Face Recognition Hiện đại với DeepFace

```python
from deepface import DeepFace
import cv2

# Verification: hai khuôn mặt có cùng một người?
result = DeepFace.verify(
    img1_path="person1.jpg",
    img2_path="person2.jpg",
    model_name="ArcFace",         # ArcFace, Facenet, VGG-Face, etc.
    detector_backend="retinaface",
)
print("Same person:", result["verified"], "Distance:", result["distance"])

# Recognition: tìm danh tính trong database
df = DeepFace.find(
    img_path="unknown.jpg",
    db_path="./face_database/",
    model_name="ArcFace",
)

# Trích xuất embedding
embedding = DeepFace.represent(
    img_path="person.jpg",
    model_name="ArcFace",
)[0]["embedding"]
print(f"Embedding dimension: {len(embedding)}")
```

## Các Face Embedding Models

| Model | Embedding Dim | Accuracy (LFW) | Ghi chú |
|---|---|---|---|
| **FaceNet** | 128 | 99.65% | Triplet loss, Google |
| **ArcFace** | 512 | 99.82% | Additive angular margin loss, best open model |
| **VGGFace2** | 2048/512 | 99.50% | Large-scale training data |

---

## Transfer Learning với Pretrained Models

Với hầu hết các CV tasks, bắt đầu với pretrained model và fine-tune.

```python
import torch
from torchvision.models import efficientnet_b0, EfficientNet_B0_Weights

# Tải pretrained
model = efficientnet_b0(weights=EfficientNet_B0_Weights.IMAGENET1K_V1)

# Thay thế classifier head
num_features = model.classifier[1].in_features
model.classifier[1] = torch.nn.Linear(num_features, num_classes)

# Fine-tune: LR thấp hơn cho backbone
optimizer = torch.optim.AdamW([
    {"params": model.features.parameters(), "lr": 1e-4},
    {"params": model.classifier.parameters(), "lr": 1e-3},
], weight_decay=0.01)

# Training loop với early stopping và model checkpointing
best_val_acc = 0
for epoch in range(20):
    model.train()
    for batch_x, batch_y in train_loader:
        optimizer.zero_grad()
        loss = criterion(model(batch_x), batch_y)
        loss.backward()
        optimizer.step()

    # Validation
    model.eval()
    val_acc = evaluate(model, val_loader)
    if val_acc > best_val_acc:
        best_val_acc = val_acc
        torch.save(model.state_dict(), "best_model.pth")
```

---

## Vision Transformers (ViT)

ViT áp dụng kiến trúc Transformer cho các image patches. Ảnh được chia thành các patches có kích thước cố định (ví dụ 16x16), linearly embedded, và xử lý bởi một Transformer encoder tiêu chuẩn.

```python
from transformers import ViTForImageClassification, ViTImageProcessor
from PIL import Image

processor = ViTImageProcessor.from_pretrained("google/vit-base-patch16-224")
model = ViTForImageClassification.from_pretrained("google/vit-base-patch16-224")

image = Image.open("image.jpg")
inputs = processor(images=image, return_tensors="pt")
outputs = model(**inputs)
predicted_class = outputs.logits.argmax(-1).item()
print(model.config.id2label[predicted_class])
```

| Khía cạnh | CNN (ví dụ ResNet) | ViT |
|---|---|---|
| Inductive bias | Locality + translation equivariance | Tối thiểu (cần nhiều dữ liệu hơn) |
| Hiệu quả dữ liệu | Hoạt động tốt trên small datasets | Cần large datasets hoặc strong augmentation |
| Long-range dependencies | Qua các deep layers | Trực tiếp qua self-attention |
| Compute scaling | Tăng chậm với kích thước ảnh | Tăng bậc hai với số patches |
| Tốt nhất cho | Small-medium data, real-time | Large-scale, high-accuracy tasks |

---

## OpenCV Quick Reference

```python
import cv2
import numpy as np

# Đọc ở các chế độ khác nhau
img_color = cv2.imread("image.jpg", cv2.IMREAD_COLOR)      # BGR
img_gray = cv2.imread("image.jpg", cv2.IMREAD_GRAYSCALE)
img_unchanged = cv2.imread("image.jpg", cv2.IMREAD_UNCHANGED)  # bao gồm alpha

# Chuyển đổi color spaces
rgb = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB)
hsv = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2HSV)

# Thresholding
_, binary = cv2.threshold(img_gray, 127, 255, cv2.THRESH_BINARY)
adaptive = cv2.adaptiveThreshold(img_gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                                  cv2.THRESH_BINARY, 11, 2)

# Contours
contours, hierarchy = cv2.findContours(binary, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
area = cv2.contourArea(contours[0])
perimeter = cv2.arcLength(contours[0], True)

# Vẽ
cv2.rectangle(img, (x1,y1), (x2,y2), (0,255,0), 2)
cv2.circle(img, (cx,cy), radius, (255,0,0), -1)  # -1 fills circle
cv2.putText(img, "Label", (x,y), cv2.FONT_HERSHEY_SIMPLEX, 1, (0,0,255), 2)

# Video capture
cap = cv2.VideoCapture(0)  # webcam
while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break
    cv2.imshow("Frame", frame)
    if cv2.waitKey(1) & 0xFF == ord("q"):
        break
cap.release()
cv2.destroyAllWindows()
```

---

## 3D Vision và Geometry cho Robotics

Computer vision cho robot thường là bài toán 3D chứ không chỉ là bài toán nhận diện 2D.

Các khối kiến thức quan trọng:

- camera intrinsics và extrinsics
- depth estimation
- stereo geometry
- triangulation
- pose estimation
- point cloud và voxel representation

Vì sao nó quan trọng:

- navigation cần hiểu obstacle nhất quán trong không gian
- manipulation cần object pose chứ không chỉ object class
- mobile manipulator cần perception ăn khớp với frame của robot

Nếu detection 2D không được grounding đúng xuống không gian 3D thì robot vẫn không hành động đáng tin cậy được.

---

## Video Understanding và Tracking

Rất nhiều hệ CV deploy thực tế không phải hệ xử lý từng ảnh đơn lẻ. Chúng hoạt động theo thời gian.

Các task hay gặp:

- multi-object tracking
- re-identification
- action recognition
- event detection
- temporal segmentation

Trong robotics, temporal consistency thường quan trọng hơn top-1 accuracy của từng frame:

- theo dõi object trong vài giây
- dự đoán chuyển động
- lọc detection bị nhiễu
- reason trên contact hoặc hand-object interaction

Đó là lý do video model và tracking pipeline vẫn rất quan trọng dù vision-language model ngày càng mạnh.

---

## Vision-Language Models và Grounded Perception

Các hệ vision hiện đại ngày càng hỗ trợ:

- open-vocabulary detection
- grounding theo referring expression
- phrase-to-region alignment
- segmentation từ natural language prompt

Các khả năng này đặc biệt hữu ích cho human-robot interaction:

- "nhặt cái cốc xanh gần bàn phím"
- "đi tới khung cửa đang mở bên trái"
- "tìm cái cờ-lê dưới băng ghế"

Nhưng grounded vision cho robotics vẫn phụ thuộc mạnh vào:

- calibration
- latency
- căn chỉnh 3D
- fallback behavior khi mơ hồ

Perception có điều kiện theo ngôn ngữ rất mạnh, nhưng cuối cùng vẫn phải nối lại với geometry và control.

---

## Pose estimation, mapping và occupancy

Trong robotics, nhận ra object thường là chưa đủ. Hệ thống có thể còn cần:

- 6DoF object pose
- camera-to-world alignment
- segmentation nhất quán với depth
- occupancy map hoặc voxel map
- semantic map giữ được tính nhất quán theo thời gian

Đây là cây cầu từ "nhìn thấy" sang "hành động".

Các khối xây dựng thường gặp:

- keypoint detection và PnP
- RGB-D fusion
- point cloud registration
- semantic occupancy prediction
- pose tracking theo thời gian

Model vision có benchmark đẹp vẫn có thể fail khi deploy nếu output không ổn định trong robot frame.

---

## Failure modes của robotics vision ngoài đời thực

Vision cho robotics hỏng theo những kiểu mà nhiều offline dataset chưa phản ánh đủ:

- calibration drift
- motion blur và rolling shutter
- vật thể trong suốt hoặc phản chiếu
- clutter và che khuất nặng
- ánh sáng thay đổi giữa các phòng hoặc các thời điểm trong ngày
- biến thể object thuộc long-tail
- sensor latency và dropped frames

Đó là lý do hệ vision deploy được cần nhiều hơn model accuracy:

- confidence estimation
- temporal smoothing
- fallback policy
- health check cho sensor và calibration
- degraded behavior an toàn khi perception không chắc chắn

Trong hệ vật lý, chất lượng perception phải được đánh giá bằng độ tin cậy của hành động downstream, không chỉ bằng benchmark score.

---

## Câu hỏi Phỏng vấn

### 1) Canny edge detection hoạt động như thế nào?

Canny áp dụng Gaussian smoothing, tính gradient magnitude và direction qua Sobel, thực hiện non-maximum suppression để làm mỏng các cạnh, và dùng hysteresis thresholding (cạnh mạnh được giữ, cạnh yếu chỉ được giữ nếu kết nối với cạnh mạnh).

### 2) Tại sao IoU tốt hơn chỉ dùng box overlap?

IoU đo overlap tương đối với union của cả hai boxes, khiến nó scale-invariant và phạt nặng các boxes lớn mà overlap lỏng lẻo. Simple overlap percentage có thể cho điểm cao gây hiểu nhầm.

### 3) Semantic vs Instance segmentation: cái nào khó hơn và tại sao?

Instance segmentation khó hơn vì nó cần cả pixel-level classification VÀ phân biệt các ranh giới đối tượng riêng lẻ. Điều này cần hoặc detection-based approaches rõ ràng (Mask R-CNN) hoặc dense instance embedding methods.

### 4) Khác nhau giữa các phương pháp upsampling trong segmentation là gì?

- **Nearest-neighbor:** duplicate pixels (blocky, nhanh)
- **Bilinear interpolation:** mượt nhưng không có thông tin mới
- **Transposed convolution (deconvolution):** có thể học, có thể tạo checkerboard artifacts
- **Bilinear upsampling + convolution:** kết hợp sự mượt mà với learned refinement (dùng trong U-Net skip connections)

### 5) Tại sao data augmentation quan trọng hơn với CV so với tabular ML?

Hình ảnh có dimensionality cao và models học các visual patterns phức tạp. Augmentations tăng diversity của training data một cách nhân tạo (rotations, flips, color jitter, cutout, mixup) và cải thiện generalization, đặc biệt khi labeled data đắt đỏ.

### 6) Khi nào dùng YOLO vs Faster R-CNN?

YOLO cho các ứng dụng real-time (video, robotics, autonomous driving) khi tốc độ là yếu tố quan trọng. Faster R-CNN khi độ chính xác là ưu tiên và thời gian inference ít bị ràng buộc. YOLOv8 và các phiên bản sau đã phần lớn thu hẹp khoảng cách accuracy cho nhiều tasks.

### 7) Vì sao 3D perception khó hơn 2D detection?

Vì hệ thống phải khôi phục geometry, scale, pose và tính nhất quán không gian dưới điều kiện che khuất, sensor nhiễu và calibration lỗi, chứ không chỉ phân loại pixel hay box.

### 8) Vì sao VLM không tự nó đủ cho robotics perception?

Vì robot vẫn cần output có grounding không gian, timing guarantee và hành vi đáng tin cậy khi gặp ambiguity. Hiểu semantics thôi chưa tạo ra action an toàn.

### 9) Khác nhau giữa detection và 6DoF pose estimation là gì?

Detection cho biết object xuất hiện ở đâu trong ảnh. 6DoF pose estimation cố gắng khôi phục đầy đủ vị trí và hướng của nó trong không gian 3D, thứ mà manipulation thường cần.

### 10) Điều gì làm một vision model có thể deploy lên robot, chứ không chỉ mạnh trên benchmark?

Calibration ổn định, latency có giới hạn, robustness trước environmental shift, output biết thể hiện độ tự tin, và hành vi degrade an toàn khi perception trở nên không chắc chắn.
