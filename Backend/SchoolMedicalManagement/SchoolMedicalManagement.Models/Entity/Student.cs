using System;
using System.Collections.Generic;

namespace SchoolMedicalManagement.Models.Entity;

public partial class Student
{
    public int StudentId { get; set; }

    public string? FullName { get; set; }

    public DateOnly? DateOfBirth { get; set; }

    public string? Gender { get; set; }

    public string? Class { get; set; }

    public int? ParentId { get; set; }

    public virtual ICollection<HealthCheckSummary> HealthCheckSummaries { get; set; } = new List<HealthCheckSummary>();

    public virtual HealthProfile? HealthProfile { get; set; }

    public virtual ICollection<MedicalEvent> MedicalEvents { get; set; } = new List<MedicalEvent>();

    public virtual ICollection<MedicationRequest> MedicationRequests { get; set; } = new List<MedicationRequest>();

    public virtual User? Parent { get; set; }

    public virtual ICollection<VaccinationConsentRequest> VaccinationConsentRequests { get; set; } = new List<VaccinationConsentRequest>();

    public virtual ICollection<VaccinationRecord> VaccinationRecords { get; set; } = new List<VaccinationRecord>();
}
