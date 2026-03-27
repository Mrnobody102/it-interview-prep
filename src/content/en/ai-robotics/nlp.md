# NLP & Transformers

## Overview

Natural Language Processing (NLP) enables computers to understand, interpret, and generate human language. The field has undergone a revolution with the introduction of the Transformer architecture, which now powers virtually all state-of-the-art language models including large language models (LLMs).

The progression of NLP:

1. **Rule-based systems:** hand-crafted grammar rules
2. **Statistical NLP:** n-grams, HMMs, Naive Bayes
3. **Word embeddings era:** Word2Vec, GloVe, FastText
4. **Neural NLP:** LSTMs for sequences
5. **Transformer era:** BERT, GPT, T5, LLaMA, and beyond
6. **LLM era:** instruction tuning, RLHF, multimodal models

---

## Text Preprocessing

Clean, consistent text is foundational. Preprocessing steps vary by task but generally include:

| Step | Description | Example |
|---|---|---|
| **Lowercasing** | Normalize case | "Hello WORLD" -> "hello world" |
| **Punctuation removal** | Remove noise | "Hello!" -> "Hello" |
| **Tokenization** | Split into tokens | "don't" -> ["don", "'t"] or ["do", "n't"] |
| **Stopword removal** | Remove common words | "the", "is", "and" |
| **Stemming** | Reduce to root form | "running" -> "run" |
| **Lemmatization** | Reduce to dictionary form | "better" -> "good" |
| **Noise cleaning** | URLs, HTML, special chars | "Visit https://x.com" -> "Visit" |

## Tokenization Methods

| Method | How it works | Example |
|---|---|---|
| **Word-level** | Split by whitespace/punctuation | ["machine", "learning"] |
| **Character-level** | Split into characters | ["m", "a", "c", "h", ...] |
| **BPE** (Byte-Pair Encoding) | Merge frequent character pairs iteratively | Subword vocabulary ~30K tokens |
| **WordPiece** | Like BPE but favors full words when possible | Used by BERT |
| **SentencePiece** | Trains directly on raw text, handles unknown languages | Used by T5, LLaMA |

## Preprocessing with spaCy

```python
import spacy
import re

nlp = spacy.load("en_core_web_sm")

def preprocess_text(text):
    # Lowercase
    text = text.lower()
    # Remove URLs, HTML tags, extra whitespace
    text = re.sub(r'http\S+', '', text)
    text = re.sub(r'<.*?>', '', text)
    text = re.sub(r'\s+', ' ', text).strip()

    doc = nlp(text)
    # Lemmatize, remove stopwords and punctuation
    tokens = [
        token.lemma_
        for token in doc
        if not token.is_stop and not token.is_punct and token.is_alpha
    ]
    return tokens

text = "Machine learning is transforming AI applications worldwide!"
tokens = preprocess_text(text)
print(tokens)  # ['machine', 'learning', 'transform', 'ai', 'application', 'world']
```

---

## Word Embeddings

Before Transformers, dense word vectors (embeddings) replaced sparse one-hot encodings.

## Word2Vec

Two architectures:
- **CBOW:** predict center word from context window
- **Skip-gram:** predict context words from center word

```python
from gensim.models import Word2Vec

sentences = [
    ["machine", "learning", "transforms", "data"],
    ["deep", "learning", "powers", "ai"],
    ["natural", "language", "processing", "advances"],
]

model = Word2Vec(
    sentences=sentences,
    vector_size=100,   # embedding dimension
    window=3,          # context window size
    min_count=1,       # minimum word frequency
    sg=1,              # 1=Skip-gram, 0=CBOW
    epochs=100,
)

vector = model.wv["learning"]
similar = model.wv.most_similar("learning", topn=3)
print("Vector shape:", vector.shape)
print("Similar to 'learning':", similar)
```

## GloVe

Global Vectors: captures both local context and global co-occurrence statistics by factorizing a word co-occurrence matrix.

## FastText

Improves on Word2Vec by representing each word as a bag of character n-grams. Handles out-of-vocabulary (OOV) words that share subwords with known words.

## Limitations of Static Embeddings

- One vector per word (can't handle polysemy)
- No cross-sentence or document-level context
- Out-of-vocabulary words

Transformers solve these by generating context-dependent embeddings.

---

## The Transformer Architecture

The Transformer (Vaswani et al., 2017) replaced recurrence with self-attention.

## Multi-Head Self-Attention

```python
import torch
import torch.nn as nn
import math

class MultiHeadAttention(nn.Module):
    def __init__(self, d_model, num_heads):
        super().__init__()
        assert d_model % num_heads == 0
        self.d_model = d_model
        self.num_heads = num_heads
        self.d_k = d_model // num_heads

        self.W_q = nn.Linear(d_model, d_model)
        self.W_k = nn.Linear(d_model, d_model)
        self.W_v = nn.Linear(d_model, d_model)
        self.W_o = nn.Linear(d_model, d_model)

    def split_heads(self, x, batch_size):
        # (batch, seq_len, d_model) -> (batch, heads, seq_len, d_k)
        x = x.view(batch_size, -1, self.num_heads, self.d_k)
        return x.transpose(1, 2)

    def forward(self, query, key, value, mask=None):
        batch_size = query.size(0)

        Q = self.split_heads(self.W_q(query), batch_size)
        K = self.split_heads(self.W_k(key), batch_size)
        V = self.split_heads(self.W_v(value), batch_size)

        # Scaled dot-product attention
        scores = torch.matmul(Q, K.transpose(-2, -1)) / math.sqrt(self.d_k)

        if mask is not None:
            scores = scores.masked_fill(mask == 0, -1e9)

        attention_weights = torch.softmax(scores, dim=-1)
        context = torch.matmul(attention_weights, V)

        # Concatenate heads
        context = context.transpose(1, 2).contiguous()
        context = context.view(batch_size, -1, self.d_model)

        return self.W_o(context), attention_weights
```

## Feed-Forward Network

Each Transformer layer also contains a position-wise FFN:

`FFN(x) = max(0, xW1 + b1)W2 + b2` (typically with GELU activation)

This is where most of the model's parameters reside.

## Positional Encoding

Transformers have no inherent notion of order, so positional information is added:

```python
class PositionalEncoding(nn.Module):
    def __init__(self, d_model, max_len=5000, dropout=0.1):
        super().__init__()
        self.dropout = nn.Dropout(p=dropout)

        pe = torch.zeros(max_len, d_model)
        position = torch.arange(0, max_len, dtype=torch.float).unsqueeze(1)
        div_term = torch.exp(
            torch.arange(0, d_model, 2).float() * (-math.log(10000.0) / d_model)
        )
        pe[:, 0::2] = torch.sin(position * div_term)
        pe[:, 1::2] = torch.cos(position * div_term)
        pe = pe.unsqueeze(0)  # (1, max_len, d_model)
        self.register_buffer('pe', pe)

    def forward(self, x):
        x = x + self.pe[:, :x.size(1)]
        return self.dropout(x)
```

---

## BERT: Bidirectional Encoder Representations from Transformers

BERT uses a bidirectional encoder to learn contextual representations from both left and right context simultaneously.

## Pre-training Objectives

1. **Masked Language Modeling (MLM):** randomly mask ~15% of tokens, predict them. This lets BERT learn bidirectional context.
2. **Next Sentence Prediction (NSP):** given two sentences A and B, predict whether B follows A in the original document. This helps with downstream tasks like question answering and natural language inference.

## BERT for Text Classification

```python
from transformers import (
    AutoTokenizer,
    AutoModelForSequenceClassification,
    AutoConfig,
    Trainer,
    TrainingArguments,
)
import numpy as np
import torch

model_name = "bert-base-uncased"
tokenizer = AutoTokenizer.from_pretrained(model_name)

config = AutoConfig.from_pretrained(model_name)
config.num_labels = 2
config.hidden_dropout_prob = 0.1
config.attention_probs_dropout_prob = 0.1

model = AutoModelForSequenceClassification.from_pretrained(
    model_name, config=config
)

# Tokenize
def tokenize_function(examples):
    return tokenizer(
        examples["text"],
        padding="max_length",
        truncation=True,
        max_length=256,
    )

# Fine-tune
training_args = TrainingArguments(
    output_dir="./bert_classifier",
    num_train_epochs=3,
    per_device_train_batch_size=16,
    per_device_eval_batch_size=32,
    warmup_ratio=0.1,
    weight_decay=0.01,
    eval_strategy="epoch",
    logging_steps=50,
    load_best_model_at_end=True,
    metric_for_best_model="f1",
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=eval_dataset,
    compute_metrics=lambda p: {
        "accuracy": np.mean(p.predictions.argmax(-1) == p.label_ids),
    },
)
trainer.train()
```

---

## GPT: Generative Pre-Training

GPT uses a unidirectional (left-to-right) decoder architecture. It is trained on next token prediction (autoregressive), which makes it naturally suited for text generation.

## Key Differences: BERT vs GPT

| Aspect | BERT | GPT |
|---|---|---|
| Architecture | Encoder-only | Decoder-only |
| Attention | Bidirectional | Causal (left-to-right) |
| Training | MLM + NSP | Next token prediction |
| Best for | Understanding tasks | Generation tasks |
| Fine-tuning | Add task head, fine-tune all | Often use in-context learning |
| Scale | 110M - 340B params | 125M - 175B+ params |

## GPT for Text Generation

```python
from transformers import (
    GPT2LMHeadModel,
    GPT2Tokenizer,
    pipeline,
)

# Method 1: Pipeline (simplest)
generator = pipeline("text-generation", model="gpt2")
results = generator(
    "The future of artificial intelligence depends on",
    max_length=100,
    num_return_sequences=3,
    temperature=0.8,
    top_k=50,
    top_p=0.92,
    no_repeat_ngram_size=3,
    do_sample=True,
)

for r in results:
    print(r["generated_text"])

# Method 2: Manual generation with tokenizer
tokenizer = GPT2Tokenizer.from_pretrained("gpt2")
model = GPT2LMHeadModel.from_pretrained("gpt2")

prompt = "Machine learning has revolutionized"
input_ids = tokenizer(prompt, return_tensors="pt").input_ids

output = model.generate(
    input_ids,
    max_new_tokens=50,
    do_sample=True,
    temperature=0.7,
    top_k=50,
    pad_token_id=tokenizer.eos_token_id,
)
print(tokenizer.decode(output[0], skip_special_tokens=True))
```

### Generation Parameters

- **Temperature:** controls randomness. Lower = more deterministic, higher = more creative
- **Top-k:** samples only from top k most likely tokens
- **Top-p (nucleus):** samples from smallest set of tokens whose cumulative probability exceeds p
- **No repeat n-gram:** prevents repeating token sequences

---

## Large Language Model Fine-tuning

## LoRA (Low-Rank Adaptation)

Instead of fine-tuning all parameters, LoRA injects trainable low-rank matrices into attention layers. Dramatically reduces compute and memory.

```python
from peft import LoraConfig, get_peft_model, TaskType

lora_config = LoraConfig(
    r=16,                    # rank
    lora_alpha=32,           # scaling factor
    target_modules=["q_proj", "v_proj", "k_proj", "o_proj"],
    lora_dropout=0.05,
    bias="none",
    task_type=TaskType.CAUSAL_LM,
)

model = get_peft_model(base_model, lora_config)
model.print_trainable_parameters()
# Trainable params: ~0.1% of total
```

## RLHF (Reinforcement Learning from Human Feedback)

RLHF aligns language models with human preferences:

1. Supervised fine-tuning (SFT) on curated demonstrations
2. Train a reward model from human preference comparisons
3. Fine-tune with PPO (Proximal Policy Optimization) using the reward model

## QLoRA

Quantized LoRA: quantizes the base model to 4-bit NF4 format while keeping LoRA adapters in full precision. Enables fine-tuning 65B+ models on a single GPU.

---

## Text Classification

## Sentiment Analysis with Hugging Face

```python
from transformers import pipeline

# Zero-shot classification (no fine-tuning needed)
classifier = pipeline(
    "zero-shot-classification",
    model="facebook/bart-large-mnli",
)
result = classifier(
    "This product exceeded all my expectations.",
    candidate_labels=["positive", "negative", "neutral"],
)
print(result)

# Fine-tuned sentiment analysis
sentiment = pipeline("sentiment-analysis", model="distilbert-base-uncased-finetuned-sst-2-english")
print(sentiment("I absolutely love this movie!"))
# [{'label': 'POSITIVE', 'score': 0.9998}]
```

## Spam Detection

```python
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

# TF-IDF vectorization
vectorizer = TfidfVectorizer(
    max_features=10000,
    ngram_range=(1, 3),
    min_df=2,
    sublinear_tf=True,
)

X = vectorizer.fit_transform(df["message"])
y = df["label"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, stratify=y)

clf = LogisticRegression(max_iter=1000, class_weight="balanced")
clf.fit(X_train, y_train)

y_pred = clf.predict(X_test)
print(classification_report(y_test, y_pred))
```

---

## Named Entity Recognition (NER)

```python
from transformers import pipeline, AutoTokenizer, AutoModelForTokenClassification

# Method 1: Pipeline
ner = pipeline("ner", model="dslim/bert-base-NER", aggregation_strategy="simple")
text = "Apple CEO Tim Cook visited Singapore last week."
entities = ner(text)
for e in entities:
    print(f"{e['word']:20s} -> {e['entity_group']:10s} ({e['score']:.3f})")

# Method 2: Fine-grained token-level
tokenizer = AutoTokenizer.from_pretrained("dslim/bert-base-NER")
model = AutoModelForTokenClassification.from_pretrained("dslim/bert-base-NER")

inputs = tokenizer(text, return_tensors="pt", truncation=True, max_length=512)
with torch.no_grad():
    outputs = model(**inputs)

logits = outputs.logits
predictions = torch.argmax(logits, dim=2)
tokens = tokenizer.convert_ids_to_tokens(inputs["input_ids"][0])

labels = ["O", "B-MISC", "I-MISC", "B-PER", "I-PER", "B-ORG", "I-ORG", "B-LOC", "I-LOC"]
for token, pred in zip(tokens, predictions[0]):
    if token not in tokenizer.all_special_tokens:
        print(f"{token:15s} -> {labels[pred.item()]}")
```

### Common NER Tags (BIO Scheme)

- **B-XXX:** Beginning of an entity
- **I-XXX:** Inside an entity
- **O:** Outside any entity

Standard entity types: PERSON, ORG, LOC, DATE, MONEY, PERCENT

---

## Text Generation and Prompting

## Prompt Engineering

Effective prompting techniques:

| Technique | Description |
|---|---|
| **Zero-shot** | Give instructions without examples |
| **Few-shot** | Provide 2-5 examples in the prompt |
| **Chain-of-Thought** | Ask model to explain reasoning step-by-step |
| **Self-consistency** | Generate multiple CoT responses, pick most consistent answer |
| **Tree-of-Thought** | Explore multiple reasoning branches |

```python
# Few-shot prompting
prompt = """Classify the sentiment as positive, negative, or neutral.

Example 1: "This movie was fantastic!" -> positive
Example 2: "Worst experience of my life." -> negative
Example 3: "The meeting is at 3pm." -> neutral

Now classify: "Just okay, nothing special."
"""

response = openai.ChatCompletion.create(
    model="gpt-3.5-turbo",
    messages=[{"role": "user", "content": prompt}],
)
print(response.choices[0].message.content)  # neutral
```

## RAG (Retrieval-Augmented Generation)

RAG combines retrieval from a knowledge base with generation. It grounds LLM responses in retrieved context, reducing hallucination and enabling up-to-date knowledge.

```python
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores import Chroma
from langchain.chains import RetrievalQA
from langchain_community.llms import HuggingFacePipeline

# 1. Create vector store from documents
embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
db = Chroma.from_documents(documents=texts, embedding=embeddings)

# 2. Create retriever
retriever = db.as_retriever(search_kwargs={"k": 3})

# 3. Build RAG chain
qa_chain = RetrievalQA.from_chain_type(
    llm=HuggingFacePipeline(pipeline=generator),
    retriever=retriever,
    chain_type="stuff",
)

# 4. Query
result = qa_chain({"query": "What is machine learning?"})
print(result["result"])
```

---

## Hugging Face Transformers Library

```python
from transformers import (
    AutoTokenizer,
    AutoModel,
    AutoModelForSequenceClassification,
    AutoModelForQuestionAnswering,
    AutoModelForCausalLM,
    pipeline,
    TrainingArguments,
    Trainer,
)

# Load tokenizer and model
tokenizer = AutoTokenizer.from_pretrained("bert-base-uncased")
model = AutoModel.from_pretrained("bert-base-uncased")

# Quick inference with pipeline
pipe = pipeline("sentiment-analysis")
result = pipe("I love using Hugging Face!")

# Batch tokenization
texts = ["First text.", "Second text.", "Third text."]
encoded = tokenizer(texts, padding=True, truncation=True, return_tensors="pt", max_length=512)

# Model outputs
with torch.no_grad():
    outputs = model(**encoded)
    # last_hidden_state: (batch, seq_len, hidden)
    # pooler_output: (batch, hidden) - CLS token after linear+tanH

# Training with Trainer
training_args = TrainingArguments(
    output_dir="./output",
    num_train_epochs=3,
    per_device_train_batch_size=8,
    gradient_accumulation_steps=2,
    learning_rate=2e-5,
    warmup_steps=500,
    weight_decay=0.01,
    fp16=True,
    logging_steps=100,
    eval_strategy="steps",
    save_strategy="steps",
    save_total_limit=3,
)
```

---

## Interview Q&A

### 1) How does self-attention scale with sequence length?

Self-attention has O(n^2) time and memory complexity with respect to sequence length n, because every token attends to every other token. Long-context models (Ring Attention, Flash Attention) address this by computing attention in blocks.

### 2) Why do we use subword tokenization instead of word-level?

Word-level vocabularies are large and can't handle out-of-vocabulary (OOV) words. Subword tokenization (BPE, WordPiece) creates a compact vocabulary (~30K tokens) that handles rare words through composition, and generalizes better across morphologically rich languages.

### 3) What is the difference between encoder-only, decoder-only, and encoder-decoder transformers?

Encoder-only (BERT): bidirectional context, MLM training, good for understanding. Decoder-only (GPT): causal context, NTP training, good for generation. Encoder-decoder (T5, BART): full bidirectional cross-attention, seq2seq tasks like translation and summarization.

### 4) What causes hallucination in LLMs and how does RAG help?

Hallucination occurs because LLMs generate text based on learned patterns, not verified facts. RAG grounds responses in retrieved documents, providing factual context and citations. Combining RAG with chain-of-thought prompting further improves accuracy.

### 5) What is the difference between greedy decoding, beam search, and sampling?

Greedy: always picks the most likely token (fast but can produce repetitive text). Beam search: keeps k most likely sequences (better quality, slower). Sampling: randomly picks tokens proportional to their probability (more diverse, less controlled). Temperature, top-k, and top-p are sampling parameters that balance diversity and coherence.

### 6) When would you fine-tune vs use RAG?

Fine-tune when you need the model to learn a specific format, tone, or task structure that general instructions can't capture. Use RAG when you need up-to-date information, factual accuracy, or when the knowledge base changes frequently.
