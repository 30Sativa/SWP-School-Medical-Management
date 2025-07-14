using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SchoolMedicalManagement.Models.Request;
using SchoolMedicalManagement.Service.Implement;
using SchoolMedicalManagement.Service.Interface;

namespace School_Medical_Management.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentController : ControllerBase
    {
        private readonly IStudentService _studentService;

        public StudentController(IStudentService studentService)
        {
            _studentService = studentService;
        }

        // Luôn trả danh sách học sinh, không cần kiểm tra null vì trả về list rỗng cũng hợp lệ
        [HttpGet]
        public async Task<IActionResult> GetStudentList()
        {
            var response = await _studentService.GetStudentList();
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }

        // Dùng StatusCode để phản hồi theo status code từ BaseResponse
        [HttpGet("{id}")]
        public async Task<IActionResult> GetStudentById([FromRoute] int id)
        {
            var response = await _studentService.GetStudentById(id);
            return StatusCode(int.Parse(response.Status), response);
        }

        // CreateStudent cũng trả về BaseResponse
        [HttpPost]
        public async Task<IActionResult> CreateStudent([FromBody] CreateStudentRequest request)
        {
            var response = await _studentService.CreateStudent(request);
            return StatusCode(int.Parse(response.Status), response);
        }

        // Gợi ý: nên dùng BaseResponse thay vì bool để đồng bộ cách phản hồi
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStudent(int id, [FromBody] UpdateStudentRequest request)
        {
            var response = await _studentService.UpdateStudent(id, request);
            if (response == null || response.Data == null)
                return NotFound($"Không tìm thấy học sinh với ID {id} hoặc cập nhật thất bại.");

            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStudent([FromRoute] int id)
        {
            var response = await _studentService.DeleteStudent(id);
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }


        // ✅ Sửa lại dùng StatusCode như các hàm khác
        [HttpGet("by-parent/{parentId}")]
        public async Task<IActionResult> GetStudentsOfParent(Guid parentId)
        {
            var response = await _studentService.GetStudentsOfParent(parentId);
            return StatusCode(int.Parse(response.Status), response);
        }

        [HttpGet("by-class/{className}")]
        public async Task<IActionResult> GetStudentsByClass([FromRoute] string className)
        {
            var response = await _studentService.GetStudentsByClass(className);
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }
    }
}
