using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SchoolMedicalManagement.Models.Request;
using SchoolMedicalManagement.Models.Response;


namespace SchoolMedicalManagement.Service.Interface
{
    public interface IAuthService
    {
        Task<BaseResponse> Login(UserLoginRequest loginRequest);
        Task<BaseResponse> ChangePasswordAfterFirstLogin(int id,UserChangePasswordRequest request);
    }
}
