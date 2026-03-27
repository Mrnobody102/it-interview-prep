# Networking

## 

### Key Networking Concepts

| Concept | Description |
|---|---|
| **Firewall** | Controls incoming and outgoing network traffic based on security rules |
| **NAT (Network Address Translation)** | Converts private IP addresses to public IP (and vice versa), enabling multiple devices to share one public IP |
| **CORS (Cross-Origin Resource Sharing)** | Browser security mechanism; backend must explicitly allow cross-origin requests if FE and BE are on different domains |
| **DNS (Domain Name System)** | Translates domain names (google.com) to IP addresses |
| **CDN (Content Delivery Network)** | Distributed network of servers for delivering static content |

### Network Protocol Stack (OSI Model)

| Layer | Number | Protocols | What it Does |
|---|---|---|---|
| **Application** | 7 | HTTP, HTTPS, WebSocket, FTP, DNS, SMTP | End-user interfaces |
| **Presentation** | 6 | TLS/SSL, JPEG, PNG, JSON | Data formatting, encryption |
| **Session** | 5 | NetBIOS, RPC, PPTP | Session management |
| **Transport** | 4 | TCP, UDP | Reliable data delivery |
| **Network** | 3 | IP, ICMP, OSPF, BGP | Routing, logical addressing |
| **Data Link** | 2 | Ethernet, Wi-Fi, ARP | Physical addressing (MAC) |
| **Physical** | 1 | Cables, hubs, signals | Physical transmission |

### Application Layer Protocols

#### HTTP / HTTPS

```
HTTP Methods:
  GET     - Retrieve resource
  POST    - Create resource
  PUT     - Replace resource
  PATCH   - Partial update
  DELETE  - Remove resource
```

| Status Code Family | Meaning | Examples |
|---|---|---|
| **2xx** | Success | 200 OK, 201 Created, 204 No Content |
| **3xx** | Redirection | 301 Moved Permanently, 304 Not Modified |
| **4xx** | Client Error | 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 429 Too Many Requests |
| **5xx** | Server Error | 500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable, 504 Gateway Timeout |

#### WebSocket

- **Full-duplex:** Real-time two-way communication over a single TCP connection
- **Persistent:** Connection stays open until closed by client or server
- **Use cases:** Chat applications, live dashboards, gaming, collaborative tools

```javascript
// WebSocket client example
const ws = new WebSocket('wss://api.example.com/live');

ws.onopen = () => {
  console.log('Connected to WebSocket server');
  ws.send(JSON.stringify({ type: 'subscribe', channel: 'price_updates' }));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Received:', data);
};

ws.onerror = (error) => {
  console.error('WebSocket error:', error);
};

ws.onclose = () => {
  console.log('Connection closed');
};
```

#### RPC (Remote Procedure Call)

- **Purpose:** Service-to-service communication with low latency
- **Concept:** Call a function on a remote server as if it were local
- **Formats:** gRPC (binary, uses Protocol Buffers), Thrift

### Transport Layer Protocols

| Protocol | Characteristics | Use Cases |
|---|---|---|
| **TCP** | Connection-oriented, reliable, ordered delivery, flow control, congestion control | Web, APIs, email, file transfer, databases |
| **UDP** | Connectionless, fast, no delivery guarantee, no ordering | Streaming, gaming, VoIP, DNS queries, video calls |

#### TCP vs. UDP

| Aspect | TCP | UDP |
|---|---|---|
| **Connection** | Connection-oriented (3-way handshake) | Connectionless |
| **Reliability** | Guaranteed delivery | Best-effort, no guarantee |
| **Ordering** | Packets arrive in order | No ordering guarantee |
| **Speed** | Slower (overhead) | Faster (minimal overhead) |
| **Flow Control** | Yes | No |
| **Congestion Control** | Yes | No |
| **Header Size** | 20+ bytes | 8 bytes |

### Network Layer Protocols

| Protocol | Purpose |
|---|---|
| **IP (IPv4/IPv6)** | Device addressing and packet routing |
| **ICMP** | Diagnostic and error reporting (ping, traceroute) |
| **ARP** | Maps IP addresses to MAC addresses within a local network |
| **OSPF** | Interior gateway protocol for routing within an autonomous system |
| **BGP** | Border Gateway Protocol — routing between autonomous systems (the Internet's backbone) |

### DNS (Domain Name System)

#### DNS Record Types

| Record Type | Purpose | Example |
|---|---|---|
| **A** | IPv4 address mapping | `example.com -> 93.184.216.34` |
| **AAAA** | IPv6 address mapping | `example.com -> 2606:2800:220:1::` |
| **CNAME** | Alias to another domain | `www.example.com -> example.com` |
| **MX** | Mail server | `example.com -> mail.example.com` |
| **TXT** | SPF, DKIM, verification | `v=spf1 include:_spf.example.com ~all` |
| **NS** | Name server delegation | `example.com -> ns1.example.com` |

#### DNS Resolution Flow

```
Client → Resolver (ISP/8.8.8.8)
       → Root DNS Server (.)
       → TLD Server (.com)
       → Authoritative NS (example.com)
       → A Record returned
```

> **Note:** DNS records have a **TTL (Time To Live)** which controls how long resolvers cache the result. Lower TTL = more frequent lookups but faster propagation of changes.

### HTTP/1.1 vs. HTTP/2 vs. HTTP/3

| Feature | HTTP/1.1 | HTTP/2 | HTTP/3 |
|---|---|---|---|
| **Transport** | TCP | TCP | UDP (QUIC) |
| **Multiplexing** | No (head-of-line blocking) | Yes | Yes |
| **Header Compression** | No | HPACK | QPACK |
| **Server Push** | No | Yes | Yes |
| **Encryption** | Optional | TLS required | TLS required |
| **Connection Reuse** | Single request per connection | Multiplexed streams | Stream-based |

### CIDR (Classless Inter-Domain Routing)

| Notation | Address Range | Number of IPs |
|---|---|---|
| `/32` | Single IP | 1 |
| `/24` | Small network | 256 |
| `/16` | Medium network | 65,536 |
| `/8` | Large network | 16,777,216 |
| `10.0.0.0/8` | Private (RFC 1918) | 16,777,216 |
| `172.16.0.0/12` | Private (RFC 1918) | 1,048,576 |
| `192.168.0.0/16` | Private (RFC 1918) | 65,536 |

> **Tip:** In system design interviews, understanding HTTP status codes, the difference between TCP and UDP, and how DNS works are frequently tested topics.
