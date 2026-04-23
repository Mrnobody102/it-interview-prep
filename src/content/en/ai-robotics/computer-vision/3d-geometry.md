# 3D Vision, Geometry & Pose

## Overview

For robotics, perception must often be grounded in 3D space.

That means computer vision is not only about recognition. It is also about recovering:

- geometry
- depth
- relative pose
- object pose
- occupancy of the environment

This topic sits at the boundary between CV, robotics, and estimation.

---

## Camera Models

Important concepts:

- pinhole projection
- focal length
- principal point
- distortion parameters
- intrinsics vs extrinsics

If these are wrong, everything downstream suffers:

- depth
- triangulation
- pose estimation
- robot-frame alignment

This is why calibration is not optional in serious robotics work.

---

## Depth and Multi-View Geometry

Common depth sources:

- stereo cameras
- RGB-D cameras
- lidar
- monocular depth estimation

Useful concepts:

- epipolar geometry
- disparity
- triangulation
- scale ambiguity in monocular setups

Not all depth is equally trustworthy. In practice, each sensor has different failure modes:

- RGB-D struggles on reflective or distant surfaces
- stereo struggles on textureless regions
- monocular depth depends heavily on learned priors

---

## Point Clouds and Spatial Representations

Once data is in 3D, common representations include:

- point clouds
- voxel grids
- signed distance fields
- occupancy maps
- learned latent 3D features

These are useful for:

- obstacle reasoning
- scene reconstruction
- collision checking
- manipulation planning

Representation choice always trades off memory, fidelity, and compute.

---

## Pose Estimation

Pose estimation tries to recover:

- camera pose
- object pose
- robot-relative pose of important entities

Typical tools:

- keypoint detection
- PnP
- ICP for alignment
- marker-based estimation
- learned pose estimators

In robotics, 6DoF pose estimation is often the bridge from recognition to action:

- grasp planning
- insertion tasks
- bin picking
- visual servoing

---

## Occupancy, Mapping, and the SLAM Boundary

Computer vision overlaps with mapping, but it does not replace SLAM or state estimation.

CV contributes:

- depth cues
- landmarks
- semantic understanding
- object-level priors

Localization and SLAM add:

- state estimation over time
- uncertainty handling
- map consistency
- pose graph or filtering logic

Use this CV topic for the visual and geometric side. Use the robotics perception/localization topic for the broader estimation stack.

---

## Geometry Failure Modes

Common failure causes:

- bad intrinsics or extrinsics
- mis-synchronized sensors
- rolling shutter distortion
- partial occlusion
- ambiguous correspondences
- noisy depth near edges or reflective materials

This is why "the detector found the object" is not the same as "the robot knows where it is."

---

## Interview Q&A

### 1) Why is calibration so important in 3D vision?

Because projection geometry depends directly on camera parameters. Small calibration errors can create large downstream errors in depth, pose, and robot alignment.

### 2) What is the difference between detection and 6DoF pose?

Detection localizes an object in image space. 6DoF pose estimation recovers its position and orientation in 3D, which is what manipulation usually needs.

### 3) Why does monocular depth have limits for robotics?

Because scale is ambiguous and predictions depend on learned priors. Without additional cues, monocular depth can be visually plausible but physically unreliable.
