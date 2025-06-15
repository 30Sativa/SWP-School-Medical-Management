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

        // ✅ 1. Lấy danh sách đơn thuốc đang chờ duyệt
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

        // ✅ 2. Xử lý đơn thuốc (duyệt hoặc từ chối)
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
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error handling request: {ex.Message}");
            }
        }

        // ✅ 3. Tạo đơn thuốc mới (cho phép upload ảnh đơn thuốc)
        [HttpPost("create")]
        public async Task<IActionResult> CreateMedicationRequest([FromForm] CreateMedicationRequest request, [FromQuery] Guid parentId)
        {
            if (request == null || request.StudentID <= 0 ||
                string.IsNullOrWhiteSpace(request.MedicationName) ||
                string.IsNullOrWhiteSpace(request.Dosage) ||
                string.IsNullOrWhiteSpace(request.Instructions))
            {
                return BadRequest("Invalid medication request data.");
            }

            try
            {
                // ✅ Xử lý lưu ảnh nếu có
                string? imagePath = null;
                if (request.ImageFile != null && request.ImageFile.Length > 0)
                {
                    var fileName = Guid.NewGuid() + Path.GetExtension(request.ImageFile.FileName);
                    var savePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "medication", fileName);

                    // Đảm bảo thư mục tồn tại
                    Directory.CreateDirectory(Path.GetDirectoryName(savePath)!);

                    using (var stream = new FileStream(savePath, FileMode.Create))
                    {
                        await request.ImageFile.CopyToAsync(stream);
                    }

                    // Gán đường dẫn để lưu trong DB
                    imagePath = $"/uploads/medication/{fileName}";
                }

                var response = await _medicationRequestService.CreateMedicationRequestAsync(request, parentId, imagePath);

                return response.Status == StatusCodes.Status200OK.ToString()
                    ? Ok(response)
                    : BadRequest(response);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error creating request: {ex.Message}");
            }
        }
    }
}
