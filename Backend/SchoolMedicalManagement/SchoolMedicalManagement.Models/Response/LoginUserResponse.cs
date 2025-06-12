using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SchoolMedicalManagement.Models.Entity;

namespace SchoolMedicalManagement.Models.Response
{
    public class LoginUserResponse
    {
        public Guid UserId { get; set; }                // ✅ sửa từ int → Guid

        public string FullName { get; set; } = null!;

        public string RoleName { get; set; } = null!;    // ✅ thay vì trả cả object Role

        public bool IsFirstLogin { get; set; }           // ✅ bool không nullable là đủ

        public string Token { get; set; } = null!;

    }
}
