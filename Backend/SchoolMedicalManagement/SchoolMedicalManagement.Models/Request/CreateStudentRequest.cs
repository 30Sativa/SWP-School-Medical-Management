using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolMedicalManagement.Models.Request
{
    public class CreateStudentRequest
    {
        public string? FullName { get; set; }
        public DateOnly DateOfBirth { get; set; }
        public string? Gender { get; set; }
        public string? Class { get; set; }
        public int? ParentId { get; set; }
    }
}
