# CNNs, RNNs & Core Deep Learning Architectures

## Overview

Not every problem needs a transformer.

Core deep architectures still matter because each one encodes a useful inductive bias:

- CNNs assume locality and translation structure
- recurrent models assume temporal recurrence
- residual architectures improve gradient flow through depth

Understanding those biases helps you choose simpler, faster, and often more robust models.

---

## Convolutional Neural Networks

CNNs apply shared filters across local neighborhoods. This gives two major advantages:

- far fewer parameters than fully connected image models
- strong bias for spatial pattern reuse

Key components:

- convolution layers
- stride and padding
- pooling or strided downsampling
- normalization
- residual or skip connections

CNNs are still very strong for:

- embedded vision
- real-time detection
- small-data industrial inspection
- segmentation with strong spatial priors

### Why ResNets Matter

Residual connections learn `F(x) + x` instead of forcing a block to learn the entire mapping from scratch. This makes deep models much easier to optimize.

That idea later influenced many other model families, not only CNNs.

---

## U-Net, FPN, and Task-Specific Backbones

In real projects, you rarely use a plain classifier backbone alone.

Important patterns include:

- **U-Net** for dense prediction and medical / industrial segmentation
- **Feature Pyramid Networks (FPN)** for multi-scale detection
- **encoder-decoder** designs for depth estimation and restoration
- **lightweight CNNs** such as MobileNet or EfficientNet-style families for edge deployment

Architecture choice is often driven by resolution, latency budget, and output structure.

---

## Recurrent Models: RNN, LSTM, and GRU

Before transformers dominated sequence modeling, recurrent networks were the standard way to process ordered data.

### Why Vanilla RNNs Fail

They struggle with long-term dependencies because backpropagation through time amplifies vanishing or exploding gradients.

### Why LSTM and GRU Help

They introduce gating mechanisms that decide:

- what to keep in memory
- what to forget
- what to expose as output

These models are still relevant when:

- sequence length is modest
- latency matters
- hardware is limited
- the problem needs online state updates rather than full-sequence attention

---

## Inductive Bias and Model Choice

You should choose architectures by matching assumptions to the data:

| Problem pattern | Strong candidate |
|---|---|
| Images with local texture cues | CNN |
| Dense pixel prediction | U-Net / encoder-decoder |
| Short online sensor streams | GRU / LSTM / temporal CNN |
| Very long-range sequence reasoning | Transformer |
| Tiny edge device with fixed task | Compact CNN or hybrid model |

The most fashionable model is not automatically the best production model.

---

## Architecture Choice in AI-Robotics

For robotics, classical deep architectures remain useful because:

- control loops may not tolerate heavy attention stacks
- edge devices may have strict power limits
- perception tasks often benefit from strong geometric locality
- online filtering and recurrence help with temporal smoothness

Examples:

- CNN backbone + small transformer head
- GRU over proprioception + vision encoder for short-horizon policy state
- U-Net style segmentation for grasp-region prediction

Hybrid systems are common because they balance accuracy and real-time behavior.

---

## Interview Q&A

### 1) Why are CNNs still relevant in 2026?

Because they are efficient, data-efficient, and often easier to deploy for real-time perception and embedded systems than larger transformer-only models.

### 2) What problem do residual connections solve?

They improve gradient flow and make deep networks easier to optimize by learning residual transformations instead of full mappings.

### 3) When would you still choose LSTM or GRU over a transformer?

When you need low-latency online updates, modest sequence length, smaller memory usage, or a simpler recurrent state on edge hardware.

### 4) What is inductive bias in deep learning?

It is the structural assumption a model makes about data. Good inductive bias can reduce data needs and improve robustness.
