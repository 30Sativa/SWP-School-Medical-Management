using Microsoft.AspNetCore.Http;
using SchoolMedicalManagement.Models.Entity;
using SchoolMedicalManagement.Models.Request;
using SchoolMedicalManagement.Models.Response;
using SchoolMedicalManagement.Repository.Repository;
using SchoolMedicalManagement.Service.Interface;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace SchoolMedicalManagement.Service.Implement
{
    public class MedicalEventTypeService : IMedicalEventTypeService
    {
        private readonly MedicalEventTypeRepository _medicalEventTypeRepository;

        public MedicalEventTypeService(MedicalEventTypeRepository medicalEventTypeRepository)
        {
            _medicalEventTypeRepository = medicalEventTypeRepository;
        }

        public async Task<BaseResponse> GetAllMedicalEventTypesAsync()
        {
            var types = await _medicalEventTypeRepository.GetAllMedicalEventTypes();
            var data = types.Select(t => new MedicalEventTypeManagementResponse
            {
                EventTypeId = t.EventTypeId,
                EventTypeName = t.EventTypeName
            }).ToList();
            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = "Lấy danh sách loại sự kiện y tế thành công.",
                Data = data
            };
        }

        public async Task<BaseResponse?> GetMedicalEventTypeByIdAsync(int id)
        {
            var t = await _medicalEventTypeRepository.GetMedicalEventTypeById(id);
            if (t == null)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status404NotFound.ToString(),
                    Message = $"Không tìm thấy loại sự kiện y tế với ID {id}.",
                    Data = null
                };
            }
            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = "Tìm thấy loại sự kiện y tế thành công.",
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
                    Message = "Tạo loại sự kiện y tế thất bại.",
                    Data = null
                };
            }
            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = "Tạo loại sự kiện y tế thành công.",
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
                    Message = $"Không tìm thấy loại sự kiện y tế với ID {id}.",
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
                    Message = "Cập nhật thất bại. Vui lòng kiểm tra dữ liệu yêu cầu.",
                    Data = null
                };
            }
            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = "Cập nhật loại sự kiện y tế thành công.",
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