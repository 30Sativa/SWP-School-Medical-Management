using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SchoolMedicalManagement.Models.Request;
using SchoolMedicalManagement.Service.Interface;

namespace School_Medical_Management.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MedicalEventController : ControllerBase
    {
        private readonly IMedicalEventService _medicalEventService;
        public MedicalEventController(IMedicalEventService medicalEventService)
        {
            _medicalEventService = medicalEventService;
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> GetMedicalEventByIdAsync([FromRoute] int id)
        {
            var result = await _medicalEventService.GetMedicalEventByIdAsync(id);
            return StatusCode(int.Parse(result.Status), result);
        }

        [HttpPost]
        public async Task<IActionResult> CreateMedicalEventAsync([FromBody] ManageMedicalEventRequest request)
        {
            var response = await _medicalEventService.CreateMedicalEventAsync(request);
            return StatusCode(int.Parse(response.Status), response);
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMedicalEventAsync([FromRoute] int id, [FromBody] ManageMedicalEventRequest request)
        {
            var response = await _medicalEventService.UpdateMedicalEventAsync(id, request);
            return StatusCode(int.Parse(response.Status), response);
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMedicalEventAsync(int id)
        {
            var result = await _medicalEventService.DeleteMedicalEventAsync(id);
            if (!result)
            {
                return NotFound($"Medical event with ID {id} not found or could not be deleted.");
            }
            return Ok($"Deleted Medical Event with ID: {id} successfully");
        }
        [HttpGet]
        public async Task<IActionResult> GetAllMedicalEventsAsync()
        {
            var response = await _medicalEventService.GetAllMedicalEventsAsync();
            if (response == null || !response.Any())
            {
                return NotFound("No medical events found.");
            }
            return Ok(response);
        }
    }
}