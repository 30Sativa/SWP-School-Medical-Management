using Microsoft.AspNetCore.Http;
using SchoolMedicalManagement.Service.Interface;
using Microsoft.AspNetCore.Mvc;
using SchoolMedicalManagement.Repository.Request;
using SchoolMedicalManagement.Repository.Response;

namespace School_Medical_Management.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IAuthService _authService;
        public UserController(IAuthService authService)
        {
            _authService = authService;
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginRequest loginRequest)
        {
            var response = await _authService.Login(loginRequest);
            if (response == null)
                return Unauthorized("Invalid username or password");

            return Ok(response);
        }
    }
}