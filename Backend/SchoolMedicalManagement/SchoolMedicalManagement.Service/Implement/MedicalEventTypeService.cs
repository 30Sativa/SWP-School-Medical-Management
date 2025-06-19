using Microsoft.AspNetCore.Http;
using SchoolMedicalManagement.Models.Entity;
using SchoolMedicalManagement.Models.Request;
using SchoolMedicalManagement.Models.Response;
using SchoolMedicalManagement.Repository.Repository;
using SchoolMedicalManagement.Service.Interface;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SchoolMedicalManagement.Service.Implement
{
    public class MedicalEventTypeService : IMedicalEventTypeService
    {
        private readonly MedicalEventTypeRepository _medicalEventTypeRepository;

        public MedicalEventTypeService(MedicalEventTypeRepository medicalEventTypeRepository)
        {
            _medicalEventTypeRepository = medicalEventTypeRepository;
        }

        public async Task<List<MedicalEventTypeManagementResponse>> GetAllMedicalEventTypesAsync()
        {
            var types = await _medicalEventTypeRepository.GetAllMedicalEventTypes();
            var result = new List<MedicalEventTypeManagementResponse>();
            foreach (var t in types)
            {
                result.Add(new MedicalEventTypeManagementResponse
                {
                    EventTypeId = t.EventTypeId,
                    EventTypeName = t.EventTypeName
                });
            }
            return result;
        }

        public async Task<BaseResponse?> GetMedicalEventTypeByIdAsync(int id)
        {
            var t = await _medicalEventTypeRepository.GetMedicalEventTypeById(id);
            if (t == null)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status404NotFound.ToString(),
                    Message = $"Medical event type with ID {id} not found.",
                    Data = null
                };
            }
            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = "Medical event type found successfully.",
                Data = new MedicalEventTypeManagementResponse
                {
                    EventTypeId = t.EventTypeId,
                    EventTypeName = t.EventTypeName
                }
            };
        }

        public async Task<BaseResponse?> CreateMedicalEventTypeAsync(CreateMedicalEventTypeRequest request)
        {
            var newType = new MedicalEventType
            {
                EventTypeName = request.EventTypeName
            };

            var created = await _medicalEventTypeRepository.CreateMedicalEventType(newType);
            if (created == null)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status400BadRequest.ToString(),
                    Message = "Create medical event type failed.",
                    Data = null
                };
            }
            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = "Create medical event type successfully.",
                Data = new MedicalEventTypeManagementResponse
                {
                    EventTypeId = created.EventTypeId,
                    EventTypeName = created.EventTypeName
                }
            };
        }

        public async Task<BaseResponse?> UpdateMedicalEventTypeAsync(int id, UpdateMedicalEventTypeRequest request)
        {
            var t = await _medicalEventTypeRepository.GetMedicalEventTypeById(id);
            if (t == null)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status404NotFound.ToString(),
                    Message = $"Medical event type with ID {id} not found.",
                    Data = null
                };
            }

            t.EventTypeName = request.EventTypeName;

            var updated = await _medicalEventTypeRepository.UpdateMedicalEventType(t);
            if (updated == null)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status400BadRequest.ToString(),
                    Message = "Update failed. Please check the request data.",
                    Data = null
                };
            }
            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = "Medical event type updated successfully.",
                Data = new MedicalEventTypeManagementResponse
                {
                    EventTypeId = updated.EventTypeId,
                    EventTypeName = updated.EventTypeName
                }
            };
        }

        public async Task<bool> DeleteMedicalEventTypeAsync(int id)
        {
            return await _medicalEventTypeRepository.DeleteMedicalEventType(id);
        }
    }
}