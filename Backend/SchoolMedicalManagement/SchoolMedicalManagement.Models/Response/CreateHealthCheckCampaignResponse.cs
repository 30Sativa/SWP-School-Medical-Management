using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolMedicalManagement.Models.Response
{
    public class CreateHealthCheckCampaignResponse
    {
        public string? Title { get; set; }

        public DateOnly? Date { get; set; }

        public string? Description { get; set; }

        public int? CreatedBy { get; set; }

        public string? CreatedByName { get; set; }
    }
}
