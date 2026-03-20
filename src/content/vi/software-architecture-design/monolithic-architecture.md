# Kiến trúc phần mềm

## 1. Kiến trúc Monolithic

### 1.1. Tổng quan

Kiến trúc đơn khối — toàn bộ ứng dụng được xây dựng như một khối duy nhất. Tất cả thành phần (UI, business logic, truy cập DB) nằm trong một codebase và deploy cùng nhau.

### 1.2. Đặc điểm

| Khía cạnh | Mô tả |
|---|---|
| **Cấu trúc** | Toàn bộ code trong một codebase |
| **Deployment** | Một artifact duy nhất |
| **Giao tiếp** | Gọi hàm in-memory |
| **Công nghệ** | Một tech stack |

### 1.3. Ưu điểm

- **Đơn giản khi bắt đầu:** Phù hợp cho dự án mới, chu kỳ phát triển nhanh
- **Dễ test và debug:** Toàn bộ code ở một nơi, quy trình debug đơn giản
- **Deployment đơn giản:** Deploy một artifact duy nhất
- **Overhead thấp:** Không có latency giữa các thành phần

### 1.4. Nhược điểm

- **Giới hạn về scale:** Khó scale từng thành phần độc lập
- **Điểm lỗi duy nhất (SPOF):** Một lỗi nhỏ có thể làm sập toàn bộ hệ thống
- **Khóa công nghệ:** Khó áp dụng công nghệ mới cho từng phần riêng lẻ
- **Build/deploy chậm:** Codebase lớn dần thì CI/CD pipeline trở nên chậm

### 1.5. Khi nào nên dùng

- Dự án nhỏ, đội ngũ nhỏ
- Yêu cầu đơn giản, phạm vi hạn chế
- Cần phát triển và ra mắt nhanh
- Prototype và MVP giai đoạn đầu

### 1.6. So sánh Monolith vs. Microservices

| Tiêu chí | Monolith | Microservices |
|---|---|---|
| **Độ phức tạp** | Thấp | Cao |
| **Deployment** | Một artifact | Độc lập theo service |
| **Scaling** | Toàn bộ ứng dụng | Theo từng service |
| **Công nghệ** | Một stack | Polyglot |
| **Cô lập lỗi** | Kém | Tốt |
| **Quy mô team** | Nhỏ | Lớn |
| **Time to Market** | Nhanh | Cài đặt chậm hơn |

### 1.7. Kiến trúc Monolith có Module

Ngay cả trong kiến trúc monolith, nên tổ chức code theo module rõ ràng:

```
src/
├── modules/
│   ├── users/          # Module người dùng
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   └── models/
│   ├── orders/         # Module đơn hàng
│   │   ├── controllers/
│   │   ├── services/
│   │   └── repositories/
│   └── products/       # Module sản phẩm
└── shared/             # Code dùng chung
    ├── utils/
    ├── constants/
    └── config/
```

> **Tip:** Bắt đầu với monolith. Tách service ra khi có lý do rõ ràng (team mở rộng, nhu cầu deploy độc lập, yêu cầu scale khác nhau cho từng thành phần).
