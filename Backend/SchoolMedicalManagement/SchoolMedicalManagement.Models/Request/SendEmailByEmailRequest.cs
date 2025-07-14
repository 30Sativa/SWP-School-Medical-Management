namespace SchoolMedicalManagement.Models.Request
{
    public class SendEmailByEmailRequest
    {
        public string Email { get; set; }
        public string Subject { get; set; }
        public string Body { get; set; }
    }
} 