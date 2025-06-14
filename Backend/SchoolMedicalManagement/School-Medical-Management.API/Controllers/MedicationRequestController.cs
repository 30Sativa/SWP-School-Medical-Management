using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SchoolMedicalManagement.Models.Request;
using SchoolMedicalManagement.Service.Interface;

namespace School_Medical_Management.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MedicationRequestController : ControllerBase
    {
        private readonly IMedicationRequestService _medicationRequestService;

        public MedicationRequestController(IMedicationRequestService medicationRequestService)
        {
            _medicationRequestService = medicationRequestService;
        }


        // ✅ Lấy danh sách đơn thuốc đang chờ duyệt
        [HttpGet("pending")]
        public async Task<IActionResult> GetPendingRequests()
        {
            try
            {
                var requests = await _medicationRequestService.GetPendingRequestsAsync();
                return Ok(requests);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error retrieving requests: {ex.Message}");
            }
        }
        // ✅ Xử lý đơn thuốc (duyệt hoặc từ chối)
        [HttpPost("handle")]
        public async Task<IActionResult> HandleMedicationRequest([FromBody] UpdateMedicationRequestStatus request)
        {
            if (request == null || request.RequestID <= 0 || (request.StatusID != 2 && request.StatusID != 3) || request.NurseID == Guid.Empty)
            {
                return BadRequest("Invalid request data.");
            }
            try
            {
                var result = await _medicationRequestService.HandleMedicationRequest(request);
                if (result != null)
                {
                    return Ok("Request handled successfully.");
                }
                else
                {
                    return NotFound("Request not found or could not be updated.");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error handling request: {ex.Message}");
            }
        }

        // ✅ Tạo đơn thuốc mới
        [HttpPost("create")]
        public async Task<IActionResult> CreateMedicationRequest([FromBody] CreateMedicationRequest request, [FromQuery] Guid parentId)
        {
            if (request == null || request.StudentID <= 0 || string.IsNullOrWhiteSpace(request.MedicationName) || string.IsNullOrWhiteSpace(request.Dosage) || string.IsNullOrWhiteSpace(request.Instructions))
            {
                return BadRequest("Invalid request data.");
            }
            try
            {
                var response = await _medicationRequestService.CreateMedicationRequestAsync(request, parentId);
                if (response.Status == StatusCodes.Status201Created.ToString())
                {
                    return CreatedAtAction(nameof(GetPendingRequests), new { id = response.Data }, response.Data);
                }
                return BadRequest(response.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error creating request: {ex.Message}");
            }
        }
    }
}
