using System;
using System.Collections.Generic;

namespace SchoolMedicalManagement.Models.Entity;

public partial class VaccinationRecord
{
    public int RecordId { get; set; }

    public int? StudentId { get; set; }

    public int? CampaignId { get; set; }

    public int? ConsentStatusId { get; set; }

    public DateTime? ConsentDate { get; set; }

    public DateTime? VaccinationDate { get; set; }

    public string? Result { get; set; }

    public string? FollowUpNote { get; set; }

    public bool? IsActive { get; set; }

    public virtual VaccinationCampaign? Campaign { get; set; }

    public virtual ConsentStatusType? ConsentStatus { get; set; }

    public virtual Student? Student { get; set; }
}
