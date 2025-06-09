using SchoolMedicalManagement.Models.Request;
using SchoolMedicalManagement.Models.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolMedicalManagement.Service.Interface
{
    public interface IHealthProfileService
    {
        Task<List<ManagerHealthProfileResponse>> GetAllHealthProfilesAsync();
        Task<BaseResponse?> GetHealthProfileByIdAsync(int id);
        Task<BaseResponse?> CreateHealthProfileAsync(CreateHealthProfileRequest healthProfile); 
        Task<BaseResponse?> UpdateHealthProfileAsync(int id, UpdateHealthProfileRequest healthProfile);
        Task<bool> DeleteHealthProfileAsync(int id);
    }
}
