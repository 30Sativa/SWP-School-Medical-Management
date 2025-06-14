using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SchoolMedicalManagement.Models.Request;
using SchoolMedicalManagement.Models.Response;

namespace SchoolMedicalManagement.Service.Interface
{
    public interface IMedicationRequestService
    {
        Task<List<MedicationRequestResponse>> GetPendingRequestsAsync();
        Task<BaseResponse> HandleMedicationRequest(UpdateMedicationRequestStatus request);
        Task<BaseResponse> CreateMedicationRequestAsync(CreateMedicationRequest request, Guid parentId);

    }
}
