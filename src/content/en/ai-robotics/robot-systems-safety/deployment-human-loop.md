# Deployment Patterns & Human-in-the-Loop

## Overview

Deployment should not jump from lab success to unrestricted autonomy.

This topic focuses on:

- staged rollout
- shadow and limited autonomy modes
- operator involvement
- safe escalation of autonomy

---

## Deployment Patterns

Useful patterns:

- simulation-only validation
- replay-backed comparison
- shadow mode
- canary rollout
- limited autonomy with operator override

The deployment pattern should match the risk profile of the task.

---

## Human-in-the-Loop Design

Humans may stay in the loop for:

- approval of risky actions
- teleoperation fallback
- failure recovery
- labeling and postmortem review

Good HITL design reduces cognitive overload instead of simply handing every hard case to a human.

---

## Safe Escalation

Autonomy should usually scale through:

- bounded environments
- constrained tasks
- measured confidence thresholds
- accumulated operational evidence

This is much safer than trying to deploy maximum autonomy from day one.

---

## Interview Q&A

### 1) Why use staged rollout for robots?

Because physical deployment risk is high, and progressive exposure reduces the chance of widespread unsafe failure.

### 2) Why is human-in-the-loop still valuable?

Because humans can supervise edge cases, recover failures, and provide judgment when model confidence or task risk is too uncertain.

### 3) What is shadow mode?

It is a deployment mode where the new system runs and is observed, but does not yet control real actions.
