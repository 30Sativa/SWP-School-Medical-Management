using System;
using System.Collections.Generic;

namespace SchoolMedicalManagement.Models.Entity;

public partial class HealthCheckSummary
{
    public int RecordId { get; set; }

    public int StudentId { get; set; }

    public int? CampaignId { get; set; }

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

    public virtual HealthCheckCampaign? Campaign { get; set; }

    public virtual Student Student { get; set; } = null!;
}
