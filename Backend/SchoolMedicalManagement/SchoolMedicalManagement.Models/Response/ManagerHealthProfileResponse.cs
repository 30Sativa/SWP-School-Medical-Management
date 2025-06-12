using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolMedicalManagement.Models.Response
{
    public class ManagerHealthProfileResponse
    {
        public int ProfileId { get; set; }

        public int? StudentId { get; set; }          // FK

        public decimal? Height { get; set; }         // cm

        public decimal? Weight { get; set; }         // kg

        public string? ChronicDiseases { get; set; } // bệnh nền (nullable)

        public string? Allergies { get; set; }       // dị ứng

        public string? GeneralNote { get; set; }     // ghi chú

        public bool? IsActive { get; set; } = true;   // soft-delete
    }
}
