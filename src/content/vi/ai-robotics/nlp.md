# NLP & Transformers

## Tổng quan

Natural Language Processing (NLP) cho phép máy tính hiểu, diễn giải và tạo ra ngôn ngữ con người. Lĩnh vực này đã trải qua cuộc cách mạng với sự ra đời của kiến trúc Transformer, hiện đang hỗ trợ hầu như tất cả các mô hình ngôn ngữ state-of-the-art bao gồm các large language models (LLMs).

Quá trình phát triển của NLP:

1. **Hệ thống dựa trên luật:** các quy tắc ngữ pháp thủ công
2. **Statistical NLP:** n-grams, HMMs, Naive Bayes
3. **Kỷ nguyên Word embeddings:** Word2Vec, GloVe, FastText
4. **Neural NLP:** LSTMs cho sequences
5. **Kỷ nguyên Transformer:** BERT, GPT, T5, LLaMA, và hơn thế
6. **Kỷ nguyên LLM:** instruction tuning, RLHF, các mô hình đa phương thức

---

## Text Preprocessing

Văn bản sạch, nhất quán là nền tảng. Các bước preprocessing thay đổi tùy theo task nhưng thường gồm:

| Bước | Mô tả | Ví dụ |
|---|---|---|
| **Lowercasing** | Chuẩn hóa kiểu chữ | "Hello WORLD" -> "hello world" |
| **Punctuation removal** | Loại bỏ nhiễu | "Hello!" -> "Hello" |
| **Tokenization** | Tách thành tokens | "don't" -> ["don", "'t"] hoặc ["do", "n't"] |
| **Stopword removal** | Loại bỏ từ phổ biến | "the", "is", "and" |
| **Stemming** | Rút gọn về dạng gốc | "running" -> "run" |
| **Lemmatization** | Rút gọn về dạng từ điển | "better" -> "good" |
| **Noise cleaning** | URLs, HTML, ký tự đặc biệt | "Visit https://x.com" -> "Visit" |

## Các Phương pháp Tokenization

| Phương pháp | Cách hoạt động | Ví dụ |
|---|---|---|
| **Word-level** | Tách theo khoảng trắng/dấu câu | ["machine", "learning"] |
| **Character-level** | Tách thành các ký tự | ["m", "a", "c", "h", ...] |
| **BPE** (Byte-Pair Encoding) | Merge các cặp ký tự frequent | Subword vocabulary ~30K tokens |
| **WordPiece** | Giống BPE nhưng ưu tiên từ hoàn chỉnh | Dùng bởi BERT |
| **SentencePiece** | Train trực tiếp trên raw text, xử lý các ngôn ngữ unknown | Dùng bởi T5, LLaMA |

## Preprocessing với spaCy

```python
import spacy
import re

nlp = spacy.load("en_core_web_sm")

def preprocess_text(text):
    # Lowercase
    text = text.lower()
    # Loại bỏ URLs, HTML tags, khoảng trắng thừa
    text = re.sub(r'http\S+', '', text)
    text = re.sub(r'<.*?>', '', text)
    text = re.sub(r'\s+', ' ', text).strip()

    doc = nlp(text)
    # Lemmatize, loại bỏ stopwords và punctuation
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

Trước Transformers, các dense word vectors (embeddings) thay thế các sparse one-hot encodings.

## Word2Vec

Hai kiến trúc:
- **CBOW:** dự đoán từ trung tâm từ context window
- **Skip-gram:** dự đoán các từ context từ từ trung tâm

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

Global Vectors: nắm bắt cả local context và global co-occurrence statistics bằng cách factorize một word co-occurrence matrix.

## FastText

Cải thiện trên Word2Vec bằng cách biểu diễn mỗi từ như một bag of character n-grams. Xử lý được các từ out-of-vocabulary (OOV) chia sẻ subwords với các từ đã biết.

## Hạn chế của Static Embeddings

- Một vector cho mỗi từ (không xử lý được đa nghĩa)
- Không có cross-sentence hoặc document-level context
- Từ out-of-vocabulary

Transformers giải quyết những vấn đề này bằng cách tạo ra các context-dependent embeddings.

---

## Kiến trúc Transformer

Transformer (Vaswani et al., 2017) thay thế recurrence bằng self-attention.

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

Mỗi Transformer layer cũng chứa một FFN theo position:

`FFN(x) = max(0, xW1 + b1)W2 + b2` (thường với GELU activation)

Đây là nơi chứa phần lớn các parameters của model.

## Positional Encoding

Transformers không có khái niệm về thứ tự bản thân, nên thông tin vị trí được thêm vào:

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

BERT sử dụng bidirectional encoder để học các contextual representations từ cả left và right context đồng thời.

## Pre-training Objectives

1. **Masked Language Modeling (MLM):** ngẫu nhiên mask ~15% tokens, dự đoán chúng. Điều này cho phép BERT học bidirectional context.
2. **Next Sentence Prediction (NSP):** cho hai câu A và B, dự đoán liệu B có theo sau A trong document gốc không. Điều này giúp với các downstream tasks như question answering và natural language inference.

## BERT cho Text Classification

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

GPT sử dụng kiến trúc decoder unidirectional (left-to-right). Nó được train trên next token prediction (autoregressive), khiến nó tự nhiên phù hợp cho text generation.

## Sự Khác biệt Chính: BERT vs GPT

| Khía cạnh | BERT | GPT |
|---|---|---|
| Kiến trúc | Encoder-only | Decoder-only |
| Attention | Bidirectional | Causal (left-to-right) |
| Training | MLM + NSP | Next token prediction |
| Tốt nhất cho | Understanding tasks | Generation tasks |
| Fine-tuning | Thêm task head, fine-tune all | Thường dùng in-context learning |
| Scale | 110M - 340B params | 125M - 175B+ params |

## GPT cho Text Generation

```python
from transformers import (
    GPT2LMHeadModel,
    GPT2Tokenizer,
    pipeline,
)

# Method 1: Pipeline (đơn giản nhất)
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

# Method 2: Manual generation với tokenizer
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

### Các Tham số Generation

- **Temperature:** kiểm soát tính ngẫu nhiên. Thấp = deterministic hơn, cao = sáng tạo hơn
- **Top-k:** sample chỉ từ top k tokens có khả năng cao nhất
- **Top-p (nucleus):** sample từ smallest set của tokens mà cumulative probability vượt quá p
- **No repeat n-gram:** ngăn chặn lặp lại các chuỗi tokens

---

## Large Language Model Fine-tuning

## LoRA (Low-Rank Adaptation)

Thay vì fine-tune tất cả parameters, LoRA injects các trainable low-rank matrices vào attention layers. Giảm đáng kể compute và memory.

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

RLHF align các mô hình ngôn ngữ với human preferences:

1. Supervised fine-tuning (SFT) trên các demonstrations được chọn lọc
2. Train một reward model từ human preference comparisons
3. Fine-tune với PPO (Proximal Policy Optimization) sử dụng reward model

## QLoRA

Quantized LoRA: quantizes base model thành 4-bit NF4 format trong khi giữ LoRA adapters ở full precision. Cho phép fine-tuning các model 65B+ trên một GPU.

---

## Text Classification

## Sentiment Analysis với Hugging Face

```python
from transformers import pipeline

# Zero-shot classification (không cần fine-tuning)
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

### Các NER Tags Phổ biến (BIO Scheme)

- **B-XXX:** Beginning of an entity
- **I-XXX:** Inside an entity
- **O:** Outside any entity

Các entity types tiêu chuẩn: PERSON, ORG, LOC, DATE, MONEY, PERCENT

---

## Text Generation và Prompting

## Prompt Engineering

Các kỹ thuật prompting hiệu quả:

| Kỹ thuật | Mô tả |
|---|---|
| **Zero-shot** | Đưa instructions không có examples |
| **Few-shot** | Cung cấp 2-5 examples trong prompt |
| **Chain-of-Thought** | Yêu cầu model giải thích reasoning từng bước |
| **Self-consistency** | Tạo nhiều CoT responses, chọn answer nhất quán nhất |
| **Tree-of-Thought** | Khám phá nhiều reasoning branches |

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

RAG kết hợp retrieval từ một knowledge base với generation. Nó neo các LLM responses trong retrieved context, giảm hallucination và cho phép knowledge cập nhật.

```python
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores import Chroma
from langchain.chains import RetrievalQA
from langchain_community.llms import HuggingFacePipeline

# 1. Tạo vector store từ documents
embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
db = Chroma.from_documents(documents=texts, embedding=embeddings)

# 2. Tạo retriever
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

# Load tokenizer và model
tokenizer = AutoTokenizer.from_pretrained("bert-base-uncased")
model = AutoModel.from_pretrained("bert-base-uncased")

# Quick inference với pipeline
pipe = pipeline("sentiment-analysis")
result = pipe("I love using Hugging Face!")

# Batch tokenization
texts = ["First text.", "Second text.", "Third text."]
encoded = tokenizer(texts, padding=True, truncation=True, return_tensors="pt", max_length=512)

# Model outputs
with torch.no_grad():
    outputs = model(**encoded)
    # last_hidden_state: (batch, seq_len, hidden)
    # pooler_output: (batch, hidden) - CLS token sau linear+tanH

# Training với Trainer
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

## Câu hỏi Phỏng vấn

### 1) Self-attention scale như thế nào với sequence length?

Self-attention có O(n^2) time và memory complexity liên quan đến sequence length n, vì mỗi token attend đến mọi token khác. Các long-context models (Ring Attention, Flash Attention) giải quyết điều này bằng cách tính attention theo blocks.

### 2) Tại sao dùng subword tokenization thay vì word-level?

Word-level vocabularies lớn và không xử lý được out-of-vocabulary (OOV) words. Subword tokenization (BPE, WordPiece) tạo một vocabulary compact (~30K tokens) xử lý các rare words thông qua composition, và generalize tốt hơn qua các ngôn ngữ giàu hình thái.

### 3) Khác nhau giữa encoder-only, decoder-only, và encoder-decoder transformers là gì?

Encoder-only (BERT): bidirectional context, MLM training, tốt cho understanding. Decoder-only (GPT): causal context, NTP training, tốt cho generation. Encoder-decoder (T5, BART): full bidirectional cross-attention, seq2seq tasks như translation và summarization.

### 4) Nguyên nhân nào gây ra hallucination trong LLMs và RAG giúp như thế nào?

Hallucination xảy ra vì LLMs tạo text dựa trên các patterns đã học, không phải các facts đã xác minh. RAG neo responses trong các retrieved documents, cung cấp factual context và citations. Kết hợp RAG với chain-of-thought prompting cải thiện accuracy hơn nữa.

### 5) Khác nhau giữa greedy decoding, beam search, và sampling là gì?

Greedy: luôn chọn token có khả năng cao nhất (nhanh nhưng có thể tạo text lặp lại). Beam search: giữ k sequences có khả năng cao nhất (chất lượng tốt hơn, chậm hơn). Sampling: ngẫu nhiên chọn tokens theo probability (đa dạng hơn, ít kiểm soát hơn). Temperature, top-k, và top-p là các sampling parameters cân bằng diversity và coherence.

### 6) Khi nào nên fine-tune vs dùng RAG?

Fine-tune khi bạn cần model học một format cụ thể, tone, hoặc cấu trúc task mà các general instructions không thể capture. Dùng RAG khi bạn cần thông tin cập nhật, factual accuracy, hoặc khi knowledge base thay đổi thường xuyên.