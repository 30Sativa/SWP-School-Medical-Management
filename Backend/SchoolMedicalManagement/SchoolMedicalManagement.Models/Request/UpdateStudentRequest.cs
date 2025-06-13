using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolMedicalManagement.Models.Request
{
    public class UpdateStudentRequest
    {
        //[Required]
        //public int StudentId { get; set; }

        //[Required]
        public string FullName { get; set; } = null!;

        //[Required]
        public DateOnly? DateOfBirth { get; set; }

        public int GenderId { get; set; }

        //public string? GenderName { get; set; }

        public string? ClassName { get; set; }


        public Guid? ParentId { get; set; }  // nếu luôn yêu cầu chọn parent mới
    }
}
