using SchoolMedicalManagement.Models.Request;
using SchoolMedicalManagement.Models.Response;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SchoolMedicalManagement.Service.Interface
{
    public interface IHealthCheckSummaryService
    {
        Task<List<HealthCheckSummaryManagementResponse>> GetAllHealthCheckSummariesAsync();
        Task<BaseResponse?> GetHealthCheckSummaryByIdAsync(int id);
        Task<BaseResponse?> CreateHealthCheckSummaryAsync(CreateHealthCheckSummaryRequest request);
        Task<BaseResponse?> UpdateHealthCheckSummaryAsync(int id, UpdateHealthCheckSummaryRequest request);
        Task<bool> DeleteHealthCheckSummaryAsync(int id);
    }
} 