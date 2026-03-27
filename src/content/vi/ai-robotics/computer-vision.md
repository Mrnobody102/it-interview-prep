# Computer Vision

## Tổng quan

Computer Vision cho phép máy tính "nhìn" và hiểu hình ảnh/video.

## Image Processing cơ bản

```python
import cv2
import numpy as np

# Đọc và hiển thị
img = cv2.imread('image.jpg')
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

# Filters
blur = cv2.GaussianBlur(img, (5, 5), 0)
edges = cv2.Canny(img, 100, 200)

# Morphological operations
kernel = np.ones((5,5), np.uint8)
dilated = cv2.dilate(edges, kernel, iterations=1)
eroded = cv2.erode(dilated, kernel, iterations=1)
```

## Object Detection

### YOLO (You Only Look Once)

```python
import torch
from ultralytics import YOLO

# Load pretrained model
model = YOLO('yolov8n.pt')

# Detect objects
results = model.predict(source='image.jpg', conf=0.5)

# Draw results
for r in results:
    for box in r.boxes:
        x1, y1, x2, y2 = box.xyxy[0]
        conf = box.conf[0]
        cls = box.cls[0]
        label = f"{model.names[int(cls)]}: {conf:.2f}"
        cv2.rectangle(img, (int(x1), int(y1)),
                      (int(x2), int(y2)), (0, 255, 0), 2)
```

### SSD / Faster R-CNN

```python
from torchvision.models.detection import fasterrcnn_resnet50_fpn

model = fasterrcnn_resnet50_fpn(pretrained=True)
model.eval()

# Inference
with torch.no_grad():
    predictions = model([torch.rand(3, 600, 800)])[0]
    boxes = predictions['boxes']
    labels = predictions['labels']
    scores = predictions['scores']
```

## Image Segmentation

### Semantic Segmentation

```python
import segmentation_models_pytorch as smp

model = smp.Unet(
    encoder_name="resnet34",
    encoder_weights="imagenet",
    in_channels=3,
    classes=21
)

# Predict
mask = model.predict(image_tensor)
```

### Instance Segmentation (Mask R-CNN)

```python
from torchvision.models.detection import maskrcnn_resnet50_fpn

model = maskrcnn_resnet50_fpn(pretrained=True)
model.eval()

with torch.no_grad():
    predictions = model(images)
    masks = predictions[0]['masks']
    scores = predictions[0]['scores']
```

## Face Recognition

```python
import face_recognition

# Load và encode
image = face_recognition.load_image_file("person.jpg")
encodings = face_recognition.face_encodings(image)[0]

# Compare
unknown_image = face_recognition.load_image_file("unknown.jpg")
unknown_encoding = face_recognition.face_encodings(unknown_image)[0]

match = face_recognition.compare_faces([encodings], unknown_encoding)
distance = face_recognition.face_distance([encodings], unknown_encoding)
```

## Câu hỏi phỏng vấn

### 1. IoU (Intersection over Union) là gì?

IoU = Intersection / Union của hai bounding boxes. Dùng để đánh giá object detection — IoU > 0.5 thường được coi là "correct detection".

### 2. NMS (Non-Maximum Suppression) hoạt động thế nào?

Loại bỏ overlapping boxes cho cùng một object. Sort boxes theo confidence, giữ box có confidence cao nhất, loại các boxes có IoU > threshold với nó.

### 3. Sự khác nhau giữa Semantic và Instance Segmentation?

Semantic segmentation: gán class label cho mỗi pixel. Instance segmentation: phân biệt individual instances của cùng class.
