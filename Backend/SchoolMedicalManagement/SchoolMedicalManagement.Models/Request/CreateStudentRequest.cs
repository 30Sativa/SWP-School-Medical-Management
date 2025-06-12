using System;
using System.ComponentModel.DataAnnotations;

namespace SchoolMedicalManagement.Models.Request
{
    public class CreateStudentRequest
    {
        [Required]
        public string FullName { get; set; } = null!;

        [Required]
        public DateOnly? DateOfBirth { get; set; }   // chuyển từ DateOnly → DateTime để hỗ trợ JSON tốt hơn

        [Required]
        public int GenderId { get; set; }           // sửa từ string → int

        public string? Class { get; set; }          // giữ tên rõ ràng và không cần đổi ClassName

        [Required]
        public Guid ParentId { get; set; }
    }
}
