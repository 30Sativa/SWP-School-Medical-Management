using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SchoolMedicalManagement.Service.Interface;
using System;
using System.Threading.Tasks;

namespace School_Medical_Management.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize(Roles = "Admin,Nurse")]
    public class DashboardController : ControllerBase
    {
        private readonly IDashboardService _dashboardService;

        public DashboardController(IDashboardService dashboardService)
        {
            _dashboardService = dashboardService;
        }

        [HttpGet("overview")]
        public async Task<IActionResult> GetDashboardOverview()
        {
            var response = await _dashboardService.GetDashboardOverviewAsync();
            return StatusCode(int.Parse(response?.Status ?? "200"), response);
        }

        [HttpGet("vaccination-campaigns/statistics")]
        public async Task<IActionResult> GetVaccinationCampaignStatistics()
        {
            var response = await _dashboardService.GetVaccinationCampaignStatisticsAsync();
            return StatusCode(int.Parse(response?.Status ?? "200"), response);
        }

        // API: Thống kê sức khỏe học sinh
        [HttpGet("health-statistics")]
        public async Task<IActionResult> GetHealthStatistics()
        {
            var response = await _dashboardService.GetHealthStatisticsAsync();
            return StatusCode(int.Parse(response?.Status ?? "200"), response);
        }

        // API: Thống kê sự kiện y tế
        [HttpGet("medical-events-statistics")]
        public async Task<IActionResult> GetMedicalEventsStatistics()
        {
            var response = await _dashboardService.GetMedicalEventsStatisticsAsync();
            return StatusCode(int.Parse(response?.Status ?? "200"), response);
        }

        // API: Thống kê dùng thuốc
        [HttpGet("medication-statistics")]
        public async Task<IActionResult> GetMedicationStatistics()
        {
            var response = await _dashboardService.GetMedicationStatisticsAsync();
            return StatusCode(int.Parse(response?.Status ?? "200"), response);
        }

        // API: Dashboard cho phụ huynh
        [HttpGet("parent/{parentId}")]
        //[Authorize(Roles = "Parent")]
        public async Task<IActionResult> GetParentDashboardOverview([FromRoute] Guid parentId)
        {
            var response = await _dashboardService.GetParentDashboardOverviewAsync(parentId);
            return StatusCode(int.Parse(response?.Status ?? "200"), response);
        }
    }
}