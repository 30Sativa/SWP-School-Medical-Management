using Microsoft.AspNetCore.Http;
using SchoolMedicalManagement.Models.Entity;
using SchoolMedicalManagement.Models.Request;
using SchoolMedicalManagement.Models.Response;
using SchoolMedicalManagement.Repository.Repository;
using SchoolMedicalManagement.Service.Interface;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SchoolMedicalManagement.Service.Implement
{
    public class HealthCheckSummaryService : IHealthCheckSummaryService
    {
        private readonly HealthCheckSummaryRepository _summaryRepository;
        private readonly StudentRepository _studentRepository;
        private readonly HealthCheckCampaignRepository _campaignRepository;

        public HealthCheckSummaryService(HealthCheckSummaryRepository summaryRepository, StudentRepository studentRepository, HealthCheckCampaignRepository campaignRepository)
        {
            _summaryRepository = summaryRepository;
            _studentRepository = studentRepository;
            _campaignRepository = campaignRepository;
        }

        public async Task<List<HealthCheckSummaryManagementResponse>> GetAllHealthCheckSummariesAsync()
        {
            var summaries = await _summaryRepository.GetAllHealthCheckSummaries();
            var result = new List<HealthCheckSummaryManagementResponse>();
            foreach (var s in summaries)
            {
                result.Add(new HealthCheckSummaryManagementResponse
                {
                    RecordId = s.RecordId,
                    StudentId = s.StudentId,
                    StudentName = s.Student?.FullName,
                    CampaignId = s.CampaignId,
                    CampaignTitle = s.Campaign?.Title,
                    BloodPressure = s.BloodPressure,
                    HeartRate = s.HeartRate,
                    Height = s.Height,
                    Weight = s.Weight,
                    Bmi = s.Bmi,
                    VisionSummary = s.VisionSummary,
                    Ent = s.Ent,
                    EntNotes = s.EntNotes,
                    Mouth = s.Mouth,
                    Throat = s.Throat,
                    ToothDecay = s.ToothDecay,
                    ToothNotes = s.ToothNotes,
                    GeneralNote = s.GeneralNote,
                    FollowUpNote = s.FollowUpNote,
                    ConsentStatus = s.ConsentStatus,
                    IsActive = s.IsActive
                });
            }
            return result;
        }

        public async Task<BaseResponse?> GetHealthCheckSummaryByIdAsync(int id)
        {
            var s = await _summaryRepository.GetHealthCheckSummaryById(id);
            if (s == null)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status404NotFound.ToString(),
                    Message = $"Health check summary with ID {id} not found.",
                    Data = null
                };
            }
            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = "Health check summary found successfully.",
                Data = new HealthCheckSummaryManagementResponse
                {
                    RecordId = s.RecordId,
                    StudentId = s.StudentId,
                    StudentName = s.Student?.FullName,
                    CampaignId = s.CampaignId,
                    CampaignTitle = s.Campaign?.Title,
                    BloodPressure = s.BloodPressure,
                    HeartRate = s.HeartRate,
                    Height = s.Height,
                    Weight = s.Weight,
                    Bmi = s.Bmi,
                    VisionSummary = s.VisionSummary,
                    Ent = s.Ent,
                    EntNotes = s.EntNotes,
                    Mouth = s.Mouth,
                    Throat = s.Throat,
                    ToothDecay = s.ToothDecay,
                    ToothNotes = s.ToothNotes,
                    GeneralNote = s.GeneralNote,
                    FollowUpNote = s.FollowUpNote,
                    ConsentStatus = s.ConsentStatus,
                    IsActive = s.IsActive
                }
            };
        }

        public async Task<BaseResponse?> CreateHealthCheckSummaryAsync(CreateHealthCheckSummaryRequest request)
        {
            var newSummary = new HealthCheckSummary
            {
                StudentId = request.StudentId,
                CampaignId = request.CampaignId,
                BloodPressure = request.BloodPressure,
                HeartRate = request.HeartRate,
                Height = request.Height,
                Weight = request.Weight,
                Bmi = request.Bmi,
                VisionSummary = request.VisionSummary,
                Ent = request.Ent,
                EntNotes = request.EntNotes,
                Mouth = request.Mouth,
                Throat = request.Throat,
                ToothDecay = request.ToothDecay,
                ToothNotes = request.ToothNotes,
                GeneralNote = request.GeneralNote,
                FollowUpNote = request.FollowUpNote,
                ConsentStatus = request.ConsentStatus,
                IsActive = request.IsActive ?? true
            };

            // Kiểm tra Student có tồn tại không vì dữ liệu sức khỏe này gắn liền với 1 student
            var existingStudent = await _studentRepository.GetStudentById(request.StudentId);
            if (existingStudent == null)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status400BadRequest.ToString(),
                    Message = $"Student with ID {request.StudentId} not found.",
                    Data = null
                };
            }

            // Kiểm tra Campaign ID này đã được tạo trc đó chưa vì hồ sơ sức khỏe này thuộc 1 đợt khám sức khỏe nào đó
            if (request.CampaignId.HasValue)
            {
                var existingCampaign = await _campaignRepository.GetHealthCheckCampaignById(request.CampaignId.Value);
                if (existingCampaign == null)
                {
                    return new BaseResponse
                    {
                        Status = StatusCodes.Status400BadRequest.ToString(),
                        Message = $"Health check campaign with ID {request.CampaignId.Value} not found.",
                        Data = null
                    };
                }
            }

            var created = await _summaryRepository.CreateHealthCheckSummary(newSummary);
            if (created == null)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status400BadRequest.ToString(),
                    Message = "Create health check summary failed.",
                    Data = null
                };
            }
            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = "Create health check summary successfully.",
                Data = new HealthCheckSummaryManagementResponse
                {
                    RecordId = created.RecordId,
                    StudentId = created.StudentId,
                    StudentName = created.Student?.FullName,
                    CampaignId = created.CampaignId,
                    CampaignTitle = created.Campaign?.Title,
                    BloodPressure = created.BloodPressure,
                    HeartRate = created.HeartRate,
                    Height = created.Height,
                    Weight = created.Weight,
                    Bmi = created.Bmi,
                    VisionSummary = created.VisionSummary,
                    Ent = created.Ent,
                    EntNotes = created.EntNotes,
                    Mouth = created.Mouth,
                    Throat = created.Throat,
                    ToothDecay = created.ToothDecay,
                    ToothNotes = created.ToothNotes,
                    GeneralNote = created.GeneralNote,
                    FollowUpNote = created.FollowUpNote,
                    ConsentStatus = created.ConsentStatus,
                    IsActive = created.IsActive
                }
            };
        }

        public async Task<BaseResponse?> UpdateHealthCheckSummaryAsync(int id, UpdateHealthCheckSummaryRequest request)
        {
            var s = await _summaryRepository.GetHealthCheckSummaryById(id);
            if (s == null)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status404NotFound.ToString(),
                    Message = $"Health check summary with ID {id} not found.",
                    Data = null
                };
            }
            s.BloodPressure = string.IsNullOrEmpty(request.BloodPressure) ? s.BloodPressure : request.BloodPressure;
            s.HeartRate = string.IsNullOrEmpty(request.HeartRate) ? s.HeartRate : request.HeartRate;
            s.Height = string.IsNullOrEmpty(request.Height) ? s.Height : request.Height;
            s.Weight = string.IsNullOrEmpty(request.Weight) ? s.Weight : request.Weight;
            s.Bmi = string.IsNullOrEmpty(request.Bmi) ? s.Bmi : request.Bmi;
            s.VisionSummary = string.IsNullOrEmpty(request.VisionSummary) ? s.VisionSummary : request.VisionSummary;
            s.Ent = string.IsNullOrEmpty(request.Ent) ? s.Ent : request.Ent;
            s.EntNotes = string.IsNullOrEmpty(request.EntNotes) ? s.EntNotes : request.EntNotes;
            s.Mouth = string.IsNullOrEmpty(request.Mouth) ? s.Mouth : request.Mouth;
            s.Throat = string.IsNullOrEmpty(request.Throat) ? s.Throat : request.Throat;
            s.ToothDecay = string.IsNullOrEmpty(request.ToothDecay) ? s.ToothDecay : request.ToothDecay;
            s.ToothNotes = string.IsNullOrEmpty(request.ToothNotes) ? s.ToothNotes : request.ToothNotes;
            s.GeneralNote = string.IsNullOrEmpty(request.GeneralNote) ? s.GeneralNote : request.GeneralNote;
            s.FollowUpNote = string.IsNullOrEmpty(request.FollowUpNote) ? s.FollowUpNote : request.FollowUpNote;
            s.ConsentStatus = string.IsNullOrEmpty(request.ConsentStatus) ? s.ConsentStatus : request.ConsentStatus;
            s.IsActive = request.IsActive ?? s.IsActive;


            var updated = await _summaryRepository.UpdateHealthCheckSummary(s);
            if (updated == null)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status400BadRequest.ToString(),
                    Message = "Update failed. Please check the request data.",
                    Data = null
                };
            }
            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = "Health check summary updated successfully.",
                Data = new HealthCheckSummaryManagementResponse
                {
                    RecordId = updated.RecordId,
                    StudentId = updated.StudentId,
                    StudentName = updated.Student?.FullName,
                    CampaignId = updated.CampaignId,
                    CampaignTitle = updated.Campaign?.Title,
                    BloodPressure = updated.BloodPressure,
                    HeartRate = updated.HeartRate,
                    Height = updated.Height,
                    Weight = updated.Weight,
                    Bmi = updated.Bmi,
                    VisionSummary = updated.VisionSummary,
                    Ent = updated.Ent,
                    EntNotes = updated.EntNotes,
                    Mouth = updated.Mouth,
                    Throat = updated.Throat,
                    ToothDecay = updated.ToothDecay,
                    ToothNotes = updated.ToothNotes,
                    GeneralNote = updated.GeneralNote,
                    FollowUpNote = updated.FollowUpNote,
                    ConsentStatus = updated.ConsentStatus,
                    IsActive = updated.IsActive
                }
            };
        }

        public async Task<bool> DeleteHealthCheckSummaryAsync(int id)
        {
            return await _summaryRepository.DeleteHealthCheckSummary(id);
        }
    }
} 