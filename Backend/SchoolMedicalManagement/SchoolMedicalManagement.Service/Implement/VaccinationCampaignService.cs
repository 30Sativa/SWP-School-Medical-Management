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
using Hangfire;

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
            var campaigns = await _campaignRepository.GetAllCampaignsLightweight();

            if (!campaigns.Any())
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status200OK.ToString(),
                    Message = "Không tìm thấy chiến dịch tiêm chủng nào",
                    Data = new List<VaccinationCampaignResponse>()
                };
            }

            var campaignIds = campaigns.Select(c => c.CampaignId).ToList();
            var consentRequestsCounts = await _campaignRepository.GetConsentRequestsCountByCampaignIds(campaignIds);
            var vaccinationRecordsCounts = await _campaignRepository.GetVaccinationRecordsCountByCampaignIds(campaignIds);

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
                TotalConsentRequests = consentRequestsCounts.GetValueOrDefault(c.CampaignId, 0),
                TotalVaccinationRecords = vaccinationRecordsCounts.GetValueOrDefault(c.CampaignId, 0)
            }).ToList();

            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = "Lấy danh sách chiến dịch tiêm chủng thành công",
                Data = response
            };
        }

        // Lấy danh sách chiến dịch tiêm chủng đang hoạt động
        public async Task<BaseResponse> GetActiveVaccinationCampaignsAsync()
        {
            var campaigns = await _campaignRepository.GetAllActiveCampaignsLightweight();

            if (!campaigns.Any())
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status200OK.ToString(),
                    Message = "Không tìm thấy chiến dịch tiêm chủng đang hoạt động",
                    Data = new List<VaccinationCampaignResponse>()
                };
            }

            var campaignIds = campaigns.Select(c => c.CampaignId).ToList();
            var consentRequestsCounts = await _campaignRepository.GetConsentRequestsCountByCampaignIds(campaignIds);
            var vaccinationRecordsCounts = await _campaignRepository.GetVaccinationRecordsCountByCampaignIds(campaignIds);

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
                TotalConsentRequests = consentRequestsCounts.GetValueOrDefault(c.CampaignId, 0),
                TotalVaccinationRecords = vaccinationRecordsCounts.GetValueOrDefault(c.CampaignId, 0)
            }).ToList();

            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = "Lấy danh sách chiến dịch tiêm chủng đang hoạt động thành công",
                Data = response
            };
        }

        // Lấy danh sách chiến dịch theo trạng thái
        public async Task<BaseResponse> GetVaccinationCampaignsByStatusAsync(int statusId)
        {
            var campaigns = await _campaignRepository.GetCampaignsByStatusLightweight(statusId);

            if (!campaigns.Any())
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status200OK.ToString(),
                    Message = $"Không tìm thấy chiến dịch tiêm chủng với trạng thái ID {statusId}",
                    Data = new List<VaccinationCampaignResponse>()
                };
            }

            var campaignIds = campaigns.Select(c => c.CampaignId).ToList();
            var consentRequestsCounts = await _campaignRepository.GetConsentRequestsCountByCampaignIds(campaignIds);
            var vaccinationRecordsCounts = await _campaignRepository.GetVaccinationRecordsCountByCampaignIds(campaignIds);

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
                TotalConsentRequests = consentRequestsCounts.GetValueOrDefault(c.CampaignId, 0),
                TotalVaccinationRecords = vaccinationRecordsCounts.GetValueOrDefault(c.CampaignId, 0)
            }).ToList();

            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = $"Lấy danh sách chiến dịch tiêm chủng với trạng thái ID {statusId} thành công",
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
                    Message = $"Không tìm thấy chiến dịch tiêm chủng với ID {campaignId}",
                    Data = null
                };
            }

            var totalConsentRequests = await _campaignRepository.GetConsentRequestsCountByCampaignId(campaignId);
            var totalVaccinationRecords = await _campaignRepository.GetVaccinationRecordsCountByCampaignId(campaignId);

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
                TotalConsentRequests = totalConsentRequests,
                TotalVaccinationRecords = totalVaccinationRecords
            };

            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = "Lấy thông tin chiến dịch tiêm chủng thành công",
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
                    Message = "Tạo chiến dịch tiêm chủng thất bại",
                    Data = null
                };
            }

            return new BaseResponse
            {
                Status = StatusCodes.Status201Created.ToString(),
                Message = "Tạo chiến dịch tiêm chủng thành công",
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
                    Message = $"Không tìm thấy chiến dịch tiêm chủng với ID {campaignId}",
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
                Message = "Danh sách đồng ý",
                Data = response
            };
        }

        // Gửi phiếu đồng ý tiêm chủng cho phụ huynh
        public async Task<BaseResponse> SendConsentRequestAsync(int campaignId, int studentId, Guid parentId, int? autoDeclineAfterDays = null)
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

            var student = await _studentRepository.GetStudentById(studentId);
            if (student == null)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status404NotFound.ToString(),
                    Message = $"Không tìm thấy học sinh với ID {studentId}",
                    Data = null
                };
            }

            var parent = await _userRepository.GetByIdAsync(parentId);
            if (parent == null)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status404NotFound.ToString(),
                    Message = $"Không tìm thấy phụ huynh với ID {parentId}",
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
                    Message = "Tạo yêu cầu đồng ý thất bại",
                    Data = null
                };
            }

            int days = autoDeclineAfterDays ?? 3;
            BackgroundJob.Schedule<VaccinationCampaignService>(
                x => x.AutoDeclineConsentRequest(created.RequestId),
                TimeSpan.FromDays(days)
            );

            return new BaseResponse
            {
                Status = StatusCodes.Status201Created.ToString(),
                Message = "Gửi yêu cầu đồng ý thành công",
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
                    Message = $"Không tìm thấy yêu cầu đồng ý với ID {requestId}",
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
                    Message = "Cập nhật yêu cầu đồng ý thất bại",
                    Data = null
                };
            }

            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = "Cập nhật yêu cầu đồng ý thành công",
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
                    Message = $"Không tìm thấy học sinh với ID {studentId}",
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
                Message = "Lấy danh sách hồ sơ tiêm chủng thành công",
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
                    Message = $"Không tìm thấy học sinh với ID {request.StudentId}",
                    Data = null
                };
            }

            var campaign = await _campaignRepository.GetCampaignById(request.CampaignId);
            if (campaign == null)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status404NotFound.ToString(),
                    Message = $"Không tìm thấy chiến dịch tiêm chủng với ID {request.CampaignId}",
                    Data = null
                };
            }

            var consentRequests = await _campaignRepository.GetCampaignConsentRequests(request.CampaignId);
            var consentRequest = consentRequests.FirstOrDefault(cr => cr.StudentId == request.StudentId);

            if (consentRequest == null)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status404NotFound.ToString(),
                    Message = "Không tìm thấy yêu cầu đồng ý cho học sinh và chiến dịch này",
                    Data = null
                };
            }

            var record = new VaccinationRecord
            {
                StudentId = request.StudentId,
                CampaignId = request.CampaignId,
                ConsentStatusId = request.ConsentStatusId,
                ConsentDate = consentRequest.ConsentDate,
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
                    Message = "Tạo hồ sơ tiêm chủng thất bại",
                    Data = null
                };
            }

            return new BaseResponse
            {
                Status = StatusCodes.Status201Created.ToString(),
                Message = "Tạo hồ sơ tiêm chủng thành công",
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
                .Where(cr => cr.ConsentStatusId == 2)
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
                Message = "Lấy danh sách yêu cầu đồng ý thành công",
                Data = approvedRequests
            };
        }

        // Lấy danh sách học sinh từ chối tiêm của một chiến dịch
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
            var declinedRequests = consentRequests.Where(cr => cr.ConsentStatusId == 3).ToList();

            var response = declinedRequests.Select(cr => new ConsentRequestResponse
            {
                RequestId = cr.RequestId,
                StudentName = cr.Student?.FullName,
                ParentName = cr.Parent?.FullName,
                CampaignName = cr.Campaign?.VaccineName,
                RequestDate = cr.RequestDate,
                ConsentStatusName = cr.ConsentStatus?.ConsentStatusName,
                ConsentDate = cr.ConsentDate,
                CampaignId = cr.CampaignId,
                ConsentStatusId = cr.ConsentStatusId,
                ParentId = cr.ParentId,
                StudentId = cr.StudentId
            }).ToList();

            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = $"Lấy {response.Count} yêu cầu từ chối thành công cho chiến dịch {campaignId}",
                Data = response
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
                    Message = $"Không tìm thấy chiến dịch tiêm chủng với ID {request.CampaignId}",
                    Data = null
                };
            }

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
                    Message = "Cập nhật chiến dịch tiêm chủng thất bại",
                    Data = null
                };
            }

            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = "Cập nhật chiến dịch tiêm chủng thành công",
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

        // Vô hiệu hóa chiến dịch tiêm chủng (Đang diễn ra → Đã hoàn thành)
        public async Task<BaseResponse> DeactivateVaccinationCampaignAsync(int campaignId)
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

            if (campaign.StatusId != 2)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status400BadRequest.ToString(),
                    Message = "Chỉ chiến dịch với trạng thái 'Đang diễn ra' có thể bị hủy kích hoạt",
                    Data = null
                };
            }

            var deactivated = await _campaignRepository.DeactivateCampaign(campaignId);
            if (deactivated == null)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status400BadRequest.ToString(),
                    Message = "Hủy kích hoạt chiến dịch tiêm chủng thất bại",
                    Data = null
                };
            }

            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = "Hủy kích hoạt chiến dịch tiêm chủng thành công",
                Data = new VaccinationCampaignResponse
                {
                    CampaignId = deactivated.CampaignId,
                    VaccineName = deactivated.VaccineName,
                    Date = deactivated.Date,
                    Description = deactivated.Description,
                    CreatedBy = deactivated.CreatedBy,
                    CreatedByName = deactivated.CreatedByNavigation?.FullName,
                    StatusId = deactivated.StatusId,
                    StatusName = deactivated.Status?.StatusName
                }
            };
        }

        // Kích hoạt lại chiến dịch tiêm chủng (Đã hoàn thành → Đang diễn ra)
        public async Task<BaseResponse> ActivateVaccinationCampaignAsync(int campaignId)
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

            if (campaign.StatusId != 3)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status400BadRequest.ToString(),
                    Message = "Chỉ chiến dịch với trạng thái 'Đã hoàn thành' có thể được kích hoạt",
                    Data = null
                };
            }

            var activated = await _campaignRepository.ActivateCampaign(campaignId);
            if (activated == null)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status400BadRequest.ToString(),
                    Message = "Kích hoạt chiến dịch tiêm chủng thất bại",
                    Data = null
                };
            }

            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = "Kích hoạt chiến dịch tiêm chủng thành công",
                Data = new VaccinationCampaignResponse
                {
                    CampaignId = activated.CampaignId,
                    VaccineName = activated.VaccineName,
                    Date = activated.Date,
                    Description = activated.Description,
                    CreatedBy = activated.CreatedBy,
                    CreatedByName = activated.CreatedByNavigation?.FullName,
                    StatusId = activated.StatusId,
                    StatusName = activated.Status?.StatusName
                }
            };
        }

        // Lấy danh sách chiến dịch theo người tạo
        public async Task<BaseResponse> GetCampaignsByCreatorAsync(Guid creatorId)
        {
            var campaigns = await _campaignRepository.GetCampaignsByCreatorLightweight(creatorId);

            if (!campaigns.Any())
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status200OK.ToString(),
                    Message = "Không tìm thấy chiến dịch cho người tạo này",
                    Data = new List<VaccinationCampaignResponse>()
                };
            }

            var campaignIds = campaigns.Select(c => c.CampaignId).ToList();
            var consentRequestsCounts = await _campaignRepository.GetConsentRequestsCountByCampaignIds(campaignIds);
            var vaccinationRecordsCounts = await _campaignRepository.GetVaccinationRecordsCountByCampaignIds(campaignIds);

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
                TotalConsentRequests = consentRequestsCounts.GetValueOrDefault(c.CampaignId, 0),
                TotalVaccinationRecords = vaccinationRecordsCounts.GetValueOrDefault(c.CampaignId, 0)
            }).ToList();

            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = "Lấy danh sách chiến dịch theo người tạo thành công",
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
                    Message = $"Không tìm thấy chiến dịch với ID {campaignId}",
                    Data = null
                };
            }

            var statusName = status.Value switch
            {
                1 => "Chưa bắt đầu",
                2 => "Đang diễn ra",
                3 => "Đã hoàn thành",
                4 => "Đã huỷ",
                _ => "Không xác định"
            };

            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = "Lấy trạng thái chiến dịch thành công",
                Data = new { CampaignId = campaignId, StatusId = status.Value, StatusName = statusName }
            };
        }

        // Gửi phiếu đồng ý theo lớp học
        public async Task<BaseResponse> SendConsentRequestsByClassAsync(int campaignId, SendConsentByClassRequest request)
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

            var students = await _campaignRepository.GetStudentsByClass(request.ClassName);
            if (!students.Any())
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status404NotFound.ToString(),
                    Message = $"Không tìm thấy học sinh nào trong lớp {request.ClassName}",
                    Data = null
                };
            }

            var response = new BulkConsentResponse
            {
                TotalStudents = students.Count
            };

            var consentRequests = new List<VaccinationConsentRequest>();

            foreach (var student in students)
            {
                try
                {
                    if (student.ParentId == null)
                    {
                        response.FailedCount++;
                        response.FailedReasons.Add($"Học sinh {student.FullName} không có phụ huynh");
                        continue;
                    }

                    var exists = await _campaignRepository.ConsentRequestExists(campaignId, student.StudentId);
                    if (exists)
                    {
                        response.FailedCount++;
                        response.FailedReasons.Add($"Học sinh {student.FullName} đã có phiếu đồng ý");
                        continue;
                    }

                    var consentRequest = new VaccinationConsentRequest
                    {
                        CampaignId = campaignId,
                        StudentId = student.StudentId,
                        ParentId = student.ParentId.Value,
                        RequestDate = DateTime.UtcNow,
                        ConsentStatusId = 1
                    };

                    consentRequests.Add(consentRequest);
                    response.SuccessCount++;
                }
                catch (Exception ex)
                {
                    response.FailedCount++;
                    response.FailedReasons.Add($"Lỗi khi xử lý học sinh {student.FullName}: {ex.Message}");
                }
            }

            if (consentRequests.Any())
            {
                var createdRequests = await _campaignRepository.CreateMultipleConsentRequests(consentRequests);
                response.CreatedRequests = createdRequests.Select(cr => new ConsentRequestResponse
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
                    ConsentStatusName = cr.ConsentStatus?.ConsentStatusName
                }).ToList();

                int days = request.AutoDeclineAfterDays ?? 3;
                foreach (var cr in createdRequests)
                {
                    BackgroundJob.Schedule<VaccinationCampaignService>(
                        x => x.AutoDeclineConsentRequest(cr.RequestId),
                        TimeSpan.FromDays(days)
                    );
                }
            }

            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = $"Gửi phiếu đồng ý thành công cho {response.SuccessCount}/{response.TotalStudents} học sinh trong lớp {request.ClassName}",
                Data = response
            };
        }

        // Gửi phiếu đồng ý cho tất cả phụ huynh
        public async Task<BaseResponse> SendConsentRequestsToAllParentsAsync(int campaignId, int? autoDeclineAfterDays = null)
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

            var students = await _campaignRepository.GetStudentsWithParents();
            if (!students.Any())
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status404NotFound.ToString(),
                    Message = "Không tìm thấy học sinh nào có phụ huynh",
                    Data = null
                };
            }

            var response = new BulkConsentResponse
            {
                TotalStudents = students.Count
            };

            var consentRequests = new List<VaccinationConsentRequest>();

            foreach (var student in students)
            {
                try
                {
                    var exists = await _campaignRepository.ConsentRequestExists(campaignId, student.StudentId);
                    if (exists)
                    {
                        response.FailedCount++;
                        response.FailedReasons.Add($"Học sinh {student.FullName} đã có phiếu đồng ý");
                        continue;
                    }

                    var consentRequest = new VaccinationConsentRequest
                    {
                        CampaignId = campaignId,
                        StudentId = student.StudentId,
                        ParentId = student.ParentId.Value,
                        RequestDate = DateTime.UtcNow,
                        ConsentStatusId = 1
                    };

                    consentRequests.Add(consentRequest);
                    response.SuccessCount++;
                }
                catch (Exception ex)
                {
                    response.FailedCount++;
                    response.FailedReasons.Add($"Lỗi khi xử lý học sinh {student.FullName}: {ex.Message}");
                }
            }

            if (consentRequests.Any())
            {
                var createdRequests = await _campaignRepository.CreateMultipleConsentRequests(consentRequests);
                response.CreatedRequests = createdRequests.Select(cr => new ConsentRequestResponse
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
                    ConsentStatusName = cr.ConsentStatus?.ConsentStatusName
                }).ToList();

                int days = autoDeclineAfterDays ?? 3;
                foreach (var cr in createdRequests)
                {
                    BackgroundJob.Schedule<VaccinationCampaignService>(
                        x => x.AutoDeclineConsentRequest(cr.RequestId),
                        TimeSpan.FromDays(days)
                    );
                }
            }

            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = $"Gửi phiếu đồng ý thành công cho {response.SuccessCount}/{response.TotalStudents} học sinh",
                Data = response
            };
        }

        // Gửi phiếu đồng ý theo danh sách học sinh
        public async Task<BaseResponse> SendConsentRequestsBulkAsync(int campaignId, SendConsentBulkRequest request)
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

            if (!request.StudentIds.Any())
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status400BadRequest.ToString(),
                    Message = "Danh sách học sinh không được để trống",
                    Data = null
                };
            }

            var students = await _campaignRepository.GetStudentsByIds(request.StudentIds);
            if (!students.Any())
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status404NotFound.ToString(),
                    Message = "Không tìm thấy học sinh nào trong danh sách",
                    Data = null
                };
            }

            var response = new BulkConsentResponse
            {
                TotalStudents = students.Count
            };

            var consentRequests = new List<VaccinationConsentRequest>();

            foreach (var student in students)
            {
                try
                {
                    if (student.ParentId == null)
                    {
                        response.FailedCount++;
                        response.FailedReasons.Add($"Học sinh {student.FullName} không có phụ huynh");
                        continue;
                    }

                    var exists = await _campaignRepository.ConsentRequestExists(campaignId, student.StudentId);
                    if (exists)
                    {
                        response.FailedCount++;
                        response.FailedReasons.Add($"Học sinh {student.FullName} đã có phiếu đồng ý");
                        continue;
                    }

                    var consentRequest = new VaccinationConsentRequest
                    {
                        CampaignId = campaignId,
                        StudentId = student.StudentId,
                        ParentId = student.ParentId.Value,
                        RequestDate = DateTime.UtcNow,
                        ConsentStatusId = 1
                    };

                    consentRequests.Add(consentRequest);
                    response.SuccessCount++;
                }
                catch (Exception ex)
                {
                    response.FailedCount++;
                    response.FailedReasons.Add($"Lỗi khi xử lý học sinh {student.FullName}: {ex.Message}");
                }
            }

            if (consentRequests.Any())
            {
                var createdRequests = await _campaignRepository.CreateMultipleConsentRequests(consentRequests);
                response.CreatedRequests = createdRequests.Select(cr => new ConsentRequestResponse
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
                    ConsentStatusName = cr.ConsentStatus?.ConsentStatusName
                }).ToList();

                int days = request.AutoDeclineAfterDays ?? 3;
                foreach (var cr in createdRequests)
                {
                    BackgroundJob.Schedule<VaccinationCampaignService>(
                        x => x.AutoDeclineConsentRequest(cr.RequestId),
                        TimeSpan.FromDays(days)
                    );
                }
            }

            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = $"Gửi phiếu đồng ý thành công cho {response.SuccessCount}/{response.TotalStudents} học sinh",
                Data = response
            };
        }

        // Lấy phiếu đồng ý tiêm chủng theo requestId
        public async Task<BaseResponse> GetConsentRequestByIdAsync(int requestId)
        {
            var consentRequest = await _campaignRepository.GetConsentRequestById(requestId);
            if (consentRequest == null)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status404NotFound.ToString(),
                    Message = $"Không tìm thấy yêu cầu đồng ý với ID {requestId}",
                    Data = null
                };
            }

            var response = new ConsentRequestResponse
            {
                RequestId = consentRequest.RequestId,
                StudentId = consentRequest.StudentId,
                StudentName = consentRequest.Student?.FullName,
                CampaignId = consentRequest.CampaignId,
                CampaignName = consentRequest.Campaign?.VaccineName,
                ParentId = consentRequest.ParentId,
                ParentName = consentRequest.Parent?.FullName,
                RequestDate = consentRequest.RequestDate,
                ConsentStatusId = consentRequest.ConsentStatusId,
                ConsentStatusName = consentRequest.ConsentStatus?.ConsentStatusName,
                ConsentDate = consentRequest.ConsentDate
            };

            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = "Lấy yêu cầu đồng ý thành công",
                Data = response
            };
        }

        // Lấy tất cả phiếu đồng ý tiêm chủng của một học sinh
        public async Task<BaseResponse> GetConsentRequestsByStudentIdAsync(int studentId)
        {
            var student = await _studentRepository.GetStudentById(studentId);
            if (student == null)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status404NotFound.ToString(),
                    Message = $"Không tìm thấy học sinh với ID {studentId}",
                    Data = null
                };
            }

            var consentRequests = await _campaignRepository.GetConsentRequestsByStudentId(studentId);
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
                Message = "Lấy danh sách yêu cầu đồng ý theo học sinh thành công",
                Data = response
            };
        }

        // Thêm method cho Hangfire tự động từ chối phiếu đồng ý
        public async Task AutoDeclineConsentRequest(int requestId)
        {
            var consentRequest = await _campaignRepository.GetConsentRequestById(requestId);
            if (consentRequest != null && consentRequest.ConsentStatusId == 1)
            {
                consentRequest.ConsentStatusId = 3;
                consentRequest.ConsentDate = DateTime.UtcNow;
                await _campaignRepository.UpdateConsentRequest(consentRequest);
            }
        }
    }
}
