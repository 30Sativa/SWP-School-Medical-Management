using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolMedicalManagement.Models.Response
{
    public class MedicationRequestResponse
    {
        public int RequestID { get; set; }
        public string StudentName { get; set; }
        public string MedicationName { get; set; }
        public string Dosage { get; set; }
        public string Instructions { get; set; }
        public string Status { get; set; }
        public DateTime RequestDate { get; set; }
    }
}
