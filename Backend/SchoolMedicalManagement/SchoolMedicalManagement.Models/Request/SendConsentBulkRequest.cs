namespace SchoolMedicalManagement.Models.Request
{
    public class SendConsentBulkRequest
    {
        public List<int> StudentIds { get; set; } = new();
        public int? AutoDeclineAfterDays { get; set; }
    }
} 