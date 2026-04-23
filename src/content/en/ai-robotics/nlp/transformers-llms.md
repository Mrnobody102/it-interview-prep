# Transformers, LLMs & Context Windows

## Overview

Modern NLP is dominated by transformer-based models because they learn strong contextual representations and scale effectively with data and compute.

To use them well, you should understand:

- how attention works
- what differentiates encoder, decoder, and encoder-decoder families
- how context length, KV cache, and inference throughput interact

---

## Transformer Core Ideas

The transformer block combines:

- self-attention
- feed-forward network
- residual paths
- normalization
- positional information

Self-attention helps each token integrate information from other relevant positions without relying on recurrent state transitions.

### Model Families

| Family | Typical use |
|---|---|
| **Encoder-only** | classification, retrieval, NER |
| **Decoder-only** | generation, chat, code |
| **Encoder-decoder** | translation, summarization, structured generation |

Each family reflects a different tradeoff between understanding and generation.

---

## BERT, GPT, and Modern LLM Behavior

### BERT-style Models

They are optimized for contextual understanding and feature extraction. They remain strong when you need:

- high-quality embeddings
- retrieval encoders
- classification on moderate compute budgets
- token-level prediction

### GPT-style Models

They are optimized for autoregressive generation. Their strengths include:

- open-ended text generation
- in-context learning
- instruction following
- tool-calling interfaces

Modern LLM systems increasingly add routing, structured outputs, and external retrieval around the base model.

---

## Context Windows and Inference Scaling

Large context windows are useful, but they change system design.

Important constraints:

- memory usage from KV cache
- latency from long prompts
- degraded signal quality when irrelevant text dominates
- batching difficulty when requests vary in length

This is why real systems often combine:

- prompt compression
- retrieval
- chunking and reranking
- model routing between small and large variants

---

## Why This Matters Beyond Text

Transformer ideas now power:

- multimodal LLMs
- document intelligence systems
- VLMs with vision tokens
- embodied models with action tokens

So understanding transformers is no longer only an NLP skill. It is part of general AI systems literacy.

---

## Interview Q&A

### 1) Why are transformers better than classical RNNs for large-scale NLP?

Because they model long-range relationships more directly and train more efficiently through parallel computation.

### 2) What is the difference between BERT and GPT at a practical level?

BERT is primarily used for understanding tasks, while GPT-style models are primarily used for generation and instruction following.

### 3) Why is context window size not the only thing that matters?

Because longer prompts increase compute and memory cost, and too much irrelevant context can still reduce answer quality.

### 4) What is KV cache and why does it matter?

It stores intermediate attention states during autoregressive decoding, reducing repeated computation but increasing memory pressure for long sequences.
