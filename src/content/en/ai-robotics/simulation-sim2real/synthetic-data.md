# Synthetic Data, Rendering & Scenario Generation

## Overview

Synthetic data is one of the most scalable outputs of simulation infrastructure.

It is especially useful for perception-heavy systems where labeling real data is expensive.

---

## Where Synthetic Data Helps

Synthetic data is strong for:

- detection and segmentation pretraining
- depth and pose tasks
- rare-scene generation
- corner-case coverage
- structured labels that would be tedious to annotate manually

It is less reliable when realism gaps dominate the target task.

---

## Scenario Design

Good scenario generation should vary:

- object identity and arrangement
- lighting and material properties
- camera placement
- motion patterns
- task difficulty

The value comes from coverage, not just volume.

---

## Rendering Tradeoffs

Important tradeoffs:

- photorealism vs generation speed
- clean labels vs noisy realism
- narrow domain fidelity vs broad diversity

Synthetic-data pipelines should be judged by downstream improvement, not only by visual quality.

---

## Interview Q&A

### 1) Why is synthetic data attractive?

Because it can generate large, labeled datasets cheaply and cover cases that are hard to collect or annotate in the real world.

### 2) Why is more synthetic data not always better?

Because poor diversity or the wrong realism assumptions can reinforce the wrong biases.

### 3) What makes a good synthetic dataset?

Coverage of relevant scenarios, useful labels, and enough realism in the aspects that matter for the downstream model.
