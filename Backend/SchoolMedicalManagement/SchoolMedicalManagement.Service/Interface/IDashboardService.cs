using SchoolMedicalManagement.Models.Response;
using System.Threading.Tasks;

namespace SchoolMedicalManagement.Service.Interface
{
    public interface IDashboardService
    {
        Task<BaseResponse?> GetDashboardOverviewAsync();
    }
} 