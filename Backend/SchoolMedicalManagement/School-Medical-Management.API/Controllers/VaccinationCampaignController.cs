﻿using Microsoft.AspNetCore.Http;
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

        // Lấy danh sách yêu cầu đồng ý của một chiến dịch
        [HttpGet("campaigns/{id}/consent-requests")]
        public async Task<IActionResult> GetCampaignConsentRequests([FromRoute] int id)
        {
            var response = await _vaccinationCampaignService.GetCampaignConsentRequestsAsync(id);
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }

        // Lấy danh sách yêu cầu đã đồng ý
        [HttpGet("campaigns/{id}/approved-consents")]
        public async Task<IActionResult> GetApprovedConsentRequests([FromRoute] int id)
        {
            var response = await _vaccinationCampaignService.GetApprovedConsentRequestsAsync(id);
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }

        // Lấy danh sách yêu cầu từ chối
        [HttpGet("campaigns/{id}/declined-consents")]
        public async Task<IActionResult> GetDeclinedConsentRequests([FromRoute] int id)
        {
            var response = await _vaccinationCampaignService.GetDeclinedConsentRequestsAsync(id);
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }

        // Gửi phiếu đồng ý tiêm chủng cho phụ huynh
        [HttpPost("campaigns/{campaignId}/send-consent/{studentId}")]
        public async Task<IActionResult> SendConsentRequest([FromRoute] int campaignId, [FromRoute] int studentId, [FromQuery] Guid parentId)
        {
            var response = await _vaccinationCampaignService.SendConsentRequestAsync(campaignId, studentId, parentId);
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }

        // Gửi phiếu đồng ý theo lớp học
        [HttpPost("campaigns/{campaignId}/send-consent-by-class")]
        public async Task<IActionResult> SendConsentRequestsByClass([FromRoute] int campaignId, [FromBody] SendConsentByClassRequest request)
        {
            var response = await _vaccinationCampaignService.SendConsentRequestsByClassAsync(campaignId, request);
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }

        // Gửi phiếu đồng ý cho tất cả phụ huynh
        [HttpPost("campaigns/{campaignId}/send-consent-to-all-parents")]
        public async Task<IActionResult> SendConsentRequestsToAllParents([FromRoute] int campaignId)
        {
            var response = await _vaccinationCampaignService.SendConsentRequestsToAllParentsAsync(campaignId);
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }

        // Gửi phiếu đồng ý theo danh sách học sinh
        [HttpPost("campaigns/{campaignId}/send-consent-bulk")]
        public async Task<IActionResult> SendConsentRequestsBulk([FromRoute] int campaignId, [FromBody] SendConsentBulkRequest request)
        {
            var response = await _vaccinationCampaignService.SendConsentRequestsBulkAsync(campaignId, request);
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }

        // Cập nhật trạng thái đồng ý của phụ huynh
        [HttpPut("consent-requests/{id}")]
        public async Task<IActionResult> UpdateConsentRequest([FromRoute] int id, [FromBody] UpdateConsentRequestRequest request)
        {
            var response = await _vaccinationCampaignService.UpdateConsentRequestAsync(id, request);
            return StatusCode(int.Parse(response.Status ?? "200"), response);
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

        // Lấy phiếu đồng ý tiêm chủng theo requestId
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

    }
}
