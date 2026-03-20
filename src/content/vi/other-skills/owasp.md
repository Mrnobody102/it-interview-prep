# Other Skills

## OWASP Top 10 — Bảo mật ứng dụng web

### 1. Broken Access Control (A01)

#### 1.1. Mô tả

Users có thể truy cập resources mà họ không có quyền. Đây là lỗ hổng phổ biến nhất.

#### 1.2. Ví dụ

```java
// Bad: Không kiểm tra quyền
@GetMapping("/orders/{id}")
public Order getOrder(@PathVariable Long id) {
    return orderRepository.findById(id).orElseThrow(); // Ai cũng lấy được!
}

// Good: Kiểm tra quyền
@GetMapping("/orders/{id}")
public Order getOrder(@PathVariable Long id) {
    Order order = orderRepository.findById(id).orElseThrow();
    if (!order.getUserId().equals(currentUser.getId()) && !currentUser.isAdmin()) {
        throw new AccessDeniedException();
    }
    return order;
}
```

#### 1.3. Prevention

- [ ] Phân quyền mặc định: DENY
- [ ] Kiểm tra quyền trên mọi endpoint
- [ ] Dùng framework's built-in authorization (Spring Security, CASL)
- [ ] Logging các vi phạm access control

---

### 2. Cryptographic Failures (A02)

#### 2.1. Mô tả

Lộ dữ liệu nhạy cảm do mã hóa yếu hoặc thiếu mã hóa.

#### 2.2. Ví dụ

```javascript
// Bad: Password không hash
await db.query(
  'INSERT INTO users (email, password) VALUES ($1, $2)',
  [email, password] // Lưu password plain text!
);

// Good: Dùng bcrypt/argon2
import bcrypt from 'bcrypt';
const hashedPassword = await bcrypt.hash(password, 12);
await db.query(
  'INSERT INTO users (email, password_hash) VALUES ($1, $2)',
  [email, hashedPassword]
);
```

#### 2.3. Prevention

- [ ] Dùng strong hashing: bcrypt, Argon2, scrypt
- [ ] HTTPS everywhere — không http
- [ ] Mã hóa data at rest (AES-256)
- [ ] Không hardcode secrets trong code

---

### 3. Injection (A03)

#### 3.1. Mô tả

SQL, NoSQL, Command injection xảy ra khi untrusted data được gửi đến interpreter.

#### 3.2. SQL Injection

```java
// Bad: String concatenation — SQL Injection!
String query = "SELECT * FROM users WHERE email = '" + email + "'";

// Good: Parameterized query
@Query("SELECT u FROM User u WHERE u.email = :email")
User findByEmail(@Param("email") String email);
```

#### 3.3. Command Injection

```javascript
// Bad: Command injection
const cmd = `ping ${hostname}`;  // hostname = "8.8.8.8; rm -rf /"
exec(cmd);

// Good: Validate input, avoid shell
execFile('ping', [hostname], (error, stdout) => { ... });
```

#### 3.4. Prevention

- [ ] Parameterized queries cho SQL
- [ ] Input validation (whitelist)
- [ ] Escape special characters
- [ ] Dùng ORM's built-in methods

---

### 4. Insecure Design (A04)

#### 4.1. Mô tả

Thiếu security controls từ giai đoạn thiết kế.

#### 4.2. Prevention

- [ ] Threat modeling từ đầu dự án
- [ ] Secure design patterns (Defense in Depth)
- [ ] Library security review
- [ ] Rate limiting, captcha cho sensitive endpoints

---

### 5. Security Misconfiguration (A05)

#### 5.1. Mô tả

Default configurations không an toàn, verbose errors, unnecessary features enabled.

#### 5.2. Prevention

- [ ] Hardened server configuration (CIS benchmarks)
- [ ] Remove default accounts và passwords
- [ ] Error messages generic (không expose stack traces)
- [ ] Regular security patches
- [ ] Minimal permissions principle

```java
// Bad: Expose stack trace
} catch (Exception e) {
    return Response.status(500).body(e.toString()); // Attackers thấy stack trace!
}

// Good: Generic error
} catch (Exception e) {
    log.error("Unexpected error", e);
    return Response.status(500).body("An error occurred");
}
```

---

### 6. Vulnerable Components (A06)

#### 6.1. Prevention

- [ ] `npm audit` / `mvn audit` / `pip audit` thường xuyên
- [ ] Dependabot / Renovate tự động update
- [ ] Sử dụng components có active maintenance
- [ ] Virtual patching cho legacy systems

```bash
# Check for known vulnerabilities
npm audit
# Output:
# found 3 vulnerabilities (2 moderate, 1 high)
# run 'npm audit fix' to fix 2 of them
```

---

### 7. Authentication Failures (A07)

#### 7.1. Mô tả

Weak password policies, không có MFA, session management issues.

#### 7.2. Prevention

- [ ] Strong password policy: min 12 chars, mix characters types
- [ ] MFA (Multi-Factor Authentication)
- [ ] Secure session management: HttpOnly, Secure, SameSite cookies
- [ ] Account lockout sau nhiều failed attempts
- [ ] JWT với short expiration + refresh token

```java
// Good: Secure cookie settings
Cookie cookie = new Cookie("session", token);
cookie.setHttpOnly(true);     // Không đụng bằng JavaScript
cookie.setSecure(true);         // Chỉ qua HTTPS
cookie.setPath("/");
cookie.setMaxAge(3600);       // 1 giờ
response.addCookie(cookie);
```

---

### 8. Data Integrity Failures (A08)

#### 8.1. Mô tả

Không verify data integrity — serialized data có thể bị tamper.

#### 8.2. Prevention

- [ ] Digital signatures cho critical data
- [ ] Integrity checks (checksums, HMAC)
- [ ] Validate signed serialized objects

---

### 9. Logging & Monitoring Failures (A09)

#### 9.1. Mô tả

Không có logging đủ để phát hiện và respond attacks.

#### 9.2. Prevention

- [ ] Log security events: login failures, access denials
- [ ] Monitoring và alerting cho anomalies
- [ ] Centralized logging (ELK, Loki)
- [ ] Audit trail cho sensitive operations

```java
// Good: Security event logging
if (failedLoginAttempts > 5) {
    log.warn("Multiple failed login attempts for user: {}", email);
    securityAlertService.notify("Brute force detected", email);
}
```

---

### 10. SSRF — Server-Side Request Forgery (A10)

#### 10.1. Mô tả

Server fetch remote resource mà không validate URL — có thể truy cập internal services.

#### 10.2. Ví dụ

```javascript
// Bad: SSRF vulnerability
const url = req.query.url; // attacker gửi url = "http://169.254.169.254/metadata"
// Fetch metadata từ AWS EC2!
const response = await fetch(url);

// Good: URL validation + whitelist
const allowedDomains = ['api.example.com', 'cdn.example.com'];
const url = new URL(req.query.url);
if (!allowedDomains.includes(url.hostname)) {
    throw new Error('URL not allowed');
}
```

#### 10.3. Prevention

- [ ] Whitelist allowed domains/IPs
- [ ] Validate và sanitize URLs
- [ ] Network segmentation — server không truy cập internal networks

---

### Security Checklist

| Priority | Action |
|---|---|
| **Critical** | Parameterized queries (chống SQL injection) |
| **Critical** | Authentication & authorization đúng |
| **Critical** | Password hashing (bcrypt/Argon2) |
| **High** | HTTPS everywhere |
| **High** | Secure session/cookie settings |
| **High** | Input validation |
| **Medium** | Security logging & monitoring |
| **Medium** | Dependencies updated |
| **Low** | CSP headers, security headers |

> **Tip:** OWASP là tài liệu "living" — được cập nhật định kỳ. OWASP Top 10 2021 là phiên bản mới nhất. Luôn kiểm tra phiên bản mới nhất tại owasp.org.
