using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace SchoolMedicalManagement.Models.Request
{
    public class CreateMedicationRequest
    {
        public int StudentID { get; set; }
        public string MedicationName { get; set; } = null!;
        public string Dosage { get; set; } = null!;
        public string Instructions { get; set; } = null!;
        public IFormFile? ImageFile { get; set; }  // ✅ Đây là ảnh thật
    }
}
