A. System Design
I. Overview

1. Computer Architecture (disk, storage, RAM, Cache, CPU)
   • Khi khởi động chương trình: Dữ liệu và mã lệnh được tải từ Storage lên RAM.
   • CPU xử lý: Kiểm tra Cache trước, nếu cache hit thì lấy ngay, nếu cache miss thì lấy từ RAM, nếu không có trong RAM, nạp từ storage (SSD/HDD)
   • Kết quả xử lý: Có thể ghi vào RAM (tạm thời), sau đó lưu lại vào Storage nếu cần lâu dài.

2. Production App Architecture
   Kiến trúc hệ thống hiện đại gồm:
   a. Frontend
   • Triển khai trên CDN để tăng tốc độ tải và giảm tải cho backend (React.js, Next.js build thành static file).
   • Sử dụng HTTPS, CSP (Content Security Policy - chống XSS, clickjacking, data injection) để bảo vệ người dùng.
   b. Backend
   • Xây dựng dạng microservices (Spring Boot, Node.js), mỗi service đảm nhận một chức năng riêng biệt.
   • API Gateway: định tuyến, xác thực (authentication), giới hạn rate (rate limiting).
   c. Database
   • Sử dụng RDBMS (PostgreSQL, MySQL) hoặc NoSQL (MongoDB, Redis) tùy trường hợp.
   • Cấu hình replication, backup và restore thường xuyên.
   • Đảm bảo phân quyền truy cập, mã hóa dữ liệu nhạy cảm.
   d. Caching Layer
   • Redis/Memcached để giảm tải cho database, tăng tốc độ đáp ứng cho các truy vấn phổ biến.
   e. Message Queue/Event Streaming
   • Kafka, RabbitMQ để xử lý các tác vụ nền (background jobs), truyền tải sự kiện giữa các service.
   f. File Storage & Static Assets
   • Sử dụng dịch vụ cloud storage (AWS S3, Google Cloud Storage) cho ảnh, video, file lớn.
   g. DevOps & CI/CD
   • Docker container hóa ứng dụng, Kubernetes orchestration.
   • CI/CD pipeline (Jenkins, GitHub Actions) tự động build/test/deploy.
   • Infrastructure as Code (Terraform, Ansible).
   h. Monitoring & Logging
   • Sử dụng các tool như Prometheus, Grafana, ELK Stack để giám sát, cảnh báo, phân tích lỗi.
   i. Security
   • HTTPS, JWT/OAuth2 cho authentication/authorization.
   • Quản lý secret (AWS Secret Manager, Githubs Secret Repo).
   • Thường xuyên kiểm tra OWASP Top 10.
   j. High Availability & Scalability
   • Load balancer (Nginx, HAProxy), auto-scaling group.
   • Multi-region deployment (nếu cần).

3. Design Requirements
   a. Xác định yêu cầu của khách hàng thế nào?
   • Xác định rõ yêu cầu chức năng và phi chức năng
   Scalability: Có thể mở rộng để phục vụ nhiều user.
   Performance: Đáp ứng nhanh, latency thấp.
   Availability: Đảm bảo uptime cao, ít downtime.
   Security: Bảo mật dữ liệu, xác thực, phân quyền.
   Maintainability: Dễ sửa, dễ nâng cấp.
   Reliability: Hoạt động ổn định, ít lỗi.
   Cost: Giới hạn chi phí triển khai/vận hành.
   Compliance: Tuân thủ quy định pháp luật  
   • Xác định các ràng buộc quan trọng về nghiệp vụ - business (giảm chi phí, tăng số lượng user...), ràng buộc kĩ thuật (dùng công nghệ nào) và ràng buộc về tích hợp với các hệ thống khác.
   • Đề xuất giải pháp, hướng tiếp cận dựa trên yêu cầu đó.
   b. Nguyên lý CAP
   • Là nguyên lý quan trọng trong thiết kế hệ thống phân tán.
   • CAP stands for:

- Consistency tức là mọi node trong hệ thống đều nhất quán về dữ liệu tại một thời điểm
- Availability là hệ thống luôn sẵn sàng đáp ứng mọi request
- Partition Tolerance là khả năng chịu phân mảnh mạng, tức là hệ thống vẫn hoạt động (không bị sập toàn bộ) khi có sự cố các node không liên lạc được với nhau do chia cắt mạng
  • Một hệ thống phân tán chỉ có thể đảm bảo 2 trong 3 yếu tố trên cùng một lúc. Trong thực tế luôn phải đảm bảo Partition Tolerance do sự cố mạng là không thể tránh khỏi. Còn việc ưu tiên CP hay AP tùy thuộc vào tính chất của hệ thống phân tán, ví dụ ngân hàng ưu tiên tính nhất quán chọn CP, mạng xã hội ưu tiên tính sẵn sàng (dữ liệu cập nhật chậm một chút cũng không sao) chọn AP.

4. Networking
   a. Các khái niệm cần nhớ
   • Firewall: kiểm soát, cho phép hoặc chặn luồng dữ liệu vào ra hệ thống / thiết bị
   • NAT – network address translation: kĩ thuật chuyển đổi các địa chỉ IP trong mạng private sang IP công cộng (có thể dùng chung cho các thiết bị trong mạng nội bộ giúp tiết kiệm địa chỉ IP) và ngược lại
   • CORS: Cross-Origin Resource Sharing là một cơ chế của trình duyệt web chặn truy cập tài nguyên từ một domain khác với domain hiện tại.
   Ví dụ frontend và backend API triển khai ở 2 domain khác nhau, backend cần cho phép CORS để frontend có thể gọi API và lấy dữ liệu.
   b. Giao thức mạng theo tầng
   • Có 7 tầng OSI nhưng thực tế developer chủ yếu quan tâm các tầng: Application, Transport, Network
   • Application Layer: xử lý logic, giao tiếp user và app/service.  
   Giao thức:

- HTTP/HTTPS: giao thức nền tảng cho web và API, dùng để truyền dữ liệu giữa client và server
  Cơ chế: request/response - client gửi request, server trả về dữ liệu json, file...
  Các phương thức: GET - lấy dữ liệu, POST - tạo mới dữ liệu, PUT/PATCH - sửa dữ liệu, DELETE - xóa dữ liệu.
  Các HTTP status code chia thành các nhóm:  
  2xx: thành công, thường gặp nhất là 200 OK
  3xx: chuyển hướng - redirection  
  4xx: lỗi từ client, thường gặp là  
  400 Bad Request: Request sai cú pháp, dữ liệu đầu vào không hợp lệ.
  401 Unauthorized: Chưa xác thực hoặc token không hợp lệ.
  403 Forbidden: Không có quyền truy cập resource này.
  404 Not Found: Không tìm thấy resource hoặc endpoint.
  5xx: lỗi từ server, thường gặp là
  500 Internal Server Error: Lỗi server, không xác định rõ nguyên nhân
  502 Bad Gateway: Gateway hoặc proxy nhận được phản hồi không hợp lệ từ server phía sau.
  503 Service Unavailable: Dịch vụ tạm thời không hoạt động (quá tải, bảo trì).
  504 Gateway Timeout: Gateway hoặc proxy không nhận được phản hồi từ server phía sau đúng thời gian.
  HTTPS là HTTP kết hợp phương thức mã hóa SSL/TLS, đảm bảo bảo mật, tránh bị nghe lén, hầu hết các dịch vụ production hiện nay đều yêu cầu HTTPS.
- FTP (truyền file)
- SSH (truy cập server qua command)
- SMTP (giao thức gửi email)
- WebSocket (kết nối 2 chiều real-time giữa client và server sau khi handshake)
- RPC (dùng trong microservices giao tiếp giữa các dịch vụ do latency thấp)
  • Transport Layer: đảm bảo truyền dữ liệu từ nơi gửi đến nơi nhận.
  Giao thức: TCP (kết nối tin cậy, thường dùng cho web, API), UDP (kết nối nhanh nhưng không tin cậy, dùng cho streaming, game).
  • Network Layer: định tuyến dữ liệu qua các mạng khác nhau.
  Giao thức: IP (định danh địa chỉ thiết bị), ICMP (ping, kiểm tra kết nối), ARP (tìm MAC của IP).

5. API Design
   a. Một thiết kế API tốt đảm bảo:
   • Đơn giản và nhất quán
   Tất cả các endpoint đều có cấu trúc rõ ràng, đặt tên nhất quán, ví dụ như /users/{id}/orders để dễ dàng hiểu được chức năng và resource mà API cung cấp.
   • Tuân thủ chuẩn giao tiếp như RESTful, GraphQL, gRPC...
   Ví dụ đối với RESTful API:

- Sử dụng đúng các phương thức HTTP (GET, POST, PUT, DELETE…).
- Trả về đúng mã trạng thái HTTP (200, 201, 400, 404, 500…).
  • Dễ mở rộng, bảo trì
  Versioning để dễ quản lý các phiên bản API: /v1/users, /v2/users
  • Tài liệu rõ ràng
  Sử dụng Swagger/OpenAPI để tự động hóa và cập nhật tài liệu, giúp dev và đối tác dễ tích hợp, test API.
  • Bảo mật
  Sử dụng HTTPS, xác thực qua JWT hoặc OAuth2, và kiểm soát quyền truy cập, hạn chế rate limit để bảo vệ API khỏi tấn công.
  b. Các mô hình API
  • REST
  Stateless (không lưu trạng thái giữa các request, mỗi request là độc lập).
  Sử dụng các HTTP method chuẩn như GET, POST, PUT, DELETE.
  Dễ bị over-fetching (lấy dư dữ liệu) hoặc under-fetching (lấy thiếu dữ liệu).
  Trao đổi dữ liệu chủ yếu bằng JSON, dễ đọc cho con người.
  • GraphQL
  Tránh được vấn đề over-fetching và under-fetching (client chỉ lấy đúng dữ liệu cần), tuy nhiên khó trong caching.
  Query dựa trên schema xác định kiểu dữ liệu rõ ràng.
  Query phức tạp có thể ảnh hưởng hiệu năng server.
  Chỉ dùng phương thức POST.
  Luôn trả về HTTP 200, nếu có lỗi sẽ nằm trong payload gửi về kèm.
  • gRPC
  Xây dựng trên HTTP/2, hỗ trợ multiplexing và server push.
  Dùng Protocol Buffers để truyền dữ liệu, rất hiệu quả và tiết kiệm băng thông.
  Hiệu năng cao, phù hợp cho hệ thống lớn hoặc microservices.
  Dữ liệu ít thân thiện với con người, khó đọc trực tiếp.
  Yêu cầu môi trường/phần mềm hỗ trợ HTTP/2.

6. Caching & CNDs
   a. Caching
   • Là việc lưu trữ tạm thời dữ liệu ở các tầng gần với người dùng hơn như trình duyệt, proxy hoặc server (redis) để phục vụ nhanh các request hay sử dụng.
   • Giảm truy vấn tới backend và db, tiết kiệm tài nguyên và tăng hiệu năng.
   • Áp dụng tốt cho REST vì dữ liệu thường ít thay đổi (không phù hợp GraphQL).
   b. CDN
   Là mạng lưới phân phối các máy chủ đặt ở nhiều nơi trên thế giới. Lưu các file tính như HTML, CSS, JS, ảnh để người dùng tải nhanh từ server gần nhất. Giúp tăng tính high availability, tăng độ trễ khi yêu cầu tài nguyên và tăng bảo mật.

7. Proxy Server
   • Là thành phần trung gian giữa client và server, có vai trò chuyển tiếp request và response.
   • Chức năng chính:

- Ẩn IP thực của client hoặc server, tăng bảo mật
- Lọc, kiểm soát, ghi log các truy cập
- Cache dữ liệu tăng tốc truy cập cho client
  • Hai loại chính:
- Forward proxy:  
  Đứng trước client (giữa client và internet).
  Giúp ẩn IP của client khỏi các server ngoài, server chỉ thấy IP của proxy.
  Thường dùng để kiểm soát truy cập web (chặn Facebook, Youtube) trong nội bộ công ty.
- Reverse proxy:
  Đứng trước server (giữa server và internet)
  Ẩn IP của server backend, client chỉ thấy IP của proxy.
  Thường dùng để load balancing - phân phối đều request cho các server phía sau, xử lý mã hóa SSL giảm tải cho backend, caching hoặc nén dữ liệu trả về.
  Các load balancer như Nginx, AWS ELB hay CDN như Cloudflare, AWS CloudFront cũng được coi là reverse proxy.

8. Load Balancer
   • Là thành phần trung gian giúp phân phối đều lưu lược request từ client đến nhiều server backend phía sau. Ví dụ AWS Elastic Load Balancer, Nginx...
   • Mục tiêu là tối ưu hiệu năng, tăng tính chịu tải và đảm bảo hệ thống hoạt động ổn định.
   • Các loại LB:

- Layer 4 (Transport): Phân phối dựa trên địa chỉ IP, port (ví dụ: TCP, UDP). Nhanh hơn, phù hợp các dịch vụ không cần xử lý sâu về nội dung như cân bằng tải cho database, các ứng dụng TCP.
- Layer 7 (Application): Phân phối dựa trên nội dung HTTP/HTTPS, URL, cookie… (ví dụ: Nginx, HAProxy). Phù hợp cho web và API.
  • Các thuật toán LB chính:
  Round Robin: Chia đều theo lượt từng server.
  Least Connection: Ưu tiên server rảnh nhất (ít kết nối nhất).
  IP Hash: Dựa vào IP client, giữ session đảm bảo client luôn được chuyển đến 1 server cố định.
  Weighted (Weighted Round Robin / Weighted Least Connection): Chia theo sức mạnh từng server (gán trọng số cho từng server).
  • Sticky session: Đối với hệ thống có cân bằng tải, nếu không dùng thuật toán IP hash nhưng vẫn muốn gắn 1 client với 1 server (ví dụ như lưu giỏ hàng, ứng dụng chat hoặc trạng thái đăng nhập trên các hệ thống cũ) thì dùng sticky session (được hỗ trợ trong hầu hết các LB như Nginx, HAProxy, AWS ELB)
  Nếu backend stateless, không lưu session trên backend mà lưu ở client hoặc lưu tập trung tại Redis/Memcached thì không cần dùng sticky session. Ví dụ như hiện nay các ứng dụng web đều dùng JWT, session được xác nhận thông qua token (lưu phía client), server không cần nhớ trạng thái của user, hay hệ thống microservices, session lưu trên Redis, mọi server đều truy cập được.

9. Message Queue (Kafka, RabbitMQ, ActiveMQ)
   • Là thành phần trung gian giúp các hệ thống hoặc microservices giao tiếp bất đồng bộ với nhau, thông qua việc gửi và nhận thông điệp (message)
   • Giao tiếp bất đồng bộ: Ví dụ khi người dùng đăng ký xong, hệ thống trả về thông báo thành công ngay. Việc gửi email xác nhận được gửi như một message vào MQ (Kafka, RabbitMQ...). Service chuyên gửi mail sẽ nhận message này và xử lý sau. Do vậy người dùng không cần chờ email gửi xong mới được đăng ký thành công.
   a. Kafka
   • Có thể xử lý dữ liệu với thông lượng (throughput) lớn, tốc độ cao, lưu trữ message lâu dài (có thể đọc lại nhiều lần, replay lại message), được thiết kế để scale tốt phù hợp với hệ thống phân tán
   • Phù hợp cho hệ thống cần nhiều sự kiện liên tục, như streaming log, phân tích dữ liệu realtime, hoặc nhận dữ liệu từ hàng ngàn thiết bị IoT
   b. RabbitMQ
   • Dễ dùng, triển khai nhanh, hỗ trợ nhiều giao thức, mạnh về hàng đợi nghiệp vụ. Message không được lưu trữ lâu dài như Kafka
   • Phù hợp cho các ứng dụng cần xử lý bất đồng bộ như e-commerce, gửi email, thanh toán, nhập đơn hàng...
   c. ActiveMQ
   • Tích hợp với hệ sinh thái Java
   • Hỗ trợ nhiều kiểu giao tiếp như point-to-point, pub-sub
   II. Scenario
1. Một hệ thống hàng triệu người dùng thiết kế thế nào? Những điểm quan trọng để tối ưu hệ thống đó.
   a. Scale Horizontally  
   • Triển khai nhiều instance backend (EC2, container, server vật lý) phía sau LB
   • Stateless server: không lưu trạng thái trên server (JWT), session lưu ở cache ngoài (Redis)
   b. Load Balancer
   • AWS ALB, Nginx, HAProxy
   • Sử dụng health check để tự động loại instance lỗi khỏi hệ thống
   c. Database Scalability
   • Read Replica: ghi vào master/primary, đọc dữ liệu từ slave/replica database
   • Sharding/Partitioning: chia dữ liệu thành nhiều phần nhỏ theo user, khu vực... tránh quá tải trên một node
   • Connection Pooling: Hạn chế số lượng kết nối (tránh quá tải), tái sử dụng được kết nối nên tăng hiệu năng, tiết kiệm tài nguyên  
   d. Caching
   • Cache tầng ứng dụng: Dùng Redis
   • Cache tầng CDN (AWS CloudFront)
   e. Xử lý bất đồng bộ (Asynchronous Processing)
   • Queue/ Massage Broker: Kafka, RabitMQ, SQS, ActiveMQ
   • Worker pool: tăng số thread để xử lý song song
   f. High Availability & Fault Tolerance
   • Triển khai đa vùng (multi-zone, multi-region): nếu 1 vùng gặp sự cố, các vùng khác vẫn hoạt động
   • Auto-Scaling: Tự động tăng giảm số lượng instance dựa vào tải thực tế
   • Replica, backup: Đảm bảo dữ liệu không mất khi server/db có sự cố
   g. Connection Management
   • Hạn chế timeout, tối ưu giữ kết nối lâu (keep-alive), dùng connection pool, áp dụng cho cả backend và database
   • Rate limiting: hạn chế số request của mỗi user/IP trên một đơn vị thời gian để bảo vệ hệ thống
   h. Monitoring, Logging, Alerting
   • Realtime monitoring: Theo dõi chỉ số CPU, RAM, IOPS (số lượng thao tác đọc ghi IO trên giây), số lượng request, response time...
   • Alerting: cảnh báo khi có dấu hiệu quá tải, lỗi dịch vụ
   • Log tập trung: thu thập log để phân tích và xử lý sự cố nhanh
1. Một luồng request-response client đi qua các thành phần của một hệ thống web application hiện đại thế nào (ví dụ triển khai với React.js, Spring Boot, AWS)?
   Lưu ý (với sơ đồ dưới):
   • CloudFront vừa có thể dùng làm CDN cho file tĩnh (React app) vừa có thể làm reverse proxy, bảo vệ và tăng tốc API.
   • AWS WAF có thể áp dụng ở cả CloudFront, ALB, hoặc API Gateway để bảo vệ hệ thống khỏi các tấn công web phổ biến.
   • API Gateway thường dùng với các backend serverless (Lambda), nhưng cũng có thể forward đến ECS, EC2...

B. Database
I. Overview

1. DB types
   • Relational DB (SQL): Là loại database tổ chức data thành các bảng với các hàng và các cột, có cấu trúc rõ ràng. Đảm bảo tính nhất quán, toàn vẹn dữ liệu.
   Ví dụ như PostgreSQL, MySQL, Oracle.
   Use cases:

- Hệ thống cần dữ liệu quan hệ phức tạp
- Dữ liệu ổn định, ít thay đổi cấu trúc
- Muốn đảm bảo tính nhất quán và toàn vẹn dữ liệu (ACID)
- Cần truy vấn phức tạp JOIN, transaction đảm bảo.
  Hệ thống ngân hàng, quản lý đơn hàng...
  • NoSQL (non-relational database): Là loại database tổ chức dữ liệu linh hoạt (ví dụ MongoDB – document, Redis – key value, Cassandra - column based, Neo4j – graph), không yêu cầu schema cố định, dễ mở rộng ngang (horizotal scalability), tối ưu cho lưu trữ lớn, tốc độ cao
  Use cases:
- Dữ liệu phi cấu trúc, hoặc thay đổi thường xuyên (user profile, log, session).
- Hệ thống cần scale lớn, real-time (social network, IoT, gaming).
- Không cần JOIN phức tạp, chủ yếu lấy/gửi dữ liệu đơn giản.

2. Schema design
   a. Data Normalization (Chuẩn hóa)
   Là quá trình tổ chức dữ liệu trong database nhằm giảm thiểu sự dư thùa (redundancy) và đảm bảo tính nhất quán (consistancy) của dữ liệu.
   b. Denormalization
3. DB Indexing, Query Optimization
4. Transaction, Isolation Level, Locking
5. Partitioning & Sharding, Replication, Data Migration
6. Caching
7. Backup & Recovery
8. Performance Tuning
9. ORM, JPA, Spring Data JPA

II. Scenario

1. Dùng JPA khác gì dùng Native Query?
2. Quy trình tối ưu một query database

C. Java Core
I. Overview

1. OOP
   a. Overview
   Mô hình lập trình dựa trên object và class, mỗi object là một thực thể gồm các thuộc tính và hành vi.
   Encapsulation: Che giấu dữ liệu, dùng getter/setter
   Inheritance: Tái sử dụng code từ class cha
   Polymophism: Hành động giống nhau nhưng cách thực hiện khác nhau (overloading, overiding)
   Abstraction: Ẩn chi tiết cài đặt, chỉ cho biết interface/abstract method
   b. Sự khác nhau Abstract Class và Interface?
   • Abstract Class:
   Có thể có những method có thân hàm
   Có constructor, biến instance
   Đơn kế thừa, một class chỉ extends được một class cha
   • Interface:
   Không có method có thân hàm (từ Java 8 có default&static method cho phép khai báo thân hàm)
   Không có constructor
   Đa kế thừa, một interface cho phép implement nhiều interface
   • Trường hợp sử dụng:
   AC sử dụng khi muốn chia sẻ logic code chung. Ví dụ Dog, Cat extend từ lớp abstract Animal, có thể có những đặc điểm chung như tên hoặc method eat(), nhưng ngoài ra cũng có những method abstract như makeSound() để có thể cài đặt riêng.  
   Interface sử dụng khi cần định nghĩa một bản hợp đồng hành vi. Đó là khi ta muốn các class khác nhau nhưng vẫn phải có chung một hành vi, chức năng
   c. Overloading và overiding
   • Overloading:
   Xảy ra trong cùng class hoặc class con kế thừa
   Khác signature (cùng tên, khác tham số)
   Đa hình compile-time
   • Overiding
   Xảy ra giữa class cha và class con, subclass định nghĩa lại method superclass
   Signature giống y hệt class cha
   Đa hình runtime
   d. Composition vs Inheritance – khi nào nên dùng
   • Inheritance (IS-A): Cat extends Animal
   • Composition (HAS-A): Car has Engine
   Nên ưu tiên Composition vì:
   Linh hoạt hơn - có thể nhiều thành phần, giải quyết phần nào vấn đề đa kế thừa của inheritance, dễ kiểm thử unit test
   Giảm coupling - không bị ràng buộc bởi mối quan hệ cha con
   e. Multiple Inheritance qua Interface & Diamond Problem trong Java
   Java không hỗ trợ multiple inheritance qua class
   Nhưng hỗ trợ qua interface
   Nếu 2 interface có default method trùng nhau, class implements phải override để giải quyết xung đột. Ví dụ class implement 2 interface A, B cùng default defaultMethod() mà dùng của interface A thì A.super.defaultMethod()
   f. Overiding và Hiding
   Overriding là khi lớp con thay đổi hành vi của một phương thức instance đã có ở lớp cha, và quyết định phương thức nào được gọi dựa vào đối tượng thực tế tại thời điểm chạy (runtime).

Hiding là khi lớp con che khuất một phương thức static hoặc biến đã có ở lớp cha, và quyết định phương thức hoặc biến nào được sử dụng dựa vào kiểu khai báo tại thời điểm biên dịch (compile time).

g. Dynamic Dispatch & Virtual Method Table (VMT)
• Dynamic Dispatch: cơ chế giúp JVM chọn method gọi tại runtime dựa trên object thực tế.
• VMT:  
JVM lưu bảng ánh xạ method override
Khi gọi obj.method(), JVM tra cứu vtable để xác định method đúng
Đây là cách Java thực hiện runtime polymorphism

2. Collections
   a. Overview
   • Collection Framework là tập hợp các class và interface hỗ trợ thao tác với tập dữ liệu ĐỘNG (List, Set, Map, Queue), nó khác với Arrays (có kích thước cố định) và cung cấp nhiều thuật toán như sort, search, shuffle
   • Collection là INTERFACE, Collections là CLASS tiện ích
   • Iterator: dùng để duyệt 1 CHIỀU các phần tử của Collection, chỉ có next(), hasNext(), remove()
   ListIterator: nâng cấp của Iterator, chỉ dùng cho List, duyệt 2 chiều, có cả next và previous, hỗ trợ thêm sửa xóa phần tử trong khi duyệt
   • Tại sao Collection là interface gốc thay vì Class?  
   Để cho phép nhiều cấu trúc dữ liệu khác nhau (ArrayList, HashSet, LinkedList) implement linh hoạt.
   • fail-fast iterator: ném ConcurrentModificationException nếu collection bị thay đổi cấu trúc khi đang duyệt
   Ví dụ ArrayList, HashMap
   • fail-safe iterator: cho phép duyệt mà không lỗi, nhưng có thể không thấy cập nhật mới
   Ví dụ ConcurrentHashMap, CopyOnWriteArrayList
   b. Collection (lưu trữ theo phần tử rời rạc)
   • List: có thứ tự, cho phép phần tử trùng lặp (cả kể null)

- ArrayList: truy cập theo chỉ số, thêm và xóa cuối nhanh O(1), xóa index O(n), thích hợp cho đọc nhiều (truy cập theo chỉ số, O(1))
- LinkedList: linked list trong Java là double-linked list (2 chiều)  
  Thao tác thêm/xóa ở đầu/cuối nhanh, truy cập ngẫu nhiên chậm (do phải duyệt từ đầu hoặc cuối O(n)), thích hợp lưu dữ liệu thao tác thêm/xóa nhiều
  Đa năng, có thể dùng như List, Queue, Deque, Stack
- Vector/Stack: cũ, ít dùng; Vector thread-safe, Stack LIFO
  • Set: không cho phép phần tử trùng lặp, thường không thứ tự (LinkHashSet, TreeSet có thể có thứ tự)
- HashSet: không thứ tự, không trùng lặp, thao tác nhanh
  Dựa trên HashMap - chỉ lưu key, value là dummy object
  Check 2 phần tử bằng nhau: so sánh hashCode() trước, sau đó equals()
- LinkedHashSet: giữ thứ tự thêm, không trùng lặp
- TreeSet: sắp xếp tự nhiên hoặc theo Comparator/Comparable, thích hợp khi cần duyệt có thứ tự, không cho phép null (vì không so sánh được)
  • Queue/Deque (Double end queue): Lưu trữ theo hàng đợi, FIFO hoặc LIFO, cho phép trùng lặp
- PriorityQueue: hàng đợi ưu tiên theo Comparator/Comparable, không cho phép null, nếu 2 phần tử cùng độ ưu tiên thì không đảm bảo thứ tự ổn định
- ArrayDeque: hàng đợi 2 đầu, không giới hạn kích thước, thao tác đầu cuối đều nhanh O(1), không cho phép null
  Có thể dùng như queue FIFO hoặc stack LIFO
  c. Map (nhóm ánh xạ key-value, không thuộc Collection Interface)
  Key-value, key không trùng lặp (1 null duy nhất), value trùng được.
  • HashMap: lưu trữ key-value dựa trên mảng bucket, mỗi bucket chứa linked list hoặc red-black tree của các key-value

HashMap trong Java 8+ dùng red-black tree thay cho linked list để giảm độ phức tạp O(n) xuống O(logn) khi nhiều hash key vào cùng 1 bucket
Hiệu năng truy xuất O(1)
• LinkedHashMap: duy trì thứ tự thêm vào, nhanh ~HashMap, truy xuất O(1)
• TreeMap: sắp xếp tự nhiên theo Comparator/Comparable, không cho phép null, hiệu năng truy xuất O(logn)
• ConcurrentHashMap: dùng cho đa luồng, hiệu năng cao, không cho key hoặc value null 3. Concurency  
a. Thread và process
• Process là một chương trình đang chạy, có bộ nhớ, tài nguyên riêng.
• Thread là luồng thực thi nhỏ hơn trong một process, các thread cùng chia sẻ bộ nhớ. Ví dụ bật chrome (1 process), mỗi tab có thể là 1 thread
b. Runable và Thread
• Runable: một interface chỉ có phương thức run(), dùng để ĐỊNH NGHĨA task
• Thread: class có phương thức run(), start()
• Cả 2 đều không trả về giá trị  
• Nếu extends Thread thì không extend được class khác
Dùng Runable linh hoạt hơn, implement được nhiều interface, tách riêng logic chạy và quản lý thread
c. Chu kì của Thread
• New: thread được tạo ra nhưng chưa chạy do chưa gọi start()
• Runable: đã gọi start(), sẵn sàng được CPU thực thi
• Running: CPU thực sự thực thi code
• Blocked / Waiting / Timed Waiting (Chờ hoặc bị chặn): thread tạm dừng, chờ 1 sự kiện, chờ vào lock, chờ kết thúc thread khác, chờ do sleep()
• Terminated: Kết thúc, thoát khỏi phương thức run()
d. synchronized và volatile
• synchronized: khóa đối tượng hoặc method, đảm bảo chỉ có 1 thread truy cập được vào vùng code đó tại một thời điểm.
synchronized method khóa toàn bộ method, sychronized block chỉ khóa một đoạn code nhỏ nên hiệu năng tốt hơn
• volatile: dùng cho biến, đảm bảo khi 1 thread thay đổi giá trị của biến đó, các thread sẽ ngay lập tức nhìn thấy giá trị mới đó  
• volatile chỉ đảm bảo visibility, synchronized đảm bảo cả visibility và mutual exclusion (không có race condition) / cả khối code đó là atomicity
Tức, đối với thao tác nguyên tử, chỉ có 1 bước duy nhất (như thay đổi status từ true thành false) chỉ cần dùng volatile để đảm bảo thêm visibility.
Đối với thao tác gồm nhiều bước (một luồng khác có thể chen vào trong khi đang thực thi), ví dụ counter++ (gồm 3 bước đọc, tăng, ghi). Nếu chỉ dùng volatile, 2 thread có thể cùng đọc giá trị cũ, dẫn đến race condition. Khi đó dùng synchronized, đảm bảo cả tính atomicity của chuỗi thao tác trên.
• volatile phù hợp với biến có thao tác nguyên tử - boolean, flag, status...
synchronize dùng với các thao tác phức tạp hơn như tăng biến số nguyên
e. wait(), notify(), notifyAll()
Phải gọi trong khối synchronized (thread phải giữ lock của object đó)
• wait() làm thread hiện tại dừng lại để chờ 1 thread khác gọi notify() hoặc notifyAll()
• notify() đánh thức một thread khác trên cùng 1 object, nếu có nhiều thread, đánh thức MỘT thread bất kì
• notifyAll(): đánh thức tất cả thread đang wait() trên cùng 1 object
3 method trên giải quết vấn đề phối hợp giữ nhiều thread khi truy cập hoặc thao tác trên các tài nguyên dùng chung
Ví dụ: Trong một chương trình phát nhạc, thread chuyên phát nhạc phải wait thread chuyên tải dữ liệu tải xong, khi xong sẽ notify đến thread phát nhạc
f. Thread Pools và Executor Framwork
• Thread Pool là một bể chứa các thread được tạo sẵn để sẵn sàng thực thi task, giúp tái sử dụng thread không cần tạo mới mỗi lần cần xử lý
• Executor Framework cung cấp bộ API quản lý và sử dụng thread pool
ExecutorService thường dùng trong các dự án thực tế. Cung cấp các phương thức như submit() để nộp task, có thể là Runnable hoặc Callable.
Nó quản lý việc tạo, tái sử dụng và hủy thread (với phương thức shutDown()), giúp tối ưu tài nguyên hệ thống.
g. Callable và Future
• Callable: Giống Runable, dùng để định nghĩa task nhưng có kết quả trả về sau khi task chạy xong, có thể ném checked exception (Runable không)
• Future: Một interface đại diện cho kết quả của một task sẽ hoàn thành trong tương lai.  
Có thể dùng nó để kiểm tra task đã xong chưa, lấy kết quả hoặc hủy task.

h. Concurrent Collections
• ConcurrentHashMap: map an toàn cho nhiều thread đọc/ghi đồng thời mà không cần tự đồng bộ hóa (synchronized)
Hiệu năng cao hơn Hashtable, synchronizedMap. Thay vì khóa toàn bộ Map để cho 1 luồng truy cập như 2 thằng trên thì nó chia nhỏ lock, cho phép nhiều thread truy cập đồng thời.
• CopyOnWriteArrayList: list tối ưu cho trường hợp đọc nhiều, ghi ít vì mỗi lần ghi sẽ copy ra một mảng mới.
• ConcurrentLinkedQueue: queue an toàn, không khóa cho các thao tác đồng thời
• BlockingQueue (ví dụ ArrayBlockingQueue, LinkedBlockingQueue):
Hàng đợi hỗ trợ cơ chế chờ (wait) và đánh thức (notify) khi thêm, lấy phần tử
Hữu ích cho các bài toán producer-consumer
i. Atomic Variables
• Là các biến đặc biệt được thiết kế hỗ trợ các thao tác đọc, ghi, tăng, giảm, cập nhật... một cách an toàn trong môi trường đa luồng mà không cần dùng synchronize. Nó biến các thao tác trên với biến trở nên duy nhất (atomicity), do đó tránh được race-condition.
AtomicInteger, AtomicLong, AtomicBoolean...
• Hiệu năng cao hơn synchronized do dùng cơ chế CAS – compare and swap (một câu lệnh gốc CPU nên nhanh)
Ví dụ khi thực hiện thao tác tăng trên một biến đang có giá trị 10, nếu dùng synchronized, phải khóa biến đó lại, cho luồng chính (được phép truy cập) tăng lên 11 rồi mới nhả khóa cho các luồng khác chạy tiếp, rất mất thời gian.
Nếu dùng atomic variable, nó sẽ lưu lại giá trị ban đầu là 10. Giả sử trong lúc luồng chính đang tăng biến lên 11 mà có 1 luồng khác đã tăng nó lên 11 trước. CPU sẽ so sánh giá trị hiện tại (11) với giá trị ban đầu đã lưu (10). Do khác nhau nên nó sẽ cập nhật giá trị ban đầu thành 11 và tiếp tục quy trình trên.
j. Synchronizers
• CountDownLatch: cho phép 1 hoặc nhiều thread chờ cho đến khi một số tác vụ hoàn thành (mới tiếp tục).

• CyclicBarrier: cho phép 1 nhóm thread chờ nhau tại một “điểm barrier” và cùng tiếp tục khi tất cả đã đến.

k. Fork/Join Framework
ForkJoinPool: dùng cho lập trình parallelism.
Chia task lớn thành các task nhỏ (fork), sau đó ghép lại (join).  
Tối ưu trên CPU đa nhân. Khi khởi tạo ForkJoinPool, Java sẽ tự động tạo số luồng bằng số core CPU và xử lý tác vụ trên tất cả các core.
l. Deadlock & Livelock
• Deadlock: là hiện tượng xảy ra khi 2 hoặc nhiều luồng chờ lẫn nhau giải phóng tài nguyên dẫn đến tất cả bị treo vô thời hạn.
Ví dụ có 2 object lock A và B. Luồng 1 lock A trước rồi cố lock B. Luồng 2 lock B trước rồi cố lock A. Cả 2 bị treo vì không chịu nhả tải nguyên.
Cách phòng tránh:

- Đảm bảo lock tài nguyên đúng thứ tự, ví dụ luôn lấy A rồi mới lấy B.
- Dùng tryLock() của lớp ReentranLock thay vì lock với synchronized.
  tryLock(): luồng không bị chặn, thay vì chờ khóa mãi như synchronized, tryLock() chỉ thử lấy khóa, nếu không lấy được, giải phóng các tài nguyên đã giữ và thử lại hoặc xử lý logic khác.
- Sử dụng tryLock(long timeout, TimeUnit unit) set timeout để đặt thời gian giữ lock của một luồng, tránh bị lock vô thời hạn.
- Hạn chế lock nhiều tài nguyên đồng thời
  • Livelock: các thread vẫn chạy và thay đổi trạng thái, nhưng công việc không tiến triển. Hiếm gặp hơn deadlock.
  Ví dụ mình và ny mình cùng ăn tối nhưng chỉ có 1 chiếc thìa. Mình cầm thìa chuẩn bị ăn nhưng mình biết ny mình đói nên nhường thìa cho ẻm, ẻm cầm thìa xong lại nghĩ mình đói nên lại nhường thìa cho mình. Cuối cùng cả hai cùng đói mà không thực hiện được việc ăn.
  Giải pháp:
- Quy định rõ ai được ăn trước
- Giới hạn số lần nhường
- Thêm thời gian chờ ngẫu hiên khi nhường, tăng khả năng 1 người ăn trước
  m. Note and best practices
  • Trong các dự án Web Application dùng Spring Boot, thường không cần quản lý đa luồng vì SB đã tự quản lý đa luồng ở tầng server, chỉ khi cần xử lý song song hoặc một số tác vụ bất đồng bộ đặt biệt như xử lý nền (gửi notification, email mà người dùng không cần đợi), gọi nhiều API cùng lúc, xử lý dữ liệu lớn theo batch, phân nhỏ ra nhiều luồng
  • Nên dùng Thread Pool thay vì tự tạo Thread: Thay vì tạo mới từng thread, mình dùng ExecutorService để quản lý và tái sử dụng thread
  • Để tránh race condition khi nhiều luồng cùng truy cập, thay đổi một dữ liệu, dùng synchronized hoặc các class thread-safe như ConcurrentHashMap
  • Nên thiết kế các object bất biến immutable khi có thể, như dùng final, trạng thái không thay đổi sau khi khởi tạo nên không lo lắng về đồng bộ trong đa luồng
  • Luôn bắt và xử lý exception trong từng luồng, hoặc dùng UncaughtExceptionHandler, đảm bảo lỗi không bị bỏ qua và dễ kiểm soát sự cố
  • Sau khi luồng sử dụng tài nguyên như file, kết nối, socket thì phải đóng tại, tốt nhất là dùng try-with-resources hoặc đóng trong khối finally
  • Nên đặt tên cho các thread (dùng AtomicInteger) và ghi log đầy đủ

4. Lambdas, Functional interfaces, Stream API (Java 8+)
   a. Lambdas
   • Cách viết ngắn gọn cho các implementation của functional interface, giúp code dễ đọc và giảm boilerplate
   // không sử dụng từ khóa return  
   Addable ad1 = (a, b) -> (a + b);  
   System.out.println(ad1.add(10, 20));

// sử dụng từ khóa return  
Addable ad2 = (int a, int b) -> {  
 return (a + b);  
};

// ví dụ Thread sử dụng biểu thức lambda  
Runnable r2 = () -> {  
 System.out.println("Thread2 is running...");  
};  
Thread t2 = new Thread(r2);  
t2.start();

• Sử dụng khi cần truyền function như một đối số cho method
Ví dụ thường thấy nhất là dùng với stream API

ở đây filter nhận vào một function (lambda) để xác định điều kiện lọc toán tử
• Ngắn gọn hơn, không cần tạo class mới như anonymous class
b. Functional Interface
• Là gì? một interface chỉ có một abstract method duy nhất (có thể có default/static method nữa), được đánh dấu @FunctionalInterface  
• Vì sao functional interface chỉ có một abstract method? Cú pháp lambda chính là các viết ngắn gọn cho implement của method duy nhất đó, nếu có trên 2 method trừu tượng trong FI, biểu thức lambda sẽ bế tắc vì nó không biết cấp thân hàm cho phương thức nào
• Functional Interfaces Toolbox: tập hợp các functional interface có sẵn trong java - 4 main categories:

- Supplier<T>: T get() - không nhận vào tham số nhưng trả về một đối tượng (không ăn cơm mẹ nấu, đi làm và đem tiền về cho mẹ)
- Comsumer<T>: void accept(T t) - nhận tham số là một đối tượng nhưng không trả về gì (ăn cơm mẹ nấu, đi làm nhưng không đem tiền về cho mẹ)
- Function<T,R>: R apply (T t) - nhận tham số là đối tượng, trả về đối tượng (ăn cơm mẹ nấu, đi làm và đem tiền về cho mẹ)
- Predictable<T>: boolean test(T t) - nhận tham số là một đối tượng và trả về một dự đoán boolean (một trường hợp cụ thể của function)
- Để nối tiếp các functional interface và trả về một FI mới, sử dụng andThen

• Method references là cú pháp ngắn gọn hơn của lambda expression(::)
c. Stream API
• Là chuỗi các phần tử tử được hỗ trợ thao tác xử lí như một dòng chảy
• Stream khác với Collection:

- Collection lưu dữ liệu
- Stream KHÔNG lưu dữ liệu, chỉ xử lí luồng dữ liệu
  • Tính chất của Stream API:
- Không thay đổi dữ liệu gốc - các thao tác trên Stream không thay đổi Collection ban đầu
- Không lưu dữ liệu - chỉ xử lý khi cần
- Lazy Execution - các thao tác trung gian chỉ chạy khi có terminal operation
- Hỗ trợ xử lý song song với parallelStream()
  • Các thao tác chính với Stream:
- Tạo Stream:
  Từ Collection: list.stream() hoặc list.parallelStream()
  Từ array: Arrays.stream(array)
  Từ giá trị: Stream.of(1,2,3)
- Intermediate Operations (thao tác trung gian): trả về một Stream mới, không thực thi ngay (lazy execution)
  filter(Predicate) — Lọc theo điều kiện
  map(Function) — Biến đổi từng phần tử
  sorted() — Sắp xếp
  distinct() — Loại bỏ trùng
  limit(n), skip(n) — Giới hạn, bỏ qua
- Terminal Operation: thực thi pipeline, trả về kết quả
  forEach(Consumer) — Xử lý từng phần tử
  collect(Collector) — Thu thập thành List, Set, Map,...
  reduce(BinaryOperator) — Tổng hợp thành một giá trị
  count(), min(), max(), anyMatch(), allMatch(), v.v.
  d. Notes and best practice
  • Chỉ sử dụng hoặc tự tạo FI khi cần thiết, tận dụng các FI chuẩn của Java.
  • Không nên dùng Stream cho thao tác đơn giản, loop nhỏ — for-each sẽ nhanh hơn

• Không nên thay đổi (modify) phần tử bên trong Stream, không làm thay đổi giá trị gốc của collection.
KHÔNG nên:

Nên:

• Cẩn thận khi dùng song song với dữ liệu không thread-safe
Ví dụ NGUY HIỂM:

Giải quyết:

- Dùng collect(): tốt nhất

- Thay List thành Collections.synchronizedList hoặc CopyOnWriteArrayList

5. Generics
   • Mục đích? Cho phép khai báo lớp, interface, method với kiểu dữ liệu tổng quát
   • Cách sử dụng:

- Với class và interface:
- Với method:
- Với collection:  
  • Lợi ích:
- Code tường minh hơn, phát hiện lỗi kiểu dữ liệu ngay khi biên dịch
- Giảm ép kiểu thủ công, code rõ ràng, dễ đọc hơn
  Nếu không dùng Generics : ít tường minh hơn so với khai báo có generics, báo lỗi nếu dữ liệu đưa vào List không phải String. Và phải ép kiểu thủ công:

Dùng generics thì không cần:

- Tái sử dụng code: ví dụ class Box<T> có thể thay thế IntBox hoặc StringBox, tùy trường hợp sử dụng
  • Wildcard: ? (chấp nhận mọi kiểu), ? extends T (chấp nhận T hoặc kiểu con của nó), ? super T (chấp nhận T hoặc lớp cha của nó).  
  Hỗ trợ truyền kiểu linh hoạt hơn.

• Bound: T extends Number để giới hạn kiểu (chấp nhận kiểu đó hoặc kiểu con của nó)

6. Java I/O
   • Java cung cấp các APU để đọc dữ liệu từ nguồn và ghi dữ liệu ra đích
   Nguồn và đích có thể là: console (bàn phím, màn hình), file, mạng, bộ nhớ...
   • Có 2 gói IO chính:
   java.io: hỗ trợ IO dựa trên stream (luồng byte và ký tự)
   java.nio (New IO): hỗ trợ Non-blocking IO, tối ưu xử lý dữ liệu lớn và ứng dụng mạng.
   Non-blocking IO là kỹ thuật giúp chương trình không bị dừng lại khi thao tác I/O.
   • Các lớp chính:

- Byte Streams: đọc ghi dữ liệu dạng nhị phân
- Character Streams: đọc ghi dữ liệu dạng ký tự (Unicode)
- Buffer Streams: tăng hiệu suất đọc ghi cho dữ liệu dạng nhị phân hoặc ký tự
- Data Streams: đọc ghi dữ liệu nguyên thủy (int, double, boolean...)
- Object Streams: đọc ghi đối tượng (serialization)
  • Serialization và Deserialization:
- Serialization là quá trình biến một đối tượng Java thành dãy byte để có thể lưu vào file, truyền qua mạng hoặc ghi vào db
- Deserialization là quá trình ngược lại, biến dãy byte thành object
- Java hỗ trợ serialization qua các lớp: ObjectOutputStream (ghi), ObjectInputStream (đọc)
- Đối tượng muốn được serialize phải implements interface Serializable.
  serialVersionUID: Nên định nghĩa để tránh lỗi khi thay đổi class.
  Không serialize các trường không cần thiết: Dùng từ khóa transient.
- Trường hợp sử dụng: chủ yếu là dùng trong ứng dụng game,  
  • try-with-resources: tự động đóng tài nguyên như file, stream, socket, kết nối database... mà không cần tự tay gọi close() trong finally.
  Các resource này phải implements interface AutoCloseable.

7. JVM Turning, Garbage Collection
   a. Heap & Stack
   • Heap:
   Là vùng nhớ lớn trong JVM để lưu trữ các instance của object được tạo ra trong quá trình chạy chương trình (share giữa tất cả các thread).
   Được Garbage Collector (GC) tự động quản lý: thu hồi bộ nhớ các object không còn sử dụng.
   Nếu heap đầy, có thể gặp lỗi OutOfMemoryError.
   • Stack:  
   Mỗi thread có một stack riêng.
   Lưu các biến cục bộ, tham số của hàm, thông tin hàm đang thực thi (call stack).
   Khi hàm gọi lồng nhau quá sâu hoặc đệ quy vô hạn, sẽ gặp StackOverflowError.
   • Vậy những dữ liệu như thông tin class, hằng số, biến static... lưu ở đâu? Metaspace (Java 8+), sử dụng trực tiếp bộ nhớ của OS (native memory)
   b. Các tham số JVM hay dùng (chỉnh command hoặc setup trên IDE ngay lúc run)
   -Xms và -Xmx: Đặt dung lượng heap ban đầu (-Xms) và tối đa (-Xmx).
   -XX:+UseG1GC: Chọn loại GC (nên dùng G1GC cho app hiện đại).
   -Xss: Đặt dung lượng stack mỗi thread.
   Các tham số log GC: -Xlog:gc\* (Java 9+).

c. Các loại GC phổ biến
• G1 GC (Java 9+, mặc định ở Java 17, 21): Cân bằng tốt giữa throughput và độ trễ (latency), phù hợp đa số app web, hệ thống microservices hiện nay.
• Parallel GC (mặc định ở Java 8): Ưu tiên throughput, dùng cho batch processing.
• ZGC (Java 11+): Heap lớn (hàng trăm GB), latency rất thấp, cho hệ thống lớn.
d. Cách phát hiện và xử lý vấn đề về bộ nhớ
• OutOfMemoryError: Do heap đầy, Metaspace đầy, hoặc memory leak quá lâu.
• Memory leak: hiện tượng các đối tượng trong heap không còn được sử dụng nhưng vẫn còn tham chiếu nên GC không thể thu hồi.
• StackOverflowError: Đệ quy vô hạn, stack quá sâu.
• Dùng GC log và các công cụ như VisualVM/JMC để theo dõi heap và GC.
e. Các thao tác thực tế hay làm
• Điều chỉnh heap (-Xms, -Xmx) khi app thiếu/tốn nhiều bộ nhớ.
• Đổi loại GC khi app lag, pause lâu, hoặc throughput thấp.
• Theo dõi log GC để phát hiện full GC, pause time cao, memory leak.
• Tạo heap dump khi cần phân tích kỹ memory leak.
f. Notes
• Đừng để heap quá lớn mà không kiểm soát (full GC sẽ lâu).
• Ưu tiên G1GC cho đa số ứng dụng web/server hiện đại.
• Theo dõi GC pause time: Nếu pause lâu, thử tối ưu heap, đổi GC, hoặc phân tích code gây leak.
• Hạn chế gọi System.gc() trong code thực tế. 8. Điểm mới chính trong các phiên bản Java
a. Java 8
• Lambda Expression
• Functional Interface
• Method Reference
• Stream API
• Default & Static Method trong Interface
• Optional: xử lý các giá trị có thể null, tránh NullPointerException, giúp  
• Date & Time API mới: Các lớp trong package java.time (LocalDate, LocalTime, LocalDateTime, ...), thay thế cho java.util.Date cũ.
• ...
b. Java 17
• LTS (Long-term support), ổn định cho doanh nghiệp
• Sealed Classes: Giới hạn class con có thể kế thừa, giúp kiểm soát tốt hơn cấu trúc kế thừa.
• Pattern Matching for instanceof: Kiểm tra kiểu và ép kiểu gọn hơn.
• Records (ra mắt từ Java 16, ổn định ở 17): Khai báo class immutable ngắn gọn cho data.
• Text Blocks: Viết chuỗi nhiều dòng dễ dàng hơn với dấu “””
• ...
c. Java 21
• LTS mới nhất, tập trung hỗ trợ lập trình hàm hiện đại
• Pattern Matching for switch: Switch-case thông minh hơn, hỗ trợ kiểm tra kiểu, phân tích cấu trúc.
• Record Patterns: Hỗ trợ decompose dữ liệu từ record ngay trong pattern matching.
• ...

D. Spring/Spring Boot
I. Overview

1. Spring Core
   a. Inversion of Control (IoC)
   • Đảo ngược quyền điều khiển là thay vì lập trình viên chịu trách nhiệm quả lý vòng đời và sự phụ thuộc của các đối tượng, framework sẽ làm việc đó. Cụ thể trong Spring, IoC container sẽ xử lý khởi tạo, liên kết các đối tượng (chứ không do chính các class đó tự thực hiện)
   b. Dependency Injection (DI)
   • Là một cách cụ thể để thực hiện IoC. DI nghĩa là các phụ thuộc của một object sẽ được tiêm (inject) nhờ Ioc Container, thay vì object phải tự tạo ra chúng bằng từ khóa new.  
   • Lợi ích: giúp code dễ kiểm thử, dễ bảo trì, giảm sự phụ thuộc chặt chẽ giữa các module.
   c. Bean Lifecycle, Bean Scope
   • Vòng đời của bean:

- Khởi tạp: Spring tạo instance của bean
- Spring inject các dependency vào bean (bằng constructor – best practice)
- Có thể có các phương thức can thiệp trước và sau khi bean được khởi tạo
- Bean được sử dụng
- Khi container shutdown, gọi phương thức hủy (destroy)
  • Bean scope: Xác định phạm vi tồn tại và số lượng instance của bean
- Singleton: chỉ có một instance duy nhất được tạo ra trong toàn bộ ứng dụng
- Prototype: mỗi lần bean được yêu cầu, Spring sẽ tạo ra một instance mới
- Request (chỉ dùng trong web): mỗi HTTP request, một instance bean riêng được tạo
- Session: mỗi HTTP session, một instance bean riêng được tạo
- Application: một instance bean cho toàn bộ web application (ServerContext) - chỉ dụng cho ứng dụng web
- Web socket: một instance cho mỗi WebSocket
  d. ApplicationContext vs BeanFactory
  • BeanFactory:
- Là interface gốc (cơ bản) nhất của Spring Container
- Chỉ cung cấp các chức năng cơ bản về quản lý bean, như khởi tạo, cung cấp bean, tiêm phụ thuộc
- Chỉ khởi tạo bean khi bean được yêu cầu (lazy loading)
- Ít tính năng, nhẹ, chủ yếu dùng cho ứng dụng đơn giản, tài nguyên hạn chế
  • ApplicationContext:
- Là interface mở rộng của Spring Container
- Cung cấp đầy đủ các tính năng nâng cao cho enterprise application như:
  Hỗ trợ internationalization (i18n), AOP, tích hợp với các framework khác như JDBC, ORM...
- Khởi tạo tất cả singleton bean ngay khi context khởi động (eager loading)
- Trong Spring Boot, ApplicationContext luôn là mặc định
  e. AOP – Aspect Oriented Programming
  • AOP là kĩ thuật lập trình hướng khía cạnh, giúp tách các phần logic phụ trợ ra khỏi code chính, giúp các method tập trung vào business logic. Các logic phụ trợ thường gặp là logging, quản lý transaction, kiểm tra quyền (lúc truy cập vào method)...
  • AOP không thay thế OOP mà nó bổ trợ cho OOP. Ví dụ OOP đáng lẽ nên tập trung vào logic nghiệp vụ chính thì lại có những đoạn logic không liên quan như ghi log, kiểm tra quyền..., và điều này khiến code lặp lại ở nhiều nơi. AOP giúp tách biệt hoàn toàn các logic này ra khỏi các class business chính.
  • Các thành trong AOP:
- Aspect: nơi chứa logic phụ trợ (ví dụ logging logic)
- Advice (Lời khuyên/hành động): Đoạn code sẽ thực thi ở một điểm cụ thể (trước, sau, quanh method)
  Ví dụ trước khi bất cứ hàm nào trong service chạy, hãy in: ‘Bắt đầu method!’
  → Đoạn code System.out.println(“Bắt đầu method!”); là advice.
- Join Point (Điểm kết nối): Là điểm cụ thể trong quá trình thực thi chương trình, nơi advice có thể được áp dụng (thường là khi gọi method).
  Ví dụ khi bạn gọi userService.login() hoặc orderService.createOrder(), mỗi lần gọi method này là một join point.
- Pointcut (Điểm cắt): Điều kiện/biểu thức xác định những join point nào sẽ áp dụng advice (chọn những method nào để “gắn” advice).
  Bạn muốn ghi log cho mọi method trong package service:
  → Pointcut là: execution(_ com.example.service._.\*(..))
- Weaving (Kết hợp): Quá trình “gắn” aspect vào đúng chỗ trong code (các join point) khi ứng dụng chạy, biên dịch hoặc load class.
  Khi bạn chạy app, Spring hoặc AspectJ sẽ tự động “chèn” code log của bạn vào đúng các method đã định nghĩa trong pointcut.
  • Cách sử dụng:
- Thêm dependency spring-boot-starter-aop hoặc aspectjweaver (nếu dùng AspectJ)
- Sử dụng @Aspect để định nghĩa class chứa logic phụ trợ

- Một số annotation thường gặp trong AOP:

2. Spring Boot
   a. Overview
   • Spring Boot là framework được xây dựng dựa trên nền tảng Spring Framewrok, giúp tạo ứng dụng Spring nhanh nhất, đơn giản, tự động hóa cấu hình, giảm thiểu tối đa code cấu hình. Ví dụ trước đây phải cấu hình thủ công từng bean trong XML thì Spring Boot hỗ trợ cấu hình ngay trong code với các annotation.
   • Khác biệt chính với Spring:

- Spring Boot tự động cấu hình nhiều thành phần dựa trên các dependency đã thêm vào, giúp tiết kiệm thời gian và giảm lỗi cấu hình so với Spring thường
- Spring thường phải tự cấu hình server như Tomcat, Spring Boot thì có sẵn embedded server để chạy
- Hỗ trợ cấu hình ứng dụng qua file properties, YAML, biến môi trường, command line,... giúp linh động khi chuyển đổi môi trường (dev, test, prod).
  b. Cơ chế autoconfiguration  
  • Spring Boot tự động cấu hình ứng dụng dựa trên các dependency đã thêm vào project.  
  Không cần cấu hình thủ công các bean, datasource, security, MVC... nữa.
  Ví dụ:
  Nếu bạn thêm dependency spring-boot-starter-web, Spring Boot tự động cấu hình Tomcat, DispatcherServlet, các bean web, v.v.
  Nếu thêm spring-boot-starter-data-jpa, Spring Boot tự động cấu hình JPA, DataSource...
  • Starter dependencies
  Starter là các gói dependency được đóng gói sẵn, giúp bạn thêm tất cả thư viện cần thiết cho một tính năng chỉ với 1 dòng khai báo.

c. Cho phép cấu hình hóa bên ngoài (Externalized Configuration)
Chính là các file application.properties hoặc application.yml, cho phép cài đặt cấu hình các ứng dụng bên ngoài như database, AWS, Kafka... ngoài ra còn có thể cài đặt cấu hình thông qua biến môi trường và tham số dòng lệnh.
Ví dụ với tham số dòng lệnh:
Ngoài ra SB còn hỗ trợ cấu hình riêng biệt cho từng môi trường dev, test, prod:

3. Spring MVC  
   Là module của Spring Framework hỗ trợ phát triển ứng dụng web theo mô hình MVC (Model-View-Controller).  
   Giúp tách rõ Controller (xử lý request), Service (xử lý logic), Repository (database), View (giao diện).
   Thực tế hiện nay khi phát triển REST API, thường không dùng View, phần view chỉ dùng cho ứng dụng web truyền thống (JSP, Thymeleaf...)
   Để sử dụng Spring MVC, thêm dependency spring-boot-starter-web (nếu dùng Spring Boot) hoặc spring-webmvc (nếu dùng Spring thuần)
   a. REST API development
   • Dùng annotation như @RestController, @RequestMapping (cho class), @GetMapping, @PostMapping (cho method)...
   • Trả về dữ liệu JSON/XML thay vì trang HTML

b. Content negotiation (JSON/XML)
• Tự động chọn định dạng trả về dựa trên header Accept trong HTTP request
Nếu client gửi header Accept:  
application/json → trả JSON, Accept: application/xml → trả XML.
• Spring Boot hỗ trợ sẵn trả về định dạng JSON, nếu muốn hỗ trợ XML chỉ cần thêm dependency jackson-dataformat-xml
c. Exception Handling
• Để xử lý lỗi tập trung, trả về thông tin lỗi rõ ràng, chuẩn REST (ví dụ: HTTP 400, 404, 500...)
• Dùng annotation:

- @RestControllerAdvice (cho dự án REST API) @ControllerAdvice cho class
- @ExceptionHandler cho method handle exception

d. Validation
• Đảm bảo dữ liệu gửi lên API hợp lệ trước khi xử lý. Ví dụ không thiếu trường, đúng định dạng email, số điện thoại...
• Dùng annotation validation như @NotNull, @Email, @Size,... trên DTO.
Kết hợp @Valid trong method controller. Annotation này sẽ tự động kiểm tra các ràng buộc đã khai báo trên các trường của DTO.  
Spring sẽ tự động trả về lỗi (bad request 400) hoặc chuyển thông tin lỗi vào đối tượng BindingResult để xử lý.

4. Spring Security
   Là framework bảo mật tích hợp cho Spring Boot. Nó giống như một người gác cổng cho ứng dụng của chúng ta.
   a. Authentication, Authorization
   Authentication: Xác thực danh tính user (ai là người đang truy cập?).
   Authorization: Phân quyền (người dùng này được phép làm gì?).
   b. Spring Security 6
   Spring Security 6 là phiên bản hiện đại, loại bỏ hoàn toàn cấu hình cũ, đồng bộ với Spring Framework 6 và Java 17+.
   Cấu hình bảo mật phải dùng Bean SecurityFilterChain, không dùng kế thừa class nữa.
   Annotation, method security cũng thay đổi tên, nhiều API cũ bị loại bỏ.
   Việc migrate từ 5 lên 6 cần chú ý xóa bỏ toàn bộ WebSecurityConfigurerAdapter, đổi sang Bean, cập nhật các annotation và dùng Java 17 trở lên.
   c. Cấu hình cơ bản

d. JWT (JSON Web Token)
Là token được mã hóa từ một JSON object, dùng trong xác thực stateless giữa client và server.
• Cấu trúc: gồm 3 phần, ngăn cách bởi dấu chấm

- Header: thông tin loại token và loại thuật toán được sử dụng cho sử dụng như HS256 và RS256
- Payload: chứa thông tin user và token như userId, roles, thời gian hết hạn... không nên lưu các thông tin nhạy cảm ở Payload.
- Signature: được mã hóa bằng Header + Payload và một secret key chỉ server mới biết. Do đó dù Header và Payload được mã hóa Base64, tức là nếu có token, có thể giải mã ngược và thấy được thông tin Header và Payload, nhưng nếu thay đổi chúng, signature không đồng nhất, secret key ở server sẽ không thể xác thực và token trở nên không hợp lệ.
  • Ưu điểm:
  Đối với các web application sử dụng phương thức xác thực truyền thống qua cookie/session lưu ở trên server, client sẽ phải luôn gọi đúng về server đó để xác thực. Giả sử ứng dụng của chúng ta cần mở rộng thêm nhiều server hoặc triển khai microservices, client sẽ không biết gọi về server nào để xác thực, điều này có thể được giải quyết bằng sticky session (gắn 1 client với 1 server) nhưng nhược điểm vẫn kém rất nhiều trong việc dùng JWT trong trường hợp này.  
  Việc dùng JWT khiến cho ứng dụng stateless thực sự, tức là không cần lưu bất kì user session nào trên server, chỉ cần lưu token trên client và gửi kèm thông tin xác thực trong mỗi request. Nó cũng giúp khả năng mở rộng, auto-scaling, tích hợp đa vùng tốt hơn. Rất phù hợp cho các hệ thống phân tán, microservices, yêu cầu mở rộng linh hoạt, high availability.
  • Nhược điểm: Tuy nhiên cũng có một nhược điểm lớn đó là một khi đã phát hành token cho client, nó sẽ hợp lệ đến khi hết hạn, dù người dùng có đăng xuất hay bị khóa. Dẫn đến rủi ro bảo mật nếu lộ token.
  Các ứng dụng lớn hiện nay thường kết hợp dùng access token và refresh token để giải quyết phần nào bài toán trên. Khi người dùng đăng nhập thành công, hệ thống sẽ trả về access token và refresh token. Access token để đính kèm header trong mỗi request người dùng phục vụ việc xác thực, còn refresh token để lấy access token mới khi nó hết hạn.
- Access token được đặt thời hạn ngắn khoảng 5 - 15 phút, nên lưu trên localStorage.
- Refresh token có thời hạn dài hơn, thường là 7 – 30 ngày, nên lưu trên Cookie được gắn cờ Http Only hoặc trên Redis (với hệ thống phân tán)

Do access token có thời gian sống ngắn, nên nếu bị lộ access token cũng giảm thiểu thời gian khai thác hệ thống.  
Với hệ thống cần bảo mật cao, muốn thu hồi token ngay lập tức khi đăng xuất có thể triển khai một Blacklist access token trên server (thường là trên Redis với hệ thống phân tán, phản hồi nhanh), mỗi lần API nhận request, kiểm tra access token đó có nằm trong blacklist không.
Ngoài ra các hệ thống đa nền tảng như Facebook, Google... hệ thống sẽ cấp riêng refresh token cho từng thiết bị để ví dụ đăng xuất trên máy tính nhưng trên điện thoại vẫn ở trạng thái đăng nhập. Hoặc khi mất điện thoại, nghi ngờ có thiết bị lạ vào tài khoản, có thể chọn đăng xuất khỏi tất cả các thiết bị.
Để cải thiện trải nghiệm người dùng, không phải đăng nhập lại khi hết hạn refresh token, mỗi lần làm mới access token, server đồng thời cấp luôn refresh token mới, nếu người dùng hoạt động thường xuyên, refresh token sẽ luôn được làm mới.
• Cấu hình trong Spring Boot:

e. OAuth2
• Là phương thức xác thực ủy quyền cho bên thứ ba ví dụ Google, Facebook mà không cần nhập user name, password.
• Quy trình cơ bản:
Ứng dụng hỏi có đồng ý cấp quyền đăng nhập với Google, Facebook không.
Nếu đồng ý, dịch vụ bên thứ ba sẽ cấp cấp cho ứng dụng một access token dùng để gọi API từ ứng dụng.
Access token có thời gian sử dụng ngắn, khi hết hạn sẽ dùng refresh token để lấy một access token mới.
• Như vậy, thay vì ứng dụng gửi token cho client, dịch vụ bên thứ 3 sẽ được ủy quyền làm việc đó, thường dùng JWT làm chuẩn token xác thực
• Cấu hình OAuth2 với Spring Boot:
Cần cấu hình thêm về issuer-uri, public key hoặc jwk-set-uri trong file application.properties.
f. Method-level security (@PreAuthorize, @Secured)
• Để bật bảo mật method-level, sử dụng annotation sau trong class cấu hình bảo mật (có @Configuration):
@EnableMethodSecurity(prePostEnabled = true, securedEnabled = true)

- prePostEnabled = true:
  Bật @PreAuthorize, @PostAuthorize.
- securedEnabled = true:
  Bật @Secured.
  • Các annotation sử dụng cho method-level sucurity:
  @PreAuthorize: Kiểm tra điều kiện quyền trước khi thực thi method. Có thể dùng Spring Expression Language (SpEL) để kiểm tra role, quyền, điều kiện...
  @PostAuthorize: Kiểm tra điều kiện sau khi thực thi method.
  @Secured: Chỉ kiểm tra role được truy cập method, không thể kiểm tra điều kiện phức tạp.
  @RolesAllowed: Tương tự @Secured, dùng chuẩn Java EE. Ít dùng.
  Ví dụ:

hasRole(‘ADMIN’) trong @PreAuthorize tự động hiểu là ROLE_ADMIN
Nếu sử dụng @Secured thì phải viết đầy đủ ROLE_ADMIN
• Nên dùng method-level security khi cần bảo vệ nghiệp vụ ở tầng service, kiểm tra quyền phức tạp, hoặc đảm bảo mọi luồng truy cập đều phải qua kiểm tra bảo mật, không chỉ ở endpoint.  
• Trong các hệ thống microservice, các method nghiệp vụ có thể được gọi qua nhiều API khác nhau. Method-level security giúp bảo vệ chặt chẽ ở tầng nghiệp vụ, dù gọi từ đâu.
g. Tổng quan luồng xử lý
• Request HTTP tới server ngay từ đầu sẽ gặp phải một chuỗi các filter của Spring Security gọi là Security Filter Chain.
Mỗi filter có một nhiệm vụ riêng như authentication, authorization, bảo vệ CSRF, xử lý đăng xuất...
• Filter bảo vệ CSRF:
CSRF (Cross-Site Request Forgery) là tấn công dựa trên việc kẻ xấu lợi dụng trình duyệt của người dùng đã đăng nhập sẵn (có session/cookie) để thực hiện các hành động không mong muốn trên một website khác.
Với web application dùng session thì luôn nên bật bảo vệ CSRF.
Với REST API stateless dùng JWT, OAuth2, không dùng session: nếu token ở client được lưu vào localStorage/sessionStorage (như access token) và được đính kèm vào header Authorization trong mỗi request thì không cần bật bảo vệ CRSF. Nếu token ở client được lưu vào cookie (như refresh token) thì nên bật bảo vệ CSRF.
• Xác thực (authentication):  
Đầu tiên, hệ thống kiểm tra request đã được xác thực hay chưa.
Nếu chưa, các filter liên quan (như UsernamePasswordAuthenticationFilter đối với form login, hoặc một custom filter cho JWT) sẽ chịu trách nhiệm lấy thông tin xác thực từ request (username/password, token)
Thông tin này sẽ được kiểm tra thông qua AuthenticationManager và các AuthenticationProvider. Nếu xác thực thành công, thông tin người dùng được lưu vào SecurityContext
• Phân quyền (authorization):  
Sau khi xác thực, Spring Security tiếp tục kiểm tra quyền truy cập của user với endpoint đang gọi. Điều này dựa trên các rule cấu hình (ví dụ role, authority...)
Nếu không đủ quyền, hệ thống trả về lỗi 403 Forbidden.
• Nếu cả xác thực và phân quyền đều hợp lệ, request sẽ được chuyển tới controller, service để xử lý logic nghiệp vụ
• Các filter cuối cùng có thể xử lý thêm các vấn đề như logout, exception handling, hoặc ghi log nếu cần.
h. Notes
• Luôn sử dụng các thuật toán mã hóa password mạnh như BCrypt
• Kiểm soát CORS: Nếu ứng dụng là API phục vụ frontend khác domain (ví dụ frontend dùng cổng 3000, backend dùng cổng 8000), cần cấu hình CORS.
• Custom Exception Handling:
Vấn đề của xử lý exception khi sử dụng Spring Security là nó chặn trước request trước khi nó có thể gọi đến lớp xử lý exception nếu xảy ra lỗi xác thực. Ví dụ người dùng gửi về một JWT không hợp lệ, nó sẽ không thể trả về một thông báo lỗi theo format mà lớp xử lý exception của hệ thống tạo ra.  
Cách tốt nhất là sử dụng AuthenticationEntryPoint để trả về 401 (lỗi xác thực, token không hợp lệ) và AccessDeniedHandler để trả về 403 (không đủ quyền). Khi trả lỗi có thể tùy chỉnh cho giống format của lớp exception chung.

5. Testing
   a. Unit Test (JUnit, Mockito)
   b. Integration Test (Spring Boot Test, @SpringBootTest)
   c. Test các REST API (MockMvc)
6. Actuator và Monitoring
   a. Spring Boot Actuator endpoints
   b. Health checks, Metrics
   c. Logging
7. Spring Cloud

E. Software architecture & design
I. Kiến trúc tổng quan hệ thống

1. Monolithic Architecture: Kiến trúc đơn khối.
2. Modular Monolith / Domain-based Monolith.
3. Microservices Architecture: Kiến trúc vi dịch vụ.
   • Microservices là kiến trúc hệ thống mà mỗi chức năng (service) được tách ra thành một dịch vụ nhỏ, độc lập, giao tiếp qua API (thường là REST, gRPC, hoặc GraphQL)
   • Ưu điểm:

- Độc lập: Mỗi service triển khai riêng biệt nên không ảnh hưởng tới service khác nếu có lỗi.
- Dễ mở rộng: có thể scale theo từng service, ví dụ service thanh toán có thể mở rộng riêng nếu lưu lượng tăng cao, không cần scale toàn hệ thống
- Dễ triển khai: chỉ cần build/test và deploy từng service độc lập, thay vì với cả khối lớn như monolith
- Linh hoạt công nghệ: Mỗi service có thể chọn ngôn ngữ, DB, FW phù hợp
- Khả năng phục hồi: Nếu 1 service có sự cố, các service khác vẫn hoạt động ổn định. Khó sập hơn monolith
  • Nhược điểm:
- Quản lý phức tạp, yêu cầu Devops mạnh: Cần hệ thống CI/CD, monitoring, logging, container orchestration (Kubernetes, Docker…) chuyên nghiệp để vận hành trơn tru
- Do giao tiếp qua mạng nên có vấn đề về độ trễ (network latency), lỗi truyền thông tin hoặc bảo mật mạng
- Dữ liệu phân tán nên khó đảm bảo nhất quán hơn monolith

4. Service-Oriented Architecture (SOA): Kiến trúc hướng dịch vụ.
5. Serverless/Cloud- Architecture: Kiến trúc không máy chủ.
   II. Kiến trúc hệ thống phân tán  
   III. Domain-Driven Design (DDD)
6. Entities, Value Objects, Aggregates, Repositories, Services,Domain Event
7. Bounded Context
8. Ubiquitous Language
   IV. Kiến trúc tổ chức code
9. Layered Architecture (N-Tier)
10. Hexagonal / Ports & Adapters
11. Clean / Onion Architecture
12. CQRS
13. Event-Driven Architecture
    V. Design Principles:
14. SOLID
15. DRY (Don’t Repeat Yourself)
16. KISS (Keep It Simple, Stupid)
17. YAGNI (You Aren’t Gonna Need It)
    VI. Design Patterns cổ điển
    • Được hiểu như những bộ dụng cụ kinh nghiệm giải quyết các vấn đề thường gặp, giúp code sạch, dễ bảo trì và mở rộng.
18. Các mẫu khởi tạo (creational patterns)
    a. Builder
    • Builder dùng để tạo object phức tạp theo từng bước mà không cần constructor có nhiều tham số. Thường dùng khi object có nhiều field, đặc biệt optonal field. Thường thấy ở DTO, sử dụng Lombok @Builder.
    • Lợi ích:

- Tránh việc phải dùng constructor dài với nhiều tham số khó nhớ/thứ tự dễ lẫn lộn. Dễ mở rộng, thêm field mới không cần thay đổi constructor cũ.
- Code rõ ràng, có thể chỉ truyền các field cần thiết.
- Không cần nhớ thứ tự các tham số.
- Hỗ trợ tạo object immutable (không thay đổi được sau khi tạo).
  Ví dụ 1 class User có 10 field, có 8 field là tùy chọn, để tạo ra một đối tượng User gồm 2 field bắt buộc và một số trong 8 field tùy chọn kia cần có sẵn rất nhiều constructor và rất dễ nhầm lẫn. Builder tạo ra để làm đơn giản điều này.
  Nếu cần thêm dữ liệu vào 1 field, ta cũng không cần dùng tới constructor.  
  Khi truyền cũng không cần nhớ thứ tự như dùng constructor.  
  Khi gọi build, object được tạo ra với các field final, không thể thay đổi giá trị các field nữa (không có setter)

b. Singleton
• Đảm bảo chỉ có một instance duy nhất trong toàn bộ ứng dụng.
• Lợi ích: Quản lý tài nguyên hiệu quả, tránh tạo nhiều object không cần thiết.
• Trong Spring Boot, mặc định mọi bean đều là singleton, ví dụ service, logger.
c. Factory method
• Cung cấp một cách để khởi tạo đối tượng mà không chỉ rõ lớp cụ thể.
Thay vì gọi trực tiếp new, ta để subclass quyết định tạo đối tượng nào.
• Lợi ích: Tăng tính linh hoạt, dễ mở rộng, bảo trì, khi cần mở rộng không cần sửa code cũ (chỉ cần sửa factory) - nguyên lý Open/Close trong SOLID

• Abstract Factory khác Factory Method ở chỗ thay vì tạo ra 1 loại đối tượng, nó tạo ra nhiều đối tượng liên quan mà không chỉ rõ lớp cụ thể.
Ví dụ khi viết ứng dụng có thể dùng trên cả Mac và Windows, mình có interface GUIFactory với các method như createButton() và createCheckbox().
Mỗi nền tảng (Windows, Mac) sẽ có factory riêng, đảm bảo tạo ra cả bộ UI (button, checkbox) đồng bộ cho từng hệ điều hành.
Nhờ đó, chỉ cần thay đổi factory là toàn bộ giao diện sẽ phù hợp với nền tảng mình chọn.
d. Prototype
• Cho phép tạo object mới bằng cách sao chép từ một object gốc gọi là prototype, thay vì khởi tạo từ đầu.
• Mục đích là tiết kiệm chi phí khởi tạo, nhất là khi object phức tạp hoặc tốn nhiều tài nguyên (như hình ảnh, kết nối).
• Trong java, có thể dùng phương thức clone()

• Trong Spring, bean có scope “prototype” để luôn tạo mới object mỗi lần gọi, thay vì dùng lại instance cũ như singleton.  
2. Nhóm cấu trúc (structure patterns)
a. Adapter
• Giúp chuyển đổi interface của một class này thành interface mà client mong muốn, để hai class vốn không tương thích có thể làm việc với nhau.
• Trường hợp sử dụng:
Mapping dữ liệu từ DTO sang Entity và ngược lại
b. Decorate
c. Facade
d. Proxy 3. Nhóm hành vi (behavioral patterns)
a. Observer
b. Strategy
c. Template Method
d. Chain of Responsibility

F. React.js & Next.js
I. JavaScript key point & core concepts

1. ES6+ Syntax & Features
   a. Arrow function: cú pháp ngắn gọn của hàm thông thường
   b. Destructuring (object, array)
   • Object: Lấy giá trị từ object

• Array: Lấy giá trị từ mảng

c. Spread/Rest operator (...)
• Spread: Trải mảng/đối tượng ra

• Rest: Gom nhiều giá trị còn lại vào 1 biến

d. Import/Export
• Default Import/Export: chỉ xuất 1 cái chính

• Named Import/Export: xuất nhiều cái, nhập theo tên

2. Variables & Hoisting
   a. Scope: global (toàn bộ file), function (chỉ trong hàm), block (ví dụ khối if)
   Nếu 1 trang HTML cùng gọi 2 file js, các logic và biến global sẽ được dùng chung. Nếu biến global là var, giá trị sẽ bị ghi đè nếu trùng tên, dùng let hoặc const thì sẽ báo lỗi trùng tên.
   b. Hoisting
   • Là cơ chế mà JS đưa khai báo biến và hàm lên đầu scope trước khi chạy code
   • Hoisting biến: các biến let, var, const đều được hoist, nhưng với biến var thì không gán giá trị (undefined), biến let, const thì không thể sử dụng trước khi khai báo (gây lỗi)

• Hoisting hàm: Được hoisted, gọi được trước khi khai báo.

c. Variables
• var (không nên dùng): khai báo trong hàm, có thể khai báo/gán lại, hay lỗi
• let: block scope (chỉ dùng được trong cặp {}), không khai báo lại được trong scope, nhưng gán lại được
• const: nên dùng mặc định, khai báo trong block scope, không khai báo/gán lại, nếu là object/array vẫn có thể thay đổi bên trong (không gán lại được cả biến) 3. Asynchronuos Programming
a. Callback
• Là một hàm truyền vào một hàm khác, hàm được truyền vào sẽ được gọi lại khi một tác vụ nào đó trong hàm gốc thực hiện xong.
• Dễ gây callback hell nếu dùng nhiều callback

b. Promise
• Đối tượng đại diện cho một tác vụ bất đồng bộ có thể hoàn thành hoặc thất bại  
• Cho phép dùng .then() để xâu chuỗi các thao tác async và .catch() để xử lý lỗi tập trung, giúp tránh callback hell, code dễ đọc hơn.

c. Async/Await
• Cách viết code bất đồng bộ trông giống đồng bộ, dễ đọc hơn
• Chỉ dùng được trong function có từ khóa async
• Dùng await để đợi Promise hoàn thành

d. Event Loop: Cơ chế giúp JavaScript xử lý các tác vụ bất đồng bộ như callback, promise, timer...

e. Call Stack: Nơi JavaScript xếp các hàm cần thực thi theo thứ tự. Khi hàm chạy xong sẽ bị loại khỏi stack.
f. Error handling
• Callback: lỗi truyền qua tham số đầu tiên.

• Promise: dùng .catch()

• Async/Await: dùng try catch

4. Array & Object Minipulation
   a. Các method thường gặp
   • map: trả về mảng mới các phần tử được biến đổi từ mảng gốc

• filter: trả về mảng mới các phần tử thỏa mãn điều kiện

• reduce: duyệt qua từng phần tử, tính toán ra một giá trị duy nhất (cộng dồn, gộp, tính tổng, v.v.).

• find: trả về phần tử đầu tiên thỏa mãn điều kiện
• slice: trả về mảng con từ mảng gốc

• forEach, some, every, includes, indexOf, splice, join...
b. Shallow clone vs Deep clone
• Shallow clone: tạo bản sao mới chỉ ở cấp 1 của object hoặc array
Nếu bên trong có object/array lồng, các phần lồng này vẫn giữ tham chiếu (trỏ đến vùng nhớ cũ)
Cách dùng:

- Array: [...arr] hoặc arr.slice()
- Object: { ...obj } hoặc Object.assign({}, obj)

• Deep clone: tạo bản sao hoàn toàn mới cho tất cả các cấp, cả các object/array lồng bên trong. Không còn bất kì tham chiếu nào đến bản gốc.
Cách dùng:

- Dùng JSON.parse(JSON.stringify(obj)) (nhanh, dễ dùng nhưng có giới hạn: không clone được function, date, symbol...)
- Dùng thư viện như lodash: \_.cloneDeep(obj)

c. Immutable update (quan trọng trong React state)
• Không thay đổi trực tiếp dữ liệu gốc mà tạo ra một bản sao mới với các thay đổi mong muốn.
• Tại sao quan trọng trong React state?
React sử dụng cơ chế so sánh để biết khi nào cần render lại UI.
Nếu thay đổi trực tiếp state cũ, tham chiếu object/array không đổi nên React không phát hiện ra sự tahy đổi.  
Nếu tạo ra một object/array mới, React nhận ra sự thay đổi thông qua tham chiếu mới và render lại giao diện đúng cách.

5. Function & this context
   a. this: từ khóa đặc biệt, đại diện cho đối tượng mà hàm đang được gọi trên nó.
   Nếu gọi dog.speak(), thì con chó chính là this.
   Xuất hiện khi dùng React CLASS component, nếu dùng function component thì không cần làm việc với this.
   • Các trường hợp của this:

- Object

- Class

- Trong event (DOM/React)
  Trong DOM event: this là phần tử DOM.

Trong React nếu dùng class component, dùng arrow function hoặc bind để giữ đúng this.
b. Arrow function vs normal function
• Arrow function không có this và arguments riêng như normal function
this của arrow function lấy từ phạm vi bên ngoài (lexical scope)

6. Event Handling (React)
   a. Synthetic event, event delegation
   • Synthetic event
   React không sử dụng event thật từ DOM mà dùng một lớp đặc biệt gọi là SyntheticEvent, nó giúp code event chạy giống nhau trên mọi trình duyệt, tối ưu.
   Vẫn có thể dùng các thuộc tính và phương thức quen thuộc như event thật: event.target, event.preventDefault(), event.stopPropagation(),...
   • Event delegation là kỹ thuật gắn một event handler lên cha để xử lý sự kiện cho các con (thay vì gắn từng con). React đã tối ưu sẵn.
   KHÔNG cần tự viết code event delegation như với DOM truyền thống.

b. preventDefault
• Ngăn hành động mặc định của sự kiện
Ví dụ ngăn form submit, ngăn link chuyển trang...

c. stopPropagation
• Khi một sự kiện xảy ra (ví dụ click), nó sẽ “bubbles” (lan truyền) từ phần tử con lên các phần tử cha trong DOM.  
event.stopPropagation() sẽ ngăn chặn sự lan truyền đó.
(chỉ chạy handleChildClick)

7. Optional Chaining & Nullish Coalescing
   ?., ?? giúp code an toàn hơn khi truy cập thuộc tính
   • Nếu bên trái ?. là null/undefined thì kết quả là undefined (thay vì báo lỗi)
   • ?? giúp đặt giá trị mặc định nếu bên trái nó là null/undefined
8. JSON & Data Communication
   a. JSON.parse: JSON (string) to object JavaScript.
   b. JSON.stringify: Ngược lại.
   c. Giao tiếp giữa client-server (API, fetch, axios)
   • fetch: hàm có sẵn trong JS để gửi HTTP request, trả về promise.

• axious: chức năng tương tự, sử dụng đơn giản hơn, tự động parse JSON.

9. Other Important Topics
   a. Other Data Structures
   • Set: Lưu các giá trị duy nhất, không trùng lặp.
   • Map: Lưu key-value, key có thể là bất cứ kiểu gì.
   b. Memory leak (closure, DOM reference)
   • Là hiện tượng bộ nhớ không được giải phóng dù không còn dùng nữa, khiến app ngày càng nặng.
   • Nguyên nhân phổ biến:
   Closure giữ tham chiếu tới biến/DOM cũ.
   c. Closure
   • Là hành vi của JS cho phép một hàm nhớ được biến ở scope ngoài của nó, kể cả khi scope ngoài đã thực thi xong.
   • Ứng dụng cho tạo biến private, lưu trạng thái giữa nhiều lần gọi hàm...

- Ở đây, biến count nằm trong hàm makeCounter, nhưng khi hàm này trả về một hàm khác (closure), hàm đó vẫn nhớ và sử dụng được count.
- Chỉ closure (hàm được return) mới truy cập và thay đổi count.
  Bạn không thể truy cập trực tiếp count từ bên ngoài.

- Nhờ closure, giá trị của count được lưu và cập nhật qua mỗi lần gọi counter() mà không bị mất.

II. React.js

1. Basic concepts
2. State Management
   a. Context API, Redux (Redux Toolkit), các pattern quản lý state toàn cục.
   b. Xử lý side effects (middleware: Redux Thunk/Saga).
3. Component Architecture
   a. Tư duy phân tách component (smart/dumb, presentational/container).
   b. Tái sử dụng component, custom hooks.
   c. Quản lý props, state hiệu quả.
4. Routing & Navigation
   a. Nested routes
   b. Dynamic route
   c. Route protection (PrivateRoute)
5. API Integration
   a. Gọi và xử lý dữ liệu từ RESTful API/GraphQL.
   b. Quản lý trạng thái loading, error, caching (SWR, ReactQuery)
6. Performance Optimization
   a. Tối ưu re-render: React.memo, useMemo, useCallback.
   b. Code splitting, lazy loading (React.lazy, Suspense).
   c. Virtualization cho danh sách lớn
7. Form Handling & Validation
8. TypeScript
9. Styling Solutions
10. Testing
11. Build & Tooling
12. Security
    III. Next.js
    IV. Vue.js (Core Concepts)
    V. Angular (Core Concepts)

G. Devops & CI/CD

1. Git
2. OS & Linux
3. Cloud Provider (AWS)
4. Containerization - Docker & Kubernetes, Helm
5. Infrastructure as Code
6. CI/CD  
   a. Jenkins
   b. GitHub actions
7. Monitoring & Logging
8. Security best practices
9. Deployment Strategies
