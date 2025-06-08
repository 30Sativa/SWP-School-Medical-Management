using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SchoolMedicalManagement.Models.Entity;

namespace SchoolMedicalManagement.Models.Response
{
    public class LoginUserRespsonse
    {
        public int UserId { get; set; } 

        public string? FullName { get; set; } = null!;
        public Role Role { get; set; } = null!;

        public bool? IsFirstLogin { get; set; } 
        public string Token { get; set; } = null!;

    }
}
