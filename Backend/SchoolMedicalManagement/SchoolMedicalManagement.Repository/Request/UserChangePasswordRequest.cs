using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolMedicalManagement.Repository.Request
{
    public class UserChangePasswordRequest
    {
        public int UserId { get; set; }
        public string NewPassword { get; set; } = null!;
    }
}
