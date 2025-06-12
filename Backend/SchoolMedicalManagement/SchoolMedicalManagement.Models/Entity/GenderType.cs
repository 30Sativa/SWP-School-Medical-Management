using System;
using System.Collections.Generic;

namespace SchoolMedicalManagement.Models.Entity;

public partial class GenderType
{
    public int GenderId { get; set; }

    public string GenderName { get; set; } = null!;

    public virtual ICollection<Student> Students { get; set; } = new List<Student>();
}
