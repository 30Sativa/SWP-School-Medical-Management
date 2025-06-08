using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SchoolMedicalManagement.Models.Request;
using SchoolMedicalManagement.Service.Interface;
using System.Threading.Tasks;

namespace School_Medical_Management.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HealthCheckSummaryController : ControllerBase
    {
        private readonly IHealthCheckSummaryService _healthCheckSummaryService;

        public HealthCheckSummaryController(IHealthCheckSummaryService healthCheckSummaryService)
        {
            _healthCheckSummaryService = healthCheckSummaryService;
        }

        [HttpGet]
        public async Task<IActionResult> GetHealthCheckSummaryList()
        {
            var responses = await _healthCheckSummaryService.GetAllHealthCheckSummariesAsync();
            if (responses == null || responses.Count == 0)
            {
                return NotFound("Health check summary list is empty!");
            }
            return Ok(responses);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetHealthCheckSummaryById([FromRoute] int id)
        {
            var response = await _healthCheckSummaryService.GetHealthCheckSummaryByIdAsync(id);
            if (response == null)
            {
                return NotFound($"Health check summary with ID {id} not found.");
            }
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }

        [HttpPost]
        public async Task<IActionResult> CreateHealthCheckSummary([FromBody] CreateHealthCheckSummaryRequest request)
        {
            var response = await _healthCheckSummaryService.CreateHealthCheckSummaryAsync(request);
            return StatusCode(int.Parse(response?.Status ?? "200"), response);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateHealthCheckSummary([FromRoute] int id, [FromBody] UpdateHealthCheckSummaryRequest request)
        {
            var response = await _healthCheckSummaryService.UpdateHealthCheckSummaryAsync(id, request);
            if (response == null)
            {
                return NotFound($"Health check summary with ID {id} not found or could not be updated.");
            }
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteHealthCheckSummary([FromRoute] int id)
        {
            var result = await _healthCheckSummaryService.DeleteHealthCheckSummaryAsync(id);
            if (!result)
            {
                return NotFound($"Health check summary with ID {id} not found or could not be deleted.");
            }
            return Ok($"Delete Health check summary with ID: {id} successfully");
        }
    }
} 