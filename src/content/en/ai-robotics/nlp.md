# NLP & Transformers

## Overview

NLP enables computers to understand and generate language. Transformers are the state-of-the-art architecture.

## Text Preprocessing

```python
import spacy
import re

nlp = spacy.load("en_core_web_sm")

def preprocess_text(text):
    # Lowercase
    text = text.lower()
    # Remove special chars
    text = re.sub(r'[^a-z0-9\s]', '', text)
    # Tokenize
    doc = nlp(text)
    # Remove stopwords and lemmatize
    tokens = [token.lemma_ for token in doc
              if not token.is_stop and token.is_alpha]
    return tokens
```

## Word Embeddings

```python
from gensim.models import Word2Vec
from transformers import AutoTokenizer, AutoModel
import torch

# Word2Vec
sentences = [["cat", "say", "meow"], ["dog", "say", "bark"]]
model = Word2Vec(sentences, vector_size=100, window=3)
vector = model.wv["cat"]

# BERT embeddings
tokenizer = AutoTokenizer.from_pretrained("bert-base-uncased")
model = AutoModel.from_pretrained("bert-base-uncased")

inputs = tokenizer("Hello world", return_tensors="pt")
outputs = model(**inputs)
embedding = outputs.last_hidden_state[:, 0, :]  # CLS token
```

## Text Classification

```python
from transformers import AutoModelForSequenceClassification, Trainer

model = AutoModelForSequenceClassification.from_pretrained(
    "bert-base-uncased", num_labels=2
)

# Fine-tune
trainer = Trainer(
    model=model,
    train_dataset=train_dataset,
    eval_dataset=eval_dataset,
    training_args=TrainingArguments(
        output_dir="./results",
        num_train_epochs=3,
        per_device_train_batch_size=16,
        evaluation_strategy="epoch"
    )
)
trainer.train()
```

## Text Generation

```python
from transformers import pipeline

generator = pipeline("text-generation", model="gpt2")
result = generator(
    "Once upon a time",
    max_length=100,
    num_return_sequences=3,
    temperature=0.8,
    top_k=50,
    top_p=0.95
)
```

## Named Entity Recognition

```python
from transformers import pipeline

ner = pipeline("ner", model="dslim/bert-base-NER")
entities = ner("John works at Google in California")

# Output: [{'entity': 'B-PER', 'word': 'John', 'score': 0.99}, ...]
```

## Interview Questions

### 1. How does Attention mechanism work?

Attention computes `output = softmax(QK^T / sqrt(d_k)) * V`. Q (Query), K (Key), V (Value) are linear projections of the input. The score reflects relevance between query and keys.

### 2. How does BERT differ from GPT?

BERT: bidirectional encoder, uses masked language modeling, good for understanding tasks. GPT: unidirectional decoder, uses next token prediction, good for generation tasks.

### 3. What is Tokenization?

Dividing text into tokens (words, subwords, characters). BPE, WordPiece, SentencePiece are popular subword tokenization methods that efficiently handle OOV words.
