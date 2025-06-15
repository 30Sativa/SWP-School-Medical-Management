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

                    // Get campaign counts
                    TotalVaccinationCampaigns = await _vaccinationCampaignRepository.GetTotalVaccinationCampaignsCount(),
                    ActiveVaccinationCampaigns = await _vaccinationCampaignRepository.GetActiveVaccinationCampaignsCount(),
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
    }
} 