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
        private readonly IStudentService _studentService;

        public NotificationService(
            NotificationRepository notificationRepository,
            UserRepository userRepository,
            NotificationTypeRepository notificationTypeRepository,
            IStudentService studentService)
        {
            _notificationRepository = notificationRepository;
            _userRepository = userRepository;
            _notificationTypeRepository = notificationTypeRepository;
            _studentService = studentService;
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

        public async Task<BaseResponse> DeleteNotificationAsync(int id)
        {
            var success = await _notificationRepository.DeleteNotification(id);
            if (!success)
            {
                return new BaseResponse { Status = StatusCodes.Status404NotFound.ToString(), Message = "Không tìm thấy thông báo để xóa.", Data = null };
            }
            return new BaseResponse { Status = StatusCodes.Status200OK.ToString(), Message = "Xóa thông báo thành công.", Data = null };
        }

        public async Task<BaseResponse> GetParentNotificationsAsync(Guid parentId)
        {
            // Bước 1: Kiểm tra parentId có tồn tại và có quyền Parent không
            var parentUser = await _userRepository.GetUserById(parentId);
            if (parentUser == null)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status404NotFound.ToString(),
                    Message = $"Không tìm thấy phụ huynh với ID {parentId}.",
                    Data = null
                };
            }

            if (parentUser.RoleId != 3)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status403Forbidden.ToString(),
                    Message = "Người dùng không phải là phụ huynh.",
                    Data = null
                };
            }

            // Bước 2: Lấy danh sách học sinh của phụ huynh
            var studentsResponse = await _studentService.GetStudentsOfParent(parentId);
            var students = studentsResponse.Data as List<ListStudentResponse> ?? new List<ListStudentResponse>();
            var studentIds = students.Select(s => s.StudentId).ToList();
            
            var notifications = new List<ParentNotificationResponse>();

            // Bước 3: Lấy phiếu đồng ý tiêm chủng
            if (studentIds.Any())
            {
                var consentRequests = await _userRepository.GetConsentRequestsByStudentIds(studentIds);
                foreach (var consent in consentRequests)
                {
                    notifications.Add(new ParentNotificationResponse
                    {
                        Id = $"consent-{consent.RequestId}",
                        ItemType = "consent",
                        Title = consent.Campaign?.VaccineName ?? "Chiến dịch không xác định",
                        Message = "Phụ huynh vui lòng xác nhận để nhà trường tiến hành tiêm chủng cho học sinh.",
                        Date = consent.RequestDate.ToString("yyyy-MM-ddTHH:mm:ssZ"),
                        Status = consent.ConsentStatus?.ConsentStatusName ?? "Chờ phản hồi",
                        NotificationType = "vaccination"
                    });
                }
            }

            // Bước 4: Lấy thông báo gửi trực tiếp cho phụ huynh
            var directNotifications = await _notificationRepository.GetNotificationsByUserId(parentId);
            foreach (var notif in directNotifications)
            {
                notifications.Add(new ParentNotificationResponse
                {
                    Id = $"notification-{notif.NotificationId}",
                    ItemType = "notification",
                    Title = notif.Title ?? "Không có tiêu đề",
                    Message = notif.Message,
                    Date = notif.SentDate?.ToString("yyyy-MM-ddTHH:mm:ssZ") ?? DateTime.Now.ToString("yyyy-MM-ddTHH:mm:ssZ"),
                    Status = "active",
                    NotificationType = notif.Type?.TypeName ?? "general"
                });
            }

            // Bước 5: Sắp xếp theo thời gian (mới nhất trước)
            var sortedNotifications = notifications
                .OrderByDescending(x => DateTime.Parse(x.Date))
                .ToList();

            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = "Lấy danh sách thông báo phụ huynh thành công.",
                Data = sortedNotifications
            };
        }
    }
}