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
    public class NotificationTypeService : INotificationTypeService
    {
        private readonly NotificationTypeRepository _notificationTypeRepository;

        public NotificationTypeService(NotificationTypeRepository notificationTypeRepository)
        {
            _notificationTypeRepository = notificationTypeRepository;
        }

        public async Task<BaseResponse> GetAllNotificationTypesAsync()
        {
            var types = await _notificationTypeRepository.GetAllNotificationTypes();
            var data = types.Select(t => new NotificationTypeManagementResponse
            {
                TypeId = t.TypeId,
                TypeName = t.TypeName
            }).ToList();
            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = "Lấy danh sách loại thông báo thành công.",
                Data = data
            };
        }

        public async Task<BaseResponse?> GetNotificationTypeByIdAsync(int id)
        {
            var t = await _notificationTypeRepository.GetNotificationTypeById(id);
            if (t == null)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status404NotFound.ToString(),
                    Message = $"Không tìm thấy loại thông báo với ID {id}.",
                    Data = null
                };
            }
            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = "Tìm thấy loại thông báo thành công.",
                Data = new NotificationTypeManagementResponse
                {
                    TypeId = t.TypeId,
                    TypeName = t.TypeName
                }
            };
        }

        public async Task<BaseResponse?> CreateNotificationTypeAsync(CreateNotificationTypeRequest request)
        {
            var newType = new NotificationType
            {
                TypeName = request.TypeName
            };

            var created = await _notificationTypeRepository.CreateNotificationType(newType);
            if (created == null)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status400BadRequest.ToString(),
                    Message = "Tạo loại thông báo thất bại.",
                    Data = null
                };
            }
            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = "Tạo loại thông báo thành công.",
                Data = new NotificationTypeManagementResponse
                {
                    TypeId = created.TypeId,
                    TypeName = created.TypeName
                }
            };
        }

        public async Task<BaseResponse?> UpdateNotificationTypeAsync(int id, UpdateNotificationTypeRequest request)
        {
            var t = await _notificationTypeRepository.GetNotificationTypeById(id);
            if (t == null)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status404NotFound.ToString(),
                    Message = $"Không tìm thấy loại thông báo với ID {id}.",
                    Data = null
                };
            }

            t.TypeName = request.TypeName;

            var updated = await _notificationTypeRepository.UpdateNotificationType(t);
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
                Message = "Cập nhật loại thông báo thành công.",
                Data = new NotificationTypeManagementResponse
                {
                    TypeId = updated.TypeId,
                    TypeName = updated.TypeName
                }
            };
        }

        public async Task<bool> DeleteNotificationTypeAsync(int id)
        {
            return await _notificationTypeRepository.DeleteNotificationType(id);
        }
    }
} 