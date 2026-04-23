# NLP Foundations & Text Representation

## Overview

Strong NLP work starts with clean text representation, not with the largest available model.

You still need to understand:

- how raw text is normalized
- how tokenization changes model behavior
- how embeddings represent semantics
- which evaluation signals reflect actual task quality

These concepts remain useful even in the LLM era.

---

## Text Preprocessing

Common preprocessing steps:

- normalization of case, punctuation, whitespace, and encoding
- handling URLs, HTML, boilerplate, or OCR noise
- sentence splitting and tokenization
- lemmatization or stemming in classical pipelines
- language detection for multilingual corpora

In production, preprocessing must be consistent between training and inference. Tiny mismatches can quietly damage results.

### When Not to Over-Clean

For modern pretrained models, aggressive text cleaning can remove useful signals such as code formatting, punctuation, or layout markers. The right strategy depends on the downstream task.

---

## Tokenization

Tokenization defines the actual units the model sees.

Important schemes:

| Method | Strength | Weakness |
|---|---|---|
| **Word-level** | Interpretable | Poor OOV handling |
| **Character-level** | Robust to unknown text | Long sequences |
| **BPE / WordPiece** | Good compression and reuse | Subword splits can be unintuitive |
| **SentencePiece** | Works directly on raw text | Still requires careful vocabulary choices |

Tokenizer design affects:

- context length
- multilingual coverage
- memory cost
- downstream accuracy on domain terms

---

## Embeddings and Representation

### Static Embeddings

Word2Vec, GloVe, and FastText assign one vector per word or subword.

They are useful for:

- lightweight pipelines
- retrieval or clustering
- classical NLP baselines

But they cannot represent the same word differently across contexts.

### Contextual Embeddings

Transformer encoders create context-dependent representations. This is why the same token can express different meanings depending on surrounding text.

That shift from static to contextual representation is one of the most important transitions in modern NLP.

---

## Linguistic Structure and Useful Features

Even with LLMs, engineers still benefit from understanding:

- part-of-speech patterns
- named entities
- syntax and dependency structure
- document segmentation
- domain-specific phrase boundaries

These ideas matter when building extraction systems, evaluation rules, or hybrid pipelines with deterministic business logic.

---

## Evaluation Basics

Task-specific metrics matter more than generic perplexity in many production workflows.

Examples:

- **accuracy / F1** for classification
- **precision / recall** for extraction
- **BLEU / ROUGE / BERTScore** for generation-style comparison
- task-completion or reviewer agreement for human-facing workflows

Good evaluation asks whether the system is useful, not only whether the model output looks fluent.

---

## Interview Q&A

### 1) Why does tokenization matter so much?

Because it determines sequence length, vocabulary coverage, memory usage, and how domain-specific terms are broken into model-readable units.

### 2) What is the limitation of static word embeddings?

They give one vector per word and cannot represent different meanings of the same token across contexts.

### 3) Why can over-cleaning text be harmful?

Because punctuation, formatting, markup, and special tokens can carry real semantic or structural information for the downstream task.

### 4) What makes evaluation in NLP difficult?

Because fluent output is not always correct, grounded, or useful. The right metric depends heavily on the actual business or product goal.
