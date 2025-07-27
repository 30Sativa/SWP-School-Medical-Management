using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SchoolMedicalManagement.Models.Request;
using SchoolMedicalManagement.Service.Implement;
using SchoolMedicalManagement.Service.Interface;

namespace School_Medical_Management.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // Default authorization for all endpoints
    public class StudentController : ControllerBase
    {
        private readonly IStudentService _studentService;

        public StudentController(IStudentService studentService)
        {
            _studentService = studentService;
        }

        // Luôn trả danh sách học sinh, không cần kiểm tra null vì trả về list rỗng cũng hợp lệ
        // Quản lý và y tá có quyền xem danh sách học sinh
        [Authorize(Roles = "Manager,Nurse")]
        [HttpGet]
        public async Task<IActionResult> GetStudentList()
        {
            var response = await _studentService.GetStudentList();
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }

        // Dùng StatusCode để phản hồi theo status code từ BaseResponse
        // Quản lý, y tá và phụ huynh có quyền xem thông tin học sinh
        [Authorize(Roles = "Manager,Nurse,Parent")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetStudentById([FromRoute] int id)
        {
            var response = await _studentService.GetStudentById(id);
            return StatusCode(int.Parse(response.Status), response);
        }

        // CreateStudent cũng trả về BaseResponse
        // Chỉ quản lý và y tá mới có quyền tạo học sinh
        [Authorize(Roles = "Manager,Nurse")]
        [HttpPost]
        public async Task<IActionResult> CreateStudent([FromBody] CreateStudentRequest request)
        {
            var response = await _studentService.CreateStudent(request);
            return StatusCode(int.Parse(response.Status), response);
        }

        // Gợi ý: nên dùng BaseResponse thay vì bool để đồng bộ cách phản hồi
        // Chỉ quản lý và y tá mới có quyền cập nhật thông tin học sinh
        [Authorize(Roles = "Manager,Nurse")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStudent(int id, [FromBody] UpdateStudentRequest request)
        {
            var response = await _studentService.UpdateStudent(id, request);
            if (response == null || response.Data == null)
                return NotFound($"Không tìm thấy học sinh với ID {id} hoặc cập nhật thất bại.");

            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }

        // Chỉ quản lý mới có quyền xóa học sinh
        [Authorize(Roles = "Manager")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStudent([FromRoute] int id)
        {
            var response = await _studentService.DeleteStudent(id);
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }


        // ✅ Sửa lại dùng StatusCode như các hàm khác
        // Quản lý, y tá và phụ huynh có quyền xem danh sách học sinh của phụ huynh
        [Authorize(Roles = "Manager,Nurse,Parent")]
        [HttpGet("by-parent/{parentId}")]
        public async Task<IActionResult> GetStudentsOfParent(Guid parentId)
        {
            var response = await _studentService.GetStudentsOfParent(parentId);
            return StatusCode(int.Parse(response.Status), response);
        }

        // Quản lý và y tá có quyền xem danh sách học sinh theo lớp
        [Authorize(Roles = "Manager,Nurse")]
        [HttpGet("by-class/{className}")]
        public async Task<IActionResult> GetStudentsByClass([FromRoute] string className)
        {
            var response = await _studentService.GetStudentsByClass(className);
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }
    }
}
