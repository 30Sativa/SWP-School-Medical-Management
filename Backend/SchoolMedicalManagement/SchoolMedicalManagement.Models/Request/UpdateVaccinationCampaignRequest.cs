using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolMedicalManagement.Models.Request
{
    public class UpdateVaccinationCampaignRequest : CreateVaccinationCampaignRequest
    {
        public int CampaignId { get; set; }
    }
} 