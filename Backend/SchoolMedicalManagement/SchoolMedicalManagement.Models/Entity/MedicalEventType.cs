using System;
using System.Collections.Generic;

namespace SchoolMedicalManagement.Models.Entity;

public partial class MedicalEventType
{
    public int EventTypeId { get; set; }

    public string EventTypeName { get; set; } = null!;

    public virtual ICollection<MedicalEvent> MedicalEvents { get; set; } = new List<MedicalEvent>();
}
