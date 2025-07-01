using System;
using System.Collections.Generic;

namespace SchoolMedicalManagement.Models.Entity;

public partial class CampaignStatus
{
    public int StatusId { get; set; }

    public string StatusName { get; set; } = null!;

    public virtual ICollection<HealthCheckCampaign> HealthCheckCampaigns { get; set; } = new List<HealthCheckCampaign>();

    public virtual ICollection<VaccinationCampaign> VaccinationCampaigns { get; set; } = new List<VaccinationCampaign>();
}
