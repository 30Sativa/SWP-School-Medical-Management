using Microsoft.AspNetCore.Http;
using SchoolMedicalManagement.Models.Entity;
using SchoolMedicalManagement.Models.Request;
using SchoolMedicalManagement.Models.Response;
using SchoolMedicalManagement.Repository.Repository;
using SchoolMedicalManagement.Service.Interface;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace SchoolMedicalManagement.Service.Implement
{
    public class NotificationService : INotificationService
    {
        private readonly NotificationRepository _notificationRepository;
        private readonly UserRepository _userRepository;
        private readonly NotificationTypeRepository _notificationTypeRepository;

        public NotificationService(
            NotificationRepository notificationRepository,
            UserRepository userRepository,
            NotificationTypeRepository notificationTypeRepository)
        {
            _notificationRepository = notificationRepository;
            _userRepository = userRepository;
            _notificationTypeRepository = notificationTypeRepository;
        }

        public async Task<BaseResponse> GetAllNotificationsAsync()
        {
            var notifications = await _notificationRepository.GetAllNotifications();
            var data = notifications.Select(n => new NotificationManagementResponse
            {
                NotificationId = n.NotificationId,
                ReceiverId = n.ReceiverId,
                ReceiverName = n.Receiver?.FullName,
                Title = n.Title,
                Message = n.Message,
                TypeId = n.TypeId,
                TypeName = n.Type?.TypeName,
                IsRead = n.IsRead,
                SentDate = n.SentDate
            }).ToList();
            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = "Lấy danh sách thông báo thành công.",
                Data = data
            };
        }

        public async Task<BaseResponse> GetNotificationsByUserIdAsync(Guid userId)
        {
            var notifications = await _notificationRepository.GetNotificationsByUserId(userId);
            var data = notifications.Select(n => new NotificationManagementResponse
            {
                NotificationId = n.NotificationId,
                ReceiverId = n.ReceiverId,
                ReceiverName = n.Receiver?.FullName,
                Title = n.Title,
                Message = n.Message,
                TypeId = n.TypeId,
                TypeName = n.Type?.TypeName,
                IsRead = n.IsRead,
                SentDate = n.SentDate
            }).ToList();
            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = "Lấy danh sách thông báo theo user thành công.",
                Data = data
            };
        }

        public async Task<BaseResponse?> GetNotificationByIdAsync(int id)
        {
            var n = await _notificationRepository.GetNotificationById(id);
            if (n == null)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status404NotFound.ToString(),
                    Message = $"Không tìm thấy thông báo với ID {id}.",
                    Data = null
                };
            }
            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = "Tìm thấy thông báo thành công.",
                Data = new NotificationManagementResponse
                {
                    NotificationId = n.NotificationId,
                    ReceiverId = n.ReceiverId,
                    ReceiverName = n.Receiver?.FullName,
                    Title = n.Title,
                    Message = n.Message,
                    TypeId = n.TypeId,
                    TypeName = n.Type?.TypeName,
                    IsRead = n.IsRead,
                    SentDate = n.SentDate
                }
            };
        }

        public async Task<BaseResponse?> CreateNotificationAsync(CreateNotificationRequest request)
        {
            var newNotification = new Notification
            {
                ReceiverId = request.ReceiverId,
                Title = request.Title,
                Message = request.Message,
                TypeId = request.TypeId,
                IsRead = request.IsRead ?? false,
                SentDate = DateTime.Now
            };

            var existingUser = await _userRepository.GetUserById(request.ReceiverId);
            if (existingUser == null)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status400BadRequest.ToString(),
                    Message = $"Không tìm thấy người dùng với ID {request.ReceiverId}.",
                    Data = null
                };
            }

            var existingType = await _notificationTypeRepository.GetNotificationTypeById(request.TypeId);
            if (existingType == null)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status400BadRequest.ToString(),
                    Message = $"Không tìm thấy loại thông báo với ID {request.TypeId}.",
                    Data = null
                };
            }

            var created = await _notificationRepository.CreateNotification(newNotification);
            if (created == null)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status400BadRequest.ToString(),
                    Message = "Tạo thông báo thất bại.",
                    Data = null
                };
            }
            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = "Tạo thông báo thành công.",
                Data = new NotificationManagementResponse
                {
                    NotificationId = created.NotificationId,
                    ReceiverId = created.ReceiverId,
                    ReceiverName = created.Receiver?.FullName,
                    Title = created.Title,
                    Message = created.Message,
                    TypeId = created.TypeId,
                    TypeName = created.Type?.TypeName,
                    IsRead = created.IsRead,
                    SentDate = created.SentDate
                }
            };
        }

        public async Task<bool> DeleteNotificationAsync(int id)
        {
            return await _notificationRepository.DeleteNotification(id);
        }
    }
} 