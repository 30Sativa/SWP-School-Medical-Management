using SchoolMedicalManagement.Models.Request;
using SchoolMedicalManagement.Models.Response;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SchoolMedicalManagement.Service.Interface
{
    public interface IMedicalEventTypeService
    {
        Task<List<MedicalEventTypeManagementResponse>> GetAllMedicalEventTypesAsync();
        Task<BaseResponse?> GetMedicalEventTypeByIdAsync(int id);
        Task<BaseResponse?> CreateMedicalEventTypeAsync(CreateMedicalEventTypeRequest request);
        Task<BaseResponse?> UpdateMedicalEventTypeAsync(int id, UpdateMedicalEventTypeRequest request);
        Task<bool> DeleteMedicalEventTypeAsync(int id);
    }
}