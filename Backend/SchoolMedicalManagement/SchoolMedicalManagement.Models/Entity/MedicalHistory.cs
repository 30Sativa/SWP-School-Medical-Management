using System;
using System.Collections.Generic;

namespace SchoolMedicalManagement.Models.Entity;

public partial class MedicalHistory
{
    public int HistoryId { get; set; }

    public int? StudentId { get; set; }

    public string? DiseaseName { get; set; }

    public DateOnly? DiagnosedDate { get; set; }

    public string? Note { get; set; }

    public virtual Student? Student { get; set; }
}
