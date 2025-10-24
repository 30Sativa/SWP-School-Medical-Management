using SchoolMedicalManagement.Models.Response;
using System;
using System.Threading.Tasks;

namespace SchoolMedicalManagement.Service.Interface
{
    public interface IDashboardService
    {
        Task<BaseResponse?> GetDashboardOverviewAsync();
        
        // Thêm method mới để lấy thống kê chi tiết chiến dịch tiêm chủng
        Task<BaseResponse?> GetVaccinationCampaignStatisticsAsync();

        Task<BaseResponse?> GetHealthStatisticsAsync();
        Task<BaseResponse?> GetMedicalEventsStatisticsAsync();
        Task<BaseResponse?> GetMedicationStatisticsAsync();
        
        // Dashboard cho phụ huynh
        Task<BaseResponse?> GetParentDashboardOverviewAsync(Guid parentId);
    }
} 