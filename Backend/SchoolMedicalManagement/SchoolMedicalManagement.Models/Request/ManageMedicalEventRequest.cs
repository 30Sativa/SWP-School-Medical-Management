using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolMedicalManagement.Models.Request
{
    public class ManageMedicalEventRequest
    {
        public int StudentId { get; set; }
        public string EventType { get; set; }

        public DateOnly EventDate { get; set; }
        public string? Description { get; set; }
        public int? HandledBy { get; set; }
        public string? Note { get; set; }


    }
}
