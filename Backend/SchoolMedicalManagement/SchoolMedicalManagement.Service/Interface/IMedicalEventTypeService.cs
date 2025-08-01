﻿using SchoolMedicalManagement.Models.Request;
using SchoolMedicalManagement.Models.Response;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SchoolMedicalManagement.Service.Interface
{
    public interface IMedicalEventTypeService
    {
        Task<BaseResponse> GetAllMedicalEventTypesAsync();
        Task<BaseResponse?> GetMedicalEventTypeByIdAsync(int id);
        Task<BaseResponse?> CreateMedicalEventTypeAsync(CreateMedicalEventTypeRequest request);
        Task<BaseResponse?> UpdateMedicalEventTypeAsync(int id, UpdateMedicalEventTypeRequest request);
        Task<BaseResponse> DeleteMedicalEventTypeAsync(int id);
    }
}