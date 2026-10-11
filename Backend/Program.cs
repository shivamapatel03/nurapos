using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.IdentityModel.Tokens;
using Npgsql;
using System.Text;
using System.Threading.RateLimiting;

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
// Auth Repository
builder.Services.AddScoped<Nurapos.Repositories.Interfaces.IAuthRepository, Nurapos.Repositories.AuthRepository>();


// ==================================================
// SERVICES
// ==================================================

// Franchise Service
builder.Services.AddScoped<IFranchiseService,FranchiseService>();
builder.Services.AddScoped<IOwnerCatalogService, OwnerCatalogService>();
builder.Services.AddScoped<IOwnerOperationsService, OwnerOperationsService>();
// Auth Service
builder.Services.AddScoped<IAuthService,AuthService>();

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
app.UseRateLimiter();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
