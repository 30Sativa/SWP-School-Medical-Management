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
    public class HealthCheckCampaignController : ControllerBase
    {
        private readonly IHealthCheckCampaignService _healthCheckCampaignService;

        public HealthCheckCampaignController(IHealthCheckCampaignService healthCheckCampaignService)
        {
            _healthCheckCampaignService = healthCheckCampaignService;
        }

        // Lấy danh sách chiến dịch khám sức khỏe - Tất cả người dùng đã đăng nhập đều có quyền xem
        [HttpGet]
        public async Task<IActionResult> GetHealthCheckCampaignList()
        {
            var response = await _healthCheckCampaignService.GetAllHealthCheckCampaignsAsync();
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }

        // Lấy chi tiết chiến dịch khám sức khỏe theo ID - Tất cả người dùng đã đăng nhập đều có quyền xem
        [HttpGet("{id}")]
        public async Task<IActionResult> GetHealthCheckCampaignById([FromRoute] int id)
        {
            var response = await _healthCheckCampaignService.GetHealthCheckCampaignByIdAsync(id);
            if (response == null)
            {
                return NotFound($"Không tìm thấy chiến dịch khám sức khỏe với ID {id}.");
            }
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }

        // Tạo chiến dịch khám sức khỏe mới - Chỉ quản lý và y tá mới có quyền tạo
        [Authorize(Roles = "Manager,Nurse")]
        [HttpPost]
        public async Task<IActionResult> CreateHealthCheckCampaign([FromBody] CreateHealthCheckCampaignRequest request)
        {
            var response = await _healthCheckCampaignService.CreateHealthCheckCampaignAsync(request);
            return StatusCode(int.Parse(response?.Status ?? "200"), response);
        }

        // Cập nhật chiến dịch khám sức khỏe - Chỉ quản lý và y tá mới có quyền cập nhật
        [Authorize(Roles = "Manager,Nurse")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateHealthCheckCampaign([FromRoute] int id, [FromBody] UpdateHealthCheckCampaignRequest request)
        {
            var response = await _healthCheckCampaignService.UpdateHealthCheckCampaignAsync(id, request);
            if (response == null)
            {
                return NotFound($"Không tìm thấy chiến dịch khám sức khỏe với ID {id} hoặc không thể cập nhật.");
            }
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }

        // Xóa chiến dịch khám sức khỏe - Chỉ quản lý mới có quyền xóa
        [Authorize(Roles = "Manager")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteHealthCheckCampaign([FromRoute] int id)
        {
            var response = await _healthCheckCampaignService.DeleteHealthCheckCampaignAsync(id);
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }

        // Lấy danh sách chiến dịch khám sức khỏe theo trạng thái - Chỉ quản lý và y tá mới có quyền xem
        [Authorize(Roles = "Manager,Nurse")]
        [HttpGet("status/{statusId}")]
        public async Task<IActionResult> GetHealthCheckCampaignsByStatus([FromRoute] int statusId)
        {
            var response = await _healthCheckCampaignService.GetHealthCheckCampaignsByStatusAsync(statusId);
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }
    }
}
