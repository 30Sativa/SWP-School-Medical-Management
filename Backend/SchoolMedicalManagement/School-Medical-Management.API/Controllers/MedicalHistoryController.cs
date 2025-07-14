using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SchoolMedicalManagement.Models.Request;
using SchoolMedicalManagement.Service.Interface;

namespace School_Medical_Management.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MedicalHistoryController : ControllerBase
    {
        private readonly IMedicalHistoryService _service;

        public MedicalHistoryController(IMedicalHistoryService service)
        {
            _service = service;
        }

        [HttpGet("student/{studentId}")]
        public async Task<IActionResult> GetAllByStudentId(int studentId)
        {
            var response = await _service.GetAllByStudentIdAsync(studentId);
            return StatusCode(int.Parse(response.Status), response);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var res = await _service.GetByIdAsync(id);
            return StatusCode(int.Parse(res.Status), res);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateMedicalHistoryRequest request)
        {
            var res = await _service.CreateAsync(request);
            return StatusCode(int.Parse(res.Status), res);
        }

        [HttpPut]
        public async Task<IActionResult> Update([FromBody] UpdateMedicalHistoryRequest request)
        {
            var res = await _service.UpdateAsync(request);
            return StatusCode(int.Parse(res.Status), res);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var res = await _service.DeleteAsync(id);
            return StatusCode(int.Parse(res.Status), res);
        }
    }
}
