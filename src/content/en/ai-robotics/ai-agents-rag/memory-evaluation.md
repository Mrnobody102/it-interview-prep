# Memory, Context & Agent Evaluation

## Overview

Agents need more than a long prompt window.

They need disciplined handling of:

- short-term context
- longer-term state or memory
- retrieval refresh
- realistic evaluation

---

## Memory vs Context

Important distinction:

- **context window** is what the model sees right now
- **memory** is what the system chooses to preserve across turns or tasks

Memory can be:

- ephemeral task state
- summarized history
- retrieved prior interactions
- persistent user or environment state

---

## Evaluation in Practice

Agent evaluation should test:

- task completion
- tool-call correctness
- groundedness
- cost and latency
- robustness under missing or noisy context

Benchmarks that ignore workflow failure can make weak agents look better than they are.

---

## Why This Matters in Robotics

Embodied systems often need:

- memory of previous goals
- remembered object references
- awareness of environment changes
- confidence about stale vs fresh state

In robotics, stale memory can be physically dangerous if the world has moved on.

---

## Interview Q&A

### 1) Why is memory not the same as long context?

Because memory is selectively maintained system state, while long context is only the tokens currently packed into the prompt.

### 2) Why is agent evaluation hard?

Because the system can fail through retrieval, planning, tool use, memory, or orchestration even when the final text looks plausible.

### 3) Why is stale context dangerous in robotics?

Because the model may reason from an outdated world state and produce actions that no longer fit the real environment.
