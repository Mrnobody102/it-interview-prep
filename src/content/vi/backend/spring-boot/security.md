# Spring → Security 6

## 1. Authentication vs Authorization

| Khái niệm | Câu hỏi | Trả lời |
|-----------|---------|---------|
| **Authentication** | Bạn là ai? | Xác thực danh tính (login) |
| **Authorization** | Bạn có quyền gì? | Kiểm soát truy cập (access control) |

## 2. Cấu hình (Spring Security 6)

**Thay đổi quan trọng từ Security 5:** Dùng `SecurityFilterChain` bean, KHÔNG dùng `WebSecurityConfigurerAdapter`.

```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())  // Tắt cho stateless JWT APIs
            .cors(Customizer.withDefaults())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/public/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(STATELESS)
            )
            .httpBasic(Customizer.withDefaults())
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
```

## 3. UserDetails & UserDetailsService

```java
// Entity implement UserDetails
@Entity
@Table(name = "users")
public class User implements UserDetails {
    @Id private Long id;
    private String username;
    private String password;
    private String role; // ROLE_USER, ROLE_ADMIN

    @Override public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role));
    }
    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { return true; }
}

// Service implement UserDetailsService
@Service
public class CustomUserDetailsService implements UserDetailsService {
    @Autowired private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }
}
```

## 4. Mã hóa Password

**Không bao giờ lưu plain text.** Dùng `BCryptPasswordEncoder` (khuyến nghị).

```java
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
}

// Sử dụng khi đăng ký
public void register(User user) {
    user.setPassword(passwordEncoder.encode(user.getPassword()));
    userRepository.save(user);
}
```

## 5. JWT (JSON Web Token)

### 5.1. Cấu trúc

```
Header.Payload.Signature
```

```json
// Header
{ "alg": "HS256", "typ": "JWT" }

// Payload
{ "sub": "user123", "roles": ["USER"], "exp": 1699999999 }
```

### 5.2. Luồng JWT

```
1. User login → Server verify credentials → Return JWT
2. Client gửi JWT trong header: Authorization: Bearer <token>
3. Server verify signature → Extract user info → Set SecurityContext
```

### 5.3. Implement JWT

```java
// Tạo token
@Service
public class JwtService {
    @Value("${jwt.secret}")
    private String secret;

    public String generateToken(UserDetails user) {
        return Jwts.builder()
            .subject(user.getUsername())
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 15)) // 15 phút
            .signWith(Keys.hmacShaKeyFor(secret.getBytes()))
            .compact();
    }

    public String extractUsername(String token) {
        return Jwts.parser()
            .verifyWith(Keys.hmacShaKeyFor(secret.getBytes()))
            .build().parseSignedClaims(token).getPayload().getSubject();
    }
}

// JWT Filter
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    @Autowired private JwtService jwtService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response, FilterChain chain) throws Exception {
        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            String username = jwtService.extractUsername(token);

            if (username != null &&
                SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails user = userDetailsService.loadUserByUsername(username);
                if (jwtService.isTokenValid(token, user)) {
                    var auth = new UsernamePasswordAuthenticationToken(
                        user, null, user.getAuthorities());
                    SecurityContextHolder.getContext().setAuthentication(auth);
                }
            }
        }
        chain.doFilter(request, response);
    }
}
```

### 5.4. Best Practices

- **Access token ngắn hạn:** 5-15 phút
- **Refresh token dài hạn:** 7-30 ngày, lưu HttpOnly cookie hoặc Redis
- **Blacklist tùy chọn:** Dùng Redis để revoke token ngay lập tức khi logout
- **Luôn dùng HTTPS**
- **Bảo mật secret key** (ít nhất 256 bits cho HS256)

## 6. CSRF Protection

| Loại app | CSRF |
|----------|------|
| Session-based (browser) | **Bật** (dùng `csrf()` token) |
| Stateless REST API (JWT) | **Tắt** |
| Refresh token trong cookie | Bật cho endpoint refresh |

```java
// Tắt cho stateless JWT APIs
http.csrf(csrf -> csrf.disable());

// Bật cho session-based
http.csrf(csrf -> csrf
    .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
);
```

## 7. Method-level Security

```java
@EnableMethodSecurity  // Trong SecurityConfig

@Service
public class AdminService {

    // Cần role ADMIN
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteUser(Long id) { }

    // Kiểm tra authority cụ thể
    @PreAuthorize("hasAuthority('SCOPE_read')")
    public User getUser(Long id) { }

    // Biểu thức phức tạp
    @PreAuthorize("#userId == authentication.principal.id or hasRole('ADMIN')")
    public void updateProfile(Long userId, Profile profile) { }

    // @Secured — annotation cũ
    @Secured({"ROLE_ADMIN", "ROLE_USER"})
    public void doSomething() { }

    // JSR-250 annotation
    @RolesAllowed({"ADMIN", "USER"})
    public void doSomethingElse() { }
}
```

## 8. OAuth2 Resource Server (JWT)

```java
// application.yml
spring:
  security:
    oauth2:
      resourceserver:
        jwt:
          issuer-uri: https://your-issuer.com

// Config
@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        .authorizeHttpRequests(auth -> auth.anyRequest().authenticated())
        .oauth2ResourceServer(oauth2 -> oauth2
            .jwt(Customizer.withDefaults())
        );
    return http.build();
}
```

## 9. Cấu hình CORS

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
            .allowedOrigins("http://localhost:3000")
            .allowedMethods("GET", "POST", "PUT", "DELETE")
            .allowedHeaders("*")
            .allowCredentials(true);
    }
}
```

## 10. Common Security Headers

```java
http.securityHeaders(headers -> headers
    .frameOptions(frame -> frame.deny())          // Ngăn clickjacking
    .contentTypeOptions(Customizer.withDefaults()) // X-Content-Type-Options
    .xssProtection(Customizer.withDefaults())       // X-XSS-Protection
    .httpStrictTransportSecurity(hsts -> hsts      // HSTS
        .includeSubDomains(true)
        .maxAgeInSeconds(31536000))
);
```
