# .NET Backend

## 21. ASP.NET Core

### 21.1. Overview

ASP.NET Core is a **cross-platform, high-performance** web framework from Microsoft for building modern, cloud-based applications.

| Property | Description |
|---|---|
| **Cross-platform** | Runs on Windows, Linux, macOS |
| **Performance** | One of the fastest web frameworks available |
| **Language** | C# (strongly typed, modern) |
| **Dependency Injection** | Built-in IoC container |
| **Async** | Native async/await throughout |
| **Open source** | Fully open source on GitHub |
| **Ecosystem** | NuGet packages, extensive libraries |

### 21.2. ASP.NET Core Project Structure

```
MyApi/
├── Program.cs                 # Application entry point
├── appsettings.json           # Configuration
├── Controllers/
│   └── UsersController.cs     # API endpoints
├── Models/
│   ├── User.cs                # Domain entities
│   └── DTOs/                  # Data Transfer Objects
├── Services/
│   ├── IUserService.cs        # Service interface
│   └── UserService.cs         # Service implementation
├── Data/
│   └── AppDbContext.cs        # EF Core DbContext
├── Middleware/
│   └── ExceptionMiddleware.cs
└── Program.cs
```

### 21.3. Program.cs (Application Bootstrap)

```csharp
// Program.cs
using Microsoft.EntityFrameworkCore;
using MyApi.Data;
using MyApi.Services;
using MyApi.Middleware;

var builder = WebApplication.CreateBuilder(args);

// Add services to DI container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Database
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("Default")));

// Redis caching
builder.Services.AddStackExchangeRedisCache(options =>
    options.Configuration = builder.Configuration.GetConnectionString("Redis");

// Authentication
builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer("Bearer", options =>
    {
        options.Authority = builder.Configuration["Auth:Authority"];
        options.TokenValidationParameters = new()
        {
            ValidateAudience = true,
            ValidAudience = builder.Configuration["Auth:Audience"],
        };
    });

// Authorization
builder.Services.AddAuthorization();

// Dependency Injection
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddSingleton<IExampleSingleton, ExampleSingleton>();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("https://example.com")
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Rate limiting
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.AddPolicy("fixed", httpContext =>
        RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: httpContext.User.Identity?.Name ?? httpContext.Connection.RemoteIpAddress?.ToString(),
            factory: _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 100,
                Window = TimeSpan.FromMinutes(1)
            }));
});

var app = builder.Build();

// Middleware pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseMiddleware<ExceptionMiddleware>();
app.UseRateLimiter();
app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
```

### 21.4. Models and DTOs

```csharp
// Models/User.cs
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyApi.Models;

public class User
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    public string? AvatarUrl { get; set; }

    [MaxLength(500)]
    public string? Bio { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }

    // Navigation property
    public ICollection<Post> Posts { get; set; } = new List<Post>();
}

// DTOs/CreateUserDto.cs
using System.ComponentModel.DataAnnotations;

namespace MyApi.Models.DTOs;

public record CreateUserDto(
    [Required][MinLength(2)][MaxLength(100)] string Name,
    [Required][EmailAddress] string Email,
    [MinLength(8)] string? Password
);

public record UserDto(
    int Id,
    string Name,
    string Email,
    string? AvatarUrl,
    DateTime CreatedAt
);

public record UpdateUserDto(
    [MaxLength(100)] string? Name,
    string? Bio,
    string? AvatarUrl
);
```

### 21.5. Entity Framework Core

```csharp
// Data/AppDbContext.cs
using Microsoft.EntityFrameworkCore;
using MyApi.Models;

namespace MyApi.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Post> Posts => Set<Post>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Indexes
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        modelBuilder.Entity<Post>()
            .HasIndex(p => p.Slug);

        // Relationships
        modelBuilder.Entity<User>()
            .HasMany(u => u.Posts)
            .WithOne(p => p.Author)
            .HasForeignKey(p => p.AuthorId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
```

### 21.6. Controllers

```csharp
// Controllers/UsersController.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.RateLimiting;
using MyApi.Models;
using MyApi.Models.DTOs;
using MyApi.Services;
using MyApi.Data;

namespace MyApi.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Produces("application/json")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly AppDbContext _db;

    public UsersController(IUserService userService, AppDbContext db)
    {
        _userService = userService;
        _db = db;
    }

    /// <summary>Get all users (paginated)</summary>
    [HttpGet]
    [EnableRateLimiting("fixed")]
    public async Task<ActionResult<List<UserDto>>> GetAll(
        [FromQuery] int page = 1,
        [FromQuery] int limit = 20)
    {
        var users = await _userService.GetAllAsync(page, limit);
        return Ok(users);
    }

    /// <summary>Get user by ID</summary>
    [HttpGet("{id:int}")]
    public async Task<ActionResult<UserDto>> GetById(int id)
    {
        var user = await _userService.GetByIdAsync(id);
        if (user == null)
            return NotFound(new { error = $"User with ID {id} not found" });
        return Ok(user);
    }

    /// <summary>Create a new user</summary>
    [HttpPost]
    [ProducesResponseType(typeof(UserDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<ActionResult<UserDto>> Create([FromBody] CreateUserDto dto)
    {
        if (await _userService.ExistsByEmailAsync(dto.Email))
        {
            return Conflict(new { error = "Email already registered" });
        }

        var user = await _userService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = user.Id }, user);
    }

    /// <summary>Update an existing user</summary>
    [HttpPut("{id:int}")]
    [Authorize]
    public async Task<ActionResult<UserDto>> Update(int id, [FromBody] UpdateUserDto dto)
    {
        var user = await _userService.UpdateAsync(id, dto);
        if (user == null)
            return NotFound();
        return Ok(user);
    }

    /// <summary>Delete a user</summary>
    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _userService.DeleteAsync(id);
        if (!deleted)
            return NotFound();
        return NoContent();
    }
}
```

### 21.7. Services

```csharp
// Services/IUserService.cs
using MyApi.Models;
using MyApi.Models.DTOs;

namespace MyApi.Services;

public interface IUserService
{
    Task<List<UserDto>> GetAllAsync(int page, int limit);
    Task<UserDto?> GetByIdAsync(int id);
    Task<UserDto> CreateAsync(CreateUserDto dto);
    Task<UserDto?> UpdateAsync(int id, UpdateUserDto dto);
    Task<bool> DeleteAsync(int id);
    Task<bool> ExistsByEmailAsync(string email);
}

// Services/UserService.cs
using Microsoft.EntityFrameworkCore;
using MyApi.Data;
using MyApi.Models;
using MyApi.Models.DTOs;

namespace MyApi.Services;

public class UserService : IUserService
{
    private readonly AppDbContext _db;

    public UserService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<UserDto>> GetAllAsync(int page, int limit)
    {
        return await _db.Users
            .OrderByDescending(u => u.CreatedAt)
            .Skip((page - 1) * limit)
            .Take(limit)
            .Select(u => new UserDto(u.Id, u.Name, u.Email, u.AvatarUrl, u.CreatedAt))
            .ToListAsync();
    }

    public async Task<UserDto?> GetByIdAsync(int id)
    {
        var user = await _db.Users.FindAsync(id);
        if (user == null) return null;
        return new UserDto(user.Id, user.Name, user.Email, user.AvatarUrl, user.CreatedAt);
    }

    public async Task<UserDto> CreateAsync(CreateUserDto dto)
    {
        var user = new User
        {
            Name = dto.Name,
            Email = dto.Email,
            CreatedAt = DateTime.UtcNow
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        return new UserDto(user.Id, user.Name, user.Email, user.AvatarUrl, user.CreatedAt);
    }

    public async Task<UserDto?> UpdateAsync(int id, UpdateUserDto dto)
    {
        var user = await _db.Users.FindAsync(id);
        if (user == null) return null;

        if (dto.Name != null) user.Name = dto.Name;
        if (dto.Bio != null) user.Bio = dto.Bio;
        if (dto.AvatarUrl != null) user.AvatarUrl = dto.AvatarUrl;
        user.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return new UserDto(user.Id, user.Name, user.Email, user.AvatarUrl, user.CreatedAt);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var user = await _db.Users.FindAsync(id);
        if (user == null) return false;

        _db.Users.Remove(user);
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ExistsByEmailAsync(string email)
    {
        return await _db.Users.AnyAsync(u => u.Email == email);
    }
}
```

### 21.8. Middleware (Error Handling)

```csharp
// Middleware/ExceptionMiddleware.cs
using System.Net;
using System.Text.Json;

namespace MyApi.Middleware;

public class ExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionMiddleware> _logger;

    public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception: {Message}", ex.Message);
            await HandleExceptionAsync(context, ex);
        }
    }

    private static Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        var statusCode = exception switch
        {
            ArgumentException => HttpStatusCode.BadRequest,
            KeyNotFoundException => HttpStatusCode.NotFound,
            UnauthorizedAccessException => HttpStatusCode.Unauthorized,
            _ => HttpStatusCode.InternalServerError
        };

        var response = new
        {
            error = exception.Message,
            statusCode = (int)statusCode
        };

        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)statusCode;

        return context.Response.WriteAsync(JsonSerializer.Serialize(response));
    }
}
```

### 21.9. .NET Comparison with Other Backends

| Aspect | ASP.NET Core | Node.js/Express | Go |
|---|---|---|---|
| **Performance** | Excellent | Good | Excellent |
| **Type safety** | Strong (C#) | Weak (JavaScript) | Strong (Go) |
| **Async/await** | Native, mature | Native | Manual (goroutines) |
| **Ecosystem** | NuGet (mature) | npm (huge) | Go modules |
| **Cross-platform** | Yes | Yes | Yes |
| **Learning curve** | Medium | Low | Low |
| **Concurrency** | `async/await`, `Parallel` | Event loop, Worker Threads | Goroutines |
| **ORM** | Entity Framework Core | Sequelize, Prisma, TypeORM | GORM, sqlx |
| **Best for** | Enterprise, Microsoft shops | JS full-stack | Microservices, CLI tools |

> **Tip:** ASP.NET Core is an excellent choice for **enterprise applications** where type safety, strong tooling (Visual Studio), mature ecosystem, and cross-platform deployment are priorities. Its built-in dependency injection, async/await, and Entity Framework Core make it productive for data-heavy applications.
