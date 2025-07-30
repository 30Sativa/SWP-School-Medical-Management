using Microsoft.AspNetCore.Http;
using SchoolMedicalManagement.Models.Entity;
using SchoolMedicalManagement.Models.Utils;
using SchoolMedicalManagement.Models.Request;
using SchoolMedicalManagement.Models.Response;
using SchoolMedicalManagement.Repository.Repository;
using SchoolMedicalManagement.Service.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SchoolMedicalManagement.Models.Exceptions;

namespace SchoolMedicalManagement.Service.Implement
{
    public class UserService : IUserService
    {
        private readonly UserRepository _userRepository;

        public UserService(UserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<BaseResponse> CreateUserAsync(CreateUserRequest user)
        {
            // Kiểm tra xem username đã tồn tại trong hệ thống hay chưa, tránh trùng tài khoản đăng nhập.
            var existingUser = await _userRepository.GetUserByUsername(user.Username);
            if (existingUser != null)
            {
               throw new BusinessException("Tên đăng nhập đã tồn tại.", StatusCodes.Status400BadRequest);
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
                IsFirstLogin = true,
                IsActive = true
            };

            var createdUser = await _userRepository.CreateUser(newUser);
            if (createdUser == null)
            {
                throw new BusinessException("Tạo người dùng thất bại.", StatusCodes.Status400BadRequest);
            }

            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = "Tạo người dùng thành công.",
                Data = new ManagerUserResponse
                {
                    UserId = createdUser.UserId,
                    Username = createdUser.Username,

                    FullName = createdUser.FullName,
                    RoleName = createdUser.Role.RoleName,
                    Phone = createdUser.Phone,
                    Email = createdUser.Email,
                    Address = createdUser.Address,
                    IsFirstLogin = createdUser.IsFirstLogin,
                }
            };
        }

        public async Task<BaseResponse> SoftDeleteUserAsync(Guid id)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null)
            {
                throw new BusinessException($"Không tìm thấy người dùng với ID {id}.", StatusCodes.Status404NotFound);
            }

            var result = await _userRepository.SoftDeleteUser(id);
            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = result ? "Xóa người dùng thành công." : "Xóa người dùng thất bại.",
                Data = null
            };
        }

        public async Task<BaseResponse> GetAllUserAsync()
        {
            var users = await _userRepository.GetAllUser();
            var data = users.Select(user => new ListUserResponse
            {
                UserID = user.UserId,
                Username = user.Username,
                FullName = user.FullName,
                RoleID = user.RoleId,
                RoleName = user.Role.RoleName,
                Phone = user.Phone,
                Email = user.Email,
                Address = user.Address,
                IsActive = user.IsActive
            }).ToList();
            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = "Lấy danh sách người dùng thành công.",
                Data = data
            };
        }

        public async Task<BaseResponse> GetUserByIdAsync(Guid id)
        {
            var user = await _userRepository.GetUserById(id);
            if (user == null)
            {
                throw new BusinessException($"Không tìm thấy người dùng với ID {id}.", StatusCodes.Status404NotFound);
            }

            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = "Tìm thấy người dùng thành công.",
                Data = new ManagerUserResponse
                {
                    UserId = user.UserId,
                    Username = user.Username,
                    FullName = user.FullName,
                    RoleName = user.Role.RoleName,
                    Phone = user.Phone,
                    Email = user.Email,
                    Address = user.Address,
                    IsFirstLogin = user.IsFirstLogin
                }
            };
        }

        public async Task<BaseResponse> UpdateUserAsync(Guid id, UpdateUserRequest request)
        {
            var userToUpdate = await _userRepository.GetByIdAsync(id);
            if (userToUpdate == null)
            {
                throw new BusinessException($"Không tìm thấy người dùng với ID {id}.", StatusCodes.Status404NotFound);
            }

            userToUpdate.FullName = string.IsNullOrEmpty(request.FullName) ? userToUpdate.FullName : request.FullName;
            userToUpdate.Phone = string.IsNullOrEmpty(request.Phone) ? userToUpdate.Phone : request.Phone;
            userToUpdate.Email = string.IsNullOrEmpty(request.Email) ? userToUpdate.Email : request.Email;
            userToUpdate.Address = string.IsNullOrEmpty(request.Address) ? userToUpdate.Address : request.Address;
            userToUpdate.RoleId = request.RoleID;

            // Dòng này cho phép cập nhật trạng thái hoạt động, bạn có thể kiểm tra thêm quyền hạn người cập nhật để tránh abuse từ role thấp.
            userToUpdate.IsActive = request.IsActive;

            var updatedUser = await _userRepository.UpdateUser(userToUpdate);
            if (updatedUser == null)
            {
                throw new BusinessException("Cập nhật người dùng thất bại.", StatusCodes.Status400BadRequest);
            }

            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = "Cập nhật người dùng thành công.",
                Data = new ManagerUserResponse
                {
                    UserId = updatedUser.UserId,
                    Username = updatedUser.Username,
                    FullName = updatedUser.FullName,
                    RoleName = updatedUser.Role.RoleName,
                    Phone = updatedUser.Phone,
                    Email = updatedUser.Email,
                    Address = updatedUser.Address,
                    IsFirstLogin = updatedUser.IsFirstLogin
                }
            };
        }
    }
}
