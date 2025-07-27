using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SchoolMedicalManagement.Models.Request;
using SchoolMedicalManagement.Service.Interface;
using System.Threading.Tasks;

namespace School_Medical_Management.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // Default authorization for all endpoints
    public class BlogPostController : ControllerBase
    {
        private readonly IBlogPostService _blogPostService;

        public BlogPostController(IBlogPostService blogPostService)
        {
            _blogPostService = blogPostService;
        }

        // Lấy danh sách bài viết - Tất cả người dùng đã đăng nhập đều có quyền xem
        [HttpGet]
        public async Task<IActionResult> GetBlogPostList()
        {
            var response = await _blogPostService.GetAllBlogPostsAsync();
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }

        // Lấy chi tiết bài viết theo ID - Tất cả người dùng đã đăng nhập đều có quyền xem
        [HttpGet("{id}")]
        public async Task<IActionResult> GetBlogPostById([FromRoute] int id)
        {
            var response = await _blogPostService.GetBlogPostByIdAsync(id);
            if (response == null)
            {
                return NotFound($"Không tìm thấy bài viết với ID {id}.");
            }
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }

        // Tạo bài viết mới - Chỉ quản lý và y tá mới có quyền tạo
        [Authorize(Roles = "Manager,Nurse")]
        [HttpPost]
        public async Task<IActionResult> CreateBlogPost([FromBody] CreateBlogPostRequest request)
        {
            var response = await _blogPostService.CreateBlogPostAsync(request);
            return StatusCode(int.Parse(response?.Status ?? "200"), response);
        }

        // Cập nhật bài viết - Chỉ quản lý và y tá mới có quyền cập nhật
        [Authorize(Roles = "Manager,Nurse")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBlogPost([FromRoute] int id, [FromBody] UpdateBlogPostRequest request)
        {
            var response = await _blogPostService.UpdateBlogPostAsync(id, request);
            if (response == null)
            {
                return NotFound($"Không tìm thấy bài viết với ID {id} hoặc không thể cập nhật.");
            }
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }

        // Xóa bài viết - Chỉ quản lý mới có quyền xóa
        [Authorize(Roles = "Manager")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBlogPost([FromRoute] int id)
        {
            var response = await _blogPostService.DeleteBlogPostAsync(id);
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }
    }
} 