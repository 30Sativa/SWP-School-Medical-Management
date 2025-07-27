using Microsoft.AspNetCore.Authorization;
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
    [Authorize] // Default authorization for all endpoints
    public class NotificationController : ControllerBase
    {
        private readonly INotificationService _notificationService;

        public NotificationController(INotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        // Lấy danh sách tất cả thông báo - Chỉ quản lý và y tá mới có quyền xem
        [Authorize(Roles = "Manager,Nurse")]
        [HttpGet]
        public async Task<IActionResult> GetNotificationList()
        {
            var response = await _notificationService.GetAllNotificationsAsync();
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }

        // Lấy thông báo theo ID người dùng - Tất cả người dùng đã đăng nhập đều có quyền xem thông báo của mình
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetNotificationsByUserId([FromRoute] Guid userId)
        {
            var response = await _notificationService.GetNotificationsByUserIdAsync(userId);
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }

        // Lấy chi tiết thông báo theo ID - Tất cả người dùng đã đăng nhập đều có quyền xem
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

        // Gửi thông báo mới - Chỉ quản lý và y tá mới có quyền gửi
        [Authorize(Roles = "Manager,Nurse")]
        [HttpPost("send")]
        public async Task<IActionResult> SendNotification([FromBody] CreateNotificationRequest request)
        {
            var response = await _notificationService.CreateNotificationAsync(request);
            return StatusCode(int.Parse(response?.Status ?? "200"), response);
        }

        // Xóa thông báo - Chỉ quản lý mới có quyền xóa
        [Authorize(Roles = "Manager")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNotification([FromRoute] int id)
        {
            var response = await _notificationService.DeleteNotificationAsync(id);
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }

        // Lấy danh sách tổng hợp thông báo cho phụ huynh - Chỉ phụ huynh mới có quyền xem thông báo của mình
        [Authorize(Roles = "Parent")]
        [HttpGet("parent/{parentId}/notifications")]
        public async Task<IActionResult> GetParentNotifications([FromRoute] Guid parentId)
        {
            var response = await _notificationService.GetParentNotificationsAsync(parentId);
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }
    }
}