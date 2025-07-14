using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SchoolMedicalManagement.Models.Request;
using SchoolMedicalManagement.Service.Interface;
using System;
using System.Threading.Tasks;

namespace School_Medical_Management.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationController : ControllerBase
    {
        private readonly INotificationService _notificationService;

        public NotificationController(INotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        [HttpGet]
        public async Task<IActionResult> GetNotificationList()
        {
            var response = await _notificationService.GetAllNotificationsAsync();
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetNotificationsByUserId([FromRoute] Guid userId)
        {
            var response = await _notificationService.GetNotificationsByUserIdAsync(userId);
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetNotificationById([FromRoute] int id)
        {
            var response = await _notificationService.GetNotificationByIdAsync(id);
            if (response == null)
            {
                return NotFound($"Không tìm thấy thông báo với ID {id}.");
            }
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }

        [HttpPost("send")]
        public async Task<IActionResult> SendNotification([FromBody] CreateNotificationRequest request)
        {
            var response = await _notificationService.CreateNotificationAsync(request);
            return StatusCode(int.Parse(response?.Status ?? "200"), response);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNotification([FromRoute] int id)
        {
            var result = await _notificationService.DeleteNotificationAsync(id);
            if (!result)
            {
                return NotFound($"Không tìm thấy thông báo với ID {id} hoặc không thể xóa.");
            }
            return Ok($"Xóa thông báo với ID: {id} thành công");
        }
    }
} 