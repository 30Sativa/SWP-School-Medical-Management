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
    public class VaccinationRecordController : ControllerBase
    {
        private readonly IVaccinationCampaignService _vaccinationCampaignService;

        public VaccinationRecordController(IVaccinationCampaignService vaccinationCampaignService)
        {
            _vaccinationCampaignService = vaccinationCampaignService;
        }

        // Lấy lịch sử tiêm chủng của một học sinh
        [HttpGet("records/student/{studentId}")]
        public async Task<IActionResult> GetStudentVaccinationRecords([FromRoute] int studentId)
        {
            var response = await _vaccinationCampaignService.GetStudentVaccinationRecordsAsync(studentId);
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }

        // Ghi nhận kết quả tiêm chủng cho học sinh
        [HttpPost("records")]
        public async Task<IActionResult> CreateVaccinationRecord([FromBody] CreateVaccinationRecordRequest request)
        {
            var response = await _vaccinationCampaignService.CreateVaccinationRecordAsync(request);
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }

        // Cập nhật bản ghi tiêm chủng
        [HttpPut("records/{recordId}")]
        public async Task<IActionResult> UpdateVaccinationRecord([FromRoute] int recordId, [FromBody] UpdateVaccinationRecordRequest request)
        {
            request.RecordId = recordId;
            var response = await _vaccinationCampaignService.UpdateVaccinationRecordAsync(request);
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }

        // Lấy danh sách bản ghi tiêm chủng theo chiến dịch
        [HttpGet("records/campaign/{campaignId}")]
        public async Task<IActionResult> GetVaccinationRecordsByCampaign([FromRoute] int campaignId)
        {
            var response = await _vaccinationCampaignService.GetVaccinationRecordsByCampaignAsync(campaignId);
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }
    }
} 