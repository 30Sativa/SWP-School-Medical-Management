using System.ComponentModel.DataAnnotations;

namespace SchoolMedicalManagement.Models.Request
{
    public class UpdateHealthProfileStatusRequest
    {
        [Required(ErrorMessage = "IsActive la bat buoc")]
        public bool IsActive { get; set; }
    }
}