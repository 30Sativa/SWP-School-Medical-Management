using SchoolMedicalManagement.Models.Request;
using SchoolMedicalManagement.Models.Response;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SchoolMedicalManagement.Service.Interface
{
    public interface INotificationService
    {
        Task<List<NotificationManagementResponse>> GetAllNotificationsAsync();
        Task<List<NotificationManagementResponse>> GetNotificationsByUserIdAsync(Guid userId);
        Task<BaseResponse?> GetNotificationByIdAsync(int id);
        Task<BaseResponse?> CreateNotificationAsync(CreateNotificationRequest request);
        Task<bool> DeleteNotificationAsync(int id);
    }
} 