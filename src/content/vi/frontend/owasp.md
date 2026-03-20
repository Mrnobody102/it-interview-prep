# Frontend - OWASP Security

## 1. Tổng quan

**OWASP (Open Web Application Security Project)** là một tổ chức phi lợi nhuận cung cấp tài liệu về bảo mật ứng dụng web.

### 1.1. OWASP Top 10 (2021)

OWASP Top 10 là danh sách **10 lỗ hổng bảo mật nghiêm trọng nhất** trong ứng dụng web.

1. **A01: Broken Access Control**
2. **A02: Cryptographic Failures**
3. **A03: Injection**
4. **A04: Insecure Design**
5. **A05: Security Misconfiguration**
6. **A06: Vulnerable and Outdated Components**
7. **A07: Identification and Authentication Failures**
8. **A08: Software and Data Integrity Failures**
9. **A09: Security Logging and Monitoring Failures**
10. **A10: Server-Side Request Forgery (SSRF)**

---

## 2. A01 - Broken Access Control

**Broken Access Control** xảy ra khi user có thể truy cập resources hoặc thực hiện actions mà họ **không được phép**.

### 2.1. Common Vulnerabilities

```typescript
// BAD: Client-side only authorization
function deleteUser(id: number) {
  if (isAdmin()) {  // Chỉ check phía client!
    fetch(`/api/users/${id}`, { method: 'DELETE' });
  }
}

// GOOD: Server-side authorization
async function deleteUser(id: number) {
  const res = await fetch(`/api/users/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  // Server kiểm tra authorization
}

// BAD: IDOR (Insecure Direct Object Reference)
fetch(`/api/orders/${orderId}`);  // orderId có thể là bất kỳ order nào

// GOOD: Server-side enforce ownership
fetch(`/api/my/orders/${orderId}`);  // Server biết user nào request
```

### 2.2. Prevention

- [ ] **Server-side authorization** cho mọi request.
- [ ] **Deny by default** — access control deny trước, allow sau.
- [ ] **Principle of least privilege** — user chỉ có quyền cần thiết.
- [ ] **Consistent access control logic** — đặt ở một chỗ, reuse.
- [ ] **No obj IDs exposed** — dùng indirect references.
- [ ] **Log access control failures** và alert khi có suspicious activity.

---

## 3. A02 - Cryptographic Failures

**Cryptographic Failures** (trước đây là Sensitive Data Exposure) — data nhạy cảm bị expose do không mã hóa hoặc mã hóa sai.

### 3.1. Common Issues

```typescript
// BAD: Storing sensitive data in localStorage
localStorage.setItem('token', 'sk-1234567890abcdef');
localStorage.setItem('user', JSON.stringify(user));

// GOOD: Use httpOnly cookies (server-side) hoặc encrypted storage
// Tokens should be stored in memory + httpOnly cookie

// BAD: Weak hashing
const hash = md5(password);  // MD5 is broken!

// GOOD: Strong hashing (bcrypt, Argon2, scrypt)
import bcrypt from 'bcrypt';
const hash = await bcrypt.hash(password, 12);

// BAD: HTTP (non-SSL)
fetch('http://api.example.com/data');  // Data transmitted in clear text!

// GOOD: Always HTTPS
fetch('https://api.example.com/data');

// BAD: Logging sensitive data
console.log('Password:', password);
console.log('Credit card:', cardNumber);

// GOOD: Never log sensitive data
console.log('Password reset requested for user:', email);
```

### 3.2. What to Encrypt

| Data | Action |
|------|--------|
| **Passwords** | Hash (bcrypt, Argon2) |
| **PII (name, email, phone)** | Encrypt at rest |
| **Credit card numbers** | Use payment processor (Stripe), never store |
| **API keys, secrets** | Use secrets manager (AWS Secrets Manager, Vault) |
| **Session tokens** | httpOnly, Secure, SameSite cookies |

---

## 4. A03 - Injection

**Injection** xảy ra khi untrusted data được gửi đến interpreter như một command hoặc query.

### 4.1. XSS (Cross-Site Scripting)

XSS cho phép attacker inject malicious scripts vào pages viewed bởi other users.

#### Types of XSS

| Type | Mô tả | Example |
|------|-------|---------|
| **Reflected** | Payload trong URL, reflected trong response | `?search=<script>alert(1)</script>` |
| **Stored** | Payload được lưu trong DB | User comment chứa `<script>` |
| **DOM-based** | Payload xử lý phía client (DOM) | `element.innerHTML = userInput` |

```html
<!-- BAD: Reflected XSS -->
<!-- URL: /search?q=<script>alert(document.cookie)</script> -->
<p>Results for: <span id="search-term"></span></p>
<script>
  document.getElementById('search-term').innerHTML = params.q;
  // ← attacker-controlled HTML executed!
</script>

<!-- GOOD: Safe rendering -->
<script>
  document.getElementById('search-term').textContent = params.q;
  // ← textContent escapes HTML
</script>
```

#### React XSS Prevention

```tsx
// BAD: dangerouslySetInnerHTML — AVOID unless necessary
<div dangerouslySetInnerHTML={{ __html: userContent }} />

// BAD: Using v-html in Vue with user input
<div v-html="userContent" />

// GOOD: React escapes by default
<div>{userContent}</div>

// When dangerouslySetInnerHTML is unavoidable:
import DOMPurify from 'dompurify';
const sanitized = DOMPurify.sanitize(userContent, {
  ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a'],
  ALLOWED_ATTR: ['href']
});
return <div dangerouslySetInnerHTML={{ __html: sanitized }} />;

// Good for Markdown rendering:
import marked from 'marked';
import DOMPurify from 'dompurify';
const html = marked.parse(markdownContent);
const safe = DOMPurify.sanitize(html);
```

### 4.2. SQL/NoSQL Injection

```typescript
// BAD: SQL Injection
const query = `SELECT * FROM users WHERE email = '${email}'`;
// Attack: email = "' OR '1'='1" → returns all users

// GOOD: Parameterized queries
const query = 'SELECT * FROM users WHERE email = ?';
db.query(query, [email]);

// BAD: NoSQL Injection (MongoDB)
const user = await User.find({ email: userInput });
// Attack: email = { $ne: null } → returns all users

// GOOD: Validate input
if (!isValidEmail(userInput)) throw new ValidationError('Invalid email');
const user = await User.findOne({ email });
```

### 4.3. Command Injection

```typescript
// BAD: Shell command injection
const { execSync } = require('child_process');
execSync(`grep "${query}" file.txt`);
// Attack: query = "test" && rm -rf /

// GOOD: Avoid shell commands, use libraries
const fs = require('fs');
const content = fs.readFileSync('file.txt', 'utf8');
const results = content.split('\n').filter(line => line.includes(query));
```

---

## 5. A04 - Insecure Design

**Insecure Design** là weaknesses trong design architecture — khác với implementation bugs.

### 5.1. Threat Modeling

```markdown
## STRIDE Threat Modeling

| Threat | Description | Mitigation |
|--------|------------|------------|
| **S**poofing | Pretending to be someone | Authentication |
| **T**ampering | Modifying data | Authorization, integrity checks |
| **R**epudiation | Denying actions | Logging, signatures |
| **I**nformation Disclosure | Exposing data | Encryption, access control |
| **D**enial of Service | Making unavailable | Rate limiting, redundancy |
| **E**levation of Privilege | Gaining unauthorized access | Least privilege, input validation |

## Example: Login Flow

Threat: Attacker tries to brute force login
Mitigation:
- Rate limiting (5 attempts per minute)
- Account lockout (5 failed attempts → 15 min lock)
- CAPTCHA after 3 attempts
- Multi-factor authentication
- Logging và monitoring
```

### 5.2. Security by Design

```typescript
// Defense in Depth — multiple layers of security
// Layer 1: Input validation
function validateInput(input: string): boolean {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required()
  });
  return schema.validate(input).error === undefined;
}

// Layer 2: Parameterized queries (prevent injection)
// Layer 3: Output encoding (prevent XSS)
// Layer 4: Access control (prevent IDOR)
// Layer 5: Rate limiting (prevent brute force)
// Layer 6: Logging + Monitoring (detect attacks)
```

---

## 6. A05 - Security Misconfiguration

**Security Misconfiguration** là settings không đúng, gây ra vulnerabilities.

### 6.1. Common Issues

```yaml
# BAD: Express security misconfigurations
# app.js
const express = require('express');
const app = express();

// Missing security headers
// No rate limiting
// No CORS configuration
// Debug mode enabled in production

# GOOD: Secure Express configuration
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

app.use(helmet());  // Security headers
app.use(express.json({ limit: '10kb' }));  // Limit body size
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100  // limit each IP to 100 requests per windowMs
}));

app.use(cors({
  origin: ['https://app.example.com'],
  credentials: true
}));

if (process.env.NODE_ENV === 'production') {
  app.disable('x-powered-by');
}
```

### 6.2. Security Headers

| Header | Mô tả | Angular/React |
|--------|-------|--------------|
| **Content-Security-Policy** | Prevent XSS | meta tag hoặc server config |
| **X-Content-Type-Options** | Prevent MIME sniffing | `nosniff` |
| **X-Frame-Options** | Prevent clickjacking | `DENY` |
| **Strict-Transport-Security** | Force HTTPS | `max-age=31536000` |
| **X-XSS-Protection** | XSS filter (legacy) | `1; mode=block` |
| **Referrer-Policy** | Control referrer info | `strict-origin-when-cross-origin` |

```html
<!-- CSP header example -->
<meta http-equiv="Content-Security-Policy"
  content="default-src 'self';
           script-src 'self' 'nonce-{random}';
           style-src 'self' 'unsafe-inline';
           img-src 'self' data: https:;
           connect-src 'self' https://api.example.com;
           frame-ancestors 'none';">
```

---

## 7. A06 - Vulnerable and Outdated Components

**Vulnerable and Outdated Components** — dùng dependencies có known vulnerabilities.

### 7.1. Prevention

```bash
# Check for vulnerabilities
npm audit                    # Built-in audit
npx npm-check-updates       # Check outdated packages

# Security scanning
npx snyk test               # Snyk vulnerability scanner
npx retire                  # Find vulnerable JS libraries

# Dependency tree
npm ls                      # Show dependency tree
npm audit --production     # Audit production deps only

# Automated: Dependabot (GitHub)
# Automatically creates PRs for outdated/vulnerable dependencies
```

```json
// package.json scripts
{
  "scripts": {
    "security:audit": "npm audit",
    "security:check": "npx snyk test",
    "security:update": "npx npm-check-updates -u"
  }
}
```

### 7.2. Dependency Best Practices

- [ ] **Pin exact versions** trong `package-lock.json` / `yarn.lock`.
- [ ] **Audit dependencies** regularly (`npm audit`).
- [ ] **Remove unused dependencies** (`npm prune`).
- [ ] **Use tools**: Snyk, Dependabot, Renovate.
- [ ] **Monitor**: Sử dụng Snyk/GitHub Advisory Database để track vulnerabilities.
- [ ] **Don't use**: packages với no maintenance, untrusted sources, known vulnerabilities.

---

## 8. A07 - Identification and Authentication Failures

**Identification and Authentication Failures** — weaknesses trong authentication và session management.

### 8.1. Secure Authentication

```typescript
// BAD: Weak password storage
const hash = password.split('').reverse().join('');  // Trivial!

// GOOD: Strong password hashing
import bcrypt from 'bcrypt';
const hash = await bcrypt.hash(password, 12);  // Cost factor 12

// GOOD: Use Argon2 (recommended by OWASP)
import argon2 from 'argon2';
const hash = await argon2.hash(password, {
  type: argon2.argon2id,
  memoryCost: 2 ** 16,
  timeCost: 3,
  parallelism: 1
});
```

### 8.2. Secure Token Management

```typescript
// BAD: JWT stored in localStorage
localStorage.setItem('token', jwt);

// GOOD: JWT in httpOnly cookie
// Server sets: Set-Cookie: token=xxx; HttpOnly; Secure; SameSite=Strict

// BAD: Weak JWT secret
const token = jwt.sign(payload, 'secret123');

// GOOD: Strong secret + short expiry
const token = jwt.sign(payload, process.env.JWT_SECRET, {
  expiresIn: '15m',        // Short expiry
  issuer: 'my-app',        // Issuer claim
  audience: 'my-app-users' // Audience claim
});

// GOOD: Refresh token rotation
// Access token: 15 minutes
// Refresh token: 7 days (stored in httpOnly cookie, rotated on use)
```

### 8.3. Session Security

```typescript
// Session cookies
res.cookie('sessionId', sessionId, {
  httpOnly: true,      // Prevent XSS access
  secure: true,        // HTTPS only
  sameSite: 'strict',  // CSRF protection
  maxAge: 3600000     // 1 hour expiry
});

// Regenerate session ID after login (prevent session fixation)
app.post('/login', async (req, res) => {
  const user = await authenticate(req.body);
  req.session.regenerate((err) => {
    req.session.userId = user.id;
    res.json({ success: true });
  });
});
```

---

## 9. A08 - Software and Data Integrity Failures

**Software and Data Integrity Failures** — code và infrastructure không được verify, dẫn đến tampering.

### 9.1. CI/CD Security

```yaml
# BAD: No integrity checks
# Build from untrusted sources

# GOOD: Supply chain security
# 1. Lock dependency versions (package-lock.json)
# 2. Verify checksums
# 3. Sign releases
# 4. Use SLSA (Supply-chain Levels for Software Artifacts)

# GitHub Actions: Pin actions to commit SHA
jobs:
  deploy:
    steps:
      - uses: actions/checkout@b4ffde65f46336ab88af53be09092aef#v4
      # Use commit SHA, not version tag
```

### 9.2. Serialization

```typescript
// BAD: Untrusted deserialization
const data = JSON.parse(userInput);  // Safe, but...
const obj = YAML.parse(userInput);   // YAML can execute code!

// BAD: eval() for deserialization
const obj = eval(`(${userInput})`);  // RCE vulnerability!

// GOOD: Use JSON only, no eval
const obj = JSON.parse(userInput);
```

---

## 10. A09 - Security Logging and Monitoring Failures

**Security Logging and Monitoring Failures** — không có hoặc không đủ logging, không detect được attacks.

### 10.1. What to Log

```typescript
// Log security-relevant events
function logSecurityEvent(event: {
  type: 'login_success' | 'login_failure' | 'access_denied' | 'password_change';
  userId?: number;
  ip: string;
  timestamp: Date;
  details?: string;
}) {
  logger.info({
    level: 'security',
    ...event,
    service: 'auth-service'
  });
}

// Usage
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await authenticate(email, password);
    logSecurityEvent({ type: 'login_success', userId: user.id, ip: req.ip });
    res.json({ token: user.token });
  } catch (err) {
    logSecurityEvent({ type: 'login_failure', email, ip: req.ip });
    res.status(401).json({ error: 'Invalid credentials' });
  }
});
```

### 10.2. Loggable Events

| Event Type | What to Log |
|-----------|------------|
| **Authentication** | Login success/failure, logout, password reset |
| **Authorization** | Access denied, privilege escalation attempt |
| **Input validation** | Validation failures (with input sanitized) |
| **Session** | Session creation, expiration, invalidation |
| **Configuration** | Security configuration changes |
| **Data** | Sensitive data access, export, deletion |
| **Errors** | Application errors (stack traces in dev only) |

> **DO NOT log:** Passwords, tokens, credit card numbers, PII (without justification).

---

## 11. A10 - Server-Side Request Forgery (SSRF)

**SSRF** xảy ra khi attacker có thể induce server-side application thực hiện HTTP requests đến arbitrary domains.

### 11.1. SSRF Example

```typescript
// BAD: URL from user input used in server request
app.get('/fetch', async (req, res) => {
  const { url } = req.query;
  // Attacker: /fetch?url=http://169.254.169.254/latest/meta-data/
  // → Bypasses firewall, accesses cloud metadata
  const response = await fetch(url);
  res.json(await response.json());
});

// GOOD: Validate and sanitize URL
app.get('/fetch', async (req, res) => {
  const { url } = req.query;

  // 1. Validate URL format
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  // 2. Block private IPs and internal hosts
  const BLOCKED_HOSTS = [
    'localhost', '127.0.0.1', '0.0.0.0',
    '169.254.169.254',  // AWS metadata
    'metadata.google.internal',  // GCP metadata
    '100.64.0.0/10',    // Carrier-grade NAT
    '192.168.0.0/16',   // Private
    '10.0.0.0/8'        // Private
  ];

  const hostname = parsed.hostname.toLowerCase();
  if (BLOCKED_HOSTS.some(blocked => hostname === blocked)) {
    return res.status(403).json({ error: 'Access denied' });
  }

  // 3. Allowlist domains
  const ALLOWED_DOMAINS = ['api.example.com', 'cdn.example.com'];
  if (!ALLOWED_DOMAINS.includes(hostname)) {
    return res.status(403).json({ error: 'Domain not allowed' });
  }

  // 4. Use safe fetch options
  const response = await fetch(parsed.toString(), {
    redirect: 'error'  // Prevent open redirect
  });

  res.json(await response.json());
});
```

---

## 12. Security Checklist

### 12.1. Frontend Security Checklist

- [ ] **Input validation** — validate tất cả user input.
- [ ] **Output encoding** — escape HTML, JavaScript context.
- [ ] **HTTPS everywhere** — force HTTPS, HSTS.
- [ ] **Security headers** — CSP, X-Frame-Options, etc.
- [ ] **XSS prevention** — never use innerHTML with user input.
- [ ] **CSRF protection** — CSRF tokens for state-changing requests.
- [ ] **Authentication tokens** — httpOnly cookies, short expiry.
- [ ] **Dependencies** — regular audits, update dependencies.
- [ ] **Secrets** — never hardcode secrets in frontend code.
- [ ] **Error messages** — generic error messages, don't leak stack traces.

### 12.2. Rate Limiting

```typescript
// Express rate limiting
import rateLimit from 'express-rate-limit';

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,  // 100 requests per window
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false
});

const authLimiter = rateLimit({
  windowMs: 60 * 1000,  // 1 minute
  max: 5,  // 5 login attempts per minute
  message: 'Too many login attempts, please try again later.'
});

app.use('/api/', apiLimiter);
app.use('/auth/login', authLimiter);
```

---

## 13. Common Interview Questions

### Q: XSS vs CSRF?

| | XSS | CSRF |
|--|-----|------|
| **Target** | User's browser | User's browser |
| **Mechanism** | Inject malicious script | Forge request on behalf of user |
| **Goal** | Steal data, execute actions as user | Perform unauthorized actions |
| **Prevention** | CSP, output encoding, sanitize HTML | CSRF tokens, SameSite cookies |
| **Requires** | User visits malicious page | User is authenticated |

### Q: Sự khác biệt giữa authentication và authorization?

| | Authentication | Authorization |
|--|---------------|---------------|
| **Question** | "Who are you?" | "What can you do?" |
| **Examples** | Login, MFA, biometrics | Permissions, roles, access control |
| **When** | Before authorization | After authentication |

### Q: CSRF token implementation?

```typescript
// 1. Generate token on form render (server-side)
const csrfToken = crypto.randomBytes(32).toString('hex');

// 2. Include in form
<form action="/transfer" method="POST">
  <input type="hidden" name="_csrf" value="${csrfToken}">
  <input type="hidden" name="_csrf" value="${csrfToken}">
  <!-- or: <meta name="csrf-token" content="${csrfToken}"> -->
</form>

// 3. Validate on server
app.post('/transfer', (req, res) => {
  const token = req.body._csrf || req.headers['x-csrf-token'];
  if (token !== req.session.csrfToken) {
    return res.status(403).json({ error: 'Invalid CSRF token' });
  }
  // Process transfer...
});
```

### Q: Content Security Policy (CSP)?

CSP là HTTP header cho browser biết **sources nào được phép load content**.

```bash
# CSP header
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'nonce-r4nd0m';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https://cdn.example.com;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' https://api.example.com;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
```

### Q: Clickjacking là gì?

Attacker embed victim site trong iframe trong suốt, trick user click vào invisible buttons.

```bash
# Prevention: X-Frame-Options
X-Frame-Options: DENY  # Block all framing
X-Frame-Options: SAMEORIGIN  # Block cross-origin framing

# CSP
Content-Security-Policy: frame-ancestors 'none';
```
