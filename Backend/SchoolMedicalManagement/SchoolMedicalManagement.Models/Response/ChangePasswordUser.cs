using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolMedicalManagement.Models.Response
{
    public class ChangePasswordUser
    {
        public int UserId { get; set; }
        public string FullName { get; set; } = null!;
        public string RoleName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Phone { get; set; } = null!;
        public bool IsFirstLogin { get; set; }
    }
}
