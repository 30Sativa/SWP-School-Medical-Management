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
                                         //Nếu consent list khác null thì .Lấy count nếu null thì l
                TotalConsentRequests = c.VaccinationConsentRequests?.Count ?? 0, //Trả về tổng số đồng ý tiêm chủng
                TotalVaccinationRecords = c.VaccinationRecords?.Count ?? 0 // Trả về tổng số bản ghi trong đợt tiêm
            }).ToList();

            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = "Successfully get list vaccination campaigns",
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
                CreatedBy = request.CreatedBy
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
                    CreatedByName = created.CreatedByNavigation?.FullName
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

            var record = new VaccinationRecord
            {
                StudentId = request.StudentId,
                CampaignId = request.CampaignId,
                ConsentStatusId = request.ConsentStatusId,
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
}

}
