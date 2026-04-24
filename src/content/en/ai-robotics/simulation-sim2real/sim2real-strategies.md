# Domain Randomization & Sim2Real Strategies

## Overview

Sim2Real is about getting behavior learned or validated in simulation to remain useful in the real world.

This usually fails unless teams handle mismatch explicitly.

---

## Common Strategies

Important Sim2Real strategies:

- domain randomization
- system identification
- residual adaptation
- online calibration and adaptation

Each strategy addresses a different kind of simulator mismatch.

---

## Domain Randomization

Randomization can apply to:

- textures and lighting
- friction and mass
- sensor noise
- actuator delay
- object placement

The goal is not realism in one configuration, but robustness across a range of plausible realities.

---

## What Still Breaks Transfer

Transfer fails when:

- the simulator omits the wrong physics
- calibration assumptions are wrong
- the policy exploits simulator artifacts
- reality has unmodeled contacts or delays

That is why transfer should be measured, not assumed.

---

## Interview Q&A

### 1) What is domain randomization?

It is the practice of varying simulator properties so the learned policy becomes robust to differences between simulation and reality.

### 2) Why is Sim2Real hard?

Because even small mismatches in sensing, timing, contact, or dynamics can produce large behavior differences on real hardware.

### 3) Why is system identification useful?

Because better estimates of real robot dynamics help narrow the gap between simulated and actual behavior.
