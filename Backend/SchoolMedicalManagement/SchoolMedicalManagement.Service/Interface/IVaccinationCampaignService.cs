using SchoolMedicalManagement.Models.Request;
using SchoolMedicalManagement.Models.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolMedicalManagement.Service.Interface
{
    public interface IVaccinationCampaignService
    {
        Task<BaseResponse> GetVaccinationCampaignAsync(int compaignId);
        Task<BaseResponse> CreateVaccinaCampaignAsync(CreateVaccinationCampaignRequest vaccinationCampaign);
    }
}
