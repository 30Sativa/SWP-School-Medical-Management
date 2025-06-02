using Microsoft.IdentityModel.Tokens;
using SchoolMedicalManagement.Models.Entity;
using SchoolMedicalManagement.Models.Utils;
using SchoolMedicalManagement.Repository.Repository;
using SchoolMedicalManagement.Repository.Request;
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

        public async Task<UserManagementResponse> CreateUser(UserCreateRequest user)
        {
            // Kiểm tra user đó tồn tại chưa
            var existingUser = await _userRepository.GetUserByUsername(user.Username);
            if (existingUser != null)
            {
                return null; // Username đã tồn tại
            }


            var newUser = new User
            {
                Username = user.Username,
                Password = HashPassword.HashPasswordd(user.Password),
                FullName = user.FullName,
                RoleId = user.RoleId,
                Phone = user.Phone,
                Email = user.Email,
                Address = user.Address,
                IsFirstLogin = true // Acc mới tạo
            };
            var createdUser = await _userRepository.CreateUser(newUser);

            
            // Nếu không thì trả về null
            if (createdUser == null)
            {
                return null; // Tạo người dùng không thành công
            }
            
            // Nếu tạo thành công thì trả về thông tin người dùng
            var response = new UserManagementResponse
            {
                UserId = createdUser.UserId,
                Username = createdUser.Username,
                Password = createdUser.Password,
                FullName = createdUser.FullName,
                Role = createdUser.Role.RoleName,
                Phone = createdUser.Phone,
                Email = createdUser.Email,
                Address = createdUser.Address,
                IsFirstLogin = createdUser.IsFirstLogin
            };
            return response;
        }

        public async Task<bool> DeleteUser(int id)
        {
            return await _userRepository.DeleteUser(id);
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

            // Nếu ko tìm thấy thì trả về null
            // tránh bị lỗi khi truy cập thuộc tính của user null
            if (user == null)
            {
                return null; // User not found
            }

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

        public async Task<UserManagementResponse> UpdateUser(int id, UserUpdateRequest request)
        {
            // Kiểm tra user cần update có tồn tại ko?
            var userToUpdate = await _userRepository.GetUserById(id);
            if (userToUpdate == null)
            {
                return null;
            }

            userToUpdate.Password = HashPassword.HashPasswordd(string.IsNullOrEmpty(request.Password) ? userToUpdate.Password : request.Password);
            userToUpdate.FullName = string.IsNullOrEmpty(request.FullName) ? userToUpdate.FullName : request.FullName;
            userToUpdate.Phone = string.IsNullOrEmpty(request.Phone) ? userToUpdate.Phone : request.Phone;
            userToUpdate.Email = string.IsNullOrEmpty(request.Email) ? userToUpdate.Email : request.Email;
            userToUpdate.Address = string.IsNullOrEmpty(request.Address) ? userToUpdate.Address : request.Address;
            // Nếu không có thay đổi gì thì trả về null
            var updatedUser = await _userRepository.UpdateUser(userToUpdate);
            if (updatedUser == null)
            {
                return null; // Update không thành công
            }

            // Trả về thông tin người dùng sau khi cập nhật
            var response = new UserManagementResponse
            {
                UserId = updatedUser.UserId,
                Username = updatedUser.Username,
                Password = updatedUser.Password,
                FullName = updatedUser.FullName,
                Role = updatedUser.Role.RoleName,
                Phone = updatedUser.Phone,
                Email = updatedUser.Email,
                Address = updatedUser.Address,
                IsFirstLogin = updatedUser.IsFirstLogin
            };

            return response;

        }
    }
}
