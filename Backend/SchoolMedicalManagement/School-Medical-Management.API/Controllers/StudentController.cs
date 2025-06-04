using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SchoolMedicalManagement.Models.Request;
using SchoolMedicalManagement.Service.Implement;
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
            var students = await _studentService.GetStudentList();
            if (students == null || students.Count == 0)
            {
                return NotFound("Student list is empty!!!");
            }
            return Ok(students);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetStudentById([FromRoute] int id)
        {
            var student = await _studentService.GetStudentById(id);
            if (student == null)
            {
                return NotFound($"Student with ID {id} not found");
            }
            return Ok(student);
        }

        [HttpPost]
        public async Task<IActionResult> CreateStudent([FromBody] CreateStudentRequest request)
        {
            var createdStudent = await _studentService.CreateStudent(request);
            if (createdStudent == null)
            {
                return BadRequest("Failed to create student. Please check the request data.");
            }
            return Ok(createdStudent);
        }


        [HttpPut]
        public async Task<IActionResult> UpdateStudent(UpdateStudentRequest request)
        {
            var isUpdated = await _studentService.UpdateStudent(request);
            if (!isUpdated)
            {
                return BadRequest($"Student with ID {request.StudentId} not found or could not be updated.");
            }
            return Ok($"Update Student with ID: {request.StudentId} successfully");
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStudent([FromRoute] int id)
        {
            var isDeleted = await _studentService.DeleteStudent(id);
            if (!isDeleted)
            {
                return NotFound($"Student with ID {id} not found or could not be deleted.");
            }
            return Ok($"Delete Student with ID: {id} successfully");
        }


        }
}
