using System;
using System.Collections.Generic;

namespace SchoolMedicalManagement.Models.Entity;

public partial class NotificationType
{
    public int TypeId { get; set; }

    public string TypeName { get; set; } = null!;

    public virtual ICollection<Notification> Notifications { get; set; } = new List<Notification>();
}
