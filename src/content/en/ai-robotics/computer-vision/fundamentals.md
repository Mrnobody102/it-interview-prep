# CV Fundamentals & Classical Vision

## Overview

Even in the era of large vision models, strong computer vision engineers still understand the lower-level mechanics of images and classical pipelines.

Why this matters:

- preprocessing decisions still affect deep models
- camera artifacts often explain failures better than architecture diagrams
- geometric and classical priors remain useful in robotics, inspection, and low-data settings

This topic covers the foundations that make later CV topics easier to reason about.

---

## Images as Signals

A digital image is a sampled signal over space.

Useful concepts:

- spatial resolution
- dynamic range
- quantization
- noise
- blur
- aliasing

Important consequence:

- many "model failures" are actually input quality failures

For robotics, this includes:

- motion blur from fast motion
- rolling shutter distortion
- exposure changes
- sensor noise in low light

---

## Color Spaces and Preprocessing

Common color spaces:

- **RGB/BGR** for display and raw model input
- **HSV** for color thresholding and simpler rule-based segmentation
- **LAB** when perceptual lightness separation matters
- **YUV / YCbCr** in video pipelines and compression systems

Preprocessing choices often include:

- resizing and aspect-ratio handling
- normalization
- histogram equalization or CLAHE
- denoising
- white-balance or color correction

Practical warning:

- if preprocessing at train time and inference time are inconsistent, deployment quality can collapse even when the model itself is fine

---

## Filtering, Edges, and Morphology

Before deep learning, many pipelines relied heavily on handcrafted operators. They still matter for:

- debugging
- region proposal heuristics
- mask cleanup
- measurement systems
- low-compute or deterministic pipelines

Typical tools:

- Gaussian blur
- Sobel and Scharr gradients
- Laplacian
- Canny edge detection
- erosion and dilation
- opening and closing
- connected-component analysis

Morphology is especially useful when segmentation masks are noisy and need cleanup before downstream geometry or counting.

---

## Keypoints, Descriptors, and Matching

Classical local features remain relevant when:

- data is limited
- interpretability matters
- you need explicit matching between views
- you are doing pose estimation or visual localization

Important families:

- **SIFT** and **SURF** for robust floating-point descriptors
- **ORB** for a fast binary alternative
- **BRISK** and **AKAZE** for efficient matching

Typical pipeline:

1. detect keypoints
2. compute descriptors
3. match descriptors
4. reject outliers with RANSAC
5. estimate transform or pose

This pattern still appears in visual odometry, pose estimation, and map alignment systems.

---

## Augmentation and Data Curation

Augmentation is not only "make more data." It encodes assumptions about invariances.

Useful augmentations:

- flips and rotations
- scale jitter
- crop and resize
- color jitter
- blur and noise injection
- cutout / mixup / mosaic, depending on the task

But augmentation must respect the problem:

- random flips can break text or asymmetric object semantics
- aggressive resizing can hurt small-object detection
- synthetic blur that does not match real cameras may teach the wrong prior

In robotics, good augmentation often tries to reflect:

- camera pose variation
- motion blur
- illumination shift
- partial occlusion
- clutter

---

## Transfer Learning and Efficient Baselines

For many projects, the first strong baseline is not a custom architecture. It is a good pretrained backbone with disciplined fine-tuning.

Common choices:

- ResNet / EfficientNet for strong CNN baselines
- ConvNeXt as a modern convolutional family
- ViT or Swin for transformer-based vision baselines

Practical baseline recipe:

1. start from pretrained weights
2. freeze or partially freeze the backbone first
3. train a small head
4. unfreeze gradually if needed
5. track data quality and label consistency before chasing model complexity

This usually beats jumping into complex modeling too early.

---

## OpenCV and Systems-Level Debugging

OpenCV remains useful because it gives fast visibility into:

- raw frames
- color conversions
- thresholding
- contours
- geometry transforms
- overlay debugging

A lot of production CV debugging still looks like:

- render inputs
- render intermediate masks or features
- compare preprocessed images to training assumptions
- inspect latency stage by stage

Strong CV engineering is not only about training. It is also about fast diagnosis.

---

## Where Classical Vision Still Wins

Classical methods are still strong when:

- the environment is controlled
- the task is narrow
- labels are scarce
- determinism matters
- compute is heavily constrained

Examples:

- document scanning
- fiducial marker detection
- industrial inspection with fixed cameras
- simple line following or bin-picking heuristics

Deep learning is powerful, but not every subproblem needs a huge model.

---

## Interview Q&A

### 1) Why do classical CV methods still matter?

Because they are interpretable, cheap, and often effective for narrow tasks, geometry-heavy problems, and debugging deep pipelines.

### 2) Why is augmentation not always beneficial?

Because augmentation encodes assumptions. If it creates unrealistic transformations, it can teach the model the wrong invariances.

### 3) When should you start with transfer learning instead of a custom model?

Almost always for a new applied project. Pretrained backbones usually provide a stronger and faster baseline than custom architectures.
