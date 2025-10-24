using System;
using System.Collections.Generic;

namespace SchoolMedicalManagement.Models.Entity;

public partial class MedicationRequestStatus
{
    public int StatusId { get; set; }

    public string StatusName { get; set; } = null!;

    public virtual ICollection<MedicationRequest> MedicationRequests { get; set; } = new List<MedicationRequest>();
}
