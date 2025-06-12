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
                    Message = "Failed to create medical supply.",
                    Data = null
                };
            }

            return new BaseResponse
            {
                Status = StatusCodes.Status201Created.ToString(),
                Message = "Medical supply created successfully.",
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

        public async Task<List<MedicalSupplyResponse>> GetAllSuppliesAsync()
        {
            var list = await _medicalSupplyRepository.GetAllMedicalSupply();
            return list.Select(s => new MedicalSupplyResponse
            {
                SupplyID = s.SupplyId,
                Name = s.Name,
                Quantity = s.Quantity.GetValueOrDefault(),
                Unit = s.Unit,
                ExpiryDate = s.ExpiryDate
            }).ToList();
        }

        public async Task<BaseResponse> GetSupplyByIdAsync(int id)
        {
            var supply = await _medicalSupplyRepository.GetByIdMedicalSupply(id);
            if (supply == null)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status404NotFound.ToString(),
                    Message = "Medical supply not found.",
                    Data = null
                };
            }

            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = "Medical supply retrieved successfully.",
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
                    Message = "Medical supply not found.",
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
                    Message = "Failed to update medical supply.",
                    Data = null
                };
            }

            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = "Medical supply updated successfully.",
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
