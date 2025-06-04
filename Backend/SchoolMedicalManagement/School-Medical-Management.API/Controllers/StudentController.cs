using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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

    }
}
