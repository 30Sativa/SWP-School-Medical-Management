using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SchoolMedicalManagement.Models.Request;
using SchoolMedicalManagement.Service.Interface;
using System.Threading.Tasks;

namespace School_Medical_Management.API.Controllers
{
    [Route("api/health-profiles")]
    [ApiController]
    [Authorize] // Default authorization for all endpoints
    public class HealthProfileController : ControllerBase
    {
        private readonly IHealthProfileService _healthProfileService;

        public HealthProfileController(IHealthProfileService healthProfileService)
        {
            _healthProfileService = healthProfileService;
        }

        // ✅ Lấy danh sách hồ sơ sức khỏe (chỉ IsActive = true) - Y tá và quản lý có quyền xem
        [Authorize(Roles = "Nurse,Manager")]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var response = await _healthProfileService.GetAllHealthProfilesAsync();
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }

        // ✅ Lấy danh sách tất cả hồ sơ sức khỏe (bao gồm cả IsActive = false) - Chỉ quản lý mới có quyền xem
        [Authorize(Roles = "Manager")]
        [HttpGet("include-inactive")]
        public async Task<IActionResult> GetAllIncludeInactive()
        {
            var response = await _healthProfileService.GetAllHealthProfilesIncludeInactiveAsync();
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }

        // ✅ Lấy chi tiết theo ID - Y tá, quản lý và phụ huynh có quyền xem
        [Authorize(Roles = "Nurse,Manager,Parent")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            var response = await _healthProfileService.GetHealthProfileByIdAsync(id);
            if (response == null || response.Data == null)
                return NotFound($"Không tìm thấy hồ sơ sức khỏe với ID {id}.");

            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }

        // ✅ Tạo mới hồ sơ - Chỉ y tá và quản lý mới có quyền tạo
        [Authorize(Roles = "Nurse,Manager")]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateHealthProfileRequest request)
        {
            var response = await _healthProfileService.CreateHealthProfileAsync(request);
            return StatusCode(int.Parse(response?.Status ?? "200"), response);
        }

        // ✅ Cập nhật hồ sơ - Chỉ y tá và quản lý mới có quyền cập nhật
        [Authorize(Roles = "Nurse,Manager")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update([FromRoute] int id, [FromBody] UpdateHealthProfileRequest request)
        {
            var response = await _healthProfileService.UpdateHealthProfileAsync(id, request);
            if (response == null || response.Data == null)
                return NotFound($"Không tìm thấy hồ sơ sức khỏe với ID {id} hoặc cập nhật thất bại.");

            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }

        // ✅ Cập nhật trạng thái IsActive của hồ sơ sức khỏe - Chỉ quản lý mới có quyền cập nhật trạng thái
        [Authorize(Roles = "Manager")]
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateStatus([FromRoute] int id, [FromBody] UpdateHealthProfileStatusRequest request)
        {
            var response = await _healthProfileService.UpdateHealthProfileStatusAsync(id, request);
            if (response == null || response.Data == null)
                return NotFound($"Không tìm thấy hồ sơ sức khỏe với ID {id} hoặc cập nhật trạng thái thất bại.");

            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }

        // Hồ sơ không nên được xóa
        //[HttpDelete("{id}")]
        //public async Task<IActionResult> Delete([FromRoute] int id)
        //{
        //    var deleted = await _healthProfileService.DeleteHealthProfileAsync(id);
        //    return deleted
        //        ? Ok($"Deleted Health Profile with ID: {id} successfully.")
        //        : NotFound($"Health profile with ID {id} not found or could not be deleted.");
        //}

        // ✅ Lấy hồ sơ sức khỏe của học sinh - Y tá, quản lý và phụ huynh có quyền xem
        [Authorize(Roles = "Nurse,Manager,Parent")]
        [HttpGet("student/{studentId}")]
        public async Task<IActionResult> GetHealthProfileByStudentId([FromRoute] int studentId)
        {
            var response = await _healthProfileService.GetHealthProfileByStudentIdAsync(studentId);
            if (response == null || response.Data == null)
                return NotFound(response?.Message ?? $"Không tìm thấy hồ sơ sức khỏe cho học sinh với ID {studentId}.");

            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }

        // ✅ Cập nhật hồ sơ sức khỏe của học sinh - Chỉ y tá và quản lý mới có quyền cập nhật
        [Authorize(Roles = "Nurse,Manager")]
        [HttpPut("student/{studentId}")]
        public async Task<IActionResult> UpdateHealthProfileByStudentId([FromRoute] int studentId, [FromBody] UpdateHealthProfileRequest request)
        {
            var response = await _healthProfileService.UpdateHealthProfileByStudentIdAsync(studentId, request);
            if (response == null || response.Data == null)
                return NotFound(response?.Message ?? $"Không tìm thấy hồ sơ sức khỏe cho học sinh với ID {studentId} hoặc cập nhật thất bại.");

            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }
    }
}
