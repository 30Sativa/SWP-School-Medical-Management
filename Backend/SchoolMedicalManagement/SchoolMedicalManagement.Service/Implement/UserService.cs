using Microsoft.IdentityModel.Tokens;
using SchoolMedicalManagement.Models.Entity;
using SchoolMedicalManagement.Models.Utils;
using SchoolMedicalManagement.Repository.Repository;
using SchoolMedicalManagement.Models.Request;
using SchoolMedicalManagement.Models.Response;
using SchoolMedicalManagement.Service.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace SchoolMedicalManagement.Service.Implement
{
    public class UserService : IUserService
    {
        private readonly UserRepository _userRepository;

        public UserService(UserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<BaseResponse> CreateUser(UserCreateRequest user)
        {
            // Kiểm tra username đó tồn tại chưa
            var existingUser = await _userRepository.GetUserByUsername(user.Username);
            if (existingUser != null)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status400BadRequest.ToString(),
                    Message = "Username already exists.",
                    Data = null
                };
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
                return new BaseResponse { 
                    Status = StatusCodes.Status400BadRequest.ToString(), 
                    Message = "Create Fail", 
                    Data = null 
                }; // Tạo người dùng không thành công
            }

            // Nếu tạo thành công thì trả về thông tin người dùng
            var response = new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = "Create user successfully.",
                Data = new UserManagementResponse
                {
                    UserId = createdUser.UserId,
                    Username = createdUser.Username,
                    Password = createdUser.Password,
                    FullName = createdUser.FullName,
                    Role = new Role
                    {
                        RoleId = createdUser.Role.RoleId,
                        RoleName = createdUser.Role.RoleName
                    },
                    Phone = createdUser.Phone,
                    Email = createdUser.Email,
                    Address = createdUser.Address,
                    IsFirstLogin = createdUser.IsFirstLogin
                }
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
                    Role = new Role
                    {
                        RoleId = user.Role.RoleId,
                        RoleName = user.Role.RoleName
                    },
                    Phone = user.Phone,
                    Email = user.Email,
                    Address = user.Address
                });
            }
            return userListResponse;
        }

        public async Task<BaseResponse> GetUserById(int id)
        {
            var user = await _userRepository.GetUserById(id);

            // Nếu ko tìm thấy thì trả về null
            // tránh bị lỗi khi truy cập thuộc tính của user null
            if (user == null)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status404NotFound.ToString(),
                    Message = $"User with ID {id} not found.",
                    Data = null
                }; // User not found
            }

            var userManagementResponse = new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = "User found successfully.",
                Data = new UserManagementResponse
                {
                    UserId = user.UserId,
                    Username = user.Username,
                    Password = user.Password,
                    FullName = user.FullName,
                    Role = new Role
                    {
                        RoleId = user.Role.RoleId,
                        RoleName = user.Role.RoleName
                    },
                    Phone = user.Phone,
                    Email = user.Email,
                    Address = user.Address,
                    IsFirstLogin = user.IsFirstLogin
                }
            };
            return userManagementResponse;
        }


        // Sau khi suy nghĩ lại thì hàm update này ko nên update password
        // vì password là thông tin nhạy cảm, nên tách riêng ra thành hàm update password
        // Thấy không Văn Thành?
        public async Task<UserManagementResponse> UpdateUser(int id, UserUpdateRequest request)

        public async Task<BaseResponse> UpdateUser(int id, UserUpdateRequest request)

        {
            // Kiểm tra user cần update có tồn tại ko?
            var userToUpdate = await _userRepository.GetUserById(id);
            if (userToUpdate == null)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status404NotFound.ToString(),
                    Message = $"User with ID {id} not found.",
                    Data = null
                }; // User not found
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
                return new BaseResponse
                {
                    Status = StatusCodes.Status400BadRequest.ToString(),
                    Message = "Update failed. Please check the request data.",
                    Data = null
                }; // Update không thành công
            }

            // Trả về thông tin người dùng sau khi cập nhật
            var response = new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = "User updated successfully.",
                Data = new UserManagementResponse
                {
                    UserId = updatedUser.UserId,
                    Username = updatedUser.Username,
                    Password = updatedUser.Password,
                    FullName = updatedUser.FullName,
                    Role = new Role
                    {
                        RoleId = updatedUser.Role.RoleId,
                        RoleName = updatedUser.Role.RoleName
                    },
                    Phone = updatedUser.Phone,
                    Email = updatedUser.Email,
                    Address = updatedUser.Address,
                    IsFirstLogin = updatedUser.IsFirstLogin
                }
            };
            return response;

        }
    }
}
