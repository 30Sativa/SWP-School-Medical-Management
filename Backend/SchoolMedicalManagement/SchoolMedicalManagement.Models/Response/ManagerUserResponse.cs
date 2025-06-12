using System;
using SchoolMedicalManagement.Models.Entity;

namespace SchoolMedicalManagement.Models.Response
{
    public class ManagerUserResponse
    {
        public Guid UserId { get; set; }                // Chuẩn với DB (UNIQUEIDENTIFIER)

        public string Username { get; set; } = null!;   // Tên đăng nhập

        public string? FullName { get; set; }           // Họ tên

        public Role Role { get; set; }                  // Thông tin vai trò

        public string? Phone { get; set; }              // Số điện thoại

        public string? Email { get; set; }              // Email

        public string? Address { get; set; }            // Địa chỉ

        public bool?IsFirstLogin { get; set; }          // Lần đầu đăng nhập
    }
}
