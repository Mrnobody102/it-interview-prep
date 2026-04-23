# RAG, Agents & Tool Use

## Overview

By April 2026, AI application design is no longer just "pick a model and add a prompt". Real systems usually combine:

- a base model or multimodal model
- retrieval over private knowledge
- tool calling into APIs, databases, and workflows
- orchestration logic for multi-step tasks
- evaluation, guardrails, and observability

This topic matters because a large share of modern AI products are not trained end-to-end from scratch. They are assembled as systems.

---

## Retrieval vs Tool Use vs Agents

The concepts are related but not identical:

| Pattern | Core idea | Best for | Main failure mode |
|---|---|---|---|
| **RAG** | Retrieve context before generation | knowledge grounding, enterprise Q&A | bad chunking and low-quality retrieval |
| **Tool use** | Model calls external functions | structured actions, APIs, calculators | schema drift, tool selection errors |
| **Agentic workflow** | System plans and executes multi-step tasks | longer tasks, automation, research flows | looping, weak stop conditions, hidden state |

Practical rule:

- use plain prompting for simple tasks
- add RAG when the problem is knowledge freshness or private context
- add tool use when the answer requires external action or authoritative data
- add agents only when the task really needs multi-step planning

---

## Modern RAG Stack

A production RAG pipeline usually includes:

1. Document ingestion
2. Parsing and cleanup
3. Chunking
4. Embedding generation
5. Indexing in a vector or hybrid search system
6. Retrieval and reranking
7. Context assembly
8. Generation
9. Offline and online evaluation

### Chunking still matters

Even with stronger long-context models, chunking remains a systems problem:

- chunks that are too small lose meaning
- chunks that are too large reduce retrieval precision
- metadata quality strongly affects filtering
- tables, code, diagrams, and PDFs often need custom parsing

### Retrieval strategies

Common choices:

- dense retrieval for semantic similarity
- sparse retrieval for exact keyword matching
- hybrid retrieval for enterprise search
- rerankers for improving top-k quality before generation

The retrieval stage often determines quality more than model size.

---

## Tool Calling Patterns

Tool use is now a core application primitive.

Typical tools:

- SQL or analytics queries
- web search
- CRM or ticketing actions
- filesystem and code tools
- robotics APIs and control endpoints

Design principles:

- keep tool schemas explicit and narrow
- validate inputs before execution
- return structured results, not free-form text
- separate "reasoning" from "execution"
- log every tool call for replay and debugging

If a model can directly hit side-effecting tools, you need approval gates, idempotency, and rollback thinking.

---

## Agent Architectures

Popular patterns in practice:

| Pattern | Description | When it works well |
|---|---|---|
| **Router** | dispatches tasks to specialized tools/models | clear task classes |
| **Planner + Executor** | one module decomposes, another executes | multi-step tasks with stable tools |
| **State machine / graph** | explicit nodes, transitions, retries | production workflows |
| **Multi-agent** | several role-based agents cooperate | bounded, inspectable subtasks |

In 2026, strong teams prefer explicit workflow graphs over "fully autonomous" black-box loops for production systems.

Reliability usually improves when:

- state is externalized
- retry logic is explicit
- termination conditions are deterministic
- humans can inspect intermediate outputs

---

## Memory and Context Management

"Memory" can mean different things:

- conversation history
- retrieved long-term facts
- user profile and preferences
- workflow state
- external knowledge base entries

Do not overload the prompt with everything.

Use separate layers:

- short-term context for the current task
- retrieval for durable knowledge
- structured state for workflow progress
- external source of truth for business data

---

## Evaluation in 2026

Modern AI eval is multi-layered:

- task success rate
- retrieval precision and recall
- tool-call accuracy
- latency and cost
- hallucination rate
- policy and safety violations
- human preference or review outcomes

For agentic systems, "exact match" is often too weak. Better metrics include:

- whether the right tool was chosen
- whether the final state is correct
- whether the system stopped at the right point
- whether it recovered from intermediate failures

---

## Where This Connects to Robotics

RAG and agents are increasingly relevant to robotics because robots are becoming more language-conditioned and multimodal:

- instruction understanding
- planning over knowledge and affordances
- grounding commands into actions
- combining symbolic tools with learned policies
- human-in-the-loop supervision

In embodied systems, language should not replace control. It should coordinate perception, planning, and policy execution.

---

## Interview Q&A

### 1. What problem does RAG solve better than fine-tuning?

RAG is usually better when the problem is private knowledge, freshness, or provenance rather than changing the model's core behavior.

### 2. When are agents a bad idea?

Agents are a bad idea when the task is short, deterministic, and can be solved with one prompt or one fixed workflow step.

### 3. What is the biggest production risk in agentic systems?

Unbounded execution with hidden state. That is why explicit workflows, strong logging, and tool constraints matter.
