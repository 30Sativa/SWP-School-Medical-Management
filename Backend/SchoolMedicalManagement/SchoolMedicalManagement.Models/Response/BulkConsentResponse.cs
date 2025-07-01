namespace SchoolMedicalManagement.Models.Response
{
    public class BulkConsentResponse
    {
        public int TotalStudents { get; set; }
        public int SuccessCount { get; set; }
        public int FailedCount { get; set; }
        public List<string> FailedReasons { get; set; } = new();
        public List<ConsentRequestResponse> CreatedRequests { get; set; } = new();
    }
} 