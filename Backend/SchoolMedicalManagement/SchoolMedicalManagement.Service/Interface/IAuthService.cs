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
        Task<BaseResponse> Login(LoginUserRequest loginRequest);
        Task<BaseResponse> ChangePasswordAfterFirstLogin(Guid id, ChangePasswordUserRequest request);
    }
}
