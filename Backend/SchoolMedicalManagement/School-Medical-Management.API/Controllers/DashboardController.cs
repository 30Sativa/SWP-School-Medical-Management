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
    }
} 