# VLA Models, World Models & Embodied FMs

## Overview

Embodied foundation-model work in 2025-2026 increasingly centers on:

- vision-language-action models
- world models
- action chunking
- latent planning

These models aim to connect perception and language to action at scale.

---

## VLA Models

Vision-language-action models typically combine:

- visual tokens
- language instructions
- action prediction

Their promise is broad generalization across tasks, but their challenge is reliable execution under real-world noise.

---

## World Models

World models try to learn:

- latent dynamics
- plausible futures
- action-conditioned transitions

This can help planning, error detection, and policy improvement.

But world models are only as useful as their alignment with the real environment.

---

## What Changed in 2025-2026

Recent shifts include:

- more action-token and chunk-based policies
- larger multimodal pretrained backbones
- stronger interest in embodied foundation-model evaluation
- growing emphasis on deployment realism rather than demo-only results

The field is moving from isolated benchmark wins toward broader systems integration.

---

## Interview Q&A

### 1) What is a VLA model?

It is a model that combines vision, language, and action into one policy or decision architecture.

### 2) Why are world models interesting in robotics?

Because they can represent future dynamics and support planning or safer action selection.

### 3) Why are embodied foundation models still difficult to deploy?

Because real robots impose latency, safety, calibration, and distribution-shift constraints that are much harsher than demo settings.
