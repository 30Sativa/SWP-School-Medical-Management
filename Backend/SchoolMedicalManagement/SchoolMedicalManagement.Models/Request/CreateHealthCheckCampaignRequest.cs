using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolMedicalManagement.Models.Request
{
    public class CreateHealthCheckCampaignRequest
    {
        public string? Title { get; set; }

        public DateOnly? Date { get; set; }

        public string? Description { get; set; }

        public Guid? CreatedBy { get; set; }

        public int? StatusId { get; set; }
    }
}
