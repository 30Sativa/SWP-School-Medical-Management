namespace SchoolMedicalManagement.Models.Request
{
    public class SendConsentByClassRequest
    {
        public string ClassName { get; set; } = null!;
        public int? AutoDeclineAfterDays { get; set; }
    }
} 