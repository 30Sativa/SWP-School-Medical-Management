using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolMedicalManagement.Models.Request
{
    public class ChangePasswordUser
    {
        public string NewPassword { get; set; } = null!;
    }
}
