using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchoolMedicalManagement.Models.Request;
using SchoolMedicalManagement.Service.Interface;
using System.Threading.Tasks;

namespace School_Medical_Management.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // Default authorization for all endpoints
    public class ParentFeedbackController : ControllerBase
    {
        private readonly IParentFeedbackService _feedbackService;

        public ParentFeedbackController(IParentFeedbackService feedbackService)
        {
            _feedbackService = feedbackService;
        }

        // Lấy danh sách tất cả phản hồi của phụ huynh - Chỉ quản lý và y tá mới có quyền xem
        [Authorize(Roles = "Manager,Nurse")]
        [HttpGet]
        public async Task<IActionResult> GetAllFeedback()
        {
            var response = await _feedbackService.GetAllFeedbackAsync();
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }

        // Lấy chi tiết phản hồi theo ID - Chỉ quản lý và y tá mới có quyền xem
        [Authorize(Roles = "Manager,Nurse")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetFeedbackById(int id)
        {
            var response = await _feedbackService.GetFeedbackByIdAsync(id);
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }

        // Tạo phản hồi mới - Chỉ phụ huynh mới có quyền tạo
        [Authorize(Roles = "Parent")]
        [HttpPost]
        public async Task<IActionResult> CreateFeedback([FromBody] CreateParentFeedbackRequest request)
        {
            var response = await _feedbackService.CreateFeedbackAsync(request);
            return StatusCode(int.Parse(response.Status ?? "201"), response);
        }
    }
} 