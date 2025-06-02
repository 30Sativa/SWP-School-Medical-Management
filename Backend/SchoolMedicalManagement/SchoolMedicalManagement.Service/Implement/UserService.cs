using SchoolMedicalManagement.Models.Entity;
using SchoolMedicalManagement.Repository.Repository;
using SchoolMedicalManagement.Repository.Response;
using SchoolMedicalManagement.Service.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolMedicalManagement.Service.Implement
{
    public class UserService : IUserService
    {
        private readonly UserRepository _userRepository;

        public UserService(UserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<List<UserListResponse>> GetAll()
        {
            var users = await _userRepository.GetAll();
            List<UserListResponse> userListResponse = new List<UserListResponse>();
            foreach (var user in users)
            {
                userListResponse.Add(new UserListResponse
                {
                    UserId = user.UserId,
                    FullName = user.FullName,
                    Role = user.Role.RoleName,
                    Phone = user.Phone,
                    Email = user.Email,
                    Address = user.Address
                });
            }
            return userListResponse;
        }

        public async Task<UserManagementResponse> GetUserById(int id)
        {
            var user = await _userRepository.GetUserById(id);
            var userManagementResponse = new UserManagementResponse
            {
                UserId = user.UserId,
                Username = user.Username,
                Password = user.Password,
                FullName = user.FullName,
                Role = user.Role.RoleName,
                Phone = user.Phone,
                Email = user.Email,
                Address = user.Address,
                IsFirstLogin = user.IsFirstLogin
            };
            return userManagementResponse;
        }
    }
}
