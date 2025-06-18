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
                var overview = new DashboardOverviewResponse
                {
                    // Get total students
                    TotalStudents = await _studentRepository.GetTotalStudentsCount(),

                    // Get user counts by role
                    TotalUsers = await GetUserCountsByRole(),

                    // Get campaign counts - sử dụng các method thống kê mới
                    TotalVaccinationCampaigns = await _vaccinationCampaignRepository.GetTotalVaccinationCampaignsCount(),
                    ActiveVaccinationCampaigns = await _vaccinationCampaignRepository.GetActiveVaccinationCampaignsCount(), // StatusId = 2 (Đang diễn ra)
                    NotStartedVaccinationCampaigns = await _vaccinationCampaignRepository.GetNotStartedVaccinationCampaignsCount(), // StatusId = 1 (Chưa bắt đầu)
                    CompletedVaccinationCampaigns = await _vaccinationCampaignRepository.GetCompletedVaccinationCampaignsCount(), // StatusId = 3 (Đã hoàn thành)
                    CancelledVaccinationCampaigns = await _vaccinationCampaignRepository.GetCancelledVaccinationCampaignsCount(), // StatusId = 4 (Đã huỷ)
                    TotalHealthCheckCampaigns = await _healthCheckCampaignRepository.GetTotalHealthCheckCampaignsCount(),
                    ActiveHealthCheckCampaigns = await _healthCheckCampaignRepository.GetActiveHealthCheckCampaignsCount(),
                };

                return new BaseResponse
                {
                    Status = StatusCodes.Status200OK.ToString(),
                    Message = "Dashboard overview data retrieved successfully.",
                    Data = overview
                };
            }
            catch (Exception ex)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status500InternalServerError.ToString(),
                    Message = "An error occurred while retrieving dashboard data.",
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
                    Message = "Vaccination campaign statistics retrieved successfully.",
                    Data = statistics
                };
            }
            catch (Exception ex)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status500InternalServerError.ToString(),
                    Message = "An error occurred while retrieving vaccination campaign statistics.",
                    Data = null
                };
            }
        }
    }
} 