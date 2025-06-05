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
        private readonly IUserService _userService;

        public UserController(IAuthService authService, IUserService userService)
        {
            _authService = authService;
            _userService = userService;
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginRequest loginRequest)
        {
            var response = await _authService.Login(loginRequest);
            if (response == null)
                return Unauthorized("Invalid username or password");

            return Ok(response);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var users = await _userService.GetAll();
            if (users != null)
            {
                return Ok(users);
            }
            return NotFound("No users found");
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById([FromRoute] int id)
        {
            var user = await _userService.GetUserById(id);
            if (user != null)
            {
                return Ok(user);
            }
            return NotFound($"User with ID {id} not found");
        }


        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePasswordAfterFirstLogin(UserChangePasswordRequest userChangePasswordRequest)
        {
            var response = await _authService.ChangePasswordAfterFirstLogin(userChangePasswordRequest);
            if (response !=null)
            {
                return Ok(response);
            }
            return BadRequest("Failed to change password or user not eligible for password change");
        }
    }

}