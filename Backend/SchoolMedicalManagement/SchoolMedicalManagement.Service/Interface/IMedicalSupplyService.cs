using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SchoolMedicalManagement.Models.Request;
using SchoolMedicalManagement.Models.Response;

namespace SchoolMedicalManagement.Service.Interface
{
    public interface IMedicalSupplyService
    {
        Task<BaseResponse> GetAllSuppliesAsync();
        Task<BaseResponse> GetSupplyByIdAsync(int id);
        Task<BaseResponse> AddSupplyAsync(CreateMedicalSupplyRequest request);
        Task<BaseResponse> UpdateSupplyAsync(UpdateMedicalSupplyRequest request);
        //Task DeleteSupplyAsync(int id);
    }
}
