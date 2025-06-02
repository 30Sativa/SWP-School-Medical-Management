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
        Task<UserManagementResponse> GetUserById(int id);
        Task<UserManagementResponse> CreateUser(UserCreateRequest user);
        Task<bool> DeleteUser(int id);
        Task<UserManagementResponse> UpdateUser(int id, UserUpdateRequest user);
        
    }

}
