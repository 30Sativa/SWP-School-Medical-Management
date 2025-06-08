using System;

namespace SchoolMedicalManagement.Models.Request
{
    public class UpdateHealthCheckCampaignRequest
    {
        public string? Title { get; set; }
        public DateOnly? Date { get; set; }
        public string? Description { get; set; }
    }
} 