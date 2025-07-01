using System;
using System.Collections.Generic;

namespace SchoolMedicalManagement.Models.Entity;

public partial class HealthCheckCampaign
{
    public int CampaignId { get; set; }

    public string? Title { get; set; }

    public DateOnly? Date { get; set; }

    public string? Description { get; set; }

    public Guid? CreatedBy { get; set; }

    public int? StatusId { get; set; }

    public virtual User? CreatedByNavigation { get; set; }

    public virtual ICollection<HealthCheckSummary> HealthCheckSummaries { get; set; } = new List<HealthCheckSummary>();

    public virtual CampaignStatus? Status { get; set; }
}
