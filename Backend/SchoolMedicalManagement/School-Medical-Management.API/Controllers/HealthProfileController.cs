using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SchoolMedicalManagement.Models.Request;
using SchoolMedicalManagement.Service.Interface;
using System.Threading.Tasks;

namespace School_Medical_Management.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HealthProfileController : ControllerBase
    {
        private readonly IHealthProfileService _healthProfileService;

        public HealthProfileController(IHealthProfileService healthProfileService)
        {
            _healthProfileService = healthProfileService;
        }

        [HttpGet]
        public async Task<IActionResult> GetHealthProfileList()
        {
            var responses = await _healthProfileService.GetAllHealthProfilesAsync();
            if (responses == null || responses.Count == 0)
            {
                return NotFound("Health profile list is empty!");
            }
            return Ok(responses);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetHealthProfileById([FromRoute] int id)
        {
            var response = await _healthProfileService.GetHealthProfileByIdAsync(id);
            if (response == null)
            {
                return NotFound($"Health profile with ID {id} not found.");
            }
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }

        [HttpPost]
        public async Task<IActionResult> CreateHealthProfile([FromBody] CreateHealthProfileRequest request)
        {
            var response = await _healthProfileService.CreateHealthProfileAsync(request);
            return StatusCode(int.Parse(response?.Status ?? "200"), response);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateHealthProfile([FromRoute] int id, [FromBody] UpdateHealthProfileRequest request)
        {
            var response = await _healthProfileService.UpdateHealthProfileAsync(id, request);
            if (response == null)
            {
                return NotFound($"Health profile with ID {id} not found or could not be updated.");
            }
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteHealthProfile([FromRoute] int id)
        {
            var result = await _healthProfileService.DeleteHealthProfileAsync(id);
            if (!result)
            {
                return NotFound($"Health profile with ID {id} not found or could not be deleted.");
            }
            return Ok($"Delete Health profile with ID: {id} successfully");
        }
    }
}
