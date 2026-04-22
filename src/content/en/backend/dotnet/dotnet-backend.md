# .NET Backend

## 1. ASP.NET Core

### 1.1. Overview

**.NET Core** is a cross-platform, open-source framework for building modern, cloud-based applications. **ASP.NET Core** is the web version of .NET Core, combining MVC, Web API, and gRPC into a unified programming model.

### 1.2. Key features

| Feature | Description |
|---|---|
| **Cross-platform** | Windows, Linux, macOS |
| **High performance** | One of the fastest web frameworks available |
| **Dependency Injection** | Built-in IoC container |
| **Middleware pipeline** | Modular request processing |
| **Kestrel** | Built-in, high-performance web server |
| **Unified framework** | Web API + MVC + gRPC in one framework |

### 1.3. .NET Framework vs .NET Core vs .NET 5+

| | .NET Framework | .NET Core | .NET 5+ |
|---|---|---|---|
| **Platform** | Windows only | Cross-platform | Cross-platform |
| **Performance** | Good | Very good | Excellent |
| **Open source** | Partial | Full | Full |
| **Microservices** | Limited | Good | Excellent |
| **NuGet packages** | Full | Limited | Full |
| **Active development** | No (maintenance) | No (merged) | Yes |

---

## 2. Project setup and structure

### 2.1. Creating a project

```bash
# Install .NET SDK
# https://dotnet.microsoft.com/download

# Create project
dotnet new webapi -n MyApi --framework net8.0
dotnet new webapi -n MyApi --framework net7.0

# Project templates
dotnet new webapi        # Web API
dotnet new mvc           # MVC web app
dotnet new razor         # Razor Pages
dotnet new grpc          # gRPC service
dotnet new worker        # Background worker service
dotnet new classlib      # Class library

# Run project
dotnet run
dotnet run --project MyApi/MyApi.csproj

# Restore, build, test
dotnet restore
dotnet build
dotnet test
```

### 2.2. Project structure

```
MyApi/
├── Controllers/
│   ├── UsersController.cs
│   └── ProductsController.cs
├── Models/
│   ├── User.cs
│   ├── Product.cs
│   └── DTOs/
│       ├── CreateUserDto.cs
│       └── UserDto.cs
├── Services/
│   ├── IUserService.cs
│   ├── UserService.cs
│   └── Interfaces/
├── Data/
│   ├── AppDbContext.cs
│   └── Migrations/
├── Middleware/
│   └── ExceptionMiddleware.cs
├── Configuration/
│   └── AppSettings.cs
├── Program.cs
├── appsettings.json
└── MyApi.csproj
```

### 2.3. `Program.cs`

```csharp
// Program.cs - ASP.NET Core 6+ (Minimal API style)
var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Database
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("Default")));

// Dependency Injection
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddSingleton<ICacheService, RedisCacheService>();

// Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
        };
    });

builder.Services.AddAuthorization();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecific",
        policy => policy.WithOrigins("https://example.com")
            .AllowAnyHeader()
            .AllowAnyMethod());
});

// Logging
builder.Logging.AddConsole();
builder.Logging.AddDebug();

var app = builder.Build();

// Configure pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowSpecific");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
```

---

## 3. Controllers

### 3.1. API controllers

```csharp
// Controllers/UsersController.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Threading.Tasks;

namespace MyApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly ILogger<UsersController> _logger;

    public UsersController(IUserService userService, ILogger<UsersController> logger)
    {
        _userService = userService;
        _logger = logger;
    }

    /// <summary>
    /// Get all users with pagination
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(PaginatedResult<UserDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<PaginatedResult<UserDto>>> GetUsers(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? search = null)
    {
        var result = await _userService.GetUsersAsync(page, pageSize, search);
        return Ok(result);
    }

    /// <summary>
    /// Get user by ID
    /// </summary>
    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(UserDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<UserDto>> GetUser(int id)
    {
        var user = await _userService.GetByIdAsync(id);

        if (user == null)
            return NotFound(new { message = $"User with ID {id} not found" });

        return Ok(user);
    }

    /// <summary>
    /// Create new user
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(UserDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<ActionResult<UserDto>> CreateUser([FromBody] CreateUserDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var existing = await _userService.GetByEmailAsync(dto.Email);
        if (existing != null)
            return Conflict(new { message = "Email already exists" });

        var user = await _userService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
    }

    /// <summary>
    /// Update user
    /// </summary>
    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(UserDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<UserDto>> UpdateUser(int id, [FromBody] UpdateUserDto dto)
    {
        var user = await _userService.UpdateAsync(id, dto);

        if (user == null)
            return NotFound(new { message = $"User with ID {id} not found" });

        return Ok(user);
    }

    /// <summary>
    /// Delete user
    /// </summary>
    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteUser(int id)
    {
        var deleted = await _userService.DeleteAsync(id);

        if (!deleted)
            return NotFound(new { message = $"User with ID {id} not found" });

        return NoContent();
    }
}
```

### 3.2. Minimal APIs (.NET 6+)

Minimal APIs are a lightweight alternative to controllers for simpler applications.

```csharp
// Program.cs - Minimal APIs
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>();
builder.Services.AddScoped<IUserService, UserService>();

var app = builder.Build();

// GET /users
app.MapGet("/users", async (int page, int pageSize, IUserService service) =>
{
    var result = await service.GetUsersAsync(page, pageSize);
    return Results.Ok(result);
});

// GET /users/{id}
app.MapGet("/users/{id:int}", async (int id, IUserService service) =>
{
    var user = await service.GetByIdAsync(id);
    return user == null ? Results.NotFound() : Results.Ok(user);
});

// POST /users
app.MapPost("/users", async ([FromBody] CreateUserDto dto, IUserService service) =>
{
    var user = await service.CreateAsync(dto);
    return Results.Created($"/users/{user.Id}", user);
});

// PUT /users/{id}
app.MapPut("/users/{id:int}", async (int id, UpdateUserDto dto, IUserService service) =>
{
    var user = await service.UpdateAsync(id, dto);
    return user == null ? Results.NotFound() : Results.Ok(user);
});

// DELETE /users/{id}
app.MapDelete("/users/{id:int}", async (int id, IUserService service) =>
{
    var deleted = await service.DeleteAsync(id);
    return deleted ? Results.NoContent() : Results.NotFound();
});

app.Run();
```

---

## 4. Models and DTOs

### 4.1. Entity models

```csharp
// Models/User.cs
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyApi.Models;

[Table("users")]
public class User
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string Name { get; set; }

    [Required]
    [MaxLength(255)]
    public string Email { get; set; }

    [MaxLength(255)]
    public string PasswordHash { get; set; }

    [MaxLength(20)]
    public string Role { get; set; } = "user";

    public bool IsActive { get; set; } = true;

    public DateTime? LastLoginAt { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
}


// Models/Order.cs
public class Order
{
    [Key]
    public int Id { get; set; }

    public int UserId { get; set; }

    [ForeignKey(nameof(UserId))]
    public virtual User User { get; set; }

    [Column(TypeName = "decimal(12, 2)")]
    public decimal TotalAmount { get; set; }

    [MaxLength(50)]
    public string Status { get; set; } = "pending";

    [MaxLength(500)]
    public string ShippingAddress { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation property
    public virtual ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
}
```

### 4.2. DTOs

```csharp
// DTOs/UserDtos.cs
using System.ComponentModel.DataAnnotations;

namespace MyApi.Models.DTOs;

public class CreateUserDto
{
    [Required]
    [MinLength(2)]
    [MaxLength(100)]
    public string Name { get; set; }

    [Required]
    [EmailAddress]
    [MaxLength(255)]
    public string Email { get; set; }

    [Required]
    [MinLength(8)]
    public string Password { get; set; }

    [MaxLength(20)]
    public string Role { get; set; } = "user";
}

public class UpdateUserDto
{
    [MinLength(2)]
    [MaxLength(100)]
    public string? Name { get; set; }

    [EmailAddress]
    [MaxLength(255)]
    public string? Email { get; set; }

    [MinLength(8)]
    public string? Password { get; set; }
}

public class UserDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
    public string Role { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }

    // Optional: Include related data
    public int OrderCount { get; set; }
}

public class PaginatedResult<T>
{
    public List<T> Items { get; set; }
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
    public bool HasPrevious => Page > 1;
    public bool HasNext => Page < TotalPages;
}
```

---

## 5. Dependency injection

### 5.1. Service registration

ASP.NET Core has a built-in IoC container that manages service lifetimes.

```csharp
// Service registration in Program.cs
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddTransient<IEmailService, EmailService>();
builder.Services.AddSingleton<ICacheService, RedisCacheService>();
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

// Lifetime:
// - Singleton: One instance for the entire application lifetime
// - Scoped: One instance per HTTP request
// - Transient: New instance each time it's requested
```

### 5.2. Service implementation

```csharp
// Services/IUserService.cs
namespace MyApi.Services;

public interface IUserService
{
    Task<PaginatedResult<UserDto>> GetUsersAsync(int page, int pageSize, string? search = null);
    Task<UserDto?> GetByIdAsync(int id);
    Task<UserDto?> GetByEmailAsync(string email);
    Task<UserDto> CreateAsync(CreateUserDto dto);
    Task<UserDto?> UpdateAsync(int id, UpdateUserDto dto);
    Task<bool> DeleteAsync(int id);
}


// Services/UserService.cs
using Microsoft.EntityFrameworkCore;
using MyApi.Data;
using MyApi.Models;
using MyApi.Models.DTOs;

namespace MyApi.Services;

public class UserService : IUserService
{
    private readonly AppDbContext _context;
    private readonly ICacheService _cache;

    public UserService(AppDbContext context, ICacheService cache)
    {
        _context = context;
        _cache = cache;
    }

    public async Task<PaginatedResult<UserDto>> GetUsersAsync(
        int page, int pageSize, string? search = null)
    {
        var query = _context.Users.AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            query = query.Where(u =>
                u.Name.Contains(search) ||
                u.Email.Contains(search));
        }

        var totalCount = await query.CountAsync();

        var users = await query
            .OrderByDescending(u => u.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(u => new UserDto
            {
                Id = u.Id,
                Name = u.Name,
                Email = u.Email,
                Role = u.Role,
                IsActive = u.IsActive,
                CreatedAt = u.CreatedAt,
                OrderCount = u.Orders.Count
            })
            .ToListAsync();

        return new PaginatedResult<UserDto>
        {
            Items = users,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize
        };
    }

    public async Task<UserDto?> GetByIdAsync(int id)
    {
        // Check cache first
        var cacheKey = $"user:{id}";
        var cached = await _cache.GetAsync<UserDto>(cacheKey);

        if (cached != null)
            return cached;

        var user = await _context.Users
            .Where(u => u.Id == id)
            .Select(u => new UserDto
            {
                Id = u.Id,
                Name = u.Name,
                Email = u.Email,
                Role = u.Role,
                IsActive = u.IsActive,
                CreatedAt = u.CreatedAt
            })
            .FirstOrDefaultAsync();

        if (user != null)
            await _cache.SetAsync(cacheKey, user, TimeSpan.FromMinutes(10));

        return user;
    }

    public async Task<UserDto?> GetByEmailAsync(string email)
    {
        return await _context.Users
            .Where(u => u.Email == email)
            .Select(u => new UserDto
            {
                Id = u.Id,
                Name = u.Name,
                Email = u.Email,
                Role = u.Role,
                IsActive = u.IsActive,
                CreatedAt = u.CreatedAt
            })
            .FirstOrDefaultAsync();
    }

    public async Task<UserDto> CreateAsync(CreateUserDto dto)
    {
        var user = new User
        {
            Name = dto.Name,
            Email = dto.Email,
            PasswordHash = BCryptHash(dto.Password), // Use BCrypt
            Role = dto.Role,
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return new UserDto
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            Role = user.Role,
            IsActive = user.IsActive,
            CreatedAt = user.CreatedAt
        };
    }

    public async Task<UserDto?> UpdateAsync(int id, UpdateUserDto dto)
    {
        var user = await _context.Users.FindAsync(id);

        if (user == null)
            return null;

        if (!string.IsNullOrEmpty(dto.Name))
            user.Name = dto.Name;

        if (!string.IsNullOrEmpty(dto.Email))
            user.Email = dto.Email;

        if (!string.IsNullOrEmpty(dto.Password))
            user.PasswordHash = BCryptHash(dto.Password);

        user.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        // Invalidate cache
        await _cache.RemoveAsync($"user:{id}");

        return new UserDto
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            Role = user.Role,
            IsActive = user.IsActive,
            CreatedAt = user.CreatedAt
        };
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var user = await _context.Users.FindAsync(id);

        if (user == null)
            return false;

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();

        // Invalidate cache
        await _cache.RemoveAsync($"user:{id}");

        return true;
    }
}
```

---

## 6. Entity Framework Core

### 6.1. `DbContext`

The DbContext is the primary class for interacting with the database. It manages the connection, tracks changes, and provides a querying interface.

```csharp
// Data/AppDbContext.cs
using Microsoft.EntityFrameworkCore;
using MyApi.Models;

namespace MyApi.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }
    public DbSet<Product> Products { get; set; }
    public DbSet<Category> Categories { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User configuration
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasIndex(e => e.Email).IsUnique();
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("NOW()");
        });

        // Order configuration
        modelBuilder.Entity<Order>(entity =>
        {
            entity.HasOne(o => o.User)
                  .WithMany(u => u.Orders)
                  .HasForeignKey(o => o.UserId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasIndex(o => o.Status);
            entity.HasIndex(o => o.CreatedAt);
        });

        // OrderItem configuration
        modelBuilder.Entity<OrderItem>(entity =>
        {
            entity.HasOne(oi => oi.Order)
                  .WithMany(o => o.Items)
                  .HasForeignKey(oi => oi.OrderId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(oi => oi.Product)
                  .WithMany()
                  .HasForeignKey(oi => oi.ProductId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // Seed data
        modelBuilder.Entity<Category>().HasData(
            new Category { Id = 1, Name = "Electronics", Slug = "electronics" },
            new Category { Id = 2, Name = "Clothing", Slug = "clothing" }
        );
    }
}
```

### 6.2. Database migrations

```bash
# Add migrations
dotnet ef migrations add InitialCreate --context AppDbContext
dotnet ef migrations add AddUserRole --context AppDbContext

# Apply migrations
dotnet ef database update
dotnet ef database update InitialCreate

# Remove last migration
dotnet ef migrations remove

# Generate SQL script
dotnet ef migrations script --idempotent

# Remove all migrations
dotnet ef database update 0
```

### 6.3. Query optimization

```csharp
// AsNoTracking for read-only queries
public async Task<List<User>> GetAllUsersAsync()
{
    return await _context.Users
        .AsNoTracking()
        .Where(u => u.IsActive)
        .ToListAsync();
}

// Include for related data
public async Task<Order?> GetOrderWithItemsAsync(int id)
{
    return await _context.Orders
        .Include(o => o.Items)
        .ThenInclude(i => i.Product)
        .Include(o => o.User)
        .AsNoTracking()
        .FirstOrDefaultAsync(o => o.Id == id);
}

// Split queries for complex joins
public async Task<List<object>> GetDashboardDataAsync()
{
    var orders = await _context.Orders
        .AsNoTracking()
        .ToListAsync();

    var products = await _context.Products
        .AsNoTracking()
        .ToListAsync();

    // Process in memory
    return new List<object>();
}

// Raw SQL
public async Task<List<User>> GetActiveUsersAsync()
{
    return await _context.Users
        .FromSqlRaw("SELECT * FROM users WHERE is_active = true ORDER BY created_at DESC")
        .AsNoTracking()
        .ToListAsync();
}
```

---

## 7. Middleware

### 7.1. Custom middleware

Middleware components form a pipeline that processes every HTTP request. Each component can choose to short-circuit the pipeline or pass the request to the next component.

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
            _logger.LogError(ex, "An unhandled exception occurred: {Message}", ex.Message);
            await HandleExceptionAsync(context, ex);
        }
    }

    private static Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";

        var response = new ErrorResponse();

        switch (exception)
        {
            case UnauthorizedAccessException:
                context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                response.Message = "Unauthorized access";
                break;
            case KeyNotFoundException:
                context.Response.StatusCode = (int)HttpStatusCode.NotFound;
                response.Message = exception.Message;
                break;
            case ArgumentException:
                context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                response.Message = exception.Message;
                break;
            default:
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                response.Message = "Internal server error";
                break;
        }

        var jsonOptions = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };

        var json = JsonSerializer.Serialize(response, jsonOptions);
        return context.Response.WriteAsync(json);
    }
}

public class ErrorResponse
{
    public string Message { get; set; }
    public string TraceId { get; set; }
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}
```

### 7.2. Middleware pipeline

The order of middleware registration matters. Exceptions should be handled early in the pipeline.

```csharp
// Program.cs - Full middleware pipeline
app.UseMiddleware<ExceptionMiddleware>();
app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.MapHub<ChatHub>("/chat");  // SignalR
```

---

## 8. Configuration

### 8.1. `appsettings.json`

Configuration is hierarchical and environment-aware. ASP.NET Core reads from multiple sources, with later sources taking precedence.

```json
{
  "ConnectionStrings": {
    "Default": "Host=localhost;Database=mydb;Username=postgres;Password=secret",
    "Redis": "localhost:6379"
  },
  "Jwt": {
    "Key": "super-secret-key-change-in-production-min-32-chars",
    "Issuer": "MyApi",
    "Audience": "MyApiUsers",
    "ExpiryMinutes": 60
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft": "Warning",
      "Microsoft.Hosting.Lifetime": "Information",
      "Microsoft.EntityFrameworkCore": "Warning"
    }
  },
  "AllowedHosts": "*"
}
```

### 8.2. Environment-based configuration

Environment-specific settings override base settings.

```json
// appsettings.Development.json
{
  "Logging": {
    "LogLevel": {
      "Default": "Debug",
      "Microsoft": "Information"
    }
  }
}

// Program.cs - Environment-specific config
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

if (app.Environment.IsProduction())
{
    app.UseHsts();
}
```

### 8.3. Options pattern

The Options pattern binds configuration sections to strongly-typed classes.

```csharp
// Configuration/JwtSettings.cs
public class JwtSettings
{
    public string Key { get; set; }
    public string Issuer { get; set; }
    public string Audience { get; set; }
    public int ExpiryMinutes { get; set; }
}

// Program.cs
builder.Services.Configure<JwtSettings>(
    builder.Configuration.GetSection("Jwt"));

// Service usage
public class AuthService
{
    private readonly JwtSettings _jwtSettings;

    public AuthService(IOptions<JwtSettings> jwtSettings)
    {
        _jwtSettings = jwtSettings.Value;
    }
}
```

---

## 9. Logging

### 9.1. Built-in logging

ASP.NET Core includes a logging abstraction that works with multiple providers (console, debug, event log, etc.).

```csharp
// Constructor injection
public class UserService : IUserService
{
    private readonly ILogger<UserService> _logger;

    public UserService(ILogger<UserService> logger)
    {
        _logger = logger;
    }

    public async Task<UserDto> CreateAsync(CreateUserDto dto)
    {
        _logger.LogInformation("Creating user with email: {Email}", dto.Email);

        try
        {
            var user = await _userRepository.CreateAsync(dto);
            _logger.LogInformation("User created successfully: {UserId}", user.Id);
            return user;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to create user: {Email}", dto.Email);
            throw;
        }
    }
}
```

### 9.2. Log levels

| Level | Use Case |
|---|---|
| `Trace` | Detailed trace information for debugging |
| `Debug` | Debug information for development |
| `Information` | General information (default for production) |
| `Warning` | Warning conditions (potential issues) |
| `Error` | Error conditions |
| `Critical` | Critical failures (system-level crashes) |

```csharp
_logger.LogTrace("Detailed trace information");
_logger.LogDebug("Debug information");
_logger.LogInformation("General information");  // Default for production
_logger.LogWarning("Warning condition");
_logger.LogError("Error condition");
_logger.LogCritical("Critical failure");
```

---

## 10. Authentication and authorization

### 10.1. JWT authentication

JWT (JSON Web Token) is a stateless authentication mechanism commonly used in REST APIs.

```csharp
// Services/AuthService.cs
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

public interface IAuthService
{
    Task<AuthResult> LoginAsync(LoginDto dto);
    string GenerateJwtToken(User user);
}

public class AuthService : IAuthService
{
    private readonly IUserService _userService;
    private readonly JwtSettings _jwtSettings;

    public AuthService(IUserService userService, IOptions<JwtSettings> jwtSettings)
    {
        _userService = userService;
        _jwtSettings = jwtSettings.Value;
    }

    public async Task<AuthResult> LoginAsync(LoginDto dto)
    {
        var user = await _userService.GetByEmailAsync(dto.Email);

        if (user == null || !VerifyPassword(dto.Password, user.PasswordHash))
        {
            return new AuthResult { Success = false, Message = "Invalid credentials" };
        }

        var token = GenerateJwtToken(user);
        return new AuthResult
        {
            Success = true,
            Token = token,
            ExpiresIn = _jwtSettings.ExpiryMinutes * 60
        };
    }

    public string GenerateJwtToken(User user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Key));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role),
            new Claim("name", user.Name),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var token = new JwtSecurityToken(
            issuer: _jwtSettings.Issuer,
            audience: _jwtSettings.Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(_jwtSettings.ExpiryMinutes),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
```

### 10.2. Authorization policies

Authorization policies provide flexible access control based on roles, claims, or custom requirements.

```csharp
// Program.cs
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy =>
        policy.RequireRole("admin"));

    options.AddPolicy("ActiveUser", policy =>
        policy.RequireClaim("isActive", "true"));

    options.AddPolicy("MinimumAge", policy =>
        policy.Requirements.Add(new MinimumAgeRequirement(18)));
});

// Controller usage
[Authorize(Policy = "AdminOnly")]
[HttpGet("admin/dashboard")]
public async Task<IActionResult> GetAdminDashboard() { }

// Claims-based authorization
[Authorize(Policy = "MinimumAge")]
[HttpGet("adults-only")]
public async Task<IActionResult> GetAdultsContent() { }
```

---

## 11. Best practices

### 11.1. Project structure best practices

| Practice | Description |
|---|---|
| **Use DTOs** | Never expose entities directly through the API |
| **Dependency Injection** | All services should be injected via DI |
| **Async/Await** | Use async for all I/O operations |
| **Global exception handling** | Middleware to handle exceptions centrally |
| **Logging everywhere** | Log requests, errors, and important operations |
| **Configuration** | Use the IOptions pattern for configuration |
| **Separation of concerns** | Keep controllers thin; services handle business logic |

### 11.2. Performance tips

```csharp
// 1. Use AsNoTracking for read-only queries
var users = await _context.Users.AsNoTracking().ToListAsync();

// 2. Use pagination
.Skip((page - 1) * pageSize).Take(pageSize)

// 3. Use projection (Select) to limit columns
.Select(u => new UserDto { Id = u.Id, Name = u.Name })

// 4. Use batching for bulk operations
foreach (var batch in items.Chunk(1000))
{
    await _context.Users.AddRangeAsync(batch);
    await _context.SaveChangesAsync();
    _context.ChangeTracker.Clear();
}

// 5. Use compiled queries for frequently called queries
private static readonly Func<AppDbContext, int, Task<User>> _compiledQuery =
    EF.CompileAsyncQuery((AppDbContext ctx, int id) =>
        ctx.Users.FirstOrDefault(u => u.Id == id));
```

### 11.3. Testing

```csharp
// xUnit test example
public class UserServiceTests
{
    private readonly Mock<IUserRepository> _mockRepo;
    private readonly UserService _service;

    public UserServiceTests()
    {
        _mockRepo = new Mock<IUserRepository>();
        _service = new UserService(_mockRepo.Object);
    }

    [Fact]
    public async Task GetByIdAsync_WhenUserExists_ReturnsUser()
    {
        // Arrange
        var userId = 1;
        var expectedUser = new UserDto { Id = userId, Name = "Test" };
        _mockRepo.Setup(r => r.GetByIdAsync(userId))
                 .ReturnsAsync(expectedUser);

        // Act
        var result = await _service.GetByIdAsync(userId);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(expectedUser.Id, result.Id);
        Assert.Equal(expectedUser.Name, result.Name);
    }

    [Fact]
    public async Task GetByIdAsync_WhenUserNotExists_ReturnsNull()
    {
        // Arrange
        _mockRepo.Setup(r => r.GetByIdAsync(It.IsAny<int>()))
                 .ReturnsAsync((UserDto?)null);

        // Act
        var result = await _service.GetByIdAsync(999);

        // Assert
        Assert.Null(result);
    }
}
```

---

## 12. Common interview questions

### 12.1. What is the difference between `AddScoped`, `AddTransient`, and `AddSingleton`?

- **Singleton**: A single instance is created for the entire application lifetime. Every request and every service gets the same instance. Use for stateless services or services that cache expensive data.
- **Scoped**: A new instance is created once per HTTP request (or per unit of work). The same instance is used throughout a single request. This is the most common lifetime for services that work with DbContext.
- **Transient**: A new instance is created every time the service is requested. Use for lightweight, stateless services. Caution: if a transient service depends on a scoped service, it will hold a reference to the scoped instance for its entire lifetime.

### 12.2. What is Entity Framework Core?

Entity Framework Core (EF Core) is an ORM (Object-Relational Mapper) for .NET. It maps .NET objects to database tables, allowing you to work with databases using strongly-typed C# objects instead of raw SQL. Key features include change tracking, lazy/eager loading, migrations, and support for multiple database providers (SQL Server, PostgreSQL, SQLite, etc.).

### 12.3. How does the ASP.NET Core middleware pipeline work?

The middleware pipeline processes HTTP requests through a chain of components. Each component can:
- Execute code before and after calling the next middleware
- Short-circuit the pipeline by not calling `next()`
- Handle exceptions thrown by subsequent middleware

Middleware is configured in `Program.cs` using `app.Use()`, `app.Map()`, and `app.Run()`. The order matters: middleware registered first wraps middleware registered later.

### 12.4. What is the difference between MVC and Web API in ASP.NET Core?

In ASP.NET Core, MVC and Web API have been unified into a single framework. `ControllerBase` provides the base functionality for both. The key differences in traditional ASP.NET:
- MVC returns `ActionResult` with views (HTML)
- Web API returns data (JSON, XML) via `IActionResult`

In ASP.NET Core, you use `[ApiController]` attribute and return data directly. Views are served via Razor Pages or MVC controllers separately.

### 12.5. How do you handle errors in ASP.NET Core?

Error handling in ASP.NET Core can be done at multiple levels:
- **Global exception middleware**: Catch and format all unhandled exceptions
- **Problem Details**: A standardized format for error responses (RFC 7807)
- **Exception filters**: Handle exceptions at the controller level
- **Model validation**: Return 400 Bad Request for invalid input

### 12.6. What is the difference between `FromQuery`, `FromBody`, `FromRoute`, and `FromHeader`?

| Attribute | Source |
|---|---|
| `[FromQuery]` | Query string parameters (?page=1) |
| `[FromBody]` | Request body (JSON, XML) |
| `[FromRoute]` | URL route parameters (/users/{id}) |
| `[FromHeader]` | HTTP headers (Authorization) |
| `[FromForm]` | Form data (multipart/form-data) |

### 12.7. How does ASP.NET Core authentication work?

ASP.NET Core uses an authentication handler-based model. When `UseAuthentication` is called, it reads credentials from the request, validates them, and sets `HttpContext.User`. The `[Authorize]` attribute then checks if the user is authenticated and authorized. Common schemes include JWT Bearer tokens, Cookie authentication, and OAuth providers.

### 12.8. What is the purpose of `DbContext` in Entity Framework Core?

DbContext is the primary entry point for database operations. It:
- Manages the database connection
- Provides a cached view of the in-memory objects
- Tracks changes to entities (change tracking)
- Implements the Unit of Work and Repository patterns internally
- Configures the entity-to-table mappings via Fluent API or attributes
- Supports migrations to update database schema

### 12.9. What is the difference between eager loading, lazy loading, and explicit loading?

- **Eager Loading**: Loads related data along with the main query using `.Include()` and `.ThenInclude()`. Best for scenarios where related data is always needed.
- **Lazy Loading**: Automatically loads related data when navigation properties are accessed. Requires proxies or virtual properties. Can cause N+1 query problems.
- **Explicit Loading**: Loads related data on demand using `.Reference()` or `.Collection()` methods. More control than lazy loading.

### 12.10. How do you implement rate limiting in ASP.NET Core?

ASP.NET Core 7+ includes built-in rate limiting via `Microsoft.AspNetCore.RateLimiting`. You configure rate limiter options in `Program.cs`, apply them with the `[EnableRateLimiting]` attribute, and optionally configure per-endpoint limits. Common policies include fixed window, sliding window, token bucket, and concurrency limiters.

> **Tip:** ASP.NET Core is an excellent choice for **enterprise applications** where type safety, strong tooling (Visual Studio), mature ecosystem, and cross-platform deployment are priorities. Its built-in dependency injection, async/await, and Entity Framework Core make it productive for data-heavy applications.
