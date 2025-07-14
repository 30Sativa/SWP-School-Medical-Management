using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SchoolMedicalManagement.Models.Request;
using SchoolMedicalManagement.Service.Interface;
using System.Threading.Tasks;

namespace School_Medical_Management.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MedicalEventTypeController : ControllerBase
    {
        private readonly IMedicalEventTypeService _medicalEventTypeService;

        public MedicalEventTypeController(IMedicalEventTypeService medicalEventTypeService)
        {
            _medicalEventTypeService = medicalEventTypeService;
        }

        [HttpGet]
        public async Task<IActionResult> GetMedicalEventTypeList()
        {
            var response = await _medicalEventTypeService.GetAllMedicalEventTypesAsync();
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetMedicalEventTypeById([FromRoute] int id)
        {
            var response = await _medicalEventTypeService.GetMedicalEventTypeByIdAsync(id);
            if (response == null)
            {
                return NotFound($"Không tìm thấy loại sự kiện y tế với ID {id}.");
            }
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }

        [HttpPost]
        public async Task<IActionResult> CreateMedicalEventType([FromBody] CreateMedicalEventTypeRequest request)
        {
            var response = await _medicalEventTypeService.CreateMedicalEventTypeAsync(request);
            return StatusCode(int.Parse(response?.Status ?? "200"), response);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMedicalEventType([FromRoute] int id, [FromBody] UpdateMedicalEventTypeRequest request)
        {
            var response = await _medicalEventTypeService.UpdateMedicalEventTypeAsync(id, request);
            if (response == null)
            {
                return NotFound($"Không tìm thấy loại sự kiện y tế với ID {id} hoặc không thể cập nhật.");
            }
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMedicalEventType([FromRoute] int id)
        {
            var result = await _medicalEventTypeService.DeleteMedicalEventTypeAsync(id);
            if (!result)
            {
                return NotFound($"Không tìm thấy loại sự kiện y tế với ID {id} hoặc không thể xóa.");
            }
            return Ok($"Xóa loại sự kiện y tế với ID: {id} thành công");
        }
    }
}