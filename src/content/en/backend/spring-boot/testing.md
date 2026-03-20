# Spring Testing

## 1. Test Dependencies

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
</dependency>

<!-- Includes: JUnit 5, Mockito, AssertJ, Spring Test -->
```

## 2. Unit Testing with Mockito

### 2.1. Basic Mock/Stub/Verify

```java
@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @Test
    void shouldReturnUser_WhenUserExists() {
        // Arrange
        User user = new User(1L, "huy@example.com");
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        // Act
        Optional<User> result = userService.findById(1L);

        // Assert
        assertThat(result).isPresent();
        assertThat(result.get().getEmail()).isEqualTo("huy@example.com");
    }

    @Test
    void shouldThrow_WhenUserNotFound() {
        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.findById(999L))
            .isInstanceOf(UserNotFoundException.class);
    }

    @Test
    void shouldCallRepository_WhenSaving() {
        User user = new User(1L, "test@example.com");

        userService.save(user);

        verify(userRepository, times(1)).save(user);
        verify(userRepository, never()).findById(any());
    }
}
```

### 2.2. Stubbing Options

```java
// Return value
when(repo.findById(1L)).thenReturn(Optional.of(user));
when(repo.findById(1L)).thenReturn(Optional.empty());
when(repo.findById(1L)).thenThrow(new RuntimeException("DB error"));

// Argument matchers
when(repo.findById(anyLong())).thenReturn(Optional.of(user));
when(repo.findById(eq(1L))).thenReturn(Optional.of(user));
when(repo.findByEmail(contains("@"))).thenReturn(Optional.of(user));

// Do-Return syntax (for void methods)
doNothing().when(emailService).sendEmail(any());
doThrow(new RuntimeException("Failed")).when(emailService).sendEmail(any());

// Answer with logic
when(repo.process(any())).thenAnswer(invocation -> {
    User u = invocation.getArgument(0);
    u.setName("Processed");
    return u;
});
```

## 3. Integration Testing

### 3.1. @SpringBootTest

Full application context for integration tests.

```java
@SpringBootTest
@AutoConfigureMockMvc
class UserControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
    }

    @Test
    void shouldCreateUser() throws Exception {
        UserDto dto = new UserDto("huy", "huy@example.com");

        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.name").value("huy"))
            .andExpect(jsonPath("$.email").value("huy@example.com"));
    }
}
```

### 3.2. Test Slices

| Annotation | What It Tests | What's Loaded |
|-----------|-------------|---------------|
| `@WebMvcTest(Controller.class)` | Controller layer | Only web layer (mocked service) |
| `@DataJpaTest` | JPA/Repository | In-memory DB (H2), JPA |
| `@RestClientTest` | REST client | RestTemplate/WebClient |
| `@JsonTest` | JSON serialization | Jackson |
| `@JdbcTest` | JDBC | Direct JDBC, no JPA |

```java
// Test Controller only (service is mocked)
@WebMvcTest(UserController.class)
class UserControllerTest {
    @MockBean
    private UserService userService;

    @Autowired
    private MockMvc mockMvc;

    @Test
    void shouldReturnUser() throws Exception {
        when(userService.findById(1L)).thenReturn(new User(1L, "huy"));

        mockMvc.perform(get("/api/users/1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.name").value("huy"));
    }
}

// Test Repository only
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
interface UserRepositoryTest extends JpaRepositoryTest {

    @Test
    void shouldFindByEmail() {
        userRepository.save(User.builder().email("test@example.com").build());

        Optional<User> found = userRepository.findByEmail("test@example.com");

        assertThat(found).isPresent();
    }
}
```

### 3.3. Test Database

```properties
# test/resources/application.yml
spring:
  datasource:
    url: jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1
    driver-class-name: org.h2.Driver
  jpa:
    hibernate:
      ddl-auto: create-drop
    show-sql: true
  h2:
    console:
      enabled: true
```

## 4. MockMvc

```java
// GET with query params
mockMvc.perform(get("/api/users")
        .param("status", "ACTIVE")
        .param("page", "0")
        .param("size", "10"))
    .andExpect(status().isOk())
    .andExpect(jsonPath("$.content").isArray())
    .andExpect(jsonPath("$.totalElements").value(100));

// POST with body
mockMvc.perform(post("/api/users")
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(userDto)))
    .andExpect(status().isCreated())
    .andExpect(header().exists("Location"));

// PUT
mockMvc.perform(put("/api/users/1")
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(userDto)))
    .andExpect(status().isOk());

// DELETE
mockMvc.perform(delete("/api/users/1"))
    .andExpect(status().isNoContent());

// Authenticated request
mockMvc.perform(get("/api/admin/users")
        .header("Authorization", "Bearer " + jwtToken))
    .andExpect(status().isOk());
```

## 5. Testcontainers (Real Database)

```java
@Testcontainers
@SpringBootTest
class UserRepositoryTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15")
        .withDatabaseName("test")
        .withUsername("test")
        .withPassword("test");

    @DynamicPropertySource
    static void properties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }

    @Test
    void shouldWorkWithRealDatabase() {
        // Tests run against real PostgreSQL
    }
}
```

## 6. @Nested + @DisplayName

```java
@DisplayName("User Service Tests")
class UserServiceTest {

    @Nested
    @DisplayName("findById")
    class FindByIdTests {
        @Test
        @DisplayName("should return user when exists")
        void shouldReturnUser_WhenExists() { }

        @Test
        @DisplayName("should throw when not found")
        void shouldThrow_WhenNotFound() { }
    }

    @Nested
    @DisplayName("save")
    class SaveTests {
        @Test
        @DisplayName("should save valid user")
        void shouldSaveValidUser() { }
    }
}
```

## 7. Common Assertions

```java
// AssertJ
assertThat(user.getEmail()).isEqualTo("test@example.com");
assertThat(users).hasSize(3);
assertThat(users).extracting(User::getName).containsExactly("A", "B", "C");
assertThatThrownBy(() -> service.delete(999L))
    .isInstanceOf(NotFoundException.class)
    .hasMessageContaining("User not found");

// JSON Path
.andExpect(jsonPath("$.name").value("Huy"))
.andExpect(jsonPath("$.email").value("huy@example.com"))
.andExpect(jsonPath("$._links.self").exists());

// Hamcrest (also included in spring-boot-starter-test)
.assertThat(result, hasSize(3));
.assertThat(user.getName(), equalTo("Huy"));
```
