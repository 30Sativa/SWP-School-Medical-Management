using System;

namespace SchoolMedicalManagement.Models.Response
{
    public class HealthCheckCampaignManagementResponse
    {
        public int CampaignId { get; set; }
        public string? Title { get; set; }
        public DateOnly? Date { get; set; }
        public string? Description { get; set; }
        public Guid? CreatedBy { get; set; }
        public string? CreatedByName { get; set; }
        public int? StatusId { get; set; }
        public string? StatusName { get; set; }
    }
} 