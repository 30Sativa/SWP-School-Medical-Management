using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolMedicalManagement.Models.Request
{
    public class CreateHealthProfileRequest
    {
        public int StudentId { get; set; }                       // Bắt buộc

        public decimal? Height { get; set; }                      // Có thể null
        public decimal? Weight { get; set; }                      // Có thể null

        public string? ChronicDiseases { get; set; }             // Bệnh mãn tính
        public string? Allergies { get; set; }                   // Dị ứng
        public string? GeneralNote { get; set; }                 // Ghi chú chung
    }
}
