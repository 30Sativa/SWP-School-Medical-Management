using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SchoolMedicalManagement.Models.Entity;

namespace SchoolMedicalManagement.Models.Response
{
    
    public class ManagerUserResponse
    {
        public int UserId { get; set; }

        public string Username { get; set; } = null!;

        public string Password { get; set; } = null!;

        public string? FullName { get; set; }

        public Role Role { get; set; }

        public string? Phone { get; set; }

        public string? Email { get; set; }

        public string? Address { get; set; }

        public bool? IsFirstLogin { get; set; }
    }
}
