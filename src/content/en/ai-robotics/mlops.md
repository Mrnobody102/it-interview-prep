# MLOps & AI Production

## Overview

MLOps is no longer only about training a model and exposing an API.

In 2026, it covers at least four tightly related areas:

1. data quality, lineage, and experimentation
2. feature stores, model registry, and governance
3. serving, CI/CD, orchestration, and deployment
4. monitoring, LLMOps, and fleet learning for AI systems

That is why this topic is now split into dedicated child topics instead of staying as one giant page.

---

## Why This Matters for AI-Robotics

AI systems fail in production for operational reasons as often as for model reasons.

Common sources of failure:

- schema drift
- stale features or invalid data joins
- bad rollout strategy
- weak monitoring or missing alert thresholds
- evaluation that ignores safety and rare failure cases

In robotics and physical AI, the bar is even higher because production mistakes can affect real hardware and real environments.

---

## Map of the Subtopics

### 1. Data Quality, Versioning & Experimentation

Focus:

- data lineage and reproducibility
- validation, labeling quality, and dataset contracts
- experiment tracking and offline evaluation
- synchronized logs for embodied systems

Use this when the question is how to make ML work repeatably instead of by luck.

### 2. Feature Stores, Registry & Governance

Focus:

- feature definitions and online/offline consistency
- model registry and artifact promotion
- approval flows, metadata, and lineage
- governance for high-stakes AI deployments

Use this when you need control over what is deployed and why.

### 3. Serving, CI/CD & Orchestration

Focus:

- online, batch, and streaming inference
- containerization and Kubernetes-style deployment
- canary, shadow, rollback, and automation
- edge and hybrid-cloud deployment patterns

Use this when you care about reliable delivery and rollout mechanics.

### 4. Monitoring, LLMOps & Fleet Learning

Focus:

- drift detection and production metrics
- prompt, retrieval, and LLM evaluation
- cost, latency, and reliability observability
- feedback loops for robotics fleets and embodied systems

Use this when the real problem starts after deployment.

---

## Recommended Learning Order

For most engineers, the practical order is:

1. data quality and experimentation
2. registry, feature platform, and governance
3. serving and deployment orchestration
4. monitoring, LLMOps, and fleet learning

This mirrors the path from reproducible development to safe long-running production systems.

---

## Relationship to Other AI-Robotics Topics

This MLOps section overlaps with, but does not replace:

- **Machine Learning** and **Deep Learning** for model-building fundamentals
- **AI Agents, RAG & Tool Use** for application behavior design
- **Simulation, Sim2Real & Synthetic Data** for embodied evaluation loops
- **Robot Systems, Safety & Deployment** for operational constraints on real hardware

MLOps is the layer that keeps AI systems usable after the notebook phase.

---

## Interview Q&A

### 1) Why split MLOps into smaller topics?

Because data, governance, deployment, and monitoring are each large operational domains with different tools, risks, and decision patterns.

### 2) Why is MLOps especially important for AI systems today?

Because modern AI systems depend on fast model iteration, reproducible evaluation, safe rollout, and observability across both classical ML and LLM-style applications.

### 3) Why is MLOps even harder in robotics?

Because logs are multimodal, failure can affect the physical world, and evaluation often needs synchronized replay, simulation, and safety gates instead of simple API-level checks.
