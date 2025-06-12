using System;
using System.Collections.Generic;

namespace SchoolMedicalManagement.Models.Entity;

public partial class HandleRecord
{
    public int EventId { get; set; }

    public int SupplyId { get; set; }

    public int QuantityUsed { get; set; }

    public string? Note { get; set; }

    public virtual MedicalEvent Event { get; set; } = null!;

    public virtual MedicalSupply Supply { get; set; } = null!;
}
