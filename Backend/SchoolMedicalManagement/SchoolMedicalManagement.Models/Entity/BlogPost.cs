using System;
using System.Collections.Generic;

namespace SchoolMedicalManagement.Models.Entity;

public partial class BlogPost
{
    public int PostId { get; set; }

    public string? Title { get; set; }

    public string? Content { get; set; }

    public int? AuthorId { get; set; }

    public DateOnly? PostedDate { get; set; }

    public bool? IsActive { get; set; }

    public virtual User? Author { get; set; }
}
