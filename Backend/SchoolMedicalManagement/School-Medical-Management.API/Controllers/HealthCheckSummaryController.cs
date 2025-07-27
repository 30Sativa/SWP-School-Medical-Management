using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SchoolMedicalManagement.Models.Request;
using SchoolMedicalManagement.Service.Interface;
using System.Threading.Tasks;

namespace School_Medical_Management.API.Controllers
{
    [Route("api/health-checks/summaries")]
    [ApiController]
    [Authorize] // Default authorization for all endpoints
    public class HealthCheckSummaryController : ControllerBase
    {
        private readonly IHealthCheckSummaryService _healthCheckSummaryService;

        public HealthCheckSummaryController(IHealthCheckSummaryService healthCheckSummaryService)
        {
            _healthCheckSummaryService = healthCheckSummaryService;
        }

        // Lấy danh sách tổng hợp khám sức khỏe - Chỉ quản lý và y tá mới có quyền xem
        [Authorize(Roles = "Manager,Nurse")]
        [HttpGet]
        public async Task<IActionResult> GetHealthCheckSummaryList()
        {
            var response = await _healthCheckSummaryService.GetAllHealthCheckSummariesAsync();
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }

        // Lấy chi tiết tổng hợp khám sức khỏe theo ID - Tất cả người dùng đã đăng nhập đều có quyền xem
        [HttpGet("{id}")]
        public async Task<IActionResult> GetHealthCheckSummaryById([FromRoute] int id)
        {
            var response = await _healthCheckSummaryService.GetHealthCheckSummaryByIdAsync(id);
            if (response == null)
            {
                return NotFound($"Không tìm thấy tổng hợp khám sức khỏe với ID {id}.");
            }
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }

        // Tạo tổng hợp khám sức khỏe mới - Chỉ quản lý và y tá mới có quyền tạo
        [Authorize(Roles = "Manager,Nurse")]
        [HttpPost]
        public async Task<IActionResult> CreateHealthCheckSummary([FromBody] CreateHealthCheckSummaryRequest request)
        {
            var response = await _healthCheckSummaryService.CreateHealthCheckSummaryAsync(request);
            return StatusCode(int.Parse(response?.Status ?? "200"), response);
        }

        // Cập nhật tổng hợp khám sức khỏe - Chỉ quản lý và y tá mới có quyền cập nhật
        [Authorize(Roles = "Manager,Nurse")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateHealthCheckSummary([FromRoute] int id, [FromBody] UpdateHealthCheckSummaryRequest request)
        {
            var response = await _healthCheckSummaryService.UpdateHealthCheckSummaryAsync(id, request);
            if (response == null)
            {
                return NotFound($"Không tìm thấy tổng hợp khám sức khỏe với ID {id} hoặc không thể cập nhật.");
            }
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }

        // Xóa tổng hợp khám sức khỏe - Chỉ quản lý mới có quyền xóa
        [Authorize(Roles = "Manager")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteHealthCheckSummary([FromRoute] int id)
        {
            var response = await _healthCheckSummaryService.DeleteHealthCheckSummaryAsync(id);
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }

        // Lấy tổng hợp khám sức khỏe theo ID học sinh - Tất cả người dùng đã đăng nhập đều có quyền xem
        [HttpGet("student/{studentId}")]
        public async Task<IActionResult> GetHealthCheckSummariesByStudentId([FromRoute] int studentId)
        {
            var response = await _healthCheckSummaryService.GetHealthCheckSummariesByStudentIdAsync(studentId);
            if (response == null || response.Data == null)
            {
                return NotFound(response?.Message ?? $"Không tìm thấy tổng hợp khám sức khỏe cho học sinh với ID {studentId}.");
            }
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }
    }
}
