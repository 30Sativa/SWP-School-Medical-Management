using System;
using System.Collections.Generic;

namespace SchoolMedicalManagement.Models.Entity;

public partial class VaccinationConsentRequest
{
    public int RequestId { get; set; }

    public int StudentId { get; set; }

    public int CampaignId { get; set; }

    public int ParentId { get; set; }

    public DateOnly RequestDate { get; set; }

    public string? ConsentStatus { get; set; }

    public DateOnly? ConsentDate { get; set; }

    public virtual VaccinationCampaign Campaign { get; set; } = null!;

    public virtual User Parent { get; set; } = null!;

    public virtual Student Student { get; set; } = null!;
}
