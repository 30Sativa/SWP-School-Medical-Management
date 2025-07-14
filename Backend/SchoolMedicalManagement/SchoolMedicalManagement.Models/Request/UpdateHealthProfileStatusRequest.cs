using System.ComponentModel.DataAnnotations;

namespace SchoolMedicalManagement.Models.Request
{
    public class UpdateHealthProfileStatusRequest
    {
        [Required(ErrorMessage = "IsActive là bắt buộc")]
        public bool IsActive { get; set; }
    }
}