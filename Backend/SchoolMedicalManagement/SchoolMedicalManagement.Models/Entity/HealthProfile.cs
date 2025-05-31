using System;
using System.Collections.Generic;

namespace SchoolMedicalManagement.Models.Entity;

public partial class HealthProfile
{
    public int ProfileId { get; set; }

    public int? StudentId { get; set; }

    public string? Height { get; set; }

    public string? Weight { get; set; }

    public string? ChronicDiseases { get; set; }

    public string? Allergies { get; set; }

    public string? GeneralNote { get; set; }

    public virtual Student? Student { get; set; }
}
