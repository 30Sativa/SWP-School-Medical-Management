using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolMedicalManagement.Models.Response
{
    public class CreateVaccinationCampaignResponse
    {
        public int CampaignId { get; set; }

        public string? VaccineName { get; set; }

        public DateOnly? Date { get; set; }

        public string? Description { get; set; }

        public int? CreatedBy { get; set; }

        public string? CreateByName { get; set; }
    }
}
