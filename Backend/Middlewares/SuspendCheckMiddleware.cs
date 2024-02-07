using System.Security.Claims;
using System.Text;
using System.Text.Json;
using Backend.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Middlewares;

// This middleware check whether a user is suspended in only two routes "/api/accounts/me" and "/api/accounts/login"
public class SuspendCheckMiddleware(RequestDelegate next)
{
    public async Task InvokeAsync(HttpContext context, UserManager<AppUser> userManager)
    {
        var suspended = false;

        var url = context.Request.Path.Value;
        if (url == null)
        {
            await next(context);
            return;
        }

        if (url.Contains("/api/accounts/login"))
        {
            // Buffer the request body so it can be read multiple times
            context.Request.EnableBuffering();

            using var reader = new StreamReader(context.Request.Body, Encoding.UTF8,
                detectEncodingFromByteOrderMarks: false, bufferSize: 1024, leaveOpen: true);
            var requestBody = await reader.ReadToEndAsync();

            // Reset the request body position to the beginning
            context.Request.Body.Position = 0;

            // Parse the JSON request body
            var jsonDocument = JsonDocument.Parse(requestBody);
            var root = jsonDocument.RootElement;

            // Check if the request body contains an 'email' field
            if (root.TryGetProperty("email", out var emailElement) && emailElement.ValueKind == JsonValueKind.String)
            {
                var email = emailElement.GetString();
                if (!string.IsNullOrWhiteSpace(email))
                {
                    var user = await userManager.FindByNameAsync(email);
                    if (user is { Suspend: true }) suspended = true;
                }
            }
        }

        if (url.Contains("/api/accounts/me"))
        {
            var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId != null)
            {
                var user = await userManager.FindByIdAsync(userId);
                if (user is { Suspend: true }) suspended = true;
            }
        }

        if (suspended)
        {
            var problemDetails = new ProblemDetails
            {
                Type = "https://datatracker.ietf.org/doc/html/rfc9110#section-15.5.4",
                Title = "Account Suspended",
                Status = StatusCodes.Status403Forbidden,
                Detail = "Your account has been suspended.",
            };

            context.Response.ContentType = "application/problem+json";
            context.Response.StatusCode = StatusCodes.Status403Forbidden;

            var options = new JsonSerializerOptions
            {
                WriteIndented = true,
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            };
            await context.Response.WriteAsync(JsonSerializer.Serialize(problemDetails, options));
            return;
        }

        await next(context);
    }
}

public static class SuspendCheckMiddlewareExtensions
{
    public static IApplicationBuilder UseSuspendCheck(
        this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<SuspendCheckMiddleware>();
    }
}