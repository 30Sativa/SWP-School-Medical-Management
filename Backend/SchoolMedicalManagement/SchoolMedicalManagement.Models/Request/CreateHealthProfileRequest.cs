using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolMedicalManagement.Models.Request
{
    public class CreateHealthProfileRequest
    {
        public int ProfileId { get; set; }

        public int StudentId { get; set; }

        public string? Height { get; set; }

        public string? Weight { get; set; }

        public string? ChronicDiseases { get; set; }

        public string? Allergies { get; set; }

        public string? GeneralNote { get; set; }

        public bool? IsActive { get; set; }
    }
}
