using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolMedicalManagement.Models.Request
{
    public class CreateMedicalHistoryRequest
    {
        public int StudentId { get; set; }
        public string DiseaseName { get; set; }
        public string? Note { get; set; }
        public DateOnly? DiagnosedDate { get; set; }
    }
}
