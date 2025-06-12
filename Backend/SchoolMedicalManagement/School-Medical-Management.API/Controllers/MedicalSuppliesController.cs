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

        /// <summary>
        /// Lấy danh sách tất cả vật tư y tế.
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetAllSupplies()
        {
            var supplies = await _medicalSupplyService.GetAllSuppliesAsync();
            if (supplies == null || !supplies.Any())
            {
                return NotFound("Không tìm thấy vật tư nào trong kho.");
            }
            return Ok(supplies);
        }

        /// <summary>
        /// Tạo mới vật tư y tế.
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> CreateSupply([FromBody] CreateMedicalSupplyRequest request)
        {
            var response = await _medicalSupplyService.AddSupplyAsync(request);
            return StatusCode(int.Parse(response.Status), response);
        }

        /// <summary>
        /// Lấy chi tiết vật tư theo ID.
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetSupplyById([FromRoute] int id)
        {
            var response = await _medicalSupplyService.GetSupplyByIdAsync(id);
            return StatusCode(int.Parse(response.Status), response);
        }

        /// <summary>
        /// Cập nhật thông tin vật tư y tế.
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSupply([FromRoute] int id, [FromBody] UpdateMedicalSupplyRequest request)
        {
            if (id != request.SupplyId)
            {
                return BadRequest("Supply ID không khớp giữa URL và request body.");
            }

            var response = await _medicalSupplyService.UpdateSupplyAsync(request);
            return StatusCode(int.Parse(response.Status), response);
        }
    }
}
