using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SchoolMedicalManagement.Models.Entity;
using SchoolMedicalManagement.Models.Request;
using SchoolMedicalManagement.Models.Response;
using SchoolMedicalManagement.Service.Interface;

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
            return StatusCode(int.Parse(response.Status), response);
        }

        [Authorize(Roles = "Manager")]
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
        [Authorize(Roles = "Manager")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById([FromRoute] int id)
        {
            var user = await _userService.GetUserById(id);
            if (user == null)
                return NotFound($"User with ID {id} not found");
            return Ok(user);
        }
        [Authorize(Roles = "Manager")]
        [HttpPost]
        public async Task<IActionResult> CreateUser(UserCreateRequest request)
        {
            var userToCreate = await _userService.CreateUser(request);
            if (userToCreate == null)
            {
                return BadRequest("Failed to create user. Please check the request data.");
            }
            return Ok(userToCreate);
        }
        [Authorize(Roles = "Manager")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var result = await _userService.DeleteUser(id);
            if (result)
            {
                return Ok($"Delete User with ID: {id} successfully");
            }
            return NotFound($"User with ID {id} not found");

        }
        [Authorize(Roles = "Manager")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, UserUpdateRequest request)
        {
            var updatedUser = await _userService.UpdateUser(id, request);
            if (updatedUser == null)
            {
                return NotFound($"User with ID {id} not found!");
            }
            return Ok(updatedUser);
        }



        [HttpPost("change-password{id}")]
        public async Task<IActionResult> ChangePasswordAfterFirstLogin([FromRoute] int id, UserChangePasswordRequest userChangePasswordRequest)
        {
            var response = await _authService.ChangePasswordAfterFirstLogin(id,userChangePasswordRequest);
            return StatusCode(int.Parse(response.Status), response);
        }
    }

}