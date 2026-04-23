# Fine-tuning, Alignment & Model Adaptation

## Overview

A pretrained language model is only a starting point.

To make it useful for a product, you often need:

- domain adaptation
- better instruction following
- safer behavior
- evaluation against task-specific failure modes

That is where fine-tuning and alignment enter.

---

## Fine-tuning Strategies

### Full Fine-tuning

Update the whole model when:

- the model is small enough
- domain shift is strong
- you can afford the training cost

### Parameter-Efficient Adaptation

Common options:

- LoRA
- QLoRA
- adapters
- prompt tuning

These methods reduce cost and make it easier to support multiple domain variants from one backbone.

---

## Instruction Tuning and Alignment

Instruction tuning teaches a model to follow task-style prompts more reliably.

Alignment methods then try to improve:

- helpfulness
- harmlessness
- formatting consistency
- preference match to desired outputs

Techniques include:

- supervised fine-tuning
- reward-model-based RLHF
- direct preference optimization
- rejection sampling and curated preference datasets

The critical point is that alignment shifts behavior, not just benchmark score.

---

## Domain Adaptation Risks

Common failure modes:

- catastrophic forgetting of general capability
- narrow overfitting to one document style
- brittle behavior outside the finetuning distribution
- false confidence on domain-specific jargon

Good adaptation pipelines include held-out domain tests and red-team style evaluation rather than only average loss curves.

---

## Evaluation for Adapted Models

Useful evaluation dimensions:

- task success rate
- hallucination or unsupported-claim rate
- formatting validity
- latency and cost
- safety or policy compliance

For enterprise or robotics-adjacent applications, evaluation must include failure impact, not only accuracy.

---

## Interview Q&A

### 1) When should you choose LoRA instead of full fine-tuning?

When the base model is large, training budget is limited, and you mainly need efficient specialization.

### 2) What is the difference between fine-tuning and alignment?

Fine-tuning adapts the model to data or tasks, while alignment tries to shape behavior so outputs better match human or policy preferences.

### 3) What is catastrophic forgetting?

It is the loss of previously learned general capability when a model is adapted too aggressively to a narrower dataset.

### 4) Why is evaluation after fine-tuning so important?

Because improved loss or benchmark score does not guarantee better factuality, safety, or usefulness in the real workflow.
