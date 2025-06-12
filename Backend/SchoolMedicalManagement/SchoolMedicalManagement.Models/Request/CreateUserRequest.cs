using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolMedicalManagement.Models.Request
{
    public class CreateUserRequest
    {
        [Required]
        public string Username { get; set; } = null!;

        [Required]
        [MinLength(6, ErrorMessage = "Password must be at least 6 characters.")]
        public string Password { get; set; } = null!;

        [Required]
        public string FullName { get; set; } = null!;

        [Required]
        public int RoleId { get; set; }  // ✅ Tên thuộc tính đúng chuẩn PascalCase và đồng bộ (không dùng `RoleID`)

        [Phone(ErrorMessage = "Invalid phone number format.")]
        public string Phone { get; set; } = null!;

        [EmailAddress(ErrorMessage = "Invalid email format.")]
        public string Email { get; set; } = null!;

        public string? Address { get; set; }
    }
}
