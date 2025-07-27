using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SchoolMedicalManagement.Models.Request;
using SchoolMedicalManagement.Service.Interface;
using System.Threading.Tasks;

namespace School_Medical_Management.API.Controllers
{
    // Controller xử lý các request API liên quan đến bản ghi tiêm chủng
    [Route("api/VaccinationCampaign")]
    [ApiController]
    [Authorize] // Default authorization for all endpoints
    public class VaccinationRecordController : ControllerBase
    {
        private readonly IVaccinationCampaignService _vaccinationCampaignService;

        public VaccinationRecordController(IVaccinationCampaignService vaccinationCampaignService)
        {
            _vaccinationCampaignService = vaccinationCampaignService;
        }

        // Lấy lịch sử tiêm chủng của một học sinh - Y tá, quản lý và phụ huynh có quyền xem
        [Authorize(Roles = "Manager,Nurse,Parent")]
        [HttpGet("records/student/{studentId}")]
        public async Task<IActionResult> GetStudentVaccinationRecords([FromRoute] int studentId)
        {
            var response = await _vaccinationCampaignService.GetStudentVaccinationRecordsAsync(studentId);
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }

        // Ghi nhận kết quả tiêm chủng cho học sinh - Chỉ y tá và quản lý mới có quyền ghi nhận
        [Authorize(Roles = "Manager,Nurse")]
        [HttpPost("records")]
        public async Task<IActionResult> CreateVaccinationRecord([FromBody] CreateVaccinationRecordRequest request)
        {
            var response = await _vaccinationCampaignService.CreateVaccinationRecordAsync(request);
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }

        // Cập nhật bản ghi tiêm chủng - Chỉ y tá và quản lý mới có quyền cập nhật
        [Authorize(Roles = "Manager,Nurse")]
        [HttpPut("records/{recordId}")]
        public async Task<IActionResult> UpdateVaccinationRecord([FromRoute] int recordId, [FromBody] UpdateVaccinationRecordRequest request)
        {
            request.RecordId = recordId;
            var response = await _vaccinationCampaignService.UpdateVaccinationRecordAsync(request);
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }

        // Lấy danh sách bản ghi tiêm chủng theo chiến dịch - Chỉ y tá và quản lý mới có quyền xem
        [Authorize(Roles = "Manager,Nurse")]
        [HttpGet("records/campaign/{campaignId}")]
        public async Task<IActionResult> GetVaccinationRecordsByCampaign([FromRoute] int campaignId)
        {
            var response = await _vaccinationCampaignService.GetVaccinationRecordsByCampaignAsync(campaignId);
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }
    }
} 