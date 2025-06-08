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
        Task<List<UserListResponse>> GetAll();
        Task<BaseResponse> GetUserById(int id);
        Task<BaseResponse> CreateUser(CreateUserRequest user);
        Task<bool> DeleteUser(int id);
        Task<BaseResponse> UpdateUser(int id, UpdateUserRequest user);
        
    }

}
