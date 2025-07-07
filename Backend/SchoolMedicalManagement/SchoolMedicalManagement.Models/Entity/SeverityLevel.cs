using System;
using System.Collections.Generic;

namespace SchoolMedicalManagement.Models.Entity;

public partial class SeverityLevel
{
    public int SeverityId { get; set; }

    public string SeverityName { get; set; } = null!;

    public virtual ICollection<MedicalEvent> MedicalEvents { get; set; } = new List<MedicalEvent>();
}
