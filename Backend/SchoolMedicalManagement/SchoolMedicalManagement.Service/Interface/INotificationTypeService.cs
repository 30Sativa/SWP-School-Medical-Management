using SchoolMedicalManagement.Models.Request;
using SchoolMedicalManagement.Models.Response;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SchoolMedicalManagement.Service.Interface
{
    public interface INotificationTypeService
    {
        Task<BaseResponse> GetAllNotificationTypesAsync();
        Task<BaseResponse?> GetNotificationTypeByIdAsync(int id);
        Task<BaseResponse?> CreateNotificationTypeAsync(CreateNotificationTypeRequest request);
        Task<BaseResponse?> UpdateNotificationTypeAsync(int id, UpdateNotificationTypeRequest request);
        Task<BaseResponse> DeleteNotificationTypeAsync(int id);
    }
} 