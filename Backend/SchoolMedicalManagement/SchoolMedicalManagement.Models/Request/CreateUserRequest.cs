using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolMedicalManagement.Models.Request
{
    public class UserCreateRequest
    {
        public string Username { get; set; } = null!;

        public string Password { get; set; } = null!;

        public string? FullName { get; set; }

        public int RoleId { get; set; }

        public string? Phone { get; set; }

        public string? Email { get; set; }

        public string? Address { get; set; }

        public bool? IsFirstLogin { get; set; }
    }
}
