using System;
using System.Collections.Generic;

namespace SchoolMedicalManagement.Models.Entity;

public partial class MedicalEvent
{
    public int EventId { get; set; }

    public int? StudentId { get; set; }

    public string? EventType { get; set; }

    public DateOnly? EventDate { get; set; }

    public string? Description { get; set; }

    public int? HandledBy { get; set; }

    public string? Notes { get; set; }

    public bool? IsActive { get; set; }

    public virtual ICollection<HandleRecord> HandleRecords { get; set; } = new List<HandleRecord>();

    public virtual User? HandledByNavigation { get; set; }

    public virtual Student? Student { get; set; }
}
