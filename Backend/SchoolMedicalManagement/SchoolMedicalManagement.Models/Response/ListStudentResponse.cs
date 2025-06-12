using SchoolMedicalManagement.Models.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolMedicalManagement.Models.Response
{
    public class ListStudentResponse
    {
        public int StudentId { get; set; }

        public string? FullName { get; set; }

        public DateOnly? DateOfBirth { get; set; }

        public string? Gender { get; set; }            // Đã map từ entity: GenderType.GenderName

        public string? ClassName { get; set; }         // 👉 nên đổi "Class" → "ClassName" để tránh nhầm từ khóa C#

        public string? ParentName { get; set; }

        public Guid? ParentId { get; set; }

        public bool? IsActive { get; set; }

    }
}
