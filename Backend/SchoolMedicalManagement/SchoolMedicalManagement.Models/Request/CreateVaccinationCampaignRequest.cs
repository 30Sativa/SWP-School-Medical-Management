using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolMedicalManagement.Models.Request
{
    public class CreateVaccinationCampaignRequest
    {
        public string? VaccineName { get; set; }

        public DateOnly? Date { get; set; }

        public string? Description { get; set; }

        public Guid? CreatedBy { get; set; }
    }
}
