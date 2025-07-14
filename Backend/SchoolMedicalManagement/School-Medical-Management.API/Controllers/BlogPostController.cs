using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SchoolMedicalManagement.Models.Request;
using SchoolMedicalManagement.Service.Interface;
using System.Threading.Tasks;

namespace School_Medical_Management.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BlogPostController : ControllerBase
    {
        private readonly IBlogPostService _blogPostService;

        public BlogPostController(IBlogPostService blogPostService)
        {
            _blogPostService = blogPostService;
        }

        [HttpGet]
        public async Task<IActionResult> GetBlogPostList()
        {
            var response = await _blogPostService.GetAllBlogPostsAsync();
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }

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

        [HttpPost]
        public async Task<IActionResult> CreateBlogPost([FromBody] CreateBlogPostRequest request)
        {
            var response = await _blogPostService.CreateBlogPostAsync(request);
            return StatusCode(int.Parse(response?.Status ?? "200"), response);
        }

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

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBlogPost([FromRoute] int id)
        {
            var result = await _blogPostService.DeleteBlogPostAsync(id);
            if (!result)
            {
                return NotFound($"Không tìm thấy bài viết với ID {id} hoặc không thể xóa.");
            }
            return Ok($"Xóa bài viết với ID: {id} thành công");
        }
    }
} 