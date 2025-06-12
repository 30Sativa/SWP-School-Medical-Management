using SchoolMedicalManagement.Models.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolMedicalManagement.Models.Response
{
    public class ManagerStudentResponse
    {
        public int StudentId { get; set; }

        public string? FullName { get; set; }

        public DateOnly? DateOfBirth { get; set; }  

        public int? GenderId { get; set; }         // ✔️ có thể chuẩn hóa thêm nếu cần

        public string? GenderName { get; set; }
        public string? Class { get; set; }

        public Guid? ParentId { get; set; }         // ✔️ đúng kiểu với DB nếu đang dùng Guid

        public string? ParentName { get; set; }     // ✔️ rõ nghĩa hơn

    }
}
