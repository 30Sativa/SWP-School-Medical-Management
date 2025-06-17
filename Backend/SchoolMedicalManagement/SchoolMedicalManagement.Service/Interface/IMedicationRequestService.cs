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
        // ✅ sửa: thêm imagePath (nếu đang lưu ảnh thật từ controller)
        Task<BaseResponse> CreateMedicationRequestAsync(CreateMedicationRequest request, Guid parentId, string? imagePath);

    }
}
