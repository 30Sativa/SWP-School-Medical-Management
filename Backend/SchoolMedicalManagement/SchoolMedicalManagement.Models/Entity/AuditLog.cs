using System;
using System.Collections.Generic;

namespace SchoolMedicalManagement.Models.Entity;

public partial class AuditLog
{
    public int LogId { get; set; }

    public Guid? UserId { get; set; }

    public string? Action { get; set; }

    public string? TargetTable { get; set; }

    public int? TargetId { get; set; }

    public DateTime? ActionDate { get; set; }

    public string? Description { get; set; }

    public virtual User? User { get; set; }
}
