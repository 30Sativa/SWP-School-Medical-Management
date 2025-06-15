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
            var responses = await _notificationService.GetAllNotificationsAsync();
            if (responses == null || responses.Count == 0)
            {
                return NotFound("Notification list is empty!");
            }
            return Ok(responses);
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetNotificationsByUserId([FromRoute] Guid userId)
        {
            var responses = await _notificationService.GetNotificationsByUserIdAsync(userId);
            if (responses == null || responses.Count == 0)
            {
                return NotFound($"No notifications found for user with ID {userId}!");
            }
            return Ok(responses);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetNotificationById([FromRoute] int id)
        {
            var response = await _notificationService.GetNotificationByIdAsync(id);
            if (response == null)
            {
                return NotFound($"Notification with ID {id} not found.");
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
                return NotFound($"Notification with ID {id} not found or could not be deleted.");
            }
            return Ok($"Delete notification with ID: {id} successfully");
        }
    }
} 