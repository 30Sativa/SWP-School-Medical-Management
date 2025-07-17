using SchoolMedicalManagement.Models.Request;
using SchoolMedicalManagement.Models.Response;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SchoolMedicalManagement.Service.Interface
{
    public interface INotificationService
    {
        Task<BaseResponse> GetAllNotificationsAsync();
        Task<BaseResponse> GetNotificationsByUserIdAsync(Guid userId);
        Task<BaseResponse?> GetNotificationByIdAsync(int id);
        Task<BaseResponse?> CreateNotificationAsync(CreateNotificationRequest request);
        Task<BaseResponse> DeleteNotificationAsync(int id);

        // Lấy danh sách tổng hợp thông báo cho phụ huynh
        Task<BaseResponse> GetParentNotificationsAsync(Guid parentId);
    }
}