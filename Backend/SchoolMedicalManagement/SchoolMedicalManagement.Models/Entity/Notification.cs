using System;
using System.Collections.Generic;

namespace SchoolMedicalManagement.Models.Entity;

public partial class Notification
{
    public int NotificationId { get; set; }

    public Guid ReceiverId { get; set; }

    public string? Title { get; set; }

    public string? Message { get; set; }

    public int TypeId { get; set; }

    public bool? IsRead { get; set; }

    public DateTime? SentDate { get; set; }

    public virtual User Receiver { get; set; } = null!;

    public virtual NotificationType Type { get; set; } = null!;
}
