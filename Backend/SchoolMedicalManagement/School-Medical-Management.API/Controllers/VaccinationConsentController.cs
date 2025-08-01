using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SchoolMedicalManagement.Models.Request;
using SchoolMedicalManagement.Service.Interface;
using System;
using System.Threading.Tasks;

namespace School_Medical_Management.API.Controllers
{
    // Controller xử lý các request API liên quan đến phiếu đồng ý tiêm chủng
    [Route("api/VaccinationCampaign")]
    [ApiController]
    public class VaccinationConsentController : ControllerBase
    {
        private readonly IVaccinationCampaignService _vaccinationCampaignService;

        public VaccinationConsentController(IVaccinationCampaignService vaccinationCampaignService)
        {
            _vaccinationCampaignService = vaccinationCampaignService;
        }

        // Lấy danh sách phiếu đồng ý của một chiến dịch
        [HttpGet("campaigns/{id}/consent-requests")]
        public async Task<IActionResult> GetCampaignConsentRequests([FromRoute] int id)
        {
            var response = await _vaccinationCampaignService.GetCampaignConsentRequestsAsync(id);
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }

        // Lấy danh sách phiếu đã được: đồng ý
        [HttpGet("campaigns/{id}/approved-consents")]
        public async Task<IActionResult> GetApprovedConsentRequests([FromRoute] int id)
        {
            var response = await _vaccinationCampaignService.GetApprovedConsentRequestsAsync(id);
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }

        // Lấy danh sách phiếu đã bị: từ chối
        [HttpGet("campaigns/{id}/declined-consents")]
        public async Task<IActionResult> GetDeclinedConsentRequests([FromRoute] int id)
        {
            var response = await _vaccinationCampaignService.GetDeclinedConsentRequestsAsync(id);
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }

        // Gửi phiếu đồng ý tiêm chủng cho phụ huynh theo 1 học sinh
        [HttpPost("campaigns/{campaignId}/send-consent/{studentId}")]
        public async Task<IActionResult> SendConsentRequest(
            [FromRoute] int campaignId,
            [FromRoute] int studentId,
            [FromQuery] Guid parentId,
            [FromQuery] int? autoDeclineAfterDays = null)
        {
            var response = await _vaccinationCampaignService.SendConsentRequestAsync(campaignId, studentId, parentId, autoDeclineAfterDays);
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }

        // Gửi phiếu đồng ý hàng loạt theo lớp học
        [HttpPost("campaigns/{campaignId}/send-consent-by-class")]
        public async Task<IActionResult> SendConsentRequestsByClass([FromRoute] int campaignId, [FromBody] SendConsentByClassRequest request)
        {
            var response = await _vaccinationCampaignService.SendConsentRequestsByClassAsync(campaignId, request);
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }

        // Gửi phiếu đồng ý hàng loạt cho tất cả phụ huynh toàn trường
        [HttpPost("campaigns/{campaignId}/send-consent-to-all-parents")]
        public async Task<IActionResult> SendConsentRequestsToAllParents([FromRoute] int campaignId, [FromQuery] int? autoDeclineAfterDays = null)
        {
            var response = await _vaccinationCampaignService.SendConsentRequestsToAllParentsAsync(campaignId, autoDeclineAfterDays);
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }

        // Gửi phiếu đồng ý hàng loạt theo danh sách học sinh
        [HttpPost("campaigns/{campaignId}/send-consent-bulk")]
        public async Task<IActionResult> SendConsentRequestsBulk([FromRoute] int campaignId, [FromBody] SendConsentBulkRequest request)
        {
            var response = await _vaccinationCampaignService.SendConsentRequestsBulkAsync(campaignId, request);
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }

        // Phụ huynh xác nhận đồng ý tiêm chủng
        [HttpPut("consent-requests/{id}")]
        public async Task<IActionResult> UpdateConsentRequest([FromRoute] int id, [FromBody] UpdateConsentRequestRequest request)
        {
            var response = await _vaccinationCampaignService.UpdateConsentRequestAsync(id, request);
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }

        // Lấy phiếu đồng ý tiêm chủng theo id của phiếu
        [HttpGet("consent-requests/{requestId}")]
        public async Task<IActionResult> GetConsentRequestById([FromRoute] int requestId)
        {
            var response = await _vaccinationCampaignService.GetConsentRequestByIdAsync(requestId);
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }

        // Lấy tất cả phiếu đồng ý tiêm chủng của một học sinh
        [HttpGet("consent-requests/student/{studentId}")]
        public async Task<IActionResult> GetConsentRequestsByStudentId([FromRoute] int studentId)
        {
            var response = await _vaccinationCampaignService.GetConsentRequestsByStudentIdAsync(studentId);
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }

        // Gửi lại phiếu đồng ý
        [HttpPost("consent-requests/{requestId}/resend")]
        public async Task<IActionResult> ResendConsentRequest([FromRoute] int requestId, [FromQuery] int? autoDeclineAfterDays = null)
        {
            var response = await _vaccinationCampaignService.ResendConsentRequestAsync(requestId, autoDeclineAfterDays);
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }

        // Lấy danh sách phiếu đồng ý đang chờ
        [HttpGet("campaigns/{id}/pending-consents")]
        public async Task<IActionResult> GetPendingConsentRequests([FromRoute] int id)
        {
            var response = await _vaccinationCampaignService.GetPendingConsentRequestsAsync(id);
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }
    }
} 