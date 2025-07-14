using Microsoft.AspNetCore.Mvc;
using SchoolMedicalManagement.Models.Request;
using SchoolMedicalManagement.Service.Interface;
using System;
using System.Threading.Tasks;

namespace School_Medical_Management.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmailController : ControllerBase
    {
        private readonly IEmailService _emailService;

        public EmailController(IEmailService emailService)
        {
            _emailService = emailService;
        }

        [HttpPost("send-by-userid")]
        public async Task<IActionResult> SendEmailByUserId([FromBody] SendEmailByUserIdRequest request)
        {
            if (request == null || request.UserId == Guid.Empty || string.IsNullOrEmpty(request.Subject) || string.IsNullOrEmpty(request.Body))
            {
                return BadRequest(new { Status = "400", Message = "userId, subject và body là bắt buộc." });
            }
            var response = await _emailService.SendEmailByUserIdAsync(request.UserId, request.Subject, request.Body);
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }

        [HttpPost("send-by-email")]
        public async Task<IActionResult> SendEmailByEmail([FromBody] SendEmailByEmailRequest request)
        {
            if (request == null || string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Subject) || string.IsNullOrEmpty(request.Body))
            {
                return BadRequest(new { Status = "400", Message = "email, subject và body là bắt buộc." });
            }
            try
            {
                await _emailService.SendEmailAsync(request.Email, request.Subject, request.Body);
                return Ok(new { Status = "200", Message = "Gửi email thành công.", Data = (object?)null });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Status = "500", Message = $"Gửi email thất bại: {ex.Message}", Data = (object?)null });
            }
        }
    }
} 