using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SchoolMedicalManagement.Models.Request;
using SchoolMedicalManagement.Service.Interface;
using System.Threading.Tasks;

namespace School_Medical_Management.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HealthCheckCampaignController : ControllerBase
    {
        private readonly IHealthCheckCampaignService _healthCheckCampaignService;

        public HealthCheckCampaignController(IHealthCheckCampaignService healthCheckCampaignService)
        {
            _healthCheckCampaignService = healthCheckCampaignService;
        }

        [HttpGet]
        public async Task<IActionResult> GetHealthCheckCampaignList()
        {
            var response = await _healthCheckCampaignService.GetAllHealthCheckCampaignsAsync();
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }

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

        [HttpPost]
        public async Task<IActionResult> CreateHealthCheckCampaign([FromBody] CreateHealthCheckCampaignRequest request)
        {
            var response = await _healthCheckCampaignService.CreateHealthCheckCampaignAsync(request);
            return StatusCode(int.Parse(response?.Status ?? "200"), response);
        }

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

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteHealthCheckCampaign([FromRoute] int id)
        {
            var result = await _healthCheckCampaignService.DeleteHealthCheckCampaignAsync(id);
            if (!result)
            {
                return NotFound($"Không tìm thấy chiến dịch khám sức khỏe với ID {id} hoặc không thể xóa.");
            }
            return Ok($"Xóa chiến dịch khám sức khỏe với ID: {id} thành công");
        }

        [HttpGet("status/{statusId}")]
        public async Task<IActionResult> GetHealthCheckCampaignsByStatus([FromRoute] int statusId)
        {
            var response = await _healthCheckCampaignService.GetHealthCheckCampaignsByStatusAsync(statusId);
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }
    }
}
