# Other Skills — OWASP Top 10

The **OWASP Top 10** is a standard awareness document for developers about the most critical security risks to web applications.

---

## 1. Broken Access Control (A01:2021)

Users act outside their intended permissions.

### 1.1. Examples

- Accessing other users' accounts by manipulating IDs
- Viewing or modifying someone else's data
- Bypassing access control checks by modifying the URL
- Allowing viewing or editing someone else's account by providing a direct reference

### 1.2. Prevention

```javascript
// Bad — Direct object reference
app.get('/invoice/:id', (req, res) => {
  const invoice = db.getInvoice(req.params.id);
  res.json(invoice);  // Anyone can access any invoice!
});

// Good — Verify ownership
app.get('/invoice/:id', authenticate, (req, res) => {
  const invoice = db.getInvoice(req.params.id);
  if (invoice.userId !== req.user.id) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  res.json(invoice);
});
```

| Mitigation | Description |
|------------|-------------|
| Deny by default | Access controls should reject by default |
| Implement access control once, reuse | Avoid repeating checks |
| Enforce record ownership | Users can only access their own data |
| Disable directory listing | Prevent access to unintended files |
| Log access control failures | Alert on suspicious activity |

---

## 2. Cryptographic Failures (A02:2021)

Exposure of sensitive data due to weak cryptography.

### 2.1. Common Issues

- Transmitting sensitive data in plaintext (HTTP, not HTTPS)
- Using weak or deprecated algorithms (MD5, SHA1 for passwords)
- Storing passwords in plain text or with weak hashing
- Not encrypting sensitive data at rest

### 2.2. Prevention

| Practice | Description |
|----------|-------------|
| **Encrypt all sensitive data** | Use AES-256 for data, TLS 1.3 for transit |
| **Hash passwords** | Use bcrypt, Argon2, or scrypt (NOT MD5/SHA1) |
| **Don't store sensitive data** | If you don't need it, don't keep it |
| **Enforce HTTPS** | Use HSTS headers |
| **Key management** | Use proper key storage (Vault, AWS KMS) |

```javascript
// Password hashing
import bcrypt from 'bcrypt';
const hash = await bcrypt.hash(password, 12);  // Cost factor 12

// Verification
const match = await bcrypt.compare(password, hash);
```

---

## 3. Injection (A03:2021)

Untrusted data is interpreted as a command or query.

### 3.1. Types of Injection

| Type | Target | Example |
|------|--------|---------|
| **SQL Injection** | Database | `' OR '1'='1` in login form |
| **NoSQL Injection** | NoSQL queries | MongoDB query manipulation |
| **Command Injection** | OS commands | `; rm -rf /` |
| **XSS** | Browser | `<script>alert(1)</script>` |
| **LDAP Injection** | LDAP directories | Manipulating LDAP queries |

### 3.2. Prevention

```javascript
// Bad — SQL injection vulnerable
app.get('/user', (req, res) => {
  const query = `SELECT * FROM users WHERE name = '${req.query.name}'`;
  db.query(query);  // Vulnerable!
});

// Good — Parameterized query
app.get('/user', (req, res) => {
  const query = 'SELECT * FROM users WHERE name = $1';
  db.query(query, [req.query.name]);  // Safe
});

// Use an ORM (Sequelize, Prisma, TypeORM) — they use parameterized queries
```

| Mitigation | Description |
|------------|-------------|
| Parameterized queries | Never concatenate user input into queries |
| Input validation | Reject unexpected input formats |
| Escape special characters | For contexts where parameterization isn't possible |
| Least privilege | Database user should have minimal permissions |

---

## 4. Insecure Design (A04:2021)

Missing or ineffective security controls from the design phase.

### 4.1. Examples

- Missing rate limiting on authentication endpoints
- No protection against automated attacks
- Excessive trust in client-side controls
- Missing encryption by design

### 4.2. Prevention

| Practice | Description |
|----------|-------------|
| Threat modeling | Identify threats during design (STRIDE, PASTA) |
| Secure design patterns | Reuse proven secure patterns |
| Segregation of environments | Dev, Staging, Production are separate |
| Rate limiting | Protect against brute force and DoS |
| Fail securely | Default-deny policies |

---

## 5. Security Misconfiguration (A05:2021)

Incorrect or incomplete security settings.

### 5.1. Common Issues

- Default credentials left unchanged
- Unnecessary features enabled (ports, services, pages)
- Verbose error messages revealing stack traces
- Missing security headers
- Overly permissive CORS policies

### 5.2. Prevention

```bash
# Security headers example (Express/Helmet)
app.use(helmet());

// Content-Security-Policy
// X-Frame-Options: DENY
// X-Content-Type-Options: nosniff
// Strict-Transport-Security: max-age=31536000
```

| Mitigation | Description |
|------------|-------------|
| Hardening | Disable unnecessary features |
| Remove defaults | Change passwords, remove sample data |
| Minimal permissions | Principle of least privilege |
| Automated security scanning | CI/CD security checks |
| Error handling | Generic error messages, don't expose stack traces |

---

## 6. Vulnerable & Outdated Components (A06:2021)

Using components with known vulnerabilities.

### 6.1. Prevention

```bash
# Check for known vulnerabilities
npm audit                 # npm
yarn audit                # yarn
pip-audit                 # Python
snyk test                 # Snyk

# Keep dependencies updated
npm outdated              # Check outdated packages
npm update                # Update within semver range
npx npm-check-updates    # Check all available updates
```

| Practice | Description |
|----------|-------------|
| Remove unused dependencies | Fewer dependencies = fewer attack surfaces |
| Monitor CVEs | Subscribe to security advisories |
| Use automated scanning | Integrate Snyk, Dependabot in CI/CD |
| Pin versions in production | Use lock files (package-lock.json) |
| Virtual patching | WAF rules while waiting for official fix |

---

## 7. Identification & Authentication Failures (A07:2021)

Weaknesses in authentication mechanisms.

### 7.1. Common Issues

- Allowing weak or common passwords
- Missing or weak multi-factor authentication (MFA)
- Exposing session IDs in URLs
- Not invalidating sessions on logout
- Not rotating session IDs after login

### 7.2. Prevention

| Practice | Description |
|----------|-------------|
| MFA enforcement | SMS, authenticator apps, hardware keys |
| Strong password policy | Min 8 chars, mixed case, numbers, special chars |
| Account lockout | Temporarily lock after failed attempts |
| Secure session management | HttpOnly, Secure, SameSite cookies |
| Password reset | Time-limited tokens, verify old password |

---

## 8. Software & Data Integrity Failures (A08:2021)

Making assumptions about software updates, critical data, and CI/CD pipelines without integrity validation.

### 8.1. Common Issues

- Unverified software updates from untrusted sources
- Auto-updates that don't verify integrity
- Compromised CI/CD pipeline
- Insecure deserialization

### 8.2. Prevention

- Verify integrity of updates and dependencies
- Use signed updates
- Review CI/CD configuration for security
- Don't deserialize untrusted data

---

## 9. Security Logging & Monitoring Failures (A09:2021)

Insufficient logging, detection, and monitoring.

### 9.1. Common Issues

- No logging of security events
- Logs don't include enough context
- Not monitored or alerted on suspicious activity
- Incident response plan not in place

### 9.2. Prevention

| Event to Log | Description |
|-------------|-------------|
| Login attempts (success/failure) | Detect brute force |
| Access control failures | Detect unauthorized access |
| Server-side input validation errors | Detect injection attempts |
| High-value transactions | Audit trail for financial data |
| Deactivation of security controls | Alert on disabled protections |

> **Without logging and monitoring, breaches cannot be detected.** Most successful attacks are discovered by third parties, not internal teams.

---

## 10. SSRF — Server-Side Request Forgery (A10:2021)

The application fetches remote resources without validating the user-supplied URL.

### 10.1. Example

```javascript
// Bad — SSRF vulnerable
app.get('/fetch', async (req, res) => {
  const url = req.query.url;
  const response = await fetch(url);  // Attacker can provide internal IPs!
  const data = await response.text();
  res.send(data);
});

// An attacker could request:
// http://169.254.169.254/latest/meta-data/  (AWS metadata)
// http://localhost:5432/                     (Internal database)
// http://internal.corp.com/admin             (Internal admin panel)

// Good — URL validation and allowlist
const ALLOWED_HOSTS = ['api.trusted.com', 'cdn.trusted.com'];

app.get('/fetch', async (req, res) => {
  const url = new URL(req.query.url);

  if (!ALLOWED_HOSTS.includes(url.hostname)) {
    return res.status(400).json({ error: 'Invalid host' });
  }

  // Block internal IP ranges
  const ip = dns.lookup(url.hostname);
  if (isPrivateIP(ip)) {
    return res.status(400).json({ error: 'Invalid host' });
  }

  const response = await fetch(url.href);
  res.send(await response.text());
});
```

### 10.2. Prevention

- **Allowlist** permitted domains/IPs
- **Sanitize and validate** all user-supplied URLs
- **Disable HTTP redirections** for fetched resources
- **Enforce network segmentation** — restrict outbound traffic
- **Block access** to internal IP ranges and metadata endpoints
