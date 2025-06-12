using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SchoolMedicalManagement.Models.Request;
using SchoolMedicalManagement.Models.Response;

namespace SchoolMedicalManagement.Service.Interface
{
    public interface IMedicalHistoryService
    {
        Task<List<MedicalHistoryResponse>> GetAllByStudentIdAsync(int studentId);
        Task<BaseResponse> GetByIdAsync(int id);
        Task<BaseResponse> CreateAsync(CreateMedicalHistoryRequest request);
        Task<BaseResponse> UpdateAsync(UpdateMedicalHistoryRequest request);
        Task<BaseResponse> DeleteAsync(int id);
    }
}
