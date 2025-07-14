using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using SchoolMedicalManagement.Models.Entity;
using SchoolMedicalManagement.Models.Request;
using SchoolMedicalManagement.Models.Response;
using SchoolMedicalManagement.Repository.Repository;
using SchoolMedicalManagement.Service.Interface;

namespace SchoolMedicalManagement.Service.Implement
{
    public class MedicalSupplyService : IMedicalSupplyService
    {
        private readonly MedicalSupplyRepository _medicalSupplyRepository;

        public MedicalSupplyService(MedicalSupplyRepository medicalSupplyRepository)
        {
            _medicalSupplyRepository = medicalSupplyRepository;
        }

        public async Task<BaseResponse> AddSupplyAsync(CreateMedicalSupplyRequest request)
        {
            var newSupply = new MedicalSupply
            {
                Name = request.Name.Trim(),
                Quantity = request.Quantity,
                Unit = request.Unit.Trim(),
                ExpiryDate = request.ExpiryDate
            };

            var created = await _medicalSupplyRepository.CreateMedicalSupply(newSupply);
            if (created == null)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status500InternalServerError.ToString(),
                    Message = "Tạo vật tư y tế thất bại.",
                    Data = null
                };
            }

            return new BaseResponse
            {
                Status = StatusCodes.Status201Created.ToString(),
                Message = "Tạo vật tư y tế thành công.",
                Data = new MedicalSupplyResponse
                {
                    SupplyID = created.SupplyId,
                    Name = created.Name,
                    Quantity = created.Quantity.GetValueOrDefault(),
                    Unit = created.Unit,
                    ExpiryDate = created.ExpiryDate
                }
            };
        }

        public async Task<BaseResponse> GetAllSuppliesAsync()
        {
            var list = await _medicalSupplyRepository.GetAllMedicalSupply();
            var data = list.Select(s => new MedicalSupplyResponse
            {
                SupplyID = s.SupplyId,
                Name = s.Name,
                Quantity = s.Quantity.GetValueOrDefault(),
                Unit = s.Unit,
                ExpiryDate = s.ExpiryDate
            }).ToList();
            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = "Lấy danh sách vật tư y tế thành công.",
                Data = data
            };
        }

        public async Task<BaseResponse> GetSupplyByIdAsync(int id)
        {
            var supply = await _medicalSupplyRepository.GetByIdMedicalSupply(id);
            if (supply == null)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status404NotFound.ToString(),
                    Message = "Không tìm thấy vật tư y tế.",
                    Data = null
                };
            }

            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = "Lấy vật tư y tế thành công.",
                Data = new MedicalSupplyResponse
                {
                    SupplyID = supply.SupplyId,
                    Name = supply.Name,
                    Quantity = supply.Quantity.GetValueOrDefault(),
                    Unit = supply.Unit,
                    ExpiryDate = supply.ExpiryDate
                }
            };
        }

        public async Task<BaseResponse> UpdateSupplyAsync(UpdateMedicalSupplyRequest request)
        {
            var existing = await _medicalSupplyRepository.GetByIdMedicalSupply(request.SupplyId);
            if (existing == null)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status404NotFound.ToString(),
                    Message = "Không tìm thấy vật tư y tế.",
                    Data = null
                };
            }

            existing.Name = string.IsNullOrWhiteSpace(request.Name) ? existing.Name : request.Name.Trim();
            existing.Quantity = request.Quantity <= 0 ? existing.Quantity : request.Quantity;
            existing.Unit = string.IsNullOrWhiteSpace(request.Unit) ? existing.Unit : request.Unit.Trim();
            existing.ExpiryDate = request.ExpiryDate ?? existing.ExpiryDate;

            var updated = await _medicalSupplyRepository.UpdateMedicalSupply(existing);
            if (updated == null)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status500InternalServerError.ToString(),
                    Message = "Cập nhật vật tư y tế thất bại.",
                    Data = null
                };
            }

            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = "Cập nhật vật tư y tế thành công.",
                Data = new MedicalSupplyResponse
                {
                    SupplyID = updated.SupplyId,
                    Name = updated.Name,
                    Quantity = updated.Quantity.GetValueOrDefault(),
                    Unit = updated.Unit,
                    ExpiryDate = updated.ExpiryDate
                }
            };
        }
    }
}
