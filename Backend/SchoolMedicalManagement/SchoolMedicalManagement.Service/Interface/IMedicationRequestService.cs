﻿using System;
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
        Task<BaseResponse> GetPendingRequestsAsync();
        Task<BaseResponse> HandleMedicationRequest(UpdateMedicationRequestStatus request);
        // ✅ sửa: thêm imagePath (nếu đang lưu ảnh thật từ controller)
        Task<BaseResponse> CreateMedicationRequestAsync(CreateMedicationRequest request, Guid parentId, string? imagePath);

        Task<BaseResponse> GetAllMedicalRequest();

        Task<BaseResponse> GetMedicalRequestByStudentId(string studentid);

        // Get medication requests by parent ID
        Task<BaseResponse> GetRequestsByParentIdAsync(Guid parentId);

        // Get medication request by ID
        Task<BaseResponse> GetRequestByIdAsync(int requestId);

        Task<BaseResponse> UpdateMedicationRequestStatusAsync(int requestId, UpdateMedicationStatusDto dto);

        Task<BaseResponse> GetRequestsByStatusIdAsync(int statusId);
    }
}
