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
            var responses = await _healthCheckCampaignService.GetAllHealthCheckCampaignsAsync();
            if (responses == null || responses.Count == 0)
            {
                return NotFound("Health check campaign list is empty!");
            }
            return Ok(responses);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetHealthCheckCampaignById([FromRoute] int id)
        {
            var response = await _healthCheckCampaignService.GetHealthCheckCampaignByIdAsync(id);
            if (response == null)
            {
                return NotFound($"Health check campaign with ID {id} not found.");
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
                return NotFound($"Health check campaign with ID {id} not found or could not be updated.");
            }
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteHealthCheckCampaign([FromRoute] int id)
        {
            var result = await _healthCheckCampaignService.DeleteHealthCheckCampaignAsync(id);
            if (!result)
            {
                return NotFound($"Health check campaign with ID {id} not found or could not be deleted.");
            }
            return Ok($"Delete Health check campaign with ID: {id} successfully");
        }
    }
}
