using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SchoolMedicalManagement.Models.Request;
using SchoolMedicalManagement.Service.Interface;
using System.Threading.Tasks;

namespace School_Medical_Management.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationTypeController : ControllerBase
    {
        private readonly INotificationTypeService _notificationTypeService;

        public NotificationTypeController(INotificationTypeService notificationTypeService)
        {
            _notificationTypeService = notificationTypeService;
        }

        [HttpGet]
        public async Task<IActionResult> GetNotificationTypeList()
        {
            var responses = await _notificationTypeService.GetAllNotificationTypesAsync();
            if (responses == null || responses.Count == 0)
            {
                return NotFound("Notification type list is empty!");
            }
            return Ok(responses);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetNotificationTypeById([FromRoute] int id)
        {
            var response = await _notificationTypeService.GetNotificationTypeByIdAsync(id);
            if (response == null)
            {
                return NotFound($"Notification type with ID {id} not found.");
            }
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }

        [HttpPost]
        public async Task<IActionResult> CreateNotificationType([FromBody] CreateNotificationTypeRequest request)
        {
            var response = await _notificationTypeService.CreateNotificationTypeAsync(request);
            return StatusCode(int.Parse(response?.Status ?? "200"), response);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateNotificationType([FromRoute] int id, [FromBody] UpdateNotificationTypeRequest request)
        {
            var response = await _notificationTypeService.UpdateNotificationTypeAsync(id, request);
            if (response == null)
            {
                return NotFound($"Notification type with ID {id} not found or could not be updated.");
            }
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNotificationType([FromRoute] int id)
        {
            var result = await _notificationTypeService.DeleteNotificationTypeAsync(id);
            if (!result)
            {
                return NotFound($"Notification type with ID {id} not found or could not be deleted.");
            }
            return Ok($"Delete notification type with ID: {id} successfully");
        }
    }
} 