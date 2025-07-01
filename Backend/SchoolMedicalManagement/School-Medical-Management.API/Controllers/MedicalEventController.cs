using Microsoft.AspNetCore.Mvc;
using SchoolMedicalManagement.Models.Request;
using SchoolMedicalManagement.Service.Interface;

[Route("api/[controller]")]
[ApiController]
public class MedicalEventController : ControllerBase
{
    private readonly IMedicalEventService _medicalEventService;
    public MedicalEventController(IMedicalEventService medicalEventService)
    {
        _medicalEventService = medicalEventService;
    }

    // Lấy 1 sự kiện y tế theo ID
    [HttpGet("{id}")]
    public async Task<IActionResult> GetMedicalEventById([FromRoute] int id)
    {
        var result = await _medicalEventService.GetByIdMedicalEvent(id);
        return StatusCode(int.Parse(result.Status), result);
    }

    // Tạo mới sự kiện y tế
    [HttpPost]
    public async Task<IActionResult> CreateMedicalEvent([FromBody] CreateMedicalEventRequest request)
    {
        var response = await _medicalEventService.CreateMedicalEvent(request);
        return StatusCode(int.Parse(response.Status), response);
    }

    // Cập nhật sự kiện y tế
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateMedicalEvent([FromRoute] int id, [FromBody] CreateMedicalEventRequest request)
    {
        var response = await _medicalEventService.UpdateMedicalEvent(id, request);
        return StatusCode(int.Parse(response.Status), response);
    }

    // Xoá mềm sự kiện y tế
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteMedicalEvent([FromRoute] int id)
    {
        var isDeleted = await _medicalEventService.DeleteMedicalEvent(id);
        if (!isDeleted)
        {
            return NotFound($"Medical Event with ID {id} not found or could not be deleted.");
        }
        return Ok($"Medical Event with ID: {id} deleted successfully");
    }

    // Lấy danh sách sự kiện y tế đang hoạt động
    [HttpGet]
    public async Task<IActionResult> GetAllMedicalEvents()
    {
        var result = await _medicalEventService.GetAllMedicalEvent();
        return Ok(result);
    }

    [HttpGet("student/{studentId}")]
    public async Task<IActionResult> GetMedicalEventsByStudentId([FromRoute] int studentId)
    {
        var result = await _medicalEventService.GetMedicalEventsByStudentId(studentId);
        return StatusCode(int.Parse(result.Status), result);
    }
}
