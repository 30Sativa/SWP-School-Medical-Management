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
    public class MedicalEventTypeController : ControllerBase
    {
        private readonly IMedicalEventTypeService _medicalEventTypeService;

        public MedicalEventTypeController(IMedicalEventTypeService medicalEventTypeService)
        {
            _medicalEventTypeService = medicalEventTypeService;
        }

        // Lấy danh sách loại sự kiện y tế - Tất cả người dùng đã đăng nhập đều có quyền xem
        [HttpGet]
        public async Task<IActionResult> GetMedicalEventTypeList()
        {
            var response = await _medicalEventTypeService.GetAllMedicalEventTypesAsync();
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }

        // Lấy chi tiết loại sự kiện y tế theo ID - Tất cả người dùng đã đăng nhập đều có quyền xem
        [HttpGet("{id}")]
        public async Task<IActionResult> GetMedicalEventTypeById([FromRoute] int id)
        {
            var response = await _medicalEventTypeService.GetMedicalEventTypeByIdAsync(id);
            if (response == null)
            {
                return NotFound($"Không tìm thấy loại sự kiện y tế với ID {id}.");
            }
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }

        // Tạo loại sự kiện y tế mới - Chỉ quản lý mới có quyền tạo
        [Authorize(Roles = "Manager")]
        [HttpPost]
        public async Task<IActionResult> CreateMedicalEventType([FromBody] CreateMedicalEventTypeRequest request)
        {
            var response = await _medicalEventTypeService.CreateMedicalEventTypeAsync(request);
            return StatusCode(int.Parse(response?.Status ?? "200"), response);
        }

        // Cập nhật loại sự kiện y tế - Chỉ quản lý mới có quyền cập nhật
        [Authorize(Roles = "Manager")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMedicalEventType([FromRoute] int id, [FromBody] UpdateMedicalEventTypeRequest request)
        {
            var response = await _medicalEventTypeService.UpdateMedicalEventTypeAsync(id, request);
            if (response == null)
            {
                return NotFound($"Không tìm thấy loại sự kiện y tế với ID {id} hoặc không thể cập nhật.");
            }
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }

        // Xóa loại sự kiện y tế - Chỉ quản lý mới có quyền xóa
        [Authorize(Roles = "Manager")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMedicalEventType([FromRoute] int id)
        {
            var response = await _medicalEventTypeService.DeleteMedicalEventTypeAsync(id);
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }
    }
}