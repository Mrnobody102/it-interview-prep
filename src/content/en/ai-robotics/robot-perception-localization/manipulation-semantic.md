# Manipulation Perception & Semantic Grounding

## Overview

Manipulation perception is stricter than navigation perception.

A mobile robot may tolerate small localization error. A manipulator aligning a grasp or insertion often cannot.

This topic focuses on perception for precise interaction.

---

## Hand-Eye and Object-Centric Perception

Important building blocks:

- hand-eye calibration
- end-effector frame correctness
- object detection and tracking
- 6D pose estimation

The key question is not only "what object is this?" but also "where is it relative to the robot action frame?"

---

## Affordances and Contact-Aware Perception

Manipulation often needs more than object identity.

Useful outputs include:

- grasp affordance regions
- contact points
- insertion alignment cues
- surface normal estimates
- deformation or compliance hints

This is why manipulation perception often blends geometry, semantics, and task context.

---

## Semantic Grounding and Foundation Models

Foundation models can help with:

- open-vocabulary object grounding
- language-guided object search
- coarse scene understanding
- region proposal for downstream task logic

But they still need deterministic scaffolding around:

- final grasp pose
- frame consistency
- contact safety
- low-latency execution

In physical interaction, semantic understanding alone is not enough.

---

## Failure Modes in Practice

Manipulation perception often breaks because of:

- clutter and occlusion
- reflective or textureless objects
- calibration drift
- grasp predictions without physical feasibility checks
- language grounding that identifies the right object but not the right interaction point

The last meter from perception to action is usually where robotics difficulty becomes obvious.

---

## Interview Q&A

### 1) Why is manipulation perception harder than simple object detection?

Because the robot needs spatially precise, action-relevant information rather than just semantic labels or bounding boxes.

### 2) What is hand-eye calibration?

It is the calibration of the spatial relationship between a robot manipulator and its camera or sensing system.

### 3) Why are affordances important?

Because knowing an object category is not enough; the robot also needs to know where and how interaction is feasible.

### 4) Why are foundation models not sufficient by themselves for manipulation?

Because physical interaction requires precise geometry, low latency, and safety constraints that free-form semantic reasoning alone does not guarantee.
