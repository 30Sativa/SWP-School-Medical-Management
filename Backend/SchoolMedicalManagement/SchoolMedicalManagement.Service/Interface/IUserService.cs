using SchoolMedicalManagement.Models.Request;
using SchoolMedicalManagement.Models.Response;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SchoolMedicalManagement.Service.Interface
{
    public interface IUserService
    {
        // Lấy danh sách tất cả user đang hoạt động (IsActive = true)
        Task<BaseResponse> GetAllUserAsync();

        // Lấy thông tin chi tiết user theo ID
        Task<BaseResponse> GetUserByIdAsync(Guid id);

        // Tạo mới user
        Task<BaseResponse> CreateUserAsync(CreateUserRequest user);

        // ✅ Xoá mềm user (IsActive = false)
        Task<BaseResponse> SoftDeleteUserAsync(Guid id);

        // Cập nhật thông tin user
        Task<BaseResponse> UpdateUserAsync(Guid id, UpdateUserRequest user);
    }
}
