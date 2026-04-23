# Serving, CI/CD & Orchestration

## Overview

Getting a model into production is an engineering and operations problem, not only a packaging problem.

You need to choose:

- serving mode
- rollout strategy
- automation pipeline
- rollback and recovery behavior

That is where serving infrastructure and CI/CD orchestration matter.

---

## Serving Patterns

Common serving modes:

- **online inference** for low-latency APIs
- **batch inference** for scheduled large-volume scoring
- **stream inference** for event-driven systems
- **edge inference** for robotics and constrained devices

Each mode changes how you think about latency, throughput, monitoring, and failure recovery.

---

## CI/CD for ML Systems

Strong ML delivery pipelines usually include:

- unit and integration tests for preprocessing
- data validation gates
- model evaluation thresholds
- container image build and signing
- automated deployment to staging
- canary or shadow rollout before wide release

A deployment pipeline should prove that the new model is safe enough, not just that the container builds.

---

## Orchestration Platforms

Typical choices include:

- FastAPI or lightweight model servers
- Kubernetes-based deployment
- KServe, Seldon, or internal inference platforms
- workflow orchestrators such as Kubeflow, Airflow, or Argo

You do not need every tool. You need a coherent path from training artifact to serving endpoint.

---

## Rollout Strategies

Useful patterns:

- **shadow mode**: observe behavior without taking action
- **canary**: send small traffic percentages first
- **blue/green**: keep old and new stacks side by side
- **rollback**: revert quickly when metrics degrade

For embodied systems, shadow mode and simulation-backed replay are especially valuable before full deployment.

---

## Interview Q&A

### 1) What is the difference between batch and online inference?

Batch inference scores many examples on a schedule, while online inference serves low-latency predictions in response to live requests.

### 2) Why is shadow deployment useful?

It lets you compare a new model in production conditions without allowing it to control user-facing or physical decisions yet.

### 3) Why should CI/CD for ML include model evaluation gates?

Because passing software tests alone does not prove that the new model performs adequately or safely on relevant data.

### 4) Why is edge serving important in robotics?

Because sending every perception or control decision to the cloud can violate latency, bandwidth, and reliability constraints.
