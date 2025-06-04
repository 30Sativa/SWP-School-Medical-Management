using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SchoolMedicalManagement.Models.Request;
using SchoolMedicalManagement.Service.Interface;

namespace School_Medical_Management.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentController : ControllerBase
    {
        private readonly IStudentService _studentService;

        public StudentController(IStudentService studentService)
        {
            _studentService = studentService;
        }

        [HttpGet]
        public async Task<IActionResult> GetStudentList()
        {
            var responses = await _studentService.GetStudentList();
            if (responses == null)
            {
                return NotFound("Student list is empty!");
            }
            return Ok(responses);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetStudentById([FromRoute] int id)
        {
            var response = await _studentService.GetStudentById(id);
            return StatusCode(int.Parse(response.Status), response);
        }

        [HttpPost]
        public async Task<IActionResult> CreateStudent([FromBody] CreateStudentRequest request)
        {
            var response = await _studentService.CreateStudent(request);
            return StatusCode(int.Parse(response.Status), response);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateStudent([FromBody] UpdateStudentRequest request)
        {
            var result = await _studentService.UpdateStudent(request);
            if (!result)
            {
                return NotFound($"Student with ID {request.StudentId} not found or could not be updated.");
            }
            return Ok($"Update Student with ID: {request.StudentId} successfully");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStudent([FromRoute] int id)
        {
            var result = await _studentService.DeleteStudent(id);
            if (!result)
            {
                return NotFound($"Student with ID {id} not found or could not be deleted.");
            }
            return Ok($"Delete Student with ID: {id} successfully");
        }
    }
}