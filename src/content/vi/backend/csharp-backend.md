# .NET Backend (C#)

## Tổng quan

.NET là framework của Microsoft, dùng C# — ngôn ngữ strong typing, OOP, multi-paradigm. .NET Core / .NET 6+ cross-platform, hiệu năng cao, ecosystem phong phú.

### Đặc điểm cốt lõi

| Đặc điểm | Mô tả |
|-----------|--------|
| **Strong typing** | Compile-time safety |
| **Async/await** | Asynchronous programming xuất sắc |
| **LINQ** | Data querying mạnh mẽ |
| **Dependency Injection** | Built-in DI container |
| **Cross-platform** | .NET Core chạy trên Windows, Linux, macOS |

## ASP.NET Core

### Minimal API

```csharp
var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.MapGet("/health", () => Results.Ok(new { status = "ok" }));

app.MapGet("/users/{id}", (int id) => {
    var user = userService.GetById(id);
    return user is null ? Results.NotFound() : Results.Ok(user);
});

app.MapPost("/users", (User user) => {
    var created = userService.Create(user);
    return Results.Created($"/users/{created.Id}", created);
});

app.Run();
```

### Controllers

```csharp
[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpGet]
    public ActionResult<IEnumerable<User>> GetAll()
    {
        return Ok(_userService.GetAll());
    }

    [HttpGet("{id}")]
    public ActionResult<User> Get(int id)
    {
        var user = _userService.GetById(id);
        return user is null ? NotFound() : Ok(user);
    }

    [HttpPost]
    public ActionResult<User> Create([FromBody] CreateUserDto dto)
    {
        var user = _userService.Create(dto);
        return CreatedAtAction(nameof(Get), new { id = user.Id }, user);
    }
}
```

## Entity Framework Core

```csharp
// DbContext
public class AppDbContext : DbContext
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Post> Posts => Set<Post>();

    protected override void OnConfiguring(DbContextOptionsBuilder o)
        => o.UseNpgsql("connection_string");

    protected override void OnModelCreating(ModelBuilder mb)
    {
        mb.Entity<User>(e => {
            e.HasKey(u => u.Id);
            e.Property(u => u.Email).IsRequired();
            e.HasIndex(u => u.Email).IsUnique();
        });
    }
}

// Query
var users = await _context.Users
    .Where(u => u.IsActive)
    .OrderBy(u => u.Name)
    .Skip(10)
    .Take(20)
    .ToListAsync();

// Include related
var post = await _context.Posts
    .Include(p => p.Author)
    .Include(p => p.Comments)
    .FirstOrDefaultAsync(p => p.Id == id);

// Update
var user = await _context.Users.FindAsync(id);
user.Name = "New Name";
await _context.SaveChangesAsync();
```

## Dependency Injection

```csharp
// Program.cs
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddSingleton<ICacheService, RedisCacheService>();

var app = builder.Build();

// Constructor injection
public class UserController : ControllerBase
{
    private readonly IUserService _userService;
    public UserController(IUserService userService)
    {
        _userService = userService;
    }
}
```

## Async/Await Pattern

```csharp
public async Task<ActionResult<User>> GetUser(int id)
{
    var user = await _context.Users.FindAsync(id);
    if (user is null) return NotFound();
    return Ok(user);
}

public async Task<ActionResult<List<Post>>> GetUserPosts(int userId)
{
    var posts = await _context.Posts
        .Where(p => p.AuthorId == userId)
        .Include(p => p.Tags)
        .AsNoTracking()
        .ToListAsync();
    return Ok(posts);
}

// Khi nào dùng Task.Run?
// - CPU-bound work: Task.Run(() => heavyComputation())
// - Không dùng cho I/O-bound (đã có async I/O sẵn)
```

## Câu hỏi phỏng vấn

### 1. ASP.NET Core middleware pipeline hoạt động thế nào?

Middleware là các components xử lý request/response theo chuỗi. Mỗi middleware có thể:
- Thực hiện logic trước khi gọi next middleware
- Gọi next middleware
- Thực hiện logic sau khi next trả về

```csharp
app.Use(async (context, next) => {
    // Before next
    await next();
    // After next
});
```

### 2. IQueryable vs IEnumerable khác nhau?

`IQueryable` xây dựng query trên database (chỉ thực thi khi enumerate). `IEnumerable` thực thi trong memory sau khi đã fetch. Dùng `IQueryable` cho database queries để tận dụng SQL optimization.

### 3. Dependency Injection lifetime trong .NET?

- **Singleton**: một instance cho toàn bộ application
- **Scoped**: một instance per HTTP request
- **Transient**: instance mới mỗi lần được inject

### 4. Entity Framework change tracking?

EF Core theo dõi entities và chỉ update những gì thay đổi. `AsNoTracking()` tắt tracking cho read-only queries (nhanh hơn). `Attach()` để re-attach detached entities.
