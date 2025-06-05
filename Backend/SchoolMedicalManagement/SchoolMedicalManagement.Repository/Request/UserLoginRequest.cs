using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolMedicalManagement.Repository.Request
{
    public class UserLoginRequest
    {

        public string Username { get; set; } = null!;

        public string Password { get; set; } = null!;

    }
}
