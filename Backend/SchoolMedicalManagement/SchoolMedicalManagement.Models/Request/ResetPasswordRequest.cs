using System;
using System.ComponentModel.DataAnnotations;

namespace SchoolMedicalManagement.Models.Request
{
    //Đặt lại mật khẩu mới
    public class ResetPasswordRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = null!;

        [Required]
        [StringLength(100, MinimumLength = 6, ErrorMessage = "Password must be at least 6 characters")]
        public string NewPassword { get; set; } = null!;
    }
}