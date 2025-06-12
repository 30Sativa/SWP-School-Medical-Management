using System;
using System.Collections.Generic;

namespace SchoolMedicalManagement.Models.Entity;

public partial class User
{
    public Guid UserId { get; set; }

    public string Username { get; set; } = null!;

    public string Password { get; set; } = null!;

    public string? FullName { get; set; }

    public int RoleId { get; set; }

    public string? Phone { get; set; }

    public string? Email { get; set; }

    public string? Address { get; set; }

    public bool? IsFirstLogin { get; set; }

    public bool? IsActive { get; set; }

    public virtual ICollection<AuditLog> AuditLogs { get; set; } = new List<AuditLog>();

    public virtual ICollection<BlogPost> BlogPosts { get; set; } = new List<BlogPost>();

    public virtual ICollection<HealthCheckCampaign> HealthCheckCampaigns { get; set; } = new List<HealthCheckCampaign>();

    public virtual ICollection<MedicalEvent> MedicalEvents { get; set; } = new List<MedicalEvent>();

    public virtual ICollection<MedicationRequest> MedicationRequestParents { get; set; } = new List<MedicationRequest>();

    public virtual ICollection<MedicationRequest> MedicationRequestReceivedByNavigations { get; set; } = new List<MedicationRequest>();

    public virtual ICollection<Notification> Notifications { get; set; } = new List<Notification>();

    public virtual ICollection<ParentFeedback> ParentFeedbacks { get; set; } = new List<ParentFeedback>();

    public virtual Role Role { get; set; } = null!;

    public virtual ICollection<Student> Students { get; set; } = new List<Student>();

    public virtual ICollection<VaccinationCampaign> VaccinationCampaigns { get; set; } = new List<VaccinationCampaign>();

    public virtual ICollection<VaccinationConsentRequest> VaccinationConsentRequests { get; set; } = new List<VaccinationConsentRequest>();
}
