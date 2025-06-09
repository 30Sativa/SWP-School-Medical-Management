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

        public async Task<BaseResponse?> AddSupplyAsync(CreateMedicalSupplyRequest request)
        {
            var supply = new MedicalSupply
            {
                Name = request.Name,
                Quantity = request.Quantity,
                Unit = request.Unit,
                ExpiryDate = request.ExpiryDate
            };
            var createsupply = await _medicalSupplyRepository.CreateMedicalSupply(supply);
            if(createsupply == null)
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
                    SupplyID = createsupply.SupplyId,
                    Name = createsupply.Name,
                    Quantity = createsupply.Quantity,
                    Unit = createsupply.Unit,
                    ExpiryDate = createsupply.ExpiryDate
                }
            };
        }

        public async Task<List<MedicalSupplyResponse>> GetAllSuppliesAsync()
        {
            
            var supply = await _medicalSupplyRepository.GetAllMedicalSupply();
            var response = supply.Select(s => new MedicalSupplyResponse
            {
                SupplyID = s.SupplyId,
                Name = s.Name,
                Quantity = s.Quantity,
                Unit = s.Unit,
                ExpiryDate = s.ExpiryDate
            }).ToList();

            return response;
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
                    Quantity = supply.Quantity,
                    Unit = supply.Unit,
                    ExpiryDate = supply.ExpiryDate
                }
            };
        }

        public async Task<BaseResponse> UpdateSupplyAsync(UpdateMedicalSupplyRequest request)
        {
            var supply = await _medicalSupplyRepository.GetByIdMedicalSupply(request.SupplyID);
            if (supply == null)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status404NotFound.ToString(),
                    Message = "Medical supply not found.",
                    Data = null
                };
            }
            supply.Name = string.IsNullOrEmpty(request.Name) ? supply.Name : request.Name;
            supply.Quantity = request.Quantity <= 0 ? supply.Quantity : request.Quantity;
            supply.Unit = string.IsNullOrEmpty(request.Unit) ? supply.Unit : request.Unit;
            supply.ExpiryDate = request.ExpiryDate ?? supply.ExpiryDate;
            var updatedSupply = await _medicalSupplyRepository.UpdateMedicalSupply(supply);

            if (updatedSupply == null)
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
                    SupplyID = updatedSupply.SupplyId,
                    Name = updatedSupply.Name,
                    Quantity = updatedSupply.Quantity,
                    Unit = updatedSupply.Unit,
                    ExpiryDate = updatedSupply.ExpiryDate
                }
            };
        }
    }
}
