using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SchoolMedicalManagement.Models.Request;
using SchoolMedicalManagement.Service.Interface;

namespace School_Medical_Management.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MedicalSuppliesController : ControllerBase
    {
        private readonly IMedicalSupplyService _medicalSupplyService;
        public MedicalSuppliesController(IMedicalSupplyService medicalSupplyService)
        {
            _medicalSupplyService = medicalSupplyService;
        }


        [HttpGet]
        public async Task<IActionResult> GetAllSupplies()
        {
            var supplies = await _medicalSupplyService.GetAllSuppliesAsync();
            return Ok(supplies);
        }
        [HttpPost]
        public async Task<IActionResult> CreateSupply([FromBody] CreateMedicalSupplyRequest request)
        {
            var repsone = await _medicalSupplyService.AddSupplyAsync(request);
            return StatusCode(int.Parse(repsone.Status), repsone);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetSupplyById(int id)
        {
            var response = await _medicalSupplyService.GetSupplyByIdAsync(id);
            return StatusCode(int.Parse(response.Status), response);
        }
        [HttpPut]
        public async Task<IActionResult> UpdateSupply([FromBody] UpdateMedicalSupplyRequest request)
        {
            var response = await _medicalSupplyService.UpdateSupplyAsync(request);
            return StatusCode(int.Parse(response.Status), response);
        }
    }
}
