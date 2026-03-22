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

## 8. Spring Batch Testing

Spring Batch provides `@SpringBatchTest` and `JobLauncherTestUtils` for comprehensive batch job testing.

### 8.1. Dependencies

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-batch</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.batch</groupId>
    <artifactId>spring-batch-test</artifactId>
    <scope>test</scope>
</dependency>
<!-- H2 for test database -->
<dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
    <scope>test</scope>
</dependency>
```

### 8.2. @SpringBatchTest and JobLauncherTestUtils

```java
@SpringBatchTest
@SpringBootTest
class BatchJobIntegrationTest {

    @Autowired
    private JobLauncherTestUtils jobLauncherTestUtils;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
        jdbcTemplate.execute("DELETE FROM BATCH_STEP_EXECUTION");
        jdbcTemplate.execute("DELETE FROM BATCH_JOB_EXECUTION");
    }

    @Test
    void shouldRunImportUsersJob() throws Exception {
        // Arrange: seed input data
        userRepository.save(new User(null, "alice", "alice@example.com"));
        userRepository.save(new User(null, "bob", "bob@example.com"));

        JobParameters params = new JobParametersBuilder()
            .addLong("timestamp", System.currentTimeMillis())
            .addString("input.file", "classpath:users.csv")
            .toJobParameters();

        // Act
        JobExecution jobExecution = jobLauncherTestUtils.launchJob(params);

        // Assert
        assertThat(jobExecution.getStatus()).isEqualTo(BatchStatus.COMPLETED);
        assertThat(userRepository.count()).isEqualTo(2);
    }

    @Test
    void shouldFailJob_WhenInputIsInvalid() throws Exception {
        // Arrange: seed with invalid data
        userRepository.save(new User(null, "", "invalid-email"));

        JobParameters params = new JobParametersBuilder()
            .addLong("timestamp", System.currentTimeMillis())
            .toJobParameters();

        // Act
        JobExecution jobExecution = jobLauncherTestUtils.launchJob(
            "importUsersJob", params);

        // Assert
        assertThat(jobExecution.getStatus()).isEqualTo(BatchStatus.FAILED);
        assertThat(jobExecution.getAllFailureExceptions()).isNotEmpty();
    }
}
```

### 8.3. Testing Individual Steps

```java
@SpringBatchTest
@SpringBootTest
class StepLevelTest {

    @Autowired
    private StepBuilderFactory stepBuilderFactory;

    @Autowired
    private JobLauncherTestUtils jobLauncherTestUtils;

    @MockBean
    private UserItemReader mockReader;

    @MockBean
    private UserItemWriter mockWriter;

    @Test
    void shouldProcessUsers_StepExecution() throws Exception {
        // Mock reader to return a fixed set of users
        List<User> users = List.of(
            new User(1L, "alice", "alice@example.com"),
            new User(2L, "bob", "bob@example.com")
        );
        when(mockReader.read())
            .thenReturn(users.get(0))
            .thenReturn(users.get(1))
            .thenReturn(null);

        JobParameters params = new JobParametersBuilder()
            .addLong("run.id", 1L)
            .toJobParameters();

        // Launch only the step
        StepExecution stepExecution = jobLauncherTestUtils.launchStep(
            "processUsersStep", params);

        assertThat(stepExecution.getReadCount()).isEqualTo(2);
        assertThat(stepExecution.getWriteCount).isEqualTo(2);
        assertThat(stepExecution.getSkipCount()).isEqualTo(0);
        assertThat(stepExecution.getStatus()).isEqualTo(BatchStatus.COMPLETED);
    }

    @Test
    void shouldSkipInvalidRecords() throws Exception {
        // Mock reader with one invalid record
        when(mockReader.read())
            .thenReturn(new User(1L, "", "invalid")) // invalid
            .thenReturn(new User(2L, "bob", "bob@example.com")) // valid
            .thenReturn(null);

        JobParameters params = new JobParametersBuilder()
            .addLong("run.id", 1L)
            .toJobParameters();

        StepExecution stepExecution = jobLauncherTestUtils.launchStep(
            "processUsersStep", params);

        assertThat(stepExecution.getReadCount()).isEqualTo(2);
        assertThat(stepExecution.getWriteCount()).isEqualTo(1);
        assertThat(stepExecution.getSkipCount()).isEqualTo(1);
        assertThat(stepExecution.getStatus()).isEqualTo(BatchStatus.COMPLETED);
    }
}
```

### 8.4. Testing with @SpringBatchTest and TestJob

```java
@SpringBatchTest
@SpringBootTest
class JobExecutionTest {

    @Autowired
    private JobLauncherTestUtils jobLauncherTestUtils;

    @Autowired
    private JobRegistry jobRegistry;

    @Test
    void shouldLaunchJobByName() throws Exception {
        Job job = jobRegistry.getJob("exportUsersJob");

        JobParameters params = new JobParametersBuilder()
            .addString("output.path", "/tmp/users-export.csv")
            .addLong("timestamp", System.currentTimeMillis())
            .toJobParameters();

        JobExecution execution = jobLauncherTestUtils.launchJob(job, params);

        assertThat(execution.getStatus()).isEqualTo(BatchStatus.COMPLETED);
        assertThat(execution.getStepExecutions())
            .hasSize(2); // step1 + step2
    }
}
```

## 9. Lifecycle & Auditing

JPA auditing automatically populates created/updated timestamps and the user who created/modified an entity.

### 9.1. Enable JPA Auditing

```java
@SpringBootApplication
@EnableJpaAuditing
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

### 9.2. @CreatedDate and @LastModifiedDate

```java
@Entity
@EntityListeners(AuditingEntityListener.class)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // getters and setters
}
```

### 9.3. @CreatedBy and @LastModifiedBy with AuditorAware

```java
// Provide the current auditor (e.g., from Spring Security)
@Component
public class JpaAuditorConfig {

    @Bean
    public AuditorAware<String> auditorProvider() {
        return () -> {
            Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null ||
                !authentication.isAuthenticated() ||
                authentication.getPrincipal().equals("anonymousUser")) {
                return Optional.of("system");
            }
            return Optional.of(authentication.getName());
        };
    }
}
```

```java
@Entity
@EntityListeners(AuditingEntityListener.class)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @CreatedBy
    @Column(name = "created_by", updatable = false)
    private String createdBy;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @LastModifiedBy
    @Column(name = "updated_by")
    private String updatedBy;

    // ...
}
```

### 9.4. Entity Lifecycle Callbacks

| Annotation | When It Fires |
|-----------|--------------|
| `@PrePersist` | Before entity is first persisted (INSERT) |
| `@PostPersist` | After entity is first persisted |
| `@PreUpdate` | Before entity state is synchronized to DB (UPDATE) |
| `@PostUpdate` | After entity state is synchronized to DB |
| `@PreRemove` | Before entity is removed (DELETE) |
| `@PostRemove` | After entity is removed |
| `@PostLoad` | After entity is loaded from DB |

```java
@Entity
@EntityListeners(AuditingEntityListener.class)
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private BigDecimal price;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Version
    private Long version; // for optimistic locking

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    @PostPersist
    public void onPostPersist() {
        // e.g., publish domain event
        System.out.println("Product created with ID: " + id);
    }

    @PreRemove
    public void onPreRemove() {
        // e.g., validate business rule before deletion
        if ("DISCONTINUED".equals(this.name)) {
            throw new IllegalStateException("Cannot remove discontinued product");
        }
    }

    @PostLoad
    public void onPostLoad() {
        // e.g., decrypt sensitive fields, initialize transient fields
    }

    // getters and setters
}
```

### 9.5. Testing Auditing

```java
@DataJpaTest
class UserAuditingTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EntityManager entityManager;

    @Test
    void shouldPopulateAuditingFields() {
        User user = new User();
        user.setName("Test User");
        user.setEmail("test@example.com");

        User saved = userRepository.save(user);
        entityManager.flush();
        entityManager.clear();

        User found = userRepository.findById(saved.getId()).orElseThrow();

        assertThat(found.getCreatedAt()).isNotNull();
        assertThat(found.getUpdatedAt()).isNotNull();
        // createdBy/updatedBy require @WithMockUser or a test SecurityContext
    }

    @Test
    void shouldUpdateTimestamp_OnModify() {
        User user = new User();
        user.setName("Original");
        user.setEmail("test@example.com");
        userRepository.save(user);
        entityManager.flush();

        LocalDateTime originalUpdatedAt = user.getUpdatedAt();

        // Small delay to ensure timestamp differs
        user.setName("Modified");
        userRepository.save(user);
        entityManager.flush();

        assertThat(user.getUpdatedAt()).isAfter(originalUpdatedAt);
    }
}
```
