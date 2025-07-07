using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SchoolMedicalManagement.Models.Request;
using SchoolMedicalManagement.Service.Interface;
using System.Threading.Tasks;

namespace School_Medical_Management.API.Controllers
{
    [Route("api/health-checks/summaries")]
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
            var response = await _healthCheckSummaryService.GetAllHealthCheckSummariesAsync();
            return StatusCode(int.Parse(response.Status ?? "200"), response);
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

        [HttpGet("student/{studentId}")]
        public async Task<IActionResult> GetHealthCheckSummariesByStudentId([FromRoute] int studentId)
        {
            var response = await _healthCheckSummaryService.GetHealthCheckSummariesByStudentIdAsync(studentId);
            if (response == null || response.Data == null)
            {
                return NotFound(response?.Message ?? $"No health check summaries found for student with ID {studentId}.");
            }
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }
    }
}
