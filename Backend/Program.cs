using Backend.Configs;
using Backend.Data;
using Backend.Entities;
using Backend.Extensions;
using Backend.Middlewares;
using Backend.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Newtonsoft.Json;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddControllers()
    .AddNewtonsoftJson(options =>
        options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore
    );

builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("ApiBearerAuth", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Please enter jwt token",
        Name = "Authentication",
        Type = SecuritySchemeType.Http,
        BearerFormat = "JWT",
        Scheme = "Bearer"
    });
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "ApiBearerAuth"
                }
            },
            Array.Empty<string>()
        }
    });
});

builder.Services.AddDbContext<StoreContext>(opt => opt.UseNpgsql(builder.Configuration.GetConnectionString("Database")));
// builder.Services.AddDbContext<StoreContext>(opt => opt.UseInMemoryDatabase("db"));

builder.Services.AddAuthorization();

builder.Services.AddTransient<IEmailSender, EmailSender>();
builder.Services.Configure<MailConfig>(builder.Configuration.GetSection("Mail"));

builder.Services.AddIdentityApiEndpoints<AppUser>(options =>
    {
        options.Password.RequiredLength = 6;
        options.Password.RequireDigit = false;
        options.Password.RequireLowercase = false;
        options.Password.RequireUppercase = false;
        options.Password.RequireNonAlphanumeric = false;

        options.SignIn.RequireConfirmedEmail = false;

        options.User.RequireUniqueEmail = true;
        options.User.AllowedUserNameCharacters =
            "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ";
    })
    .AddRoles<AppRole>()
    .AddEntityFrameworkStores<StoreContext>()
    .AddDefaultTokenProviders();

builder.Services.AddMappings();

builder.Services.AddHealthChecks();

var app = builder.Build();

app.UseExceptionHandler("/error");

Console.WriteLine(app.Environment.IsDevelopment() ? "--> Development" : "--> Production");
Console.WriteLine($"--> {builder.Configuration.GetConnectionString("Database")}");

app.UseSwagger();
app.UseSwaggerUI();

app.UseCors(options =>
{
    options
        .WithOrigins("https://localhost:3000", "http://localhost:3000")
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();
});

// For react spa build
app.UseStaticFiles();

app.MapGroup("/api/accounts").MapIdentityApi<AppUser>();

app.UseAuthentication();

app.UseSuspendCheck();

app.UseAuthorization();

app.MapControllers();

// For react spa build
app.MapFallbackToFile("index.html");

app.CreateDbIfNotExistsAndSeed();

app.MapHealthChecks("/health");

app.Run();