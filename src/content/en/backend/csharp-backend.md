# .NET Backend (C#)

## Overview

.NET is Microsoft's framework, using C# — a strong typing, OOP, multi-paradigm language. .NET Core / .NET 6+ is cross-platform, high performance, rich ecosystem.

### Key Features

| Feature | Description |
|---------|-------------|
| **Strong typing** | Compile-time safety |
| **Async/await** | Excellent asynchronous programming |
| **LINQ** | Powerful data querying |
| **Dependency Injection** | Built-in DI container |
| **Cross-platform** | .NET Core runs on Windows, Linux, macOS |

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
    public ActionResult<IEnumerable<User>> GetAll() => Ok(_userService.GetAll());

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
public class AppDbContext : DbContext
{
    public DbSet<User> Users => Set<User>();

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
    .Skip(10).Take(20)
    .ToListAsync();

var post = await _context.Posts
    .Include(p => p.Author)
    .Include(p => p.Comments)
    .FirstOrDefaultAsync(p => p.Id == id);
```

## Dependency Injection

```csharp
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddSingleton<ICacheService, RedisCacheService>();

public class UserController : ControllerBase
{
    private readonly IUserService _userService;
    public UserController(IUserService userService)
    {
        _userService = userService;
    }
}
```

## Common Interview Questions

### 1. How does ASP.NET Core middleware pipeline work?

Middleware are components that handle request/response sequentially. Each middleware can execute logic before calling next, call next, then execute logic after. Built with `app.Use()`, `app.Map()`, `app.Run()`.

### 2. IQueryable vs IEnumerable?

`IQueryable` builds query on database (executes only when enumerated). `IEnumerable` executes in memory after fetching. Use `IQueryable` for database queries to leverage SQL optimization.

### 3. DI lifetimes in .NET?

- **Singleton**: one instance for entire application
- **Scoped**: one instance per HTTP request
- **Transient**: new instance each time it's injected

### 4. EF Core change tracking?

EF Core tracks entities and only updates what changes. `AsNoTracking()` disables tracking for read-only queries (faster). `Attach()` re-attaches detached entities.
