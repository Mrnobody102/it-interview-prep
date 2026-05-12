# Kiến trúc Monolithic (Kiến trúc đơn khối)

## Tổng quan

**Kiến trúc đơn khối (Monolithic)** là kiểu kiến trúc truyền thống nhất, nơi toàn bộ ứng dụng (từ giao diện UI, xử lý logic, đến kết nối Database) được nhét chung vào một khối mã nguồn duy nhất và được triển khai (deploy) cục bộ cùng một lúc.

**Ví dụ thực tế:** 
Giống như **Một nhà hàng truyền thống có duy nhất 1 cái bếp khổng lồ**. Trong bếp đó, đầu bếp vừa nấu phở, vừa nướng thịt, vừa pha trà sữa. Mọi nguyên liệu (Dữ liệu) đều lấy chung từ một cái tủ lạnh khổng lồ (Database).

---

### Đặc điểm nhận dạng

| Khía cạnh | Mô tả |
|---|---|
| **Cấu trúc** | Toàn bộ code nằm chung trong 1 kho (Repository). |
| **Triển khai (Deploy)** | Build ra 1 file duy nhất (VD: 1 file `.jar` của Java, hoặc 1 cục build NodeJS) và chạy. |
| **Giao tiếp** | Các hàm (function) gọi nhau trực tiếp trong RAM (In-memory), cực kỳ nhanh. |
| **Công nghệ** | Thường bị trói buộc vào 1 ngôn ngữ lập trình duy nhất (VD: Toàn bộ viết bằng Java). |

---

### Điểm mạnh (Tại sao 80% công ty khởi nghiệp dùng?)

- **Phát triển siêu tốc:** Rất dễ bắt đầu. Đội ngũ nhỏ ngồi code chung 1 chỗ, gọi hàm qua lại rất tiện.
- **Dễ Debug và Test:** Bị lỗi ở đâu, bật Debugger lên là dò được tận rễ, vì mọi code đều nằm chung 1 chỗ.
- **Deploy dễ dàng:** Chạy đúng 1 lệnh copy file lên server là xong.
- **Tốc độ gọi hàm:** Cực nhanh vì không phải gọi qua mạng (Network Latency = 0). (Ông làm phở gọi ông pha trà sữa chỉ cần nói vọng qua).

---

### Điểm yếu (Tại sao các ông lớn phải đập đi xây lại?)

- **Rất khó mở rộng (Scaling cục bộ):** 
  - Khách hàng đột nhiên thèm trà sữa, quầy trà sữa quá tải. Thay vì chỉ mở rộng quầy trà sữa, bạn bắt buộc phải **nhân bản toàn bộ cái bếp khổng lồ** (bao gồm cả lò nướng thịt và nồi phở) sang một chi nhánh mới. Rất lãng phí tài nguyên!
- **Điểm chết chí mạng (Single Point of Failure):** 
  - Lỡ tay viết 1 dòng code bị Infinite Loop (vòng lặp vô tận) ở chức năng "Gửi email", nó ngốn hết CPU và kéo sập luôn cả hệ thống Đặt hàng, Thanh toán... (Ông nướng thịt làm cháy bếp là cả nhà hàng nghỉ bán).
- **Ác mộng khi team quá lớn:** 
  - Khi code phình to tới hàng triệu dòng, mỗi lần sửa 1 dòng code phải chờ Build lại cả ứng dụng mất cả tiếng đồng hồ. 200 lập trình viên giẫm chân lên code của nhau.
- **Khóa công nghệ:** 
  - Hệ thống lỡ viết bằng Java 8 từ 10 năm trước. Giờ AI lên ngôi, muốn viết chức năng AI bằng Python? Chịu chết!

---

### Lời khuyên khi đi phỏng vấn

> **💡 Có nên dùng Microservices ngay từ đầu?**
> Đừng bao giờ trả lời "Có". Hầu hết các kiến trúc sư phần mềm đều khuyên: **Hãy bắt đầu bằng Monolithic.** 
> Khi hệ thống đủ lớn, team đủ đông, và bạn thực sự thấy được những rào cản của Monolith, thì mới bắt đầu bóc tách nó ra. Bắt đầu bằng Microservices ngay từ ngày 1 là tự rước lấy một đống rắc rối về vận hành (DevOps) mà công ty chưa chắc đã cần.

---

### Kiến trúc Modular Monolith (Xu hướng hiện nay)

Đây là điểm ăn tiền trong phỏng vấn. Nếu bạn không muốn dùng Microservices vì quá rườm rà, nhưng lại sợ Monolithic lộn xộn, hãy dùng **Modular Monolith**.

Vẫn là 1 cục code, nhưng phân chia thư mục (module) cực kì nghiêm ngặt. Module Nào làm việc của Module đó, cấm gọi chéo Database của nhau.

```text
src/
├── modules/
│   ├── users/          # Quầy thu ngân (Chỉ xử lý User)
│   ├── orders/         # Quầy nhận đơn (Chỉ xử lý Order)
│   └── products/       # Quầy sản phẩm (Chỉ xử lý Product)
└── shared/             # Khu vực dùng chung
```

Cách này giúp sau này nếu muốn chuyển sang Microservices thì chỉ cần "bế" nguyên cái thư mục `users` sang một server khác là xong!
