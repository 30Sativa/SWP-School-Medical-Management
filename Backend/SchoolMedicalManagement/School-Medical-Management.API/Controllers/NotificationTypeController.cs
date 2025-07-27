using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SchoolMedicalManagement.Models.Request;
using SchoolMedicalManagement.Service.Interface;
using System.Threading.Tasks;

namespace School_Medical_Management.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // Default authorization for all endpoints
    public class NotificationTypeController : ControllerBase
    {
        private readonly INotificationTypeService _notificationTypeService;

        public NotificationTypeController(INotificationTypeService notificationTypeService)
        {
            _notificationTypeService = notificationTypeService;
        }

        // Lấy danh sách loại thông báo - Tất cả người dùng đã đăng nhập đều có quyền xem
        [HttpGet]
        public async Task<IActionResult> GetNotificationTypeList()
        {
            var response = await _notificationTypeService.GetAllNotificationTypesAsync();
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }

        // Lấy chi tiết loại thông báo theo ID - Tất cả người dùng đã đăng nhập đều có quyền xem
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

        // Tạo loại thông báo mới - Chỉ quản lý mới có quyền tạo
        [Authorize(Roles = "Manager")]
        [HttpPost]
        public async Task<IActionResult> CreateNotificationType([FromBody] CreateNotificationTypeRequest request)
        {
            var response = await _notificationTypeService.CreateNotificationTypeAsync(request);
            return StatusCode(int.Parse(response?.Status ?? "200"), response);
        }

        // Cập nhật loại thông báo - Chỉ quản lý mới có quyền cập nhật
        [Authorize(Roles = "Manager")]
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

        // Xóa loại thông báo - Chỉ quản lý mới có quyền xóa
        [Authorize(Roles = "Manager")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNotificationType([FromRoute] int id)
        {
            var response = await _notificationTypeService.DeleteNotificationTypeAsync(id);
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }
    }
} 