# Networking (Mạng Máy Tính)

### Các khái niệm Networking quan trọng

Đây là những khái niệm nền tảng mà bạn rất hay gặp khi làm việc thực tế cũng như đi phỏng vấn.

| Khái niệm | Mô tả & Ví dụ thực tế |
|---|---|
| **Firewall (Tường lửa)** | **Mô tả:** Hệ thống kiểm soát lưu lượng mạng vào/ra dựa trên các luật (rules) bảo mật.<br>**Ví dụ:** Giống như bác bảo vệ ở cổng công ty, chỉ cho nhân viên có thẻ (port/IP hợp lệ) đi vào, người lạ bị chặn lại ngay ngoài cổng. |
| **NAT (Network Address Translation)** | **Mô tả:** Cơ chế chuyển đổi địa chỉ IP private sang public (và ngược lại).<br>**Ví dụ:** Nhà bạn có 5 cái điện thoại, 2 cái laptop (mỗi thiết bị 1 IP private kiểu 192.168.1.x), nhưng khi truy cập Internet, tất cả đều "mượn" 1 IP public duy nhất từ cục router mạng. Quá trình đó là NAT. Giúp tiết kiệm IP public. |
| **CORS (Cross-Origin Resource Sharing)** | **Mô tả:** Cơ chế bảo mật của trình duyệt, ngăn chặn trang web hiện tại gọi API sang một domain khác nếu domain kia không cho phép.<br>**Ví dụ:** Frontend chạy ở `localhost:3000` muốn gọi dữ liệu từ API `api.viblo.asia`. Trình duyệt sẽ tự động chặn request này trừ khi server API trả về header `Access-Control-Allow-Origin: *` hoặc `http://localhost:3000`. |
| **DNS (Domain Name System)** | **Mô tả:** Hệ thống phân giải tên miền (như google.com) sang địa chỉ IP để máy tính hiểu.<br>**Ví dụ:** Giống như danh bạ điện thoại, thay vì phải nhớ dãy số IP khô khan (142.250.191.46), bạn chỉ cần nhớ tên (google.com), DNS sẽ tự tra số điện thoại (IP) để kết nối. |
| **CDN (Content Delivery Network)** | **Mô tả:** Mạng lưới các máy chủ đặt khắp nơi trên thế giới để chứa dữ liệu tĩnh (ảnh, video, html).<br>**Ví dụ:** Máy chủ chính ở Mỹ, người dùng ở VN vào web sẽ rất chậm. CDN đặt một máy chủ bản sao ở VN, người dùng VN sẽ lấy ảnh từ server VN luôn nên tốc độ rất nhanh. |

> [!WARNING] **Lưu ý quan trọng về CORS:**
> CORS là cơ chế chặn ở phía **trình duyệt (browser)** chứ không phải của backend. Dù trình duyệt báo lỗi CORS, request thực chất vẫn có thể đã đến server và server đã xử lý xong. CORS không phải là công cụ xác thực (authentication). Backend vẫn luôn phải tự kiểm tra token và phân quyền bảo mật!

---

### Mô hình OSI

Mô hình mạng OSI có 7 tầng, nhưng trong công việc hàng ngày và khi phỏng vấn lập trình viên (đặc biệt là Backend / System Design), bạn chỉ cần nắm thật chắc **3 tầng** sau:

1. **Application (Tầng 7):** Nơi các phần mềm và ứng dụng giao tiếp. Ví dụ: HTTP/HTTPS (web), WebSocket (chat realtime), DNS, FTP (truyền file).
2. **Transport (Tầng 4):** Đảm bảo truyền dữ liệu giữa 2 thiết bị. Giao thức chính: TCP và UDP.
3. **Network (Tầng 3):** Định tuyến và tìm đường đi (Routing) cho dữ liệu. Giao thức chính: IP (IPv4, IPv6), ICMP (dùng để ping).

---

### Giao thức Tầng Application (Ứng dụng)

#### HTTP / HTTPS
Là giao thức nền tảng của mọi trang web và API hiện nay. Nó hoạt động theo cơ chế **Request-Response** (Client hỏi, Server trả lời).

```text
Các HTTP Methods (Hành động):
  GET     - "Cho tôi lấy dữ liệu này" (VD: Lấy danh sách user)
  POST    - "Tôi muốn tạo mới một dữ liệu" (VD: Đăng kí tài khoản)
  PUT     - "Thay thế toàn bộ dữ liệu này bằng cái mới của tôi"
  PATCH   - "Cập nhật một phần dữ liệu" (VD: Chỉ sửa lại email)
  DELETE  - "Xóa dữ liệu này đi"
```

**Các nhóm Mã trạng thái (Status Codes) thường gặp:**
- **2xx (Thành công):** 200 OK (Mọi thứ ổn thỏa), 201 Created (Đã tạo mới thành công).
- **3xx (Chuyển hướng):** 301 Moved Permanently (Link này đã chuyển sang chỗ khác rồi).
- **4xx (Lỗi từ phía người dùng - Client):**
  - `400 Bad Request`: Dữ liệu bạn gửi lên sai định dạng.
  - `401 Unauthorized`: Bạn chưa đăng nhập (Thiếu Token).
  - `403 Forbidden`: Bạn đã đăng nhập, nhưng không có quyền admin để vào đây.
  - `404 Not Found`: Không tìm thấy link hoặc dữ liệu này.
- **5xx (Lỗi từ phía Server):**
  - `500 Internal Server Error`: Code server bị bug.
  - `502 Bad Gateway` / `504 Gateway Timeout`: Lỗi từ proxy (Nginx) không kết nối được tới server chạy code (ví dụ Nodejs bị chết).

#### WebSocket
Nếu HTTP là kiểu "hỏi-đáp" một lần rồi ngắt, thì **WebSocket** giống như một đường ống kết nối liên tục, cho phép gửi dữ liệu hai chiều (Full-duplex) mà không cần phải thiết lập lại kết nối.
- **Ứng dụng:** Làm ứng dụng chat, bảng giá chứng khoán realtime, game nhiều người chơi.

#### RPC (Remote Procedure Call)
- **Mục đích:** Giao tiếp nội bộ giữa các microservices siêu nhanh.
- **Ý tưởng:** Giúp một service gọi hàm (function) nằm ở một service khác trên một server khác, hệt như gọi hàm cục bộ.
- **Công nghệ phổ biến:** gRPC (của Google, dùng dữ liệu dạng nhị phân Protocol Buffers nên rất nhẹ và nhanh).

---

### Giao thức Tầng Transport (Giao vận): TCP vs. UDP

Đây là một câu hỏi cực kỳ phổ biến khi phỏng vấn: *"Sự khác nhau giữa TCP và UDP là gì?"*

| Tiêu chí | TCP (Transmission Control Protocol) | UDP (User Datagram Protocol) |
|---|---|---|
| **Cơ chế** | **Giống như gọi điện thoại:** Phải có người nhấc máy (kết nối) thì mới nói chuyện được. Có cơ chế bắt tay 3 bước (3-way handshake). | **Giống như phát loa phường:** Cứ thế phát âm thanh đi, không cần biết bên dưới có ai nghe hay không. |
| **Độ tin cậy** | **Tuyệt đối an toàn:** Gửi gói nào nhận đủ gói đó, không sai lệch, không mất mát. Nếu rớt mạng sẽ gửi lại. | **Có rủi ro:** Gói tin có thể bị rơi rớt giữa đường mà không có cơ chế gửi lại. |
| **Thứ tự** | Dữ liệu được lắp ráp theo đúng thứ tự lúc gửi đi. | Các gói tin đến lộn xộn, tự phía nhận phải phân loại. |
| **Tốc độ** | Chậm hơn một chút do phải kiểm tra kỹ lưỡng (có overhead). | Cực kì nhanh, độ trễ thấp. |
| **Ứng dụng thực tế** | Lướt web (HTTP), nhắn tin Zalo/Messenger, chuyển tiền ngân hàng, tải file. (Cần tính chính xác cao). | Xem video trực tiếp (Livestream), gọi video call, game online (Bắn súng). Rớt 1 frame hình cũng không sao, cần nhanh. |

---

### DNS (Hệ thống phân giải tên miền)

#### Flow hoạt động khi bạn gõ "google.com" vào trình duyệt:
1. Máy tính tìm trong cache của trình duyệt và file hosts nội bộ xem có IP chưa.
2. Nếu chưa, hỏi **Resolver** (thường do nhà mạng cung cấp, hoặc của Google là `8.8.8.8`).
3. Resolver đi hỏi máy chủ gốc (Root Server), rồi đến TLD Server (quản lý đuôi `.com`), cuối cùng là hỏi Authoritative Server của Google để lấy đúng địa chỉ IP.
4. Trả IP về cho máy tính để bắt đầu tạo kết nối TCP.

> **Mẹo phỏng vấn:** DNS có cơ chế cache (lưu nháp) nhờ vào **TTL (Time To Live)**. Nếu bạn chỉnh sửa DNS của domain, nó có thể mất vài giờ để cập nhật trên toàn thế giới vì các máy chủ trung gian vẫn còn lưu cache cũ (do TTL chưa hết hạn).

---

### Sự khác nhau giữa HTTP/1.1, HTTP/2 và HTTP/3

| Tính năng | HTTP/1.1 | HTTP/2 | HTTP/3 |
|---|---|---|---|
| **Nền tảng bên dưới** | Dùng **TCP** | Dùng **TCP** | Dùng **UDP** (giao thức QUIC) |
| **Gửi nhiều file cùng lúc** | Không tốt (Gây tắc nghẽn ở đầu hàng đợi - Head-of-line blocking). | Rất tốt (Multiplexing - gửi song song nhiều file trên 1 kết nối duy nhất). | Cực kỳ xuất sắc (Khắc phục hoàn toàn các điểm nghẽn của TCP). |
| **Bảo mật mã hóa** | Dùng HTTP hoặc HTTPS (Tùy chọn) | Bắt buộc phải có HTTPS (TLS) | Bắt buộc có HTTPS |

---

### CIDR (Cách chia dải IP)
Trong các câu hỏi về Cloud (AWS/GCP), bạn hay thấy ký hiệu như `10.0.0.0/24`. Ký hiệu `/xx` biểu thị độ lớn của mạng lưới.
- `/32`: Chỉ đích danh **1** IP duy nhất (VD: IP của database).
- `/24`: Mạng nhỏ, cung cấp khoảng **256** IP.
- `/16`: Mạng trung bình, cung cấp hơn **65 ngàn** IP.
- Dải IP Private (chỉ dùng nội bộ, không ra internet trực tiếp được): `10.x.x.x`, `172.16.x.x`, `192.168.x.x`.

> **💡 Lời khuyên phỏng vấn:** Với các vị trí Backend, hãy chắc chắn bạn nắm vững ý nghĩa của các mã lỗi HTTP (status codes), cách hoạt động của CORS và phân biệt rõ khi nào nên dùng TCP, khi nào dùng UDP.
