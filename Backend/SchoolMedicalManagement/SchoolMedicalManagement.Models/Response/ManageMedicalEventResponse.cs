using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SchoolMedicalManagement.Models.Entity;

namespace SchoolMedicalManagement.Models.Response
{
    public class ManageMedicalEventResponse
    {
        public int? StudentID { get; set; }
        public string? StudentName { get; set; } = string.Empty;
        public string ParentName { get; set; } = string.Empty;
        public int? HandledBy { get; set; }
        public string? HandledByName { get; set; } = string.Empty;


        public string EventType { get; set; } = string.Empty;
        public DateOnly? EventDate { get; set; }
        public string? Description { get; set; }
        public string? Note { get; set; }



        
    }
}
