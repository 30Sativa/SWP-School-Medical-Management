using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolMedicalManagement.Models.Response
{
    public class ChangePasswordUserResponse
    {
        public Guid UserId { get; set; }               // ✅ sửa từ int → Guid, đồng bộ với DB

        public string FullName { get; set; } = null!;

        public string RoleName { get; set; } = null!;

        public string? Email { get; set; }             // ✅ có thể để nullable (tuỳ nếu không bắt buộc)

        public string? Phone { get; set; }             // ✅ tương tự, tránh crash khi null

        public bool? IsFirstLogin { get; set; }
    }
}
