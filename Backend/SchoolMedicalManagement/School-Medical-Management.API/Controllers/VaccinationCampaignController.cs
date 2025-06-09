using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SchoolMedicalManagement.Models.Request;
using SchoolMedicalManagement.Service.Implement;
using SchoolMedicalManagement.Service.Interface;

namespace School_Medical_Management.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VaccinationCampaignController : ControllerBase
    {
        private readonly IVaccinationCampaignService _vaccinationCampaignService;

        public VaccinationCampaignController(IVaccinationCampaignService vaccinationCampaignService)
        {
            _vaccinationCampaignService = vaccinationCampaignService;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetVaccinationCampaignById(int id)
        {
            var vaccinationCampaign = await _vaccinationCampaignService.GetVaccinationCampaignAsync(id);
            return StatusCode(int.Parse(vaccinationCampaign.Status), vaccinationCampaign);
        }

        [HttpPost]
        public async Task<IActionResult> CreateVaccinationCampaign(CreateVaccinationCampaignRequest request)
        {
            var createdVaccinationCampaign = await _vaccinationCampaignService.CreateVaccinaCampaignAsync(request);
            return StatusCode(int.Parse(createdVaccinationCampaign.Status), createdVaccinationCampaign);
        }

    }
}
