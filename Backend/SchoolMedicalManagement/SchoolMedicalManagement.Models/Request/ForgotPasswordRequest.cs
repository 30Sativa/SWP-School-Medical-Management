using System;
using System.ComponentModel.DataAnnotations;

namespace SchoolMedicalManagement.Models.Request
{
    //Nhập mail để gửi mã OTP
    public class ForgotPasswordRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = null!;
    }
}