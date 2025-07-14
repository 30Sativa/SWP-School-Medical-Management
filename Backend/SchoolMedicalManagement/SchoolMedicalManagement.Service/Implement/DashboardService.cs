using Microsoft.AspNetCore.Http;
using SchoolMedicalManagement.Models.Response;
using SchoolMedicalManagement.Models.Entity;
using SchoolMedicalManagement.Repository.Repository;
using SchoolMedicalManagement.Service.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SchoolMedicalManagement.Service.Implement
{
    public class DashboardService : IDashboardService
    {
        private readonly StudentRepository _studentRepository;
        private readonly UserRepository _userRepository;
        private readonly MedicalEventRepository _medicalEventRepository;
        private readonly MedicationRequestRepository _medicationRequestRepository;
        private readonly VaccinationCampaignRepository _vaccinationCampaignRepository;
        private readonly HealthCheckCampaignRepository _healthCheckCampaignRepository;
        private readonly NotificationRepository _notificationRepository;

        public DashboardService(
            StudentRepository studentRepository,
            UserRepository userRepository,
            MedicalEventRepository medicalEventRepository,
            MedicationRequestRepository medicationRequestRepository,
            VaccinationCampaignRepository vaccinationCampaignRepository,
            HealthCheckCampaignRepository healthCheckCampaignRepository,
            NotificationRepository notificationRepository)
        {
            _studentRepository = studentRepository;
            _userRepository = userRepository;
            _medicalEventRepository = medicalEventRepository;
            _medicationRequestRepository = medicationRequestRepository;
            _vaccinationCampaignRepository = vaccinationCampaignRepository;
            _healthCheckCampaignRepository = healthCheckCampaignRepository;
            _notificationRepository = notificationRepository;
        }

        public async Task<BaseResponse?> GetDashboardOverviewAsync()
        {
            try
            {
                // Lấy tổng số học sinh
                int totalStudents = await _studentRepository.GetTotalStudentsCount();

                // Lấy thống kê số lượng người dùng theo vai trò
                var totalUsers = await GetUserCountsByRole();

                // Lấy tổng số sự kiện y tế
                var allMedicalEvents = await _medicalEventRepository.GetAllMedicalEvents();
                int totalMedicalEvents = allMedicalEvents.Count;

                // Lấy 5 sự kiện y tế gần nhất
                var recentMedicalEvents = allMedicalEvents
                    .OrderByDescending(e => e.EventDate)
                    .Take(5)
                    .Select(e => new RecentMedicalEventResponse
                    {
                        EventId = e.EventId.ToString(),
                        StudentName = e.Student?.FullName ?? "",
                        EventType = e.EventType?.EventTypeName ?? "",
                        EventDate = e.EventDate,
                        Severity = e.Severity?.SeverityName ?? ""
                    }).ToList();

                // Lấy tổng số yêu cầu dùng thuốc
                var allMedicationRequests = await _medicationRequestRepository.GetAllRequestsAsync();
                int totalMedicationRequests = allMedicationRequests.Count;

                // Lấy số lượng yêu cầu dùng thuốc đang chờ duyệt
                var pendingMedicationRequests = allMedicationRequests.Count(r => r.StatusId == 1); // 1: Chờ duyệt

                // Lấy 5 yêu cầu dùng thuốc gần nhất
                var recentMedicationRequests = allMedicationRequests
                    .OrderByDescending(r => r.RequestDate)
                    .Take(5)
                    .Select(r => new RecentMedicationRequestResponse
                    {
                        RequestId = r.RequestId.ToString(),
                        StudentName = r.Student?.FullName ?? "",
                        MedicationName = r.MedicationName ?? "",
                        RequestDate = r.RequestDate,
                        Status = r.Status?.StatusName ?? ""
                    }).ToList();

                // Lấy thống kê chiến dịch tiêm chủng
                int totalVaccinationCampaigns = await _vaccinationCampaignRepository.GetTotalVaccinationCampaignsCount();
                int activeVaccinationCampaigns = await _vaccinationCampaignRepository.GetActiveVaccinationCampaignsCount();
                int notStartedVaccinationCampaigns = await _vaccinationCampaignRepository.GetNotStartedVaccinationCampaignsCount();
                int completedVaccinationCampaigns = await _vaccinationCampaignRepository.GetCompletedVaccinationCampaignsCount();
                int cancelledVaccinationCampaigns = await _vaccinationCampaignRepository.GetCancelledVaccinationCampaignsCount();

                // Lấy thống kê chiến dịch khám sức khỏe
                int totalHealthCheckCampaigns = await _healthCheckCampaignRepository.GetTotalHealthCheckCampaignsCount();
                int activeHealthCheckCampaigns = await _healthCheckCampaignRepository.GetActiveHealthCheckCampaignsCount();

                // Tạo response tổng quan dashboard
                var overview = new DashboardOverviewResponse
                {
                    TotalStudents = totalStudents,
                    TotalUsers = totalUsers,
                    TotalMedicalEvents = totalMedicalEvents,
                    TotalMedicationRequests = totalMedicationRequests,
                    PendingMedicationRequests = pendingMedicationRequests,
                    TotalVaccinationCampaigns = totalVaccinationCampaigns,
                    ActiveVaccinationCampaigns = activeVaccinationCampaigns,
                    NotStartedVaccinationCampaigns = notStartedVaccinationCampaigns,
                    CompletedVaccinationCampaigns = completedVaccinationCampaigns,
                    CancelledVaccinationCampaigns = cancelledVaccinationCampaigns,
                    TotalHealthCheckCampaigns = totalHealthCheckCampaigns,
                    ActiveHealthCheckCampaigns = activeHealthCheckCampaigns,
                    RecentMedicalEvents = recentMedicalEvents,
                    RecentMedicationRequests = recentMedicationRequests
                };

                return new BaseResponse
                {
                    Status = StatusCodes.Status200OK.ToString(),
                    Message = "Lấy dữ liệu tổng quan dashboard thành công.",
                    Data = overview
                };
            }
            catch (Exception ex)
            {
                // Nếu có lỗi, trả về mã lỗi và message
                return new BaseResponse
                {
                    Status = StatusCodes.Status500InternalServerError.ToString(),
                    Message = "Đã xảy ra lỗi khi lấy dữ liệu dashboard.",
                    Data = null
                };
            }
        }

        private async Task<UserCountResponse> GetUserCountsByRole()
        {
            var users = await _userRepository.GetAllUser();
            return new UserCountResponse
            {
                Admin = users.Count(u => u.RoleId == 1), // Assuming 1 is Admin role ID
                Nurse = users.Count(u => u.RoleId == 2), // Assuming 2 is Nurse role ID
                Parent = users.Count(u => u.RoleId == 3), // Assuming 3 is Parent role ID
                Total = users.Count
            };
        }

        // Method mới để lấy thống kê chi tiết chiến dịch tiêm chủng
        public async Task<BaseResponse?> GetVaccinationCampaignStatisticsAsync()
        {
            try
            {
                var statistics = new
                {
                    TotalCampaigns = await _vaccinationCampaignRepository.GetTotalVaccinationCampaignsCount(),
                    NotStartedCampaigns = await _vaccinationCampaignRepository.GetNotStartedVaccinationCampaignsCount(),
                    ActiveCampaigns = await _vaccinationCampaignRepository.GetActiveVaccinationCampaignsCount(),
                    CompletedCampaigns = await _vaccinationCampaignRepository.GetCompletedVaccinationCampaignsCount(),
                    CancelledCampaigns = await _vaccinationCampaignRepository.GetCancelledVaccinationCampaignsCount()
                };

                return new BaseResponse
                {
                    Status = StatusCodes.Status200OK.ToString(),
                    Message = "Lấy thống kê chiến dịch tiêm chủng thành công.",
                    Data = statistics
                };
            }
            catch (Exception ex)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status500InternalServerError.ToString(),
                    Message = "Đã xảy ra lỗi khi lấy thống kê chiến dịch tiêm chủng.",
                    Data = null
                };
            }
        }

        // Thống kê sức khỏe học sinh
        public async Task<BaseResponse?> GetHealthStatisticsAsync()
        {
            try
            {
                // Lấy tổng số chiến dịch khám sức khỏe
                int totalHealthCheckCampaigns = await _healthCheckCampaignRepository.GetTotalHealthCheckCampaignsCount();
                // Lấy số lượng chiến dịch đang diễn ra
                int activeHealthCheckCampaigns = await _healthCheckCampaignRepository.GetActiveHealthCheckCampaignsCount();
                // Trả về kết quả thống kê cơ bản
                var data = new
                {
                    TotalHealthCheckCampaigns = totalHealthCheckCampaigns,
                    ActiveHealthCheckCampaigns = activeHealthCheckCampaigns
                };
                return new BaseResponse
                {
                    Status = StatusCodes.Status200OK.ToString(),
                    Message = "Lấy thống kê sức khỏe thành công.",
                    Data = data
                };
            }
            catch (Exception)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status500InternalServerError.ToString(),
                    Message = "Đã xảy ra lỗi khi lấy thống kê sức khỏe.",
                    Data = null
                };
            }
        }

        // Thống kê sự kiện y tế
        public async Task<BaseResponse?> GetMedicalEventsStatisticsAsync()
        {
            try
            {
                // Lấy tổng số sự kiện y tế
                var allMedicalEvents = await _medicalEventRepository.GetAllMedicalEvents();
                int totalMedicalEvents = allMedicalEvents.Count;
                // Lấy 5 sự kiện y tế gần nhất
                var recentMedicalEvents = allMedicalEvents
                    .OrderByDescending(e => e.EventDate)
                    .Take(5)
                    .Select(e => new RecentMedicalEventResponse
                    {
                        EventId = e.EventId.ToString(),
                        StudentName = e.Student?.FullName ?? "",
                        EventType = e.EventType?.EventTypeName ?? "",
                        EventDate = e.EventDate,
                        Severity = e.Severity?.SeverityName ?? ""
                    }).ToList();
                // Trả về kết quả thống kê cơ bản
                var data = new
                {
                    TotalMedicalEvents = totalMedicalEvents,
                    RecentMedicalEvents = recentMedicalEvents
                };
                return new BaseResponse
                {
                    Status = StatusCodes.Status200OK.ToString(),
                    Message = "Lấy thống kê sự kiện y tế thành công.",
                    Data = data
                };
            }
            catch (Exception)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status500InternalServerError.ToString(),
                    Message = "Đã xảy ra lỗi khi lấy thống kê sự kiện y tế.",
                    Data = null
                };
            }
        }

        // Thống kê dùng thuốc
        public async Task<BaseResponse?> GetMedicationStatisticsAsync()
        {
            try
            {
                // Lấy tổng số yêu cầu dùng thuốc
                var allMedicationRequests = await _medicationRequestRepository.GetAllRequestsAsync();
                int totalMedicationRequests = allMedicationRequests.Count;
                // Lấy số lượng yêu cầu đang chờ duyệt
                int pendingMedicationRequests = allMedicationRequests.Count(r => r.StatusId == 1); // 1: Chờ duyệt
                // Lấy 5 yêu cầu gần nhất
                var recentMedicationRequests = allMedicationRequests
                    .OrderByDescending(r => r.RequestDate)
                    .Take(5)
                    .Select(r => new RecentMedicationRequestResponse
                    {
                        RequestId = r.RequestId.ToString(),
                        StudentName = r.Student?.FullName ?? "",
                        MedicationName = r.MedicationName ?? "",
                        RequestDate = r.RequestDate,
                        Status = r.Status?.StatusName ?? ""
                    }).ToList();
                // Trả về kết quả thống kê cơ bản
                var data = new
                {
                    TotalMedicationRequests = totalMedicationRequests,
                    PendingMedicationRequests = pendingMedicationRequests,
                    RecentMedicationRequests = recentMedicationRequests
                };
                return new BaseResponse
                {
                    Status = StatusCodes.Status200OK.ToString(),
                    Message = "Lấy thống kê dùng thuốc thành công.",
                    Data = data
                };
            }
            catch (Exception)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status500InternalServerError.ToString(),
                    Message = "Đã xảy ra lỗi khi lấy thống kê dùng thuốc.",
                    Data = null
                };
            }
        }

        // Dashboard cho phụ huynh - Code dễ hiểu với logic thực tế
        public async Task<BaseResponse?> GetParentDashboardOverviewAsync(Guid parentId)
        {
            try
            {
                // BƯỚC 1: Kiểm tra phụ huynh có tồn tại không
                var parent = await _userRepository.GetUserById(parentId);
                if (parent == null || parent.RoleId != 3)
                {
                    return new BaseResponse
                    {
                        Status = StatusCodes.Status404NotFound.ToString(),
                        Message = "Không tìm thấy phụ huynh.",
                        Data = null
                    };
                }

                // BƯỚC 2: Lấy danh sách con của phụ huynh
                var children = await _studentRepository.GetStudentsByParentId(parentId);
                var childrenIds = children.Select(s => s.StudentId).ToList();

                // BƯỚC 3: Lấy dữ liệu y tế của các con
                var childrenMedicalEvents = await GetChildrenMedicalEvents(childrenIds);
                var childrenMedicationRequests = await GetChildrenMedicationRequests(childrenIds);

                // BƯỚC 4: Tạo thông tin tổng quan cơ bản từng con
                var childrenOverview = CreateBasicChildrenOverview(children);

                // BƯỚC 5: Lấy sự kiện y tế gần đây (5 sự kiện mới nhất)
                var recentMedicalEvents = GetRecentMedicalEvents(childrenMedicalEvents, 5);

                // BƯỚC 6: Lấy yêu cầu thuốc gần đây (5 yêu cầu mới nhất)
                var recentMedicationRequests = GetRecentMedicationRequests(childrenMedicationRequests, 5);

                // BƯỚC 7: Lấy thông báo gần đây
                var recentNotifications = await GetRecentNotifications(parentId, 3);

                // BƯỚC 8: Tạo response cuối cùng
                var parentDashboard = new ParentDashboardOverviewResponse
                {
                    TotalChildren = children.Count,
                    Children = childrenOverview,
                    RecentMedicalEvents = recentMedicalEvents,
                    RecentMedicationRequests = recentMedicationRequests,
                    RecentNotifications = recentNotifications
                };

                return new BaseResponse
                {
                    Status = StatusCodes.Status200OK.ToString(),
                    Message = "Lấy dữ liệu tổng quan cho phụ huynh thành công.",
                    Data = parentDashboard
                };
            }
            catch (Exception ex)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status500InternalServerError.ToString(),
                    Message = $"Đã xảy ra lỗi khi lấy dữ liệu tổng quan cho phụ huynh: {ex.Message}",
                    Data = null
                };
            }
        }

        // ========== CÁC METHOD HỖ TRỢ - DỄ HIỂU ==========

        // Lấy tất cả sự kiện y tế của các con
        private async Task<List<MedicalEvent>> GetChildrenMedicalEvents(List<int> childrenIds)
        {
            var allMedicalEvents = await _medicalEventRepository.GetAllMedicalEvents();
            return allMedicalEvents
                .Where(e => e.StudentId.HasValue && childrenIds.Contains(e.StudentId.Value))
                .ToList();
        }

        // Lấy tất cả yêu cầu thuốc của các con
        private async Task<List<MedicationRequest>> GetChildrenMedicationRequests(List<int> childrenIds)
        {
            var allMedicationRequests = await _medicationRequestRepository.GetAllRequestsAsync();
            return allMedicationRequests
                .Where(r => childrenIds.Contains(r.StudentId))
                .ToList();
        }

        // Tạo thông tin tổng quan cơ bản từng con
        private List<ChildOverviewResponse> CreateBasicChildrenOverview(List<Student> children)
        {
            return children.Select(child => new ChildOverviewResponse
            {
                StudentId = child.StudentId,
                StudentName = child.FullName ?? "",
                Class = child.Class ?? "",
                DateOfBirth = child.DateOfBirth,
                Gender = child.Gender?.GenderName ?? ""
            }).ToList();
        }

        // Lấy các sự kiện y tế gần đây
        private List<RecentMedicalEventResponse> GetRecentMedicalEvents(List<MedicalEvent> medicalEvents, int count)
        {
            return medicalEvents
                .OrderByDescending(e => e.EventDate)
                .Take(count)
                .Select(e => new RecentMedicalEventResponse
                {
                    EventId = e.EventId.ToString(),
                    StudentName = e.Student?.FullName ?? "",
                    EventType = e.EventType?.EventTypeName ?? "",
                    EventDate = e.EventDate,
                    Severity = e.Severity?.SeverityName ?? ""
                }).ToList();
        }

        // Lấy các yêu cầu thuốc gần đây
        private List<RecentMedicationRequestResponse> GetRecentMedicationRequests(List<MedicationRequest> medicationRequests, int count)
        {
            return medicationRequests
                .OrderByDescending(r => r.RequestDate)
                .Take(count)
                .Select(r => new RecentMedicationRequestResponse
                {
                    RequestId = r.RequestId.ToString(),
                    StudentName = r.Student?.FullName ?? "",
                    MedicationName = r.MedicationName ?? "",
                    RequestDate = r.RequestDate,
                    Status = r.Status?.StatusName ?? ""
                }).ToList();
        }

        // Lấy thông báo gần đây của phụ huynh
        private async Task<List<RecentNotificationResponse>> GetRecentNotifications(Guid parentId, int count)
        {
            var notifications = await _notificationRepository.GetNotificationsByUserId(parentId);
            return notifications
                .OrderByDescending(n => n.SentDate)
                .Take(count)
                .Select(n => new RecentNotificationResponse
                {
                    NotificationId = n.NotificationId,
                    Title = n.Title,
                    Message = n.Message,
                    CreatedDate = n.SentDate ?? DateTime.MinValue,
                    IsRead = n.IsRead ?? false
                }).ToList();
        }
    }
}



