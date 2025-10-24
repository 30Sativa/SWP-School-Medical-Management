using System;
using System.Collections.Generic;

namespace SchoolMedicalManagement.Models.Entity;

public partial class VaccinationConsentRequest
{
    public int RequestId { get; set; }

    public int StudentId { get; set; }

    public int CampaignId { get; set; }

    public Guid ParentId { get; set; }

    public DateTime RequestDate { get; set; }

    public int? ConsentStatusId { get; set; }

    public DateTime? ConsentDate { get; set; }

    public virtual VaccinationCampaign Campaign { get; set; } = null!;

    public virtual ConsentStatusType? ConsentStatus { get; set; }

    public virtual User Parent { get; set; } = null!;

    public virtual Student Student { get; set; } = null!;
}
