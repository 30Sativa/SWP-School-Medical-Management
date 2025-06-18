using Microsoft.AspNetCore.Http;
using SchoolMedicalManagement.Models.Entity;
using SchoolMedicalManagement.Models.Request;
using SchoolMedicalManagement.Models.Response;
using SchoolMedicalManagement.Repository.Repository;
using SchoolMedicalManagement.Service.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SchoolMedicalManagement.Service.Implement
{
    public class VaccinationCampaignService : IVaccinationCampaignService
    {
        private readonly VaccinationCampaignRepository _campaignRepository;
        private readonly StudentRepository _studentRepository;
        private readonly UserRepository _userRepository;

        public VaccinationCampaignService(
            VaccinationCampaignRepository campaignRepository,
            StudentRepository studentRepository,
            UserRepository userRepository)
        {
            _campaignRepository = campaignRepository;
            _studentRepository = studentRepository;
            _userRepository = userRepository;
        }

        // Lấy danh sách tất cả chiến dịch tiêm chủng
        public async Task<BaseResponse> GetVaccinationCampaignsAsync()
        {
            var campaigns = await _campaignRepository.GetAllCampaigns();
            var response = campaigns.Select(c => new VaccinationCampaignResponse
            {
                CampaignId = c.CampaignId,
                VaccineName = c.VaccineName,
                Date = c.Date,
                Description = c.Description,
                CreatedBy = c.CreatedBy,
                CreatedByName = c.CreatedByNavigation?.FullName,
                StatusId = c.StatusId,
                StatusName = c.Status?.StatusName,
                TotalConsentRequests = c.VaccinationConsentRequests?.Count ?? 0,
                TotalVaccinationRecords = c.VaccinationRecords?.Count ?? 0
            }).ToList();

            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = "Successfully get list vaccination campaigns",
                Data = response
            };
        }

        // Lấy danh sách chiến dịch tiêm chủng đang hoạt động
        public async Task<BaseResponse> GetActiveVaccinationCampaignsAsync()
        {
            var campaigns = await _campaignRepository.GetAllActiveCampaigns();
            var response = campaigns.Select(c => new VaccinationCampaignResponse
            {
                CampaignId = c.CampaignId,
                VaccineName = c.VaccineName,
                Date = c.Date,
                Description = c.Description,
                CreatedBy = c.CreatedBy,
                CreatedByName = c.CreatedByNavigation?.FullName,
                StatusId = c.StatusId,
                StatusName = c.Status?.StatusName,
                TotalConsentRequests = c.VaccinationConsentRequests?.Count ?? 0,
                TotalVaccinationRecords = c.VaccinationRecords?.Count ?? 0
            }).ToList();

            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = "Successfully get list active vaccination campaigns",
                Data = response
            };
        }

        // Lấy danh sách chiến dịch theo trạng thái
        public async Task<BaseResponse> GetVaccinationCampaignsByStatusAsync(int statusId)
        {
            var campaigns = await _campaignRepository.GetCampaignsByStatus(statusId);
            var response = campaigns.Select(c => new VaccinationCampaignResponse
            {
                CampaignId = c.CampaignId,
                VaccineName = c.VaccineName,
                Date = c.Date,
                Description = c.Description,
                CreatedBy = c.CreatedBy,
                CreatedByName = c.CreatedByNavigation?.FullName,
                StatusId = c.StatusId,
                StatusName = c.Status?.StatusName,
                TotalConsentRequests = c.VaccinationConsentRequests?.Count ?? 0,
                TotalVaccinationRecords = c.VaccinationRecords?.Count ?? 0
            }).ToList();

            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = $"Successfully get vaccination campaigns with status ID {statusId}",
                Data = response
            };
        }

        // Lấy thông tin chi tiết một chiến dịch tiêm chủng
        public async Task<BaseResponse> GetVaccinationCampaignAsync(int campaignId)
        {
            var campaign = await _campaignRepository.GetCampaignById(campaignId);
            if (campaign == null)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status404NotFound.ToString(),
                    Message = $"Vaccination campaign with ID {campaignId} not found",
                    Data = null
                };
            }

            var response = new VaccinationCampaignResponse
            {
                CampaignId = campaign.CampaignId,
                VaccineName = campaign.VaccineName,
                Date = campaign.Date,
                Description = campaign.Description,
                CreatedBy = campaign.CreatedBy,
                CreatedByName = campaign.CreatedByNavigation?.FullName,
                StatusId = campaign.StatusId,
                StatusName = campaign.Status?.StatusName,
                TotalConsentRequests = campaign.VaccinationConsentRequests?.Count ?? 0,
                TotalVaccinationRecords = campaign.VaccinationRecords?.Count ?? 0
            };

            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = "Successfully retrieved vaccination campaign",
                Data = response
            };
        }

        // Tạo mới một chiến dịch tiêm chủng
        public async Task<BaseResponse> CreateVaccinationCampaignAsync(CreateVaccinationCampaignRequest request)
        {
            var campaign = new VaccinationCampaign
            {
                VaccineName = request.VaccineName,
                Date = request.Date,
                Description = request.Description,
                CreatedBy = request.CreatedBy,
                StatusId = request.StatusId ?? 1 // Default to status 1 if not provided
            };

            var created = await _campaignRepository.CreateCampaign(campaign);
            if (created == null)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status400BadRequest.ToString(),
                    Message = "Failed to create vaccination campaign",
                    Data = null
                };
            }

            return new BaseResponse
            {
                Status = StatusCodes.Status201Created.ToString(),
                Message = "Successfully created vaccination campaign",
                Data = new VaccinationCampaignResponse
                {
                    CampaignId = created.CampaignId,
                    VaccineName = created.VaccineName,
                    Date = created.Date,
                    Description = created.Description,
                    CreatedBy = created.CreatedBy,
                    CreatedByName = created.CreatedByNavigation?.FullName,
                    StatusId = created.StatusId,
                    StatusName = created.Status?.StatusName
                }
            };
        }

        // Lấy danh sách tất cả yêu cầu xác nhận của một chiến dịch
        public async Task<BaseResponse> GetCampaignConsentRequestsAsync(int campaignId)
        {
            var campaign = await _campaignRepository.GetCampaignById(campaignId);
            if (campaign == null)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status404NotFound.ToString(),
                    Message = $"Vaccination campaign with ID {campaignId} not found",
                    Data = null
                };
            }

            var consentRequests = await _campaignRepository.GetCampaignConsentRequests(campaignId);
            var response = consentRequests.Select(cr => new ConsentRequestResponse
            {
                RequestId = cr.RequestId,
                StudentId = cr.StudentId,
                StudentName = cr.Student?.FullName,
                CampaignId = cr.CampaignId,
                CampaignName = cr.Campaign?.VaccineName,
                ParentId = cr.ParentId,
                ParentName = cr.Parent?.FullName,
                RequestDate = cr.RequestDate,
                ConsentStatusId = cr.ConsentStatusId,
                ConsentStatusName = cr.ConsentStatus?.ConsentStatusName,
                ConsentDate = cr.ConsentDate
            }).ToList();

            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = "List agree",
                Data = response
            };
        }

        // Gửi phiếu đồng ý tiêm chủng cho phụ huynh
        public async Task<BaseResponse> SendConsentRequestAsync(int campaignId, int studentId, Guid parentId)
        {
            var campaign = await _campaignRepository.GetCampaignById(campaignId);
            if (campaign == null)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status404NotFound.ToString(),
                    Message = $"Vaccination campaign with ID {campaignId} not found",
                    Data = null
                };
            }

            var student = await _studentRepository.GetStudentById(studentId);
            if (student == null)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status404NotFound.ToString(),
                    Message = $"Student with ID {studentId} not found",
                    Data = null
                };
            }

            var parent = await _userRepository.GetByIdAsync(parentId);
            if (parent == null)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status404NotFound.ToString(),
                    Message = $"Parent with ID {parentId} not found",
                    Data = null
                };
            }

            var consentRequest = new VaccinationConsentRequest
            {
                CampaignId = campaignId,
                StudentId = studentId,
                ParentId = parentId,
                RequestDate = DateTime.UtcNow,
                ConsentStatusId = 1 // Set mặc định là "Chờ xác nhận"
            };

            var created = await _campaignRepository.CreateConsentRequest(consentRequest);
            if (created == null)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status400BadRequest.ToString(),
                    Message = "Failed to create consent request",
                    Data = null
                };
            }

            // TODO: Send email notification to parent (mở rộng trong tương lai)

            return new BaseResponse
            {
                Status = StatusCodes.Status201Created.ToString(),
                Message = "Successfully sent consent request",
                Data = new ConsentRequestResponse
                {
                    RequestId = created.RequestId,
                    StudentId = created.StudentId,
                    StudentName = student.FullName,
                    CampaignId = created.CampaignId,
                    CampaignName = campaign.VaccineName,
                    ParentId = created.ParentId,
                    ParentName = parent.FullName,
                    RequestDate = created.RequestDate
                }
            };
        }

        // Cập nhật trạng thái đồng ý của phụ huynh
        public async Task<BaseResponse> UpdateConsentRequestAsync(int requestId, UpdateConsentRequestRequest request)
        {
            var consentRequest = await _campaignRepository.GetConsentRequestById(requestId);
            if (consentRequest == null)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status404NotFound.ToString(),
                    Message = $"Consent request with ID {requestId} not found",
                    Data = null
                };
            }

            consentRequest.ConsentStatusId = request.ConsentStatusId;
            consentRequest.ConsentDate = DateTime.UtcNow;

            var updated = await _campaignRepository.UpdateConsentRequest(consentRequest);
            if (updated == null)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status400BadRequest.ToString(),
                    Message = "Failed to update consent request",
                    Data = null
                };
            }

            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = "Successfully updated consent request",
                Data = new ConsentRequestResponse
                {
                    RequestId = updated.RequestId,
                    StudentId = updated.StudentId,
                    StudentName = updated.Student?.FullName,
                    CampaignId = updated.CampaignId,
                    CampaignName = updated.Campaign?.VaccineName,
                    ParentId = updated.ParentId,
                    ParentName = updated.Parent?.FullName,
                    RequestDate = updated.RequestDate,
                    ConsentStatusId = updated.ConsentStatusId,
                    ConsentStatusName = updated.ConsentStatus?.ConsentStatusName,
                    ConsentDate = updated.ConsentDate
                }
            };
        }

        // Lấy lịch sử tiêm chủng của một học sinh
        public async Task<BaseResponse> GetStudentVaccinationRecordsAsync(int studentId)
        {
            var student = await _studentRepository.GetStudentById(studentId);
            if (student == null)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status404NotFound.ToString(),
                    Message = $"Student with ID {studentId} not found",
                    Data = null
                };
            }

            var records = await _campaignRepository.GetStudentVaccinationRecords(studentId);
            var response = records.Select(r => new VaccinationRecordResponse
            {
                RecordId = r.RecordId,
                StudentId = r.StudentId,
                StudentName = r.Student?.FullName,
                CampaignId = r.CampaignId,
                CampaignName = r.Campaign?.VaccineName,
                ConsentStatusId = r.ConsentStatusId,
                ConsentStatusName = r.ConsentStatus?.ConsentStatusName,
                ConsentDate = r.ConsentDate,
                VaccinationDate = r.VaccinationDate,
                Result = r.Result,
                FollowUpNote = r.FollowUpNote,
                IsActive = r.IsActive
            }).ToList();

            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = "Successfully retrieved vaccination records",
                Data = response
            };
        }

        // Ghi nhận kết quả tiêm chủng cho học sinh
        public async Task<BaseResponse> CreateVaccinationRecordAsync(CreateVaccinationRecordRequest request)
        {
            var student = await _studentRepository.GetStudentById(request.StudentId);
            if (student == null)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status404NotFound.ToString(),
                    Message = $"Student with ID {request.StudentId} not found",
                    Data = null
                };
            }

            var campaign = await _campaignRepository.GetCampaignById(request.CampaignId);
            if (campaign == null)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status404NotFound.ToString(),
                    Message = $"Vaccination campaign with ID {request.CampaignId} not found",
                    Data = null
                };
            }

            // Get all consent requests for the campaign and find the one for this student
            var consentRequests = await _campaignRepository.GetCampaignConsentRequests(request.CampaignId);
            var consentRequest = consentRequests.FirstOrDefault(cr => cr.StudentId == request.StudentId);
            
            if (consentRequest == null)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status404NotFound.ToString(),
                    Message = "Consent request not found for this student and campaign",
                    Data = null
                };
            }

            var record = new VaccinationRecord
            {
                StudentId = request.StudentId,
                CampaignId = request.CampaignId,
                ConsentStatusId = request.ConsentStatusId,
                ConsentDate = consentRequest.ConsentDate, // Use the ConsentDate from consent request
                VaccinationDate = request.VaccinationDate,
                Result = request.Result,
                FollowUpNote = request.FollowUpNote,
                IsActive = request.IsActive
            };

            var created = await _campaignRepository.CreateVaccinationRecord(record);
            if (created == null)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status400BadRequest.ToString(),
                    Message = "Failed to create vaccination record",
                    Data = null
                };
            }

            return new BaseResponse
            {
                Status = StatusCodes.Status201Created.ToString(),
                Message = "Successfully created vaccination record",
                Data = new VaccinationRecordResponse
                {
                    RecordId = created.RecordId,
                    StudentId = created.StudentId,
                    StudentName = student.FullName,
                    CampaignId = created.CampaignId,
                    CampaignName = campaign.VaccineName,
                    ConsentStatusId = created.ConsentStatusId,
                    ConsentStatusName = created.ConsentStatus?.ConsentStatusName,
                    ConsentDate = created.ConsentDate,
                    VaccinationDate = created.VaccinationDate,
                    Result = created.Result,
                    FollowUpNote = created.FollowUpNote,
                    IsActive = created.IsActive
                }
            };
        }

        // Lấy danh sách yêu cầu đã đồng ý của một chiến dịch
        public async Task<BaseResponse> GetApprovedConsentRequestsAsync(int campaignId)
        {
            var campaign = await _campaignRepository.GetCampaignById(campaignId);
            if (campaign == null)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status404NotFound.ToString(),
                    Message = $"Không tìm thấy chiến dịch tiêm chủng với ID {campaignId}",
                    Data = null
                };
            }

            var consentRequests = await _campaignRepository.GetCampaignConsentRequests(campaignId);
            var approvedRequests = consentRequests
                .Where(cr => cr.ConsentStatusId == 2) // 2: Đồng ý
                .Select(cr => new ConsentRequestResponse
                {
                    RequestId = cr.RequestId,
                    StudentId = cr.StudentId,
                    StudentName = cr.Student?.FullName,
                    CampaignId = cr.CampaignId,
                    CampaignName = cr.Campaign?.VaccineName,
                    ParentId = cr.ParentId,
                    ParentName = cr.Parent?.FullName,
                    RequestDate = cr.RequestDate,
                    ConsentStatusId = cr.ConsentStatusId,
                    ConsentStatusName = cr.ConsentStatus?.ConsentStatusName,
                    ConsentDate = cr.ConsentDate
                }).ToList();

            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = "Lấy danh sách yêu cầu đã đồng ý thành công",
                Data = approvedRequests
            };
        }

        // Lấy danh sách yêu cầu từ chối của một chiến dịch
        public async Task<BaseResponse> GetDeclinedConsentRequestsAsync(int campaignId)
        {
            var campaign = await _campaignRepository.GetCampaignById(campaignId);
            if (campaign == null)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status404NotFound.ToString(),
                    Message = $"Không tìm thấy chiến dịch tiêm chủng với ID {campaignId}",
                    Data = null
                };
            }

            var consentRequests = await _campaignRepository.GetCampaignConsentRequests(campaignId);
            var declinedRequests = consentRequests
                .Where(cr => cr.ConsentStatusId == 3) // 3: Từ chối
                .Select(cr => new ConsentRequestResponse
                {
                    RequestId = cr.RequestId,
                    StudentId = cr.StudentId,
                    StudentName = cr.Student?.FullName,
                    CampaignId = cr.CampaignId,
                    CampaignName = cr.Campaign?.VaccineName,
                    ParentId = cr.ParentId,
                    ParentName = cr.Parent?.FullName,
                    RequestDate = cr.RequestDate,
                    ConsentStatusId = cr.ConsentStatusId,
                    ConsentStatusName = cr.ConsentStatus?.ConsentStatusName,
                    ConsentDate = cr.ConsentDate
                }).ToList();

            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = "Lấy danh sách yêu cầu từ chối thành công",
                Data = declinedRequests
            };
        }

        // Cập nhật chiến dịch tiêm chủng
        public async Task<BaseResponse> UpdateVaccinationCampaignAsync(UpdateVaccinationCampaignRequest request)
        {
            var campaign = await _campaignRepository.GetCampaignById(request.CampaignId);
            if (campaign == null)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status404NotFound.ToString(),
                    Message = $"Vaccination campaign with ID {request.CampaignId} not found",
                    Data = null
                };
            }

            // Cập nhật thông tin chiến dịch
            campaign.VaccineName = request.VaccineName;
            campaign.Date = request.Date;
            campaign.Description = request.Description;
            campaign.StatusId = request.StatusId;

            var updated = await _campaignRepository.UpdateCampaign(campaign);
            if (updated == null)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status400BadRequest.ToString(),
                    Message = "Failed to update vaccination campaign",
                    Data = null
                };
            }

            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = "Successfully updated vaccination campaign",
                Data = new VaccinationCampaignResponse
                {
                    CampaignId = updated.CampaignId,
                    VaccineName = updated.VaccineName,
                    Date = updated.Date,
                    Description = updated.Description,
                    CreatedBy = updated.CreatedBy,
                    CreatedByName = updated.CreatedByNavigation?.FullName,
                    StatusId = updated.StatusId,
                    StatusName = updated.Status?.StatusName
                }
            };
        }

        // Vô hiệu hóa chiến dịch tiêm chủng (chuyển từ đang hoạt động sang đã kết thúc)
        public async Task<BaseResponse> DeactivateVaccinationCampaignAsync(int campaignId)
        {
            var updated = await _campaignRepository.DeactivateCampaign(campaignId);
            if (updated == null)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status400BadRequest.ToString(),
                    Message = "Campaign not found or is not active",
                    Data = null
                };
            }

            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = "Successfully deactivated vaccination campaign",
                Data = new VaccinationCampaignResponse
                {
                    CampaignId = updated.CampaignId,
                    VaccineName = updated.VaccineName,
                    Date = updated.Date,
                    Description = updated.Description,
                    CreatedBy = updated.CreatedBy,
                    CreatedByName = updated.CreatedByNavigation?.FullName,
                    StatusId = updated.StatusId,
                    StatusName = updated.Status?.StatusName
                }
            };
        }

        // Kích hoạt lại chiến dịch tiêm chủng (chuyển từ đã kết thúc sang đang hoạt động)
        public async Task<BaseResponse> ActivateVaccinationCampaignAsync(int campaignId)
        {
            var updated = await _campaignRepository.ActivateCampaign(campaignId);
            if (updated == null)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status400BadRequest.ToString(),
                    Message = "Campaign not found or is not closed",
                    Data = null
                };
            }

            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = "Successfully activated vaccination campaign",
                Data = new VaccinationCampaignResponse
                {
                    CampaignId = updated.CampaignId,
                    VaccineName = updated.VaccineName,
                    Date = updated.Date,
                    Description = updated.Description,
                    CreatedBy = updated.CreatedBy,
                    CreatedByName = updated.CreatedByNavigation?.FullName,
                    StatusId = updated.StatusId,
                    StatusName = updated.Status?.StatusName
                }
            };
        }

        // Lấy thống kê chiến dịch tiêm chủng
        public async Task<BaseResponse> GetCampaignStatisticsAsync()
        {
            var statistics = await _campaignRepository.GetCampaignStatistics();
            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = "Successfully retrieved campaign statistics",
                Data = statistics
            };
        }

        // Lấy danh sách chiến dịch theo khoảng thời gian
        public async Task<BaseResponse> GetCampaignsByDateRangeAsync(DateOnly startDate, DateOnly endDate)
        {
            var campaigns = await _campaignRepository.GetCampaignsByDateRange(startDate, endDate);
            var response = campaigns.Select(c => new VaccinationCampaignResponse
            {
                CampaignId = c.CampaignId,
                VaccineName = c.VaccineName,
                Date = c.Date,
                Description = c.Description,
                CreatedBy = c.CreatedBy,
                CreatedByName = c.CreatedByNavigation?.FullName,
                StatusId = c.StatusId,
                StatusName = c.Status?.StatusName,
                TotalConsentRequests = c.VaccinationConsentRequests?.Count ?? 0,
                TotalVaccinationRecords = c.VaccinationRecords?.Count ?? 0
            }).ToList();

            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = $"Successfully get campaigns from {startDate:dd/MM/yyyy} to {endDate:dd/MM/yyyy}",
                Data = response
            };
        }

        // Lấy danh sách chiến dịch theo người tạo
        public async Task<BaseResponse> GetCampaignsByCreatorAsync(Guid creatorId)
        {
            var campaigns = await _campaignRepository.GetCampaignsByCreator(creatorId);
            var response = campaigns.Select(c => new VaccinationCampaignResponse
            {
                CampaignId = c.CampaignId,
                VaccineName = c.VaccineName,
                Date = c.Date,
                Description = c.Description,
                CreatedBy = c.CreatedBy,
                CreatedByName = c.CreatedByNavigation?.FullName,
                StatusId = c.StatusId,
                StatusName = c.Status?.StatusName,
                TotalConsentRequests = c.VaccinationConsentRequests?.Count ?? 0,
                TotalVaccinationRecords = c.VaccinationRecords?.Count ?? 0
            }).ToList();

            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = "Successfully get campaigns by creator",
                Data = response
            };
        }

        // Kiểm tra trạng thái chiến dịch
        public async Task<BaseResponse> CheckCampaignStatusAsync(int campaignId)
        {
            var status = await _campaignRepository.GetCampaignStatus(campaignId);
            if (!status.HasValue)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status404NotFound.ToString(),
                    Message = $"Campaign with ID {campaignId} not found",
                    Data = null
                };
            }

            var statusName = status.Value switch
            {
                1 => "Đang hoạt động",
                2 => "Đã kết thúc",
                _ => "Không xác định"
            };

            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = "Successfully retrieved campaign status",
                Data = new { CampaignId = campaignId, StatusId = status.Value, StatusName = statusName }
            };
        }
    }
}
