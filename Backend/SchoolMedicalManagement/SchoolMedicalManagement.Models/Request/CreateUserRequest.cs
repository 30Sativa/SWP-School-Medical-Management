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
        [MinLength(6, ErrorMessage = "Mật khẩu phải có ít nhất 6 ký tự.")]
        public string Password { get; set; } = null!;

        [Required]
        public string FullName { get; set; } = null!;

        [Required]
        public int RoleId { get; set; }  // ✅ Tên thuộc tính đúng chuẩn PascalCase và đồng bộ (không dùng `RoleID`)

        [Phone(ErrorMessage = "Định dạng số điện thoại không hợp lệ.")]
        public string Phone { get; set; } = null!;

        [EmailAddress(ErrorMessage = "Định dạng email không hợp lệ.")]
        public string Email { get; set; } = null!;

        public string? Address { get; set; }
    }
}
