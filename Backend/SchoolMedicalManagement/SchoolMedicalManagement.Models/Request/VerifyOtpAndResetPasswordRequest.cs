namespace SchoolMedicalManagement.Models.Request
{
    public class VerifyOtpAndResetPasswordRequest
    {
        public string Email { get; set; }
        public string Otp { get; set; }
        public string NewPassword { get; set; }
    }
} 