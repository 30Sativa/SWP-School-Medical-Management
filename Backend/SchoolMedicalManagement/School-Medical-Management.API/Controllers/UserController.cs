using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchoolMedicalManagement.Models.Request;
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

        // Đăng nhập
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginUserRequest loginRequest)
        {
            var response = await _authService.Login(loginRequest);
            return StatusCode(int.Parse(response.Status), response);
        }

        // Lấy toàn bộ user (chỉ cho Manager)
        [Authorize(Roles = "Manager")]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var users = await _userService.GetAllUserAsync();
            return Ok(users); // Không cần check null vì luôn trả List<>
        }

        // Lấy thông tin 1 user theo ID
        [Authorize(Roles = "Manager")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById([FromRoute] Guid id)
        {
            var response = await _userService.GetUserByIdAsync(id);
            return StatusCode(int.Parse(response.Status), response);
        }

        // Tạo user mới
        [Authorize(Roles = "Manager")]
        [HttpPost]
        public async Task<IActionResult> CreateUser([FromBody] CreateUserRequest request)
        {
            var response = await _userService.CreateUserAsync(request);
            return StatusCode(int.Parse(response.Status), response);
        }

        // Xóa user
        [Authorize(Roles = "Manager")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(Guid id)
        {
            var response = await _userService.SoftDeleteUserAsync(id);
            return StatusCode(int.Parse(response.Status), response);
        }

        // Cập nhật user
        [Authorize(Roles = "Manager")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(Guid id, [FromBody] UpdateUserRequest request)
        {
            var response = await _userService.UpdateUserAsync(id, request);
            return StatusCode(int.Parse(response.Status), response);
        }

        // Đổi mật khẩu sau lần đăng nhập đầu tiên
        [HttpPost("change-password-firstlogin/{id}")]
        public async Task<IActionResult> ChangePasswordAfterFirstLogin([FromRoute] Guid id, [FromBody] ChangePasswordUserRequest request)
        {
            var response = await _authService.ChangePasswordAfterFirstLogin(id, request);
            return StatusCode(int.Parse(response.Status), response);
        }
    }
}
