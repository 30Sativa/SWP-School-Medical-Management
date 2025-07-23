using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SchoolMedicalManagement.Models.Request;
using SchoolMedicalManagement.Models.Response;
using SchoolMedicalManagement.Service.Interface;
using System;
using System.Threading.Tasks;

namespace School_Medical_Management.API.Controllers
{
    // Controller xử lý các request API liên quan đến chiến dịch tiêm chủng
    [Route("api/[controller]")]
    [ApiController]
    public class VaccinationCampaignController : ControllerBase
    {
        private readonly IVaccinationCampaignService _vaccinationCampaignService;

        public VaccinationCampaignController(IVaccinationCampaignService vaccinationCampaignService)
        {
            _vaccinationCampaignService = vaccinationCampaignService;
        }

        // Lấy danh sách tất cả chiến dịch tiêm chủng
        [HttpGet("campaigns")]
        public async Task<IActionResult> GetVaccinationCampaigns()
        {
            var response = await _vaccinationCampaignService.GetVaccinationCampaignsAsync();
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }

        // Lấy danh sách chiến dịch tiêm chủng đang hoạt động
        [HttpGet("campaigns/active")]
        public async Task<IActionResult> GetActiveVaccinationCampaigns()
        {
            var response = await _vaccinationCampaignService.GetActiveVaccinationCampaignsAsync();
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }

        // Lấy danh sách chiến dịch tiêm chủng theo trạng thái
        [HttpGet("campaigns/status/{statusId}")]
        public async Task<IActionResult> GetVaccinationCampaignsByStatus([FromRoute] int statusId)
        {
            var response = await _vaccinationCampaignService.GetVaccinationCampaignsByStatusAsync(statusId);
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }

        // Lấy thông tin chi tiết một chiến dịch tiêm chủng
        [HttpGet("campaigns/{id}")]
        public async Task<IActionResult> GetVaccinationCampaign([FromRoute] int id)
        {
            var response = await _vaccinationCampaignService.GetVaccinationCampaignAsync(id);
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }

        // Tạo mới một chiến dịch tiêm chủng
        [HttpPost("campaigns")]
        public async Task<IActionResult> CreateVaccinationCampaign([FromBody] CreateVaccinationCampaignRequest request)
        {
            var response = await _vaccinationCampaignService.CreateVaccinationCampaignAsync(request);
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }

        // Cập nhật một chiến dịch tiêm chủng
        [HttpPut("campaigns")]
        public async Task<IActionResult> UpdateVaccinationCampaign([FromBody] UpdateVaccinationCampaignRequest request)
        {
            var response = await _vaccinationCampaignService.UpdateVaccinationCampaignAsync(request);
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }

        // Vô hiệu hóa một chiến dịch tiêm chủng
        [HttpPut("campaigns/{id}/deactivate")]
        public async Task<IActionResult> DeactivateVaccinationCampaign([FromRoute] int id)
        {
            var response = await _vaccinationCampaignService.DeactivateVaccinationCampaignAsync(id);
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }

        // Kích hoạt lại một chiến dịch tiêm chủng
        [HttpPut("campaigns/{id}/activate")]
        public async Task<IActionResult> ActivateVaccinationCampaign([FromRoute] int id)
        {
            var response = await _vaccinationCampaignService.ActivateVaccinationCampaignAsync(id);
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }

        // Lấy danh sách chiến dịch theo người tạo
        [HttpGet("campaigns/creator/{creatorId}")]
        public async Task<IActionResult> GetCampaignsByCreator([FromRoute] Guid creatorId)
        {
            var response = await _vaccinationCampaignService.GetCampaignsByCreatorAsync(creatorId);
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }

        // Kiểm tra trạng thái chiến dịch
        [HttpGet("campaigns/{id}/status")]
        public async Task<IActionResult> CheckCampaignStatus([FromRoute] int id)
        {
            var response = await _vaccinationCampaignService.CheckCampaignStatusAsync(id);
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }

        // Lấy tóm tắt thống kê chiến dịch
        [HttpGet("campaigns/{id}/summary")]
        public async Task<IActionResult> GetCampaignSummary([FromRoute] int id)
        {
            var response = await _vaccinationCampaignService.GetCampaignSummaryAsync(id);
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }
    }
}
