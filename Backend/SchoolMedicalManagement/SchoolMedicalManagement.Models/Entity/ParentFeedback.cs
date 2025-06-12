using System;
using System.Collections.Generic;

namespace SchoolMedicalManagement.Models.Entity;

public partial class ParentFeedback
{
    public int FeedbackId { get; set; }

    public Guid? ParentId { get; set; }

    public string? RelatedType { get; set; }

    public int? RelatedId { get; set; }

    public string? Content { get; set; }

    public int? Rating { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual User? Parent { get; set; }
}
