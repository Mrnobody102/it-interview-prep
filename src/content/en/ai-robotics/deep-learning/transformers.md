# Transformers, Foundation Models & Fine-tuning

## Overview

Transformers became dominant because self-attention scales better than recurrence for long-range dependency modeling and large pretraining corpora.

But interviews and production systems now require more than repeating the attention formula. You need to understand:

- architecture variants
- pretraining objectives
- fine-tuning strategies
- inference and deployment costs

---

## Self-Attention and Transformer Structure

Self-attention lets each token attend to all other relevant tokens in context:

`Attention(Q, K, V) = softmax(QK^T / sqrt(d_k)) V`

The standard block combines:

- multi-head attention
- feed-forward network
- residual connections
- normalization
- positional information

Different model families vary in how they apply masking, cross-attention, and decoding.

### Common Transformer Families

| Family | Best for |
|---|---|
| **Encoder-only** | classification, retrieval, token labeling |
| **Decoder-only** | generation, chat, code completion |
| **Encoder-decoder** | translation, summarization, structured seq2seq tasks |

---

## Pretraining Objectives and Foundation Models

Examples:

- **BERT-style MLM** learns strong contextual representations for understanding
- **GPT-style next-token prediction** scales well for generation and in-context learning
- **T5-style text-to-text** unifies many tasks behind one interface
- **multimodal pretraining** aligns image, text, audio, or action tokens

Large pretrained models work because they compress broad statistical structure before any downstream fine-tuning starts.

---

## Fine-tuning and Adaptation

### Full Fine-tuning

Update all model parameters. Best when:

- you have enough data and compute
- domain shift is large
- the model is not too large for your infra

### Parameter-Efficient Fine-tuning

Common methods:

- **LoRA**
- **QLoRA**
- adapters
- prompt or prefix tuning

These are useful when the backbone is large and you want cheaper specialization.

### What to Watch

- catastrophic forgetting
- overfitting narrow instruction data
- evaluation leakage from benchmark-style prompts
- degraded latency after quantization or adapter stacking

---

## Long Context, Retrieval, and Inference Cost

Longer context windows are useful, but not free.

Tradeoffs include:

- quadratic attention cost for many architectures
- more KV-cache memory
- weaker signal concentration when too much irrelevant context is packed in

This is why production systems often combine:

- moderate context windows
- retrieval
- summarization or memory compression
- routing between smaller and larger models

Architecture knowledge matters because model capability and serving cost are tightly linked.

---

## Why This Matters in AI-Robotics

Transformers are now used beyond language:

- vision transformers
- vision-language models
- action chunking and policy transformers
- time-series fusion across cameras, force, proprioception, and commands

But robotics adds constraints:

- bounded latency per control cycle
- safety requirements when generation is uncertain
- synchronization across multiple sensor streams

That means transformer adoption in robotics is always a systems question, not only a modeling question.

---

## Interview Q&A

### 1) Why did transformers overtake recurrent models?

Because self-attention captures long-range dependencies more directly and allows much more parallel training on modern hardware.

### 2) When is LoRA better than full fine-tuning?

When the pretrained model is large, compute is limited, and you mainly need efficient domain adaptation rather than full model re-specialization.

### 3) Why is a longer context window not always enough?

Because more tokens increase compute and memory cost, and irrelevant context can still hurt reasoning quality. Retrieval and compression often remain necessary.

### 4) Why are transformers important in robotics?

Because they provide a flexible token-based interface for multimodal fusion, planning, and action prediction, especially in embodied AI systems.
