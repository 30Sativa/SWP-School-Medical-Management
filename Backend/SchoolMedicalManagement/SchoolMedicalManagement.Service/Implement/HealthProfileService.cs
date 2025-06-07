using Microsoft.AspNetCore.Http;
using SchoolMedicalManagement.Models.Entity;
using SchoolMedicalManagement.Models.Request;
using SchoolMedicalManagement.Models.Response;
using SchoolMedicalManagement.Repository.Repository;
using SchoolMedicalManagement.Service.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolMedicalManagement.Service.Implement
{
    public class HealthProfileService : IHealthProfileService
    {
        private readonly HealthProfileRepository _healthProfileRepository;

        public HealthProfileService(HealthProfileRepository healthProfileRepository)
        {
            _healthProfileRepository = healthProfileRepository;
        }

        public async Task<List<HealthProfileManagementResponse>> GetAllHealthProfilesAsync()
        {
            var healthProfiles = await _healthProfileRepository.GetAllHealthProfile();
            var result = new List<HealthProfileManagementResponse>();
            foreach (var hp in healthProfiles)
            {
                result.Add(new HealthProfileManagementResponse
                {
                    ProfileId = hp.ProfileId,
                    StudentId = hp.StudentId ?? 0,
                    Height = hp.Height,
                    Weight = hp.Weight,
                    ChronicDiseases = hp.ChronicDiseases,
                    Allergies = hp.Allergies,
                    GeneralNote = hp.GeneralNote,
                    IsActive = hp.IsActive
                });
            }
            return result;
        }

        public async Task<BaseResponse?> GetHealthProfileByIdAsync(int id)
        {
            var hp = await _healthProfileRepository.GetHealthProfileById(id);
            if (hp == null)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status404NotFound.ToString(),
                    Message = $"Health profile with ID {id} not found.",
                    Data = null
                };
            }
            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = "Health profile found successfully.",
                Data = new HealthProfileManagementResponse
                {
                    ProfileId = hp.ProfileId,
                    StudentId = hp.StudentId ?? 0,
                    Height = hp.Height,
                    Weight = hp.Weight,
                    ChronicDiseases = hp.ChronicDiseases,
                    Allergies = hp.Allergies,
                    GeneralNote = hp.GeneralNote,
                    IsActive = hp.IsActive
                }
            };
        }

        public async Task<BaseResponse?> CreateHealthProfileAsync(CreateHealthProfileRequest request)
        {
            var newProfile = new HealthProfile
            {
                StudentId = request.StudentId,
                Height = request.Height,
                Weight = request.Weight,
                ChronicDiseases = request.ChronicDiseases,
                Allergies = request.Allergies,
                GeneralNote = request.GeneralNote,
                IsActive = true // Mới tạo thì mặc định là true
            };
            var created = await _healthProfileRepository.CreateHealthProfile(newProfile);
            if (created == null)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status400BadRequest.ToString(),
                    Message = "Create health profile failed.",
                    Data = null
                };
            }
            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = "Create health profile successfully.",
                Data = new HealthProfileManagementResponse
                {
                    ProfileId = created.ProfileId,
                    StudentId = created.StudentId ?? 0,
                    Height = created.Height,
                    Weight = created.Weight,
                    ChronicDiseases = created.ChronicDiseases,
                    Allergies = created.Allergies,
                    GeneralNote = created.GeneralNote,
                    IsActive = created.IsActive
                }
            };
        }

        public async Task<BaseResponse?> UpdateHealthProfileAsync(int id, UpdateHealthProfileRequest request)
        {
            var hp = await _healthProfileRepository.GetHealthProfileById(id);
            if (hp == null)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status404NotFound.ToString(),
                    Message = $"Health profile with ID {id} not found.",
                    Data = null
                };
            }
            hp.Height = string.IsNullOrEmpty(request.Height) ? hp.Height : request.Height;
            hp.Weight = string.IsNullOrEmpty(request.Weight) ? hp.Weight : request.Weight;
            hp.ChronicDiseases = string.IsNullOrEmpty(request.ChronicDiseases) ? hp.ChronicDiseases : request.ChronicDiseases;
            hp.Allergies = string.IsNullOrEmpty(request.Allergies) ? hp.Allergies : request.Allergies;
            hp.GeneralNote = string.IsNullOrEmpty(request.GeneralNote) ? hp.GeneralNote : request.GeneralNote;
            hp.IsActive = request.IsActive ?? hp.IsActive;
            var updated = await _healthProfileRepository.UpdateHealthProfile(hp);
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
                Message = "Health profile updated successfully.",
                Data = new HealthProfileManagementResponse
                {
                    ProfileId = updated.ProfileId,
                    StudentId = updated.StudentId ?? 0,
                    Height = updated.Height,
                    Weight = updated.Weight,
                    ChronicDiseases = updated.ChronicDiseases,
                    Allergies = updated.Allergies,
                    GeneralNote = updated.GeneralNote,
                    IsActive = updated.IsActive
                }
            };
        }

        public async Task<bool> DeleteHealthProfileAsync(int id)
        {
            return await _healthProfileRepository.DeleteHealthProfile(id);
        }
    }
}
