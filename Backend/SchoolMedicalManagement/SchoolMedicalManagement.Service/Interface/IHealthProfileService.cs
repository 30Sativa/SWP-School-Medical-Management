using SchoolMedicalManagement.Models.Request;
using SchoolMedicalManagement.Models.Response;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SchoolMedicalManagement.Service.Interface
{
    public interface IHealthProfileService
    {
        // ✅ Lấy danh sách tất cả hồ sơ sức khỏe (kèm thông tin học sinh)
        Task<List<ManagerHealthProfileResponse>> GetAllHealthProfilesAsync();

        // ✅ Lấy danh sách tất cả hồ sơ sức khỏe bao gồm cả IsActive = false
        Task<List<ManagerHealthProfileResponse>> GetAllHealthProfilesIncludeInactiveAsync();

        // ✅ Lấy chi tiết một hồ sơ sức khỏe theo ID
        Task<BaseResponse?> GetHealthProfileByIdAsync(int profileId);

        // ✅ Tạo mới hồ sơ sức khỏe
        Task<BaseResponse?> CreateHealthProfileAsync(CreateHealthProfileRequest request);

        // ✅ Cập nhật hồ sơ sức khỏe
        Task<BaseResponse?> UpdateHealthProfileAsync(int profileId, UpdateHealthProfileRequest request);

        // ✅ Cập nhật trạng thái IsActive của hồ sơ sức khỏe
        Task<BaseResponse?> UpdateHealthProfileStatusAsync(int profileId, UpdateHealthProfileStatusRequest request);

        // ✅ Xoá mềm hồ sơ sức khỏe
        Task<bool> DeleteHealthProfileAsync(int profileId);

        // ✅ Lấy hồ sơ sức khỏe theo StudentId
        Task<BaseResponse?> GetHealthProfileByStudentIdAsync(int studentId);

        // ✅ Cập nhật hồ sơ sức khỏe theo StudentId
        Task<BaseResponse?> UpdateHealthProfileByStudentIdAsync(int studentId, UpdateHealthProfileRequest request);
    }
}
