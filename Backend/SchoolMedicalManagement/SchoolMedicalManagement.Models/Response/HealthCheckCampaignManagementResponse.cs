using System;

namespace SchoolMedicalManagement.Models.Response
{
    public class HealthCheckCampaignManagementResponse
    {
        public int CampaignId { get; set; }
        public string? Title { get; set; }
        public DateOnly? Date { get; set; }
        public string? Description { get; set; }
        public int? CreatedBy { get; set; }
        public string? CreatedByName { get; set; }
    }
} 