using Microsoft.AspNetCore.Http;
using SchoolMedicalManagement.Models.Response;
using SchoolMedicalManagement.Repository.Repository;
using SchoolMedicalManagement.Service.Interface;
using System;
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

        public DashboardService(
            StudentRepository studentRepository,
            UserRepository userRepository,
            MedicalEventRepository medicalEventRepository,
            MedicationRequestRepository medicationRequestRepository,
            VaccinationCampaignRepository vaccinationCampaignRepository,
            HealthCheckCampaignRepository healthCheckCampaignRepository)
        {
            _studentRepository = studentRepository;
            _userRepository = userRepository;
            _medicalEventRepository = medicalEventRepository;
            _medicationRequestRepository = medicationRequestRepository;
            _vaccinationCampaignRepository = vaccinationCampaignRepository;
            _healthCheckCampaignRepository = healthCheckCampaignRepository;
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
    }
} 