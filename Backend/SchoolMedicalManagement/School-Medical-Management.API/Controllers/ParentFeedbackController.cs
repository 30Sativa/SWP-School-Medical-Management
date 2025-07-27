using Microsoft.AspNetCore.Mvc;
using SchoolMedicalManagement.Models.Request;
using SchoolMedicalManagement.Service.Interface;
using System.Threading.Tasks;

namespace School_Medical_Management.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ParentFeedbackController : ControllerBase
    {
        private readonly IParentFeedbackService _feedbackService;

        public ParentFeedbackController(IParentFeedbackService feedbackService)
        {
            _feedbackService = feedbackService;
        }

        // GET: api/parentfeedback
        [HttpGet]
        public async Task<IActionResult> GetAllFeedback()
        {
            var response = await _feedbackService.GetAllFeedbackAsync();
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }

        // GET: api/parentfeedback/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetFeedbackById(int id)
        {
            var response = await _feedbackService.GetFeedbackByIdAsync(id);
            return StatusCode(int.Parse(response.Status ?? "200"), response);
        }

        // POST: api/parentfeedback
        [HttpPost]
        public async Task<IActionResult> CreateFeedback([FromBody] CreateParentFeedbackRequest request)
        {
            var response = await _feedbackService.CreateFeedbackAsync(request);
            return StatusCode(int.Parse(response.Status ?? "201"), response);
        }
    }
} 