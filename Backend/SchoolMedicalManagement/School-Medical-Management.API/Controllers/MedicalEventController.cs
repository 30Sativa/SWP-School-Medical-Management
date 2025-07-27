using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchoolMedicalManagement.Models.Request;
using SchoolMedicalManagement.Service.Interface;

namespace School_Medical_Management.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // Default authorization for all endpoints
    public class MedicalEventController : ControllerBase
    {
        private readonly IMedicalEventService _medicalEventService;
        public MedicalEventController(IMedicalEventService medicalEventService)
        {
            _medicalEventService = medicalEventService;
        }

        // Lấy 1 sự kiện y tế theo ID - Y tá, quản lý và phụ huynh có quyền xem
        [Authorize(Roles = "Nurse,Manager,Parent")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetMedicalEventById([FromRoute] int id)
        {
            var result = await _medicalEventService.GetByIdMedicalEvent(id);
            return StatusCode(int.Parse(result.Status), result);
        }

        // Tạo mới sự kiện y tế - Chỉ y tá và quản lý mới có quyền tạo
        [Authorize(Roles = "Nurse,Manager")]
        [HttpPost]
        public async Task<IActionResult> CreateMedicalEvent([FromBody] CreateMedicalEventRequest request)
        {
            var response = await _medicalEventService.CreateMedicalEvent(request);
            return StatusCode(int.Parse(response.Status), response);
        }

        // Cập nhật sự kiện y tế - Chỉ y tá và quản lý mới có quyền cập nhật
        [Authorize(Roles = "Nurse,Manager")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMedicalEvent([FromRoute] int id, [FromBody] CreateMedicalEventRequest request)
        {
            var response = await _medicalEventService.UpdateMedicalEvent(id, request);
            return StatusCode(int.Parse(response.Status), response);
        }

        // Xoá mềm sự kiện y tế - Chỉ quản lý mới có quyền xóa
        [Authorize(Roles = "Manager")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMedicalEvent([FromRoute] int id)
        {
            var response = await _medicalEventService.DeleteMedicalEvent(id);
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }

        // Lấy danh sách sự kiện y tế đang hoạt động - Y tá và quản lý có quyền xem
        [Authorize(Roles = "Nurse,Manager")]
        [HttpGet]
        public async Task<IActionResult> GetAllMedicalEvents()
        {
            var response = await _medicalEventService.GetAllMedicalEvent();
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }

        // Lấy sự kiện y tế theo ID học sinh - Y tá, quản lý và phụ huynh có quyền xem
        [Authorize(Roles = "Nurse,Manager,Parent")]
        [HttpGet("student/{studentId}")]
        public async Task<IActionResult> GetMedicalEventsByStudentId([FromRoute] int studentId)
        {
            var result = await _medicalEventService.GetMedicalEventsByStudentId(studentId);
            return StatusCode(int.Parse(result.Status), result);
        }
    }
}
