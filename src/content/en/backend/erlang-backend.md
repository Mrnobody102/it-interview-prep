# Erlang / Elixir Backend

## 1. Overview

Erlang and Elixir are programming languages designed for distributed, fault-tolerant, real-time systems with high uptime. The Erlang VM (BEAM) is the runtime platform for both languages.

### 1.1. Core features

| Feature | Description |
|---------|-------------|
| **Actor Model** | Each actor is a separate lightweight process |
| **Fault Tolerance** | "Let it crash" — process failure does not affect the system |
| **Soft Real-time** | Per-process garbage collection, no whole-system pause |
| **Hot Code Reloading** | Deploy code without downtime |
| **Distributed** | Native cluster support via Erlang distribution |

## 2. Subtopics

| Subtopic | Description |
|----------|-------------|
| **Elixir Syntax** | Basic syntax, data structures, pattern matching, protocols |
| **Concurrency & OTP** | GenServer, Task, Supervisor, ETS, distributed Erlang |
| **Phoenix Framework** | Router, Controllers, LiveView, Ecto, Channels |

## 3. Elixir and Erlang

Elixir runs on BEAM (Erlang VM), compiling down to Erlang bytecode. Elixir provides a more modern syntax, powerful macro system, and better tooling (Mix, ExUnit, Phoenix). Erlang provides traditional syntax and built-in otpstdlib. Runtime logic is fully compatible.

## 4. Common interview questions

### 4.1. Why is BEAM considered strong for highly concurrent systems?

Because BEAM can run a massive number of lightweight processes, isolate failures, and schedule work fairly without mapping each task to an OS thread.

### 4.2. How is an Erlang process different from an OS thread?

An Erlang process is much lighter, has isolated memory, communicates by message passing, and is scheduled by the VM instead of the operating system.

### 4.3. When should you choose Elixir/Erlang over Go or Java?

Choose BEAM languages when fault tolerance, long-lived connections, soft real-time behavior, and operational resilience matter more than raw single-thread performance.
