# Detection, Segmentation & Recognition

## Overview

Recognition tasks answer questions such as:

- what object is present?
- where is it?
- which pixels belong to it?
- which instance is which?

These tasks are core to robotics because they provide the semantic layer on top of raw sensing.

---

## Task Taxonomy

Important task types:

- **Image classification:** predict labels for the whole image
- **Object detection:** predict boxes and classes
- **Semantic segmentation:** predict class for each pixel
- **Instance segmentation:** predict per-instance masks
- **Panoptic segmentation:** combine "stuff" and "things"

The more the robot needs to interact physically, the more pixel-level and instance-level understanding usually matters.

---

## Metrics That Actually Matter

Common metrics:

- **Top-1 / Top-5 accuracy** for classification
- **IoU** for localization overlap
- **AP / mAP** for detection
- **mIoU** for semantic segmentation
- **PQ** for panoptic segmentation

But robotics deployment often needs extra metrics:

- latency at target hardware
- small-object recall
- false positive rate in clutter
- calibration of confidence
- temporal stability

A detector with a great benchmark score can still be unusable if it flickers or misses small safety-critical objects.

---

## Detector Families

Broad detector families:

- **Two-stage detectors** such as Faster R-CNN
- **One-stage detectors** such as SSD and YOLO
- **Transformer-based detectors** such as DETR variants

Typical tradeoffs:

- two-stage models often maximize accuracy
- one-stage models often win on speed and deployment simplicity
- transformer detectors simplify some design choices but can be heavier and harder to tune for real-time use

In robotics, YOLO-family models remain common because they offer a good speed/quality balance on practical hardware.

---

## Segmentation Families

Important segmentation styles:

- encoder-decoder CNNs such as U-Net
- DeepLab-style atrous architectures
- lightweight transformer segmentation models
- promptable segmentation systems for interactive or language-conditioned use

Segmentation becomes especially valuable when:

- object boundaries matter
- grasping regions matter
- free space matters
- pixel-level measurements are needed

For many robot tasks, segmentation is more operationally useful than a box.

---

## Recognition Under Long-Tail Conditions

Recognition systems fail hardest on:

- rare categories
- visually similar objects
- small or thin objects
- occluded items
- unusual viewpoints
- domain-shifted backgrounds and lighting

This is why dataset design matters so much:

- class balance
- hard negatives
- long-tail coverage
- accurate boxes and masks
- representative deployment scenes

Good labels and realistic data usually matter more than trying ten architectures blindly.

---

## Practical Training Decisions

Key decisions:

- input resolution
- anchor-free vs anchor-based setup
- class granularity
- label quality standards
- augmentation strategy
- confidence and NMS thresholds

For segmentation, also care about:

- mask resolution
- boundary quality
- class imbalance
- loss design such as cross-entropy, Dice, or focal losses

Training is not only about maximizing a single metric. It is about matching the operating regime.

---

## Recognition for Robotics

Robotics changes the objective:

- real-time inference matters
- classes may be task-defined, not benchmark-defined
- pose and affordance may matter more than taxonomy
- temporal consistency matters
- false positives can trigger bad actions

Examples:

- a warehouse robot may care more about pallet edges and fork pockets than generic object categories
- a mobile manipulator may care more about graspable regions than image-level labels
- a home robot may need open-set handling because the environment changes constantly

Recognition quality should be judged by downstream decision quality.

---

## Interview Q&A

### 1) Why can mAP be insufficient as a deployment metric?

Because it does not capture latency, temporal stability, confidence calibration, or task-specific failure costs in deployment.

### 2) When is segmentation more useful than detection?

When object boundaries, occupied area, free space, or fine manipulation regions matter more than coarse bounding boxes.

### 3) Why do robotics systems often prefer one-stage detectors?

Because they usually offer better real-time performance and simpler deployment tradeoffs while still providing strong enough accuracy for many tasks.
