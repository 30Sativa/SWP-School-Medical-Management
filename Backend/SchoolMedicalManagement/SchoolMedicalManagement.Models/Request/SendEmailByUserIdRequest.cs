using System;

namespace SchoolMedicalManagement.Models.Request
{
    public class SendEmailByUserIdRequest
    {
        public Guid UserId { get; set; }
        public string Subject { get; set; }
        public string Body { get; set; }
    }
} 