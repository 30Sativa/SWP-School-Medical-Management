using System.Text.Json;
using SchoolMedicalManagement.Models.Exceptions;
using SchoolMedicalManagement.Models.Response;

namespace School_Medical_Management.API.Middlewaree
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;

        public ExceptionMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (BusinessException ex)
            {
                await WriteErrorResponse(context, ex.Message, ex.StatusCode);
            }
            catch (Exception ex)
            {
                await WriteErrorResponse(context, "Lỗi hệ thống.", StatusCodes.Status500InternalServerError);
                // Log nội dung ex.Message, ex.StackTrace tại đây nếu cần
            }
        }

        private static async Task WriteErrorResponse(HttpContext context, string message, int statusCode)
        {
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = statusCode;

            var response = new BaseResponse
            {
                Status = statusCode.ToString(),
                Message = message,
                Data = null
            };

            await context.Response.WriteAsync(JsonSerializer.Serialize(response));
        }
    }
}
