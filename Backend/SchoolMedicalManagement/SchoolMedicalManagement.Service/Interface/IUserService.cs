using SchoolMedicalManagement.Repository.Request;
using SchoolMedicalManagement.Repository.Response;
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

        
    }

}
