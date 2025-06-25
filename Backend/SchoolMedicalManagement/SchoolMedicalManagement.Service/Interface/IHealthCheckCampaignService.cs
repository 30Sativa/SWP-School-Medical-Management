using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SchoolMedicalManagement.Models.Request;
using SchoolMedicalManagement.Models.Response;

namespace SchoolMedicalManagement.Service.Interface
{
    public interface IHealthCheckCampaignService
    {
        Task<BaseResponse> GetAllHealthCheckCampaignsAsync();
        Task<BaseResponse> GetHealthCheckCampaignsByStatusAsync(int statusId);
        Task<BaseResponse?> GetHealthCheckCampaignByIdAsync(int id);
        Task<BaseResponse?> CreateHealthCheckCampaignAsync(CreateHealthCheckCampaignRequest campaign);
        Task<BaseResponse?> UpdateHealthCheckCampaignAsync(int id, UpdateHealthCheckCampaignRequest campaign);
        Task<bool> DeleteHealthCheckCampaignAsync(int id);
    }
}
