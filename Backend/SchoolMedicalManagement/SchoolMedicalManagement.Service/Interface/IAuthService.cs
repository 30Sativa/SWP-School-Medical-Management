using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SchoolMedicalManagement.Repository.Request;
using SchoolMedicalManagement.Repository.Response;

namespace SchoolMedicalManagement.Service.Interface
{
    public interface IAuthService
    {
        Task<UserLoginResponse> Login(UserLoginRequest loginRequest);
    }
}
