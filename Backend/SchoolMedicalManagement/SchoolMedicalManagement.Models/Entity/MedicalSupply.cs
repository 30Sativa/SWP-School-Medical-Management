using System;
using System.Collections.Generic;

namespace SchoolMedicalManagement.Models.Entity;

public partial class MedicalSupply
{
    public int SupplyId { get; set; }

    public string? Name { get; set; }

    public int? Quantity { get; set; }

    public string? Unit { get; set; }

    public DateOnly? ExpiryDate { get; set; }

    public virtual ICollection<HandleRecord> HandleRecords { get; set; } = new List<HandleRecord>();
}
