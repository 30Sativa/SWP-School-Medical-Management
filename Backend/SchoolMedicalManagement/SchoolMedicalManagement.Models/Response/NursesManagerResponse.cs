using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SchoolMedicalManagement.Models.Entity;

namespace SchoolMedicalManagement.Models.Response
{
    public class NursesManagerResponse
    {
        public Student Student { get; set; }

        public string? EventType { get; set; }

        public DateOnly? EventDate { get; set; }

        public string? Description { get; set; }

        public int? HandledBy { get; set; }

        public string? Notes { get; set; }
    }
}
