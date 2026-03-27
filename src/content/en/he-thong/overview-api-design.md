# System Design

## 12. API Design

### 12.1. API Styles Comparison

| Aspect | REST | GraphQL | gRPC |
|---|---|---|---|
| **Architecture** | Stateless, resource-based | Query-based, flexible | Contract-based, service-to-service |
| **Data Format** | JSON (typically) | JSON | Protocol Buffers (binary) |
| **HTTP Methods** | GET, POST, PUT, PATCH, DELETE | Single POST endpoint | HTTP/2 POST |
| **Over-fetching** | Yes (fixed response shape) | No (client specifies fields) | No |
| **Under-fetching** | Yes (may need multiple requests) | No (single query) | No |
| **Caching** | Standard HTTP caching | Custom (more complex) | HTTP/2 multiplexing |
| **Human-readable** | Yes | Yes | No (binary) |
| **Performance** | Good | Good | Excellent |
| **Use Case** | Web APIs, public APIs | Mobile, complex frontends | Internal microservices |

### 12.2. REST API Design

#### 12.2.1. REST Constraints

1. **Client-Server:** Separation of concerns
2. **Stateless:** Each request contains all necessary context
3. **Cacheable:** Responses can be cached
4. **Uniform Interface:** Resources identified by URIs
5. **Layered System:** Client does not know if connected directly

#### 12.2.2. REST URL Naming Conventions

```
Good patterns:
  GET    /users              → List users
  GET    /users/{id}         → Get single user
  POST   /users              → Create user
  PUT    /users/{id}         → Replace user
  PATCH  /users/{id}         → Partial update
  DELETE /users/{id}         → Delete user

  GET    /users/{id}/orders  → Get user's orders
  POST   /orders/{id}/cancel → Action on resource

Bad patterns:
  GET    /getUsers           → Verb in URL
  POST   /user/create        → Action in URL
  GET    /api/v1/getUserData → Inconsistent with resources
```

#### 12.2.3. REST Response Codes

| Code | Meaning | When to Use |
|---|---|---|
| **200** | OK | Successful GET, PATCH |
| **201** | Created | Successful POST that creates resource |
| **204** | No Content | Successful DELETE, PUT |
| **400** | Bad Request | Invalid request body/parameters |
| **401** | Unauthorized | Missing or invalid authentication |
| **403** | Forbidden | Authenticated but no permission |
| **404** | Not Found | Resource does not exist |
| **409** | Conflict | Duplicate resource, version conflict |
| **422** | Unprocessable Entity | Validation errors |
| **429** | Too Many Requests | Rate limit exceeded |
| **500** | Internal Server Error | Unexpected server error |

### 12.3. GraphQL

#### 12.3.1. Key Concepts

- **Query:** Read data (like GET)
- **Mutation:** Write data (like POST/PUT/DELETE)
- **Subscription:** Real-time updates via WebSocket

#### 12.3.2. GraphQL Example

```graphql
# Schema definition
type User {
  id: ID!
  name: String!
  email: String!
  orders: [Order!]!
}

type Order {
  id: ID!
  total: Float!
  status: OrderStatus!
}

enum OrderStatus {
  PENDING
  SHIPPED
  DELIVERED
}

# Query with selection set
query GetUserWithOrders($userId: ID!) {
  user(id: $userId) {
    name
    email
    orders(status: DELIVERED) {
      id
      total
    }
  }
}

# Variables
{
  "userId": "123"
}
```

```json
// Response — exactly what the client requested
{
  "data": {
    "user": {
      "name": "Alice",
      "email": "alice@example.com",
      "orders": [
        { "id": "ord-1", "total": 99.99 }
      ]
    }
  }
}
```

### 12.4. gRPC

#### 12.4.1. Protocol Buffers Schema

```protobuf
// user.proto
syntax = "proto3";

package user;

service UserService {
  rpc GetUser(GetUserRequest) returns (User);
  rpc ListUsers(ListUsersRequest) returns (ListUsersResponse);
  rpc CreateUser(CreateUserRequest) returns (User);
  rpc DeleteUser(DeleteUserRequest) returns (Empty);
}

message User {
  string id = 1;
  string name = 2;
  string email = 3;
  int64 created_at = 4;
}

message GetUserRequest {
  string id = 1;
}

message ListUsersRequest {
  int32 page_size = 1;
  string page_token = 2;
}

message ListUsersResponse {
  repeated User users = 1;
  string next_page_token = 2;
}

message CreateUserRequest {
  string name = 1;
  string email = 2;
}

message DeleteUserRequest {
  string id = 1;
}

message Empty {}
```

### 12.5. API Best Practices

#### 12.5.1. Versioning

```bash
# URL path versioning (most common)
GET /api/v1/users
GET /api/v2/users

# Query parameter versioning
GET /api/users?version=2

# Header versioning
GET /api/users
Accept: application/vnd.api.v2+json
```

#### 12.5.2. Pagination

```bash
# Offset-based pagination
GET /api/v1/users?page=2&limit=20

# Cursor-based pagination (better for large datasets)
GET /api/v1/users?cursor=eyJpZCI6MTB9&limit=20

# Response envelope
{
  "data": [...],
  "pagination": {
    "total": 1000,
    "page": 2,
    "limit": 20,
    "has_next": true
  }
}
```

#### 12.5.3. Error Handling

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request parameters",
    "details": [
      {
        "field": "email",
        "issue": "Invalid email format"
      },
      {
        "field": "age",
        "issue": "Must be a positive integer"
      }
    ],
    "request_id": "req_abc123"
  }
}
```

#### 12.5.4. Security Best Practices

| Practice | Description |
|---|---|
| **HTTPS only** | Encrypt all traffic in transit |
| **Authentication** | JWT tokens, OAuth 2.0, API keys |
| **Rate Limiting** | Limit requests per client (e.g., 1000/hour) |
| **Input Validation** | Validate and sanitize all inputs |
| **CORS** | Restrict cross-origin requests |
| **API Documentation** | OpenAPI/Swagger specification |

### 12.6. When to Use Each Style

| Scenario | Recommended Style |
|---|---|
| **Public web APIs** | REST + JSON |
| **Mobile apps with varying data needs** | GraphQL |
| **Internal microservice communication** | gRPC |
| **Real-time streaming** | gRPC Streaming or WebSocket |
| **Simple CRUD operations** | REST |
| **Complex, nested data requirements** | GraphQL |

> **Tip:** Do not force all APIs to use the same style. Internal high-throughput services benefit from gRPC. External-facing APIs are best served by REST. Complex querying needs are solved by GraphQL.
