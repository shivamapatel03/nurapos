using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.IdentityModel.Tokens;
using Npgsql;
using System.Text;
using System.Threading.RateLimiting;
using StackExchange.Redis;

using Nurapos.Repositories;
using Nurapos.Repositories.Interfaces;
using Nurapos.Services;
using Nurapos.Services.Interfaces;
using Nurapos.Helpers;
using Nurapos.Filters;
using Nurapos.Middleware;
using Nurapos.DTOs;

var builder = WebApplication.CreateBuilder(args);

builder.Services
    .AddControllers()
    .AddMvcOptions(options => options.Filters.Add<ApiActionLoggingFilter>())
    .ConfigureApiBehaviorOptions(options =>
    {
        options.InvalidModelStateResponseFactory = context =>
        {
            var errors = context.ModelState
                .Where(x => x.Value?.Errors.Count > 0)
                .ToDictionary(
                    x => x.Key,
                    x => x.Value!.Errors
                        .Select(e => string.IsNullOrWhiteSpace(e.ErrorMessage)
                            ? "Invalid value."
                            : e.ErrorMessage)
                        .ToArray()
                );

            return new BadRequestObjectResult(new ApiResponse<object?>
            {
                StatusCode = StatusCodes.Status400BadRequest,
                Message = "Validation failed.",
                Errors = errors
            });
        };
    });

builder.Services.AddScoped<ApiActionLoggingFilter>();


// PostgreSQL Connection
builder.Services.AddScoped<NpgsqlConnection>(sp =>
{
    var configuration = sp.GetRequiredService<IConfiguration>();

    var connectionString =
        configuration.GetConnectionString("DefaultConnection")
        ?? throw new InvalidOperationException(
            "DefaultConnection is not configured.");

    return new NpgsqlConnection(PostgresConnectionString.Normalize(connectionString));
});


// ==================================================
// REPOSITORIES
// ==================================================

// Franchise Repository
builder.Services.AddScoped<IFranchiseRepository,FranchiseRepository>();
builder.Services.AddScoped<IOwnerCatalogRepository, OwnerCatalogRepository>();
builder.Services.AddScoped<IOwnerOperationsRepository, OwnerOperationsRepository>();
builder.Services.AddScoped<IOnboardingRepository, OnboardingRepository>();
builder.Services.AddScoped<IEmployeeRepository, EmployeeRepository>();
builder.Services.AddScoped<ITerminalRepository, TerminalRepository>();
builder.Services.AddScoped<ICustomerRepository, CustomerRepository>();
builder.Services.AddScoped<IShiftRepository, ShiftRepository>();
builder.Services.AddScoped<ITableRepository, TableRepository>();
builder.Services.AddScoped<IOfferRepository, OfferRepository>();
builder.Services.AddScoped<ISettingsRepository, SettingsRepository>();
builder.Services.AddScoped<IUploadRepository, UploadRepository>();
builder.Services.AddScoped<IReportRepository, ReportRepository>();
// Auth Repository
builder.Services.AddScoped<Nurapos.Repositories.Interfaces.IAuthRepository, Nurapos.Repositories.AuthRepository>();


// ==================================================
// SERVICES
// ==================================================

// Franchise Service
builder.Services.AddScoped<IFranchiseService,FranchiseService>();
builder.Services.AddScoped<IOwnerCatalogService, OwnerCatalogService>();
builder.Services.AddScoped<IOwnerOperationsService, OwnerOperationsService>();
builder.Services.AddScoped<IOnboardingService, OnboardingService>();
builder.Services.AddScoped<IEmployeeService, EmployeeService>();
builder.Services.AddScoped<ITerminalService, TerminalService>();
builder.Services.AddScoped<ICustomerService, CustomerService>();
builder.Services.AddScoped<IShiftService, ShiftService>();
builder.Services.AddScoped<ITableService, TableService>();
builder.Services.AddScoped<IOfferService, OfferService>();
builder.Services.AddScoped<ISettingsService, SettingsService>();
builder.Services.AddScoped<IUploadService, UploadService>();
builder.Services.AddScoped<IReportService, ReportService>();
builder.Services.AddSingleton<IFileStorage, LocalFileStorage>();
// Auth Service
builder.Services.AddScoped<IAuthService,AuthService>();
builder.Services.AddSingleton<IEmailSender, EmailSender>();
var redisConnectionString = builder.Configuration["Redis:ConnectionString"];
if (!string.IsNullOrWhiteSpace(redisConnectionString))
{
    builder.Services.AddSingleton<IConnectionMultiplexer>(_ =>
    {
        var options = ConfigurationOptions.Parse(redisConnectionString);
        options.AbortOnConnectFail = false;
        return ConnectionMultiplexer.Connect(options);
    });
    builder.Services.AddSingleton<IOtpStore, RedisOtpStore>();
    builder.Services.AddSingleton<IRedisRateLimitStore, RedisRateLimitStore>();
}
else
{
    builder.Services.AddSingleton<IOtpStore, UnconfiguredOtpStore>();
    builder.Services.AddSingleton<IRedisRateLimitStore, UnconfiguredRedisRateLimitStore>();
}

// Jwt helper
builder.Services.AddSingleton<IJwtHelper,JwtHelper>();


// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy
            .WithOrigins("http://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});


// JWT
var jwtKey = builder.Configuration["Jwt:Key"]
    ?? throw new InvalidOperationException("JWT Key is missing.");

var jwtIssuer = builder.Configuration["Jwt:Issuer"];
var jwtAudience = builder.Configuration["Jwt:Audience"];

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ClockSkew = TimeSpan.FromSeconds(30),

            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,

            IssuerSigningKey =
                new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(jwtKey))
        };
    });

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("PosPinVerified", policy =>
        policy.RequireClaim("pos_pin_verified", "true"));
});

builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.OnRejected = async (context, cancellationToken) =>
    {
        context.HttpContext.Response.ContentType = "application/json";
        if (context.Lease.TryGetMetadata(MetadataName.RetryAfter, out var retryAfter))
        {
            context.HttpContext.Response.Headers.RetryAfter =
                Math.Ceiling(retryAfter.TotalSeconds).ToString();
        }

        await context.HttpContext.Response.WriteAsJsonAsync(
            new ApiResponse<object?>
            {
                StatusCode = StatusCodes.Status429TooManyRequests,
                Message = "Too many requests. Please try again later."
            },
            cancellationToken);
    };

    options.AddPolicy("Auth", httpContext =>
        RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown",
            factory: _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 5,
                Window = TimeSpan.FromMinutes(1),
                QueueLimit = 0,
                AutoReplenishment = true
            }));

    options.AddPolicy("OtpResend", httpContext =>
        RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown",
            factory: _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 3, Window = TimeSpan.FromMinutes(10), QueueLimit = 0, AutoReplenishment = true
            }));

    options.AddPolicy("PasswordForgot", httpContext =>
        RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown",
            factory: _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 5, Window = TimeSpan.FromMinutes(15), QueueLimit = 0, AutoReplenishment = true
            }));

    options.AddPolicy("PinMutation", httpContext =>
        RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: $"{httpContext.Connection.RemoteIpAddress}:{httpContext.Request.RouteValues["id"]}",
            factory: _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 5, Window = TimeSpan.FromMinutes(15), QueueLimit = 0, AutoReplenishment = true
            }));

    options.AddPolicy("PosPin", httpContext =>
        RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown",
            factory: _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 5, Window = TimeSpan.FromMinutes(15), QueueLimit = 0, AutoReplenishment = true
            }));

    options.AddPolicy("PosSale", httpContext =>
        RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown",
            factory: _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 30, Window = TimeSpan.FromMinutes(1), QueueLimit = 0, AutoReplenishment = true
            }));

    options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(httpContext =>
        RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown",
            factory: _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 120,
                Window = TimeSpan.FromMinutes(1),
                QueueLimit = 0,
                AutoReplenishment = true
            }));
});


// Swagger with JWT bearer authentication
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.OpenApiSecurityScheme
    {
        Name = "Authorization",
        Description = "Paste the access token. Swagger adds the Bearer prefix.",
        In = Microsoft.OpenApi.ParameterLocation.Header,
        Type = Microsoft.OpenApi.SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT"
    });

    options.AddSecurityRequirement(document => new Microsoft.OpenApi.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.OpenApiSecuritySchemeReference("Bearer", document, null),
            new List<string>()
        }
    });
});


var app = builder.Build();

// Keep the owner link available when deploying over an existing database.
await using (var scope = app.Services.CreateAsyncScope())
{
    var authRepository = scope.ServiceProvider.GetRequiredService<IAuthRepository>();
    await authRepository.CreateUsersTableIfNotExistsAsync();

    var franchiseRepository = scope.ServiceProvider.GetRequiredService<IFranchiseRepository>();
    await franchiseRepository.EnsureFranchiseSchemaAsync();

    var onboardingRepository = scope.ServiceProvider.GetRequiredService<IOnboardingRepository>();
    await onboardingRepository.EnsureSchemaAsync();

    var employeeRepository = scope.ServiceProvider.GetRequiredService<IEmployeeRepository>();
    await employeeRepository.EnsureSchemaAsync();

    var terminalRepository = scope.ServiceProvider.GetRequiredService<ITerminalRepository>();
    await terminalRepository.EnsureSchemaAsync();

    var customerRepository = scope.ServiceProvider.GetRequiredService<ICustomerRepository>();
    await customerRepository.EnsureSchemaAsync();

    var shiftRepository = scope.ServiceProvider.GetRequiredService<IShiftRepository>();
    await shiftRepository.EnsureSchemaAsync();

    var tableRepository = scope.ServiceProvider.GetRequiredService<ITableRepository>();
    await tableRepository.EnsureSchemaAsync();

    var offerRepository = scope.ServiceProvider.GetRequiredService<IOfferRepository>();
    await offerRepository.EnsureSchemaAsync();

    var settingsRepository = scope.ServiceProvider.GetRequiredService<ISettingsRepository>();
    await settingsRepository.EnsureSchemaAsync();

    var uploadRepository = scope.ServiceProvider.GetRequiredService<IUploadRepository>();
    await uploadRepository.EnsureSchemaAsync();
}


var swaggerEnabled = app.Environment.IsDevelopment() ||
    app.Configuration.GetValue<bool>("Swagger:Enabled");

if (swaggerEnabled)
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


app.UseMiddleware<ApiExceptionMiddleware>();

app.UseStatusCodePages(async statusContext =>
{
    var response = statusContext.HttpContext.Response;
    response.ContentType = "application/json";
    var message = response.StatusCode switch
    {
        StatusCodes.Status401Unauthorized => "Authentication is required or the credentials are invalid.",
        StatusCodes.Status403Forbidden => "You are not allowed to access this resource.",
        StatusCodes.Status404NotFound => "The requested endpoint was not found.",
        StatusCodes.Status405MethodNotAllowed => "The HTTP method is not allowed for this endpoint.",
        _ => "The request could not be completed."
    };

    await response.WriteAsJsonAsync(new ApiResponse<object?>
    {
        StatusCode = response.StatusCode,
        Message = message,
        TraceId = statusContext.HttpContext.TraceIdentifier
    });
});

app.UseCors("Frontend");

app.UseRouting();
app.UseMiddleware<DistributedRateLimitMiddleware>();
app.UseRateLimiter();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
