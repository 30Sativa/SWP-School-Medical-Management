using System;
using System.Collections.Generic;

namespace SchoolMedicalManagement.Models.Entity;

public partial class ConsentStatusType
{
    public int ConsentStatusId { get; set; }

    public string ConsentStatusName { get; set; } = null!;

    public virtual ICollection<HealthCheckSummary> HealthCheckSummaries { get; set; } = new List<HealthCheckSummary>();

    public virtual ICollection<VaccinationConsentRequest> VaccinationConsentRequests { get; set; } = new List<VaccinationConsentRequest>();

    public virtual ICollection<VaccinationRecord> VaccinationRecords { get; set; } = new List<VaccinationRecord>();
}
