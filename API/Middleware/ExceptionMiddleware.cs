using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;
using API.Errors;

namespace API.Middleware
{
    public class ExceptionMiddleware
    {
        private RequestDelegate _next { get; }
        private ILogger<ExceptionMiddleware> _logger { get; }
        private IHostEnvironment _env { get; }

        private readonly int _errorStatusCode = (int) HttpStatusCode.InternalServerError;
        public ExceptionMiddleware(
            RequestDelegate next,
            ILogger<ExceptionMiddleware> logger,
            IHostEnvironment env)
        {
            _next = next;
            _logger = logger;
            _env = env;            
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {                
                _logger.LogError(ex, ex.Message);
                context.Response.ContentType = "application/json";
                context.Response.StatusCode = _errorStatusCode;

                var response = _env.IsDevelopment()
                    ? new ApiException(_errorStatusCode, ex.Message, ex.StackTrace?.ToString())
                    : new ApiException(_errorStatusCode, "Internal Server Error");
                
                var options = new JsonSerializerOptions
                {
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                };

                var json = JsonSerializer.Serialize(response, options);

                await context.Response.WriteAsync(json);
            }
        }
    }
}