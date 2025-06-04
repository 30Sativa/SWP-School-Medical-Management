using SchoolMedicalManagement.Models.Request;
using SchoolMedicalManagement.Models.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolMedicalManagement.Service.Interface
{
    public interface IUserService
    {
        Task<List<BaseResponse>> GetAll();
        Task<BaseResponse> GetUserById(int id);
        Task<BaseResponse> CreateUser(UserCreateRequest user);
        Task<BaseResponse> DeleteUser(int id);
        Task<BaseResponse> UpdateUser(int id, UserUpdateRequest user);
        
    }

}
