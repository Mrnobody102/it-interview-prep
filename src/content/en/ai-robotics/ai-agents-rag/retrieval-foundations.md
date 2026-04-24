# Retrieval Foundations & RAG Architecture

## Overview

RAG starts with one basic idea: the model should not rely only on parametric memory when fresh or domain-specific knowledge matters.

This topic focuses on the retrieval side of agent systems:

- indexing
- chunking
- embeddings
- ranking
- response grounding

---

## Core RAG Pipeline

A practical RAG pipeline usually contains:

1. document ingestion
2. chunking and metadata tagging
3. embedding and indexing
4. retrieval and reranking
5. answer synthesis with citations or grounded context

The biggest mistake is treating retrieval as "just use a vector DB" without designing chunking and evaluation.

---

## What Good Retrieval Depends On

Retrieval quality depends on:

- chunk size and semantic boundaries
- metadata filters
- embedding model choice
- hybrid lexical plus semantic retrieval
- reranking quality

A weak retriever turns a strong model into an unreliable answer generator.

---

## Common Failure Modes

RAG fails when:

- chunks are too large or too fragmented
- indexing ignores document structure
- retrieval misses the right source
- stale documents remain active
- answer generation overstates confidence beyond retrieved evidence

This is why groundedness and retrieval recall matter as much as fluent output.

---

## Interview Q&A

### 1) Why is chunking so important in RAG?

Because chunking determines what units are retrievable, how much context is preserved, and whether the retriever can surface the right evidence.

### 2) Why combine vector and keyword retrieval?

Because semantic similarity helps meaning-based search, while lexical retrieval preserves exact terms, IDs, and rare phrases.

### 3) Why can a strong LLM still hallucinate in RAG?

Because the retriever may miss the correct evidence, or the generator may extrapolate beyond what was actually retrieved.
