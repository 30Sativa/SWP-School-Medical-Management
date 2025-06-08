using System;

namespace SchoolMedicalManagement.Models.Response
{
    public class HealthCheckSummaryManagementResponse
    {
        public int RecordId { get; set; }
        public int StudentId { get; set; }
        public string? StudentName { get; set; }
        public int? CampaignId { get; set; }
        public string? CampaignTitle { get; set; }
        public string? BloodPressure { get; set; }
        public string? HeartRate { get; set; }
        public string? Height { get; set; }
        public string? Weight { get; set; }
        public string? Bmi { get; set; }
        public string? VisionSummary { get; set; }
        public string? Ent { get; set; }
        public string? EntNotes { get; set; }
        public string? Mouth { get; set; }
        public string? Throat { get; set; }
        public string? ToothDecay { get; set; }
        public string? ToothNotes { get; set; }
        public string? GeneralNote { get; set; }
        public string? FollowUpNote { get; set; }
        public string? ConsentStatus { get; set; }
        public bool? IsActive { get; set; }
    }
} 