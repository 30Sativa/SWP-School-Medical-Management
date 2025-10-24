using SchoolMedicalManagement.Models.Request;
using SchoolMedicalManagement.Models.Response;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SchoolMedicalManagement.Service.Interface
{
    public interface IHealthCheckSummaryService
    {
        Task<BaseResponse> GetAllHealthCheckSummariesAsync();
        Task<BaseResponse?> GetHealthCheckSummaryByIdAsync(int id);
        Task<BaseResponse?> CreateHealthCheckSummaryAsync(CreateHealthCheckSummaryRequest request);
        Task<BaseResponse?> UpdateHealthCheckSummaryAsync(int id, UpdateHealthCheckSummaryRequest request);
        Task<BaseResponse> DeleteHealthCheckSummaryAsync(int id);
        Task<BaseResponse?> GetHealthCheckSummariesByStudentIdAsync(int studentId);
    }
} 
