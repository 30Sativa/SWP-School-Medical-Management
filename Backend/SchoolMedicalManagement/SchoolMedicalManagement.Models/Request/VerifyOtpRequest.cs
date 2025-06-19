using System;
using System.ComponentModel.DataAnnotations;

namespace SchoolMedicalManagement.Models.Request
{
    //Xác thực otp 
    public class VerifyOtpRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = null!;

        [Required]
        [StringLength(6, MinimumLength = 6, ErrorMessage = "OTP must be 6 digits")]
        [RegularExpression("^[0-9]*$", ErrorMessage = "OTP must contain only digits")]
        public string Otp { get; set; } = null!;
    }
}