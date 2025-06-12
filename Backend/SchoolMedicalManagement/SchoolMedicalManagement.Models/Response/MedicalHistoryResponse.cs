using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolMedicalManagement.Models.Response
{
    public class MedicalHistoryResponse
    {
        public int HistoryId { get; set; }
        public int StudentId { get; set; }
        public string StudentName { get; set; } = string.Empty;
        public string DiseaseName { get; set; } = string.Empty;
        public string? Note { get; set; }
        public DateOnly? DiagnosedDate { get; set; }
    }
}
