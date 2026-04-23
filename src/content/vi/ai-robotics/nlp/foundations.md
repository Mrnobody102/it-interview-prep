# NLP Foundations & Text Representation

## Tổng quan

Làm NLP tốt bắt đầu từ biểu diễn văn bản sạch, không phải từ model lớn nhất bạn có thể tìm thấy.

Bạn vẫn cần hiểu:

- raw text được normalize như thế nào
- tokenization ảnh hưởng hành vi model ra sao
- embeddings biểu diễn semantics thế nào
- metric nào mới phản ánh đúng chất lượng task

Các khái niệm này vẫn còn nguyên giá trị trong thời đại LLM.

---

## Text Preprocessing

Các bước preprocessing thường gặp:

- chuẩn hóa chữ hoa/thường, dấu câu, khoảng trắng, encoding
- xử lý URLs, HTML, boilerplate, hoặc noise từ OCR
- sentence splitting và tokenization
- lemmatization hoặc stemming trong pipeline cổ điển
- language detection cho corpora đa ngôn ngữ

Trong production, preprocessing phải nhất quán giữa training và inference. Sai lệch nhỏ cũng có thể âm thầm làm chất lượng giảm mạnh.

### Khi nào không nên làm sạch quá mức

Với pretrained models hiện đại, việc làm sạch quá tay có thể xóa mất tín hiệu hữu ích như code formatting, punctuation, hoặc layout markers. Chiến lược đúng phụ thuộc vào task downstream.

---

## Tokenization

Tokenization quyết định các đơn vị thật sự mà model nhìn thấy.

Các scheme quan trọng:

| Cách làm | Điểm mạnh | Điểm yếu |
|---|---|---|
| **Word-level** | Dễ hiểu | Xử lý OOV kém |
| **Character-level** | Chịu được từ lạ | Sequence dài |
| **BPE / WordPiece** | Nén tốt, tái sử dụng cao | Cách tách subword có thể khó trực quan |
| **SentencePiece** | Làm việc trực tiếp trên raw text | Vẫn cần chọn vocabulary cẩn thận |

Thiết kế tokenizer ảnh hưởng tới:

- độ dài context
- độ phủ đa ngôn ngữ
- chi phí bộ nhớ
- accuracy trên các thuật ngữ miền chuyên sâu

---

## Embeddings và Representation

### Static Embeddings

Word2Vec, GloVe, và FastText gán một vector cho mỗi word hoặc subword.

Chúng hữu ích cho:

- lightweight pipelines
- retrieval hoặc clustering
- baseline NLP cổ điển

Nhưng chúng không thể biểu diễn cùng một từ theo nhiều ngữ cảnh khác nhau.

### Contextual Embeddings

Transformer encoders tạo ra biểu diễn phụ thuộc vào ngữ cảnh. Vì vậy cùng một token có thể mang nghĩa khác nhau tùy các từ xung quanh.

Sự chuyển dịch từ static sang contextual representation là một trong những thay đổi quan trọng nhất của NLP hiện đại.

---

## Cấu trúc ngôn ngữ và features hữu ích

Ngay cả khi dùng LLM, engineers vẫn nên hiểu:

- part-of-speech patterns
- named entities
- cú pháp và dependency structure
- phân đoạn tài liệu
- ranh giới phrase theo domain

Các ý tưởng này quan trọng khi xây extraction systems, evaluation rules, hoặc pipeline hybrid có business logic xác định.

---

## Các nguyên tắc evaluation cơ bản

Metric theo task quan trọng hơn perplexity tổng quát trong nhiều workflow production.

Ví dụ:

- **accuracy / F1** cho classification
- **precision / recall** cho extraction
- **BLEU / ROUGE / BERTScore** cho generation-style comparison
- task-completion hoặc reviewer agreement cho workflow có người dùng thật

Evaluation tốt phải trả lời được hệ có hữu ích không, không chỉ là văn bản nghe có trôi chảy không.

---

## Câu hỏi Phỏng vấn

### 1) Vì sao tokenization lại quan trọng như vậy?

Vì nó quyết định độ dài sequence, độ phủ vocabulary, chi phí bộ nhớ, và cách các thuật ngữ chuyên ngành bị tách thành các đơn vị model có thể đọc.

### 2) Điểm yếu của static word embeddings là gì?

Chúng cho một vector cố định cho mỗi từ và không biểu diễn được nhiều nghĩa khác nhau của cùng một token theo ngữ cảnh.

### 3) Vì sao làm sạch văn bản quá mức lại có thể hại?

Vì punctuation, formatting, markup, và special tokens đôi khi mang thông tin semantic hoặc structural thật sự quan trọng cho task.

### 4) Vì sao evaluation trong NLP khó?

Vì output trôi chảy chưa chắc đã đúng, grounded, hoặc hữu ích. Metric phù hợp phụ thuộc rất mạnh vào mục tiêu sản phẩm hoặc business.
