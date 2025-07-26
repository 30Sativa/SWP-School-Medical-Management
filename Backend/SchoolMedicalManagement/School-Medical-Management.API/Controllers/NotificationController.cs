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
            var response = await _notificationService.DeleteNotificationAsync(id);
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }

        // Lấy danh sách tổng hợp thông báo cho phụ huynh
        [HttpGet("parent/{parentId}/notifications")]
        public async Task<IActionResult> GetParentNotifications([FromRoute] Guid parentId)
        {
            var response = await _notificationService.GetParentNotificationsAsync(parentId);
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }
    }
}