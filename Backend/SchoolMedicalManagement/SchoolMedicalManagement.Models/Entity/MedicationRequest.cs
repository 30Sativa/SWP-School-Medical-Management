using System;
using System.Collections.Generic;

namespace SchoolMedicalManagement.Models.Entity;

public partial class MedicationRequest
{
    public int RequestId { get; set; }

    public int StudentId { get; set; }

    public Guid ParentId { get; set; }

    public string? MedicationName { get; set; }

    public string? Dosage { get; set; }

    public string? Instructions { get; set; }

    public DateTime RequestDate { get; set; }

    public int? StatusId { get; set; }

    public string? ImagePath { get; set; }

    public Guid? ReceivedBy { get; set; }

    public bool? IsActive { get; set; }

    public virtual User Parent { get; set; } = null!;

    public virtual User? ReceivedByNavigation { get; set; }

    public virtual MedicationRequestStatus? Status { get; set; }

    public virtual Student Student { get; set; } = null!;
}
