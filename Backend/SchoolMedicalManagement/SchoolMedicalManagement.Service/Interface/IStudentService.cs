using SchoolMedicalManagement.Models.Request;
using SchoolMedicalManagement.Models.Response;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SchoolMedicalManagement.Service.Interface
{
    public interface IStudentService
    {
        // Lấy danh sách toàn bộ học sinh
        Task<BaseResponse> GetStudentList();

        // Lấy thông tin chi tiết của 1 học sinh
        Task<BaseResponse> GetStudentById(int studentId);

        // Tạo học sinh mới
        Task<BaseResponse> CreateStudent(CreateStudentRequest request);

        // Cập nhật học sinh
        Task<BaseResponse> UpdateStudent(int id, UpdateStudentRequest request);

        // Xóa mềm học sinh
        Task<BaseResponse> DeleteStudent(int studentId);

        // Lấy hồ sơ sức khỏe theo StudentId
        Task<BaseResponse> GetHealthProfileByStudentId(GetHealthProfileRequest request);

        // Lấy danh sách học sinh của phụ huynh (ParentId)
        Task<BaseResponse> GetStudentsOfParent(Guid parentId); // nếu bạn dùng Guid thì sửa lại cho khớp

        // Lấy danh sách học sinh theo tên lớp
        Task<BaseResponse> GetStudentsByClass(string className);
    }
}