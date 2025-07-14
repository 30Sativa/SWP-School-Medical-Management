using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SchoolMedicalManagement.Models.Request;
using SchoolMedicalManagement.Models.Response;

namespace SchoolMedicalManagement.Service.Interface
{
    public interface IMedicalEventService
    {
        // ✅ Lấy chi tiết 1 sự kiện y tế theo ID
        Task<BaseResponse?> GetByIdMedicalEvent(int eventId);

        // ✅ Tạo mới sự kiện y tế
        Task<BaseResponse?> CreateMedicalEvent(CreateMedicalEventRequest request);

        // ✅ Cập nhật sự kiện y tế (gồm cả vật tư sử dụng)
        Task<BaseResponse?> UpdateMedicalEvent(int eventId, CreateMedicalEventRequest request);

        // ✅ Xoá mềm sự kiện y tế
        Task<BaseResponse> DeleteMedicalEvent(int eventId);

        // ✅ Danh sách tất cả sự kiện y tế (đang hoạt động)
        Task<BaseResponse> GetAllMedicalEvent();

        // ✅ Danh sách sự kiện y tế theo học sinh
        Task<BaseResponse?> GetMedicalEventsByStudentId(int studentId);

    }
}
