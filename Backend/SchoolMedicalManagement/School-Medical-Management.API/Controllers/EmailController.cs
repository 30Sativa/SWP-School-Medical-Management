using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchoolMedicalManagement.Models.Request;
using SchoolMedicalManagement.Service.Interface;
using System;
using System.Threading.Tasks;

namespace School_Medical_Management.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // Default authorization for all endpoints
    public class EmailController : ControllerBase
    {
        private readonly IEmailService _emailService;

        public EmailController(IEmailService emailService)
        {
            _emailService = emailService;
        }

        // Gửi email bằng UserId - Chỉ quản lý và y tá mới có quyền gửi
        [Authorize(Roles = "Manager,Nurse")]
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

        // Gửi email bằng địa chỉ email - Chỉ quản lý và y tá mới có quyền gửi
        [Authorize(Roles = "Manager,Nurse")]
        [HttpPost("send-by-email")]
        public async Task<IActionResult> SendEmailByEmail([FromBody] SendEmailByEmailRequest request)
        {
            if (request == null || string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Subject) || string.IsNullOrEmpty(request.Body))
            {
                return BadRequest(new { Status = "400", Message = "email, subject và body là bắt buộc." });
            }
            var response = await _emailService.SendEmailAsync(request.Email, request.Subject, request.Body);
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }
    }
} 