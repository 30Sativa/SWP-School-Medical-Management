using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace School_Medical_Management.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UptimeRobot : ControllerBase
    {
        [HttpGet]
        [HttpHead]
        public IActionResult HealthCheck()
        {
            if (Request.Method == "HEAD")
            {
                return Ok(); // Mã 200, không body
            }
            return Ok(new { status = "healthy", timestamp = DateTime.UtcNow });
        }
    }
}
