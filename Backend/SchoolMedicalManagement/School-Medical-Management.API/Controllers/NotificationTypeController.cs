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
            var response = await _notificationTypeService.GetAllNotificationTypesAsync();
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetNotificationTypeById([FromRoute] int id)
        {
            var response = await _notificationTypeService.GetNotificationTypeByIdAsync(id);
            if (response == null)
            {
                return NotFound($"Không tìm thấy loại thông báo với ID {id}.");
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
                return NotFound($"Không tìm thấy loại thông báo với ID {id} hoặc không thể cập nhật.");
            }
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNotificationType([FromRoute] int id)
        {
            var response = await _notificationTypeService.DeleteNotificationTypeAsync(id);
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }
    }
} 