namespace SchoolMedicalManagement.Models.Response
{
    public class CampaignSummaryResponse
    {
        public int CampaignId { get; set; }
        public string VaccineName { get; set; }
        public DateOnly? Date { get; set; }
        public int TotalConsentRequests { get; set; }
        public int ApprovedConsents { get; set; }
        public int DeclinedConsents { get; set; }
        public int PendingConsents { get; set; }
        public int TotalVaccinationRecords { get; set; }
        public int SuccessfulVaccinations { get; set; }
    }
} 