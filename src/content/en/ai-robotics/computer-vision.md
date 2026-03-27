# Computer Vision

## Overview

Computer Vision (CV) enables machines to extract meaningful information from images and video. From classic filter-based approaches to modern deep learning, CV has transformed industries ranging from healthcare (medical imaging) to automotive (autonomous driving) to retail (visual search).

The field progresses through several task levels:

1. **Image-level:** classification, retrieval
2. **Region-level:** object detection, instance segmentation
3. **Pixel-level:** semantic segmentation, depth estimation
4. **Scene-level:** scene understanding, 3D reconstruction

---

## Image Fundamentals

## Pixels and Color Spaces

A digital image is a grid of pixels. Each pixel stores color information.

| Color Space | Channels | Use Cases |
|---|---|---|
| **RGB** | Red, Green, Blue | Standard display, most cameras |
| **BGR** | Blue, Green, Red | OpenCV default (historical reason) |
| **Grayscale** | Single intensity | Face detection, edge detection |
| **HSV** | Hue, Saturation, Value | Color-based segmentation, tracking |
| **LAB** | Lightness, A (green-red), B (blue-yellow) | Color correction, perceptual uniformity |

HSV is particularly useful because Hue separates color from brightness, making it robust to lighting variations.

## Image Transformations

| Transformation | Description | Code |
|---|---|---|
| **Resize** | Scale image to target dimensions | `cv2.resize(img, (W, H))` |
| **Rotate** | Rotate by angle | `cv2.getRotationMatrix2D`, `cv2.warpAffine` |
| **Flip** | Mirror horizontally/vertically | `cv2.flip(img, 0/1/-1)` |
| **Crop** | Extract region of interest | `img[y:y+h, x:x+w]` |
| **Translate** | Shift image by (dx, dy) | `cv2.warpAffine` with translation matrix |
| **Perspective** | Apply 4-point transform | `cv2.getPerspectiveTransform` |

---

## Image Filtering and Edge Detection

## Linear Filters

Convolution with a kernel:

```python
import cv2
import numpy as np

img = cv2.imread("image.jpg", cv2.IMREAD_GRAYSCALE)

# Box blur (average)
box_blur = cv2.blur(img, (5, 5))

# Gaussian blur (weighted average, better for noise)
gaussian = cv2.GaussianBlur(img, (5, 5), sigmaX=1.5)

# Sharpening (enhance edges)
kernel_sharpen = np.array([[-1,-1,-1],
                           [-1, 9,-1],
                           [-1,-1,-1]])
sharpened = cv2.filter2D(img, -1, kernel_sharpen)
```

## Edge Detection

```python
# Sobel: gradient in X and Y directions
sobel_x = cv2.Sobel(img, cv2.CV_64F, 1, 0, ksize=3)
sobel_y = cv2.Sobel(img, cv2.CV_64F, 0, 1, ksize=3)
sobel = cv2.magnitude(sobel_x, sobel_y)

# Laplacian: second derivative (detects zero-crossings)
laplacian = cv2.Laplacian(img, cv2.CV_64F)

# Canny: multi-stage edge detector (best overall)
# 1. Gaussian blur  2. Gradient magnitude/direction
# 3. Non-maximum suppression  4. Hysteresis thresholding
edges = cv2.Canny(img, threshold1=50, threshold2=150)
```

Canny edge detection is the industry standard because it produces thin, continuous edges with sub-pixel localization.

---

## Feature Detection and Description

Classical CV features extract distinctive patterns for matching and recognition.

## SIFT (Scale-Invariant Feature Transform)

- Detects keypoints at extrema of Difference-of-Gaussians (DoG) pyramid
- Computes orientation from gradient histograms
- Generates 128-dimensional descriptors
- Scale and rotation invariant
- Patented (now open, but use ORB for free alternatives)

## ORB (Oriented FAST and Rotated BRIEF)

- Free alternative to SIFT/SURF
- Uses FAST for keypoint detection + BRIEF for descriptors
- Adds orientation component and rotation correction to BRIEF
- Much faster, competitive accuracy

## HOG (Histogram of Oriented Gradients)

- Divides image into cells and computes gradient histograms
- Used as input to SVM (before deep learning)
- Still effective for pedestrian detection

```python
import cv2
from skimage.feature import hog

# HOG feature extraction
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

Object detection outputs bounding boxes and class labels for all objects in an image.

## Key Metrics

- **IoU (Intersection over Union):** `Area(gt ∩ pred) / Area(gt ∪ pred)`. The standard for measuring localization accuracy.
- **AP (Average Precision):** Area under the precision-recall curve for one class.
- **mAP (mean Average Precision):** Mean of AP across all classes.

## IoU Implementation

```python
def compute_iou(box1, box2):
    """Compute IoU between two boxes [x1, y1, x2, y2]."""
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

Removes overlapping boxes for the same object:

```python
def nms(boxes, scores, iou_threshold=0.5):
    """Apply Non-Maximum Suppression."""
    # Sort by score descending
    indices = np.argsort(scores)[::-1]
    keep = []

    while len(indices) > 0:
        current = indices[0]
        keep.append(current)
        if len(indices) == 1:
            break

        # Compute IoU with all remaining boxes
        ious = np.array([compute_iou(boxes[current], boxes[i])
                          for i in indices[1:]])
        # Keep boxes with IoU below threshold
        indices = indices[1:][ious < iou_threshold]

    return keep
```

## YOLO (You Only Look Once)

YOLO treats detection as a single regression problem, predicting boxes and classes in one forward pass. Very fast, suitable for real-time applications.

| Version | Key Changes | Speed (V100) |
|---|---|---|
| **YOLOv5** | Anchor-based, CSP backbone, mosaic augmentation | ~140 FPS |
| **YOLOv8** | Anchor-free, improved backbone/neck, better small object detection | ~160 FPS |
| **YOLOv11** | Efficient layer aggregation, C3K2 blocks | ~170 FPS |

```python
from ultralytics import YOLO

# Load pretrained model
model = YOLO("yolov8n.pt")   # nano (smallest); also: s, m, l, x

# Inference
results = model.predict(
    source="image.jpg",
    conf=0.25,           # confidence threshold
    iou=0.45,            # NMS IoU threshold
    save=True,
    save_txt=True,       # save labels in YOLO format
)

# Access results
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

Predicts bounding boxes at multiple feature map scales from a single CNN. Balances speed and accuracy, used in mobile scenarios.

## Faster R-CNN

Two-stage detector:
1. **Region Proposal Network (RPN):** generates candidate regions
2. **RoI Head:** classifies regions and refines boxes

Higher accuracy than single-shot detectors but slower.

```python
import torch
from torchvision.models.detection import fasterrcnn_resnet50_fpn
from torchvision.transforms import functional as F

model = fasterrcnn_resnet50_fpn(pretrained=True)
model.eval()

# Prepare image
img_tensor = F.to_tensor(cv2.resize(cv2.imread("image.jpg"), (800, 800)))

with torch.no_grad():
    predictions = model([img_tensor])[0]

# Filter by confidence
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

Assigns a class label to every pixel. Does not distinguish between instances of the same class.

| Model | Backbone | mIoU (Cityscapes) | Notes |
|---|---|---|---|
| **FCN** | VGG/AlexNet | ~65% | First end-to-end CNN for segmentation |
| **DeepLabV3+** | ResNet/Xception | ~82% | ASPP module, decoder |
| **U-Net** | Custom | High on medical data | Encoder-decoder with skip connections |
| **SegFormer** | Transformer | ~84% | Lightweight, efficient |

```python
import segmentation_models_pytorch as smp

# U-Net with ImageNet pretrained ResNet34 encoder
model = smp.Unet(
    encoder_name="resnet34",
    encoder_weights="imagenet",
    in_channels=3,
    classes=21,          # e.g., Pascal VOC (20 classes + background)
)

# Inference
model.eval()
with torch.no_grad():
    pred = model(image_tensor.unsqueeze(0))
    mask = pred.argmax(dim=1).squeeze(0).numpy()
```

## Instance Segmentation

Distinguishes individual object instances within the same class. The state-of-the-art approach is Mask R-CNN, which adds a segmentation branch on top of Faster R-CNN.

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

| Task | What it Labels | Example |
|---|---|---|
| Semantic | Per-pixel class | All people get label "person" |
| Instance | Per-pixel class + instance ID | Each person gets unique ID |
| Panoptic | Combines both (stuff + things) | Labels both instances and background |

---

## Face Recognition

Face recognition is a specialized CV task with distinct stages:

1. **Face Detection:** localize faces in the image
2. **Face Alignment:** normalize pose and illumination
3. **Face Embedding:** map face to a compact vector
4. **Face Verification/Identification:** compare embeddings

## Modern Face Recognition with DeepFace

```python
from deepface import DeepFace
import cv2

# Verification: are two faces the same person?
result = DeepFace.verify(
    img1_path="person1.jpg",
    img2_path="person2.jpg",
    model_name="ArcFace",         # ArcFace, Facenet, VGG-Face, etc.
    detector_backend="retinaface",
)
print("Same person:", result["verified"], "Distance:", result["distance"])

# Recognition: find identity in database
df = DeepFace.find(
    img_path="unknown.jpg",
    db_path="./face_database/",
    model_name="ArcFace",
)

# Embedding extraction
embedding = DeepFace.represent(
    img_path="person.jpg",
    model_name="ArcFace",
)[0]["embedding"]
print(f"Embedding dimension: {len(embedding)}")
```

## Face Embedding Models

| Model | Embedding Dim | Accuracy (LFW) | Notes |
|---|---|---|---|
| **FaceNet** | 128 | 99.65% | Triplet loss, Google |
| **ArcFace** | 512 | 99.82% | Additive angular margin loss, best open model |
| **VGGFace2** | 2048/512 | 99.50% | Large-scale training data |

---

## Transfer Learning with Pretrained Models

For most CV tasks, start with a pretrained model and fine-tune.

```python
import torch
from torchvision.models import efficientnet_b0, EfficientNet_B0_Weights

# Load pretrained
model = efficientnet_b0(weights=EfficientNet_B0_Weights.IMAGENET1K_V1)

# Replace classifier head
num_features = model.classifier[1].in_features
model.classifier[1] = torch.nn.Linear(num_features, num_classes)

# Fine-tune: lower LR for backbone
optimizer = torch.optim.AdamW([
    {"params": model.features.parameters(), "lr": 1e-4},
    {"params": model.classifier.parameters(), "lr": 1e-3},
], weight_decay=0.01)

# Training loop with early stopping and model checkpointing
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

ViT applies the Transformer architecture to image patches. The image is split into fixed-size patches (e.g., 16x16), linearly embedded, and processed by a standard Transformer encoder.

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

| Aspect | CNN (e.g., ResNet) | ViT |
|---|---|---|
| Inductive bias | Locality + translation equivariance | Minimal (needs more data) |
| Data efficiency | Works well on small datasets | Needs large datasets or strong augmentation |
| Long-range dependencies | Through deep layers | Direct via self-attention |
| Compute scaling | Grows slowly with image size | Grows quadratically with patches |
| Best for | Small-medium data, real-time | Large-scale, high-accuracy tasks |

---

## OpenCV Quick Reference

```python
import cv2
import numpy as np

# Read in different modes
img_color = cv2.imread("image.jpg", cv2.IMREAD_COLOR)      # BGR
img_gray = cv2.imread("image.jpg", cv2.IMREAD_GRAYSCALE)
img_unchanged = cv2.imread("image.jpg", cv2.IMREAD_UNCHANGED)  # includes alpha

# Convert color spaces
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

# Draw
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

## Interview Q&A

### 1) How does Canny edge detection work?

Canny applies Gaussian smoothing, computes gradient magnitude and direction via Sobel, performs non-maximum suppression to thin edges, and uses hysteresis thresholding (strong edges are kept, weak edges only if connected to strong ones).

### 2) Why is IoU better than just using box overlap?

IoU measures overlap relative to the union of both boxes, making it scale-invariant and penalizing large boxes that loosely overlap. Simple overlap percentage can give misleadingly high scores.

### 3) Semantic vs Instance segmentation: which is harder and why?

Instance segmentation is harder because it requires both pixel-level classification AND distinguishing individual object boundaries. This needs either explicit detection-based approaches (Mask R-CNN) or dense instance embedding methods.

### 4) What is the difference between upsampling methods in segmentation?

- **Nearest-neighbor:** duplicates pixels (blocky, fast)
- **Bilinear interpolation:** smooth but no new information
- **Transposed convolution (deconvolution):** learnable, can create checkerboard artifacts
- **Bilinear upsampling + convolution:** combines smoothness with learned refinement (used in U-Net skip connections)

### 5) Why does data augmentation matter more for CV than for tabular ML?

Images have high dimensionality and models learn complex visual patterns. Augmentations artificially increase training data diversity (rotations, flips, color jitter, cutout, mixup) and improve generalization, especially when labeled data is expensive.

### 6) When would you use YOLO vs Faster R-CNN?

YOLO for real-time applications (video, robotics, autonomous driving) where speed is critical. Faster R-CNN when accuracy is the priority and inference time is less constrained. YOLOv8 and later versions have largely closed the accuracy gap for many tasks.
