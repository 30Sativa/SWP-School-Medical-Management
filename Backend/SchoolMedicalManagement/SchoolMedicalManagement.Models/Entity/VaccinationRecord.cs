using System;
using System.Collections.Generic;

namespace SchoolMedicalManagement.Models.Entity;

public partial class VaccinationRecord
{
    public int RecordId { get; set; }

    public int? StudentId { get; set; }

    public int? CampaignId { get; set; }

    public string? ConsentStatus { get; set; }

    public DateOnly? ConsentDate { get; set; }

    public DateOnly? VaccinationDate { get; set; }

    public string? Result { get; set; }

    public string? FollowUpNote { get; set; }

    public bool? IsActive { get; set; }

    public virtual VaccinationCampaign? Campaign { get; set; }

    public virtual Student? Student { get; set; }
}
