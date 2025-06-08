using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SchoolMedicalManagement.Models.Request;
using SchoolMedicalManagement.Models.Response;

namespace SchoolMedicalManagement.Service.Interface
{
    public interface IMedicalEventService
    {
        Task<BaseResponse?> GetMedicalEventByIdAsync(int id);

        Task<BaseResponse?> CreateMedicalEventAsync(ManageMedicalEventRequest medicalEvent);
        Task<BaseResponse?> UpdateMedicalEventAsync(int id, ManageMedicalEventRequest request);
        Task<bool> DeleteMedicalEventAsync(int id);
        Task<List<ManageMedicalEventResponse>> GetAllMedicalEventsAsync();

    }
}
