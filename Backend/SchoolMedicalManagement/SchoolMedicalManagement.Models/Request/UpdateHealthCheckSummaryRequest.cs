using System;

namespace SchoolMedicalManagement.Models.Request
{
    public class UpdateHealthCheckSummaryRequest
    {
        public decimal? BloodPressure { get; set; }
        public int? HeartRate { get; set; }
        public decimal? Height { get; set; }
        public decimal? Weight { get; set; }
        public decimal? Bmi { get; set; }
        public string? VisionSummary { get; set; }
        public string? Ent { get; set; }
        public string? EntNotes { get; set; }
        public string? Mouth { get; set; }
        public string? Throat { get; set; }
        public string? ToothDecay { get; set; }
        public string? ToothNotes { get; set; }
        public string? GeneralNote { get; set; }
        public string? FollowUpNote { get; set; }
        public bool? IsActive { get; set; }
    }
} 