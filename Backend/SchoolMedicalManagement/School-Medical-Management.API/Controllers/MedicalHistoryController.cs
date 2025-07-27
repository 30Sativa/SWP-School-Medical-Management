using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SchoolMedicalManagement.Models.Request;
using SchoolMedicalManagement.Service.Interface;

namespace School_Medical_Management.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // Default authorization for all endpoints
    public class MedicalHistoryController : ControllerBase
    {
        private readonly IMedicalHistoryService _service;

        public MedicalHistoryController(IMedicalHistoryService service)
        {
            _service = service;
        }

        // Lấy lịch sử y tế theo ID học sinh - Y tá, quản lý và phụ huynh có quyền xem
        [Authorize(Roles = "Nurse,Manager,Parent")]
        [HttpGet("student/{studentId}")]
        public async Task<IActionResult> GetAllByStudentId(int studentId)
        {
            var response = await _service.GetAllByStudentIdAsync(studentId);
            return StatusCode(int.Parse(response.Status), response);
        }

        // Lấy chi tiết lịch sử y tế theo ID - Y tá, quản lý và phụ huynh có quyền xem
        [Authorize(Roles = "Nurse,Manager,Parent")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var res = await _service.GetByIdAsync(id);
            return StatusCode(int.Parse(res.Status), res);
        }

        // Tạo lịch sử y tế mới - Chỉ y tá và quản lý mới có quyền tạo
        [Authorize(Roles = "Nurse,Manager")]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateMedicalHistoryRequest request)
        {
            var res = await _service.CreateAsync(request);
            return StatusCode(int.Parse(res.Status), res);
        }

        // Cập nhật lịch sử y tế - Chỉ y tá và quản lý mới có quyền cập nhật
        [Authorize(Roles = "Nurse,Manager")]
        [HttpPut]
        public async Task<IActionResult> Update([FromBody] UpdateMedicalHistoryRequest request)
        {
            var res = await _service.UpdateAsync(request);
            return StatusCode(int.Parse(res.Status), res);
        }

        // Xóa lịch sử y tế - Chỉ quản lý mới có quyền xóa
        [Authorize(Roles = "Manager")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var res = await _service.DeleteAsync(id);
            return StatusCode(int.Parse(res.Status), res);
        }
    }
}
