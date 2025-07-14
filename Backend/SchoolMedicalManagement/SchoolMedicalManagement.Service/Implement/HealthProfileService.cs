using Microsoft.AspNetCore.Http;
using SchoolMedicalManagement.Models.Entity;
using SchoolMedicalManagement.Models.Request;
using SchoolMedicalManagement.Models.Response;
using SchoolMedicalManagement.Repository.Repository;
using SchoolMedicalManagement.Service.Interface;
using System.Collections.Generic;
using System.Linq;
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

        // ✅ Lấy tất cả hồ sơ sức khỏe
        public async Task<BaseResponse> GetAllHealthProfilesAsync()
        {
            var healthProfiles = await _healthProfileRepository.GetAllHealthProfile();
            var list = healthProfiles.Select(hp => new ManagerHealthProfileResponse
            {
                ProfileId = hp.ProfileId,
                StudentId = hp.StudentId ?? 0,
                Height = hp.Height,
                Weight = hp.Weight,
                ChronicDiseases = hp.ChronicDiseases,
                Allergies = hp.Allergies,
                GeneralNote = hp.GeneralNote,
                IsActive = hp.IsActive
            }).ToList();
            return new BaseResponse { Status = StatusCodes.Status200OK.ToString(), Message = "Success", Data = list };
        }

        // ✅ Lấy tất cả hồ sơ sức khỏe bao gồm cả IsActive = false
        public async Task<BaseResponse> GetAllHealthProfilesIncludeInactiveAsync()
        {
            var healthProfiles = await _healthProfileRepository.GetAllHealthProfileIncludeInactive();
            var list = healthProfiles.Select(hp => new ManagerHealthProfileResponse
            {
                ProfileId = hp.ProfileId,
                StudentId = hp.StudentId ?? 0,
                Height = hp.Height,
                Weight = hp.Weight,
                ChronicDiseases = hp.ChronicDiseases,
                Allergies = hp.Allergies,
                GeneralNote = hp.GeneralNote,
                IsActive = hp.IsActive
            }).ToList();
            return new BaseResponse { Status = StatusCodes.Status200OK.ToString(), Message = "Success", Data = list };
        }

        // ✅ Lấy 1 hồ sơ sức khỏe theo ID
        public async Task<BaseResponse?> GetHealthProfileByIdAsync(int id)
        {
            var hp = await _healthProfileRepository.GetHealthProfileById(id);
            if (hp == null)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status404NotFound.ToString(),
                    Message = $"Không tìm thấy hồ sơ sức khỏe với ID {id}.",
                    Data = null
                };
            }

            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = "Lấy hồ sơ sức khỏe thành công.",
                Data = new ManagerHealthProfileResponse
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

        // ✅ Tạo hồ sơ sức khỏe mới
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
                IsActive = true
            };

            var created = await _healthProfileRepository.CreateHealthProfile(newProfile);

            if (created == null)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status400BadRequest.ToString(),
                    Message = "Tạo hồ sơ sức khỏe thất bại.",
                    Data = null
                };
            }

            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = "Tạo hồ sơ sức khỏe thành công.",
                Data = new ManagerHealthProfileResponse
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

        // ✅ Cập nhật hồ sơ sức khỏe
        public async Task<BaseResponse?> UpdateHealthProfileAsync(int id, UpdateHealthProfileRequest request)
        {
            var hp = await _healthProfileRepository.GetHealthProfileById(id);
            if (hp == null)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status404NotFound.ToString(),
                    Message = $"Không tìm thấy hồ sơ sức khỏe với ID {id}.",
                    Data = null
                };
            }

            hp.Height = request.Height ?? hp.Height;
            hp.Weight = request.Weight ?? hp.Weight;
            hp.ChronicDiseases = request.ChronicDiseases ?? hp.ChronicDiseases;
            hp.Allergies = request.Allergies ?? hp.Allergies;
            hp.GeneralNote = request.GeneralNote ?? hp.GeneralNote;
            hp.IsActive = request.IsActive ?? hp.IsActive;

            var updated = await _healthProfileRepository.UpdateHealthProfile(hp);

            if (updated == null)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status400BadRequest.ToString(),
                    Message = "Cập nhật hồ sơ sức khỏe thất bại.",
                    Data = null
                };
            }

            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = "Cập nhật hồ sơ sức khỏe thành công.",
                Data = new ManagerHealthProfileResponse
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

        // ✅ Cập nhật trạng thái IsActive của hồ sơ sức khỏe
        public async Task<BaseResponse?> UpdateHealthProfileStatusAsync(int id, UpdateHealthProfileStatusRequest request)
        {
            var updated = await _healthProfileRepository.UpdateHealthProfileStatus(id, request.IsActive);
            
            if (updated == null)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status404NotFound.ToString(),
                    Message = $"Không tìm thấy hồ sơ sức khỏe với ID {id}.",
                    Data = null
                };
            }

            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = $"Cập nhật trạng thái hồ sơ sức khỏe thành công. Trạng thái hiện tại: {(request.IsActive ? "Hoạt động" : "Không hoạt động")}",
                Data = new ManagerHealthProfileResponse
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

        // ✅ Xoá mềm hồ sơ
        public async Task<BaseResponse> DeleteHealthProfileAsync(int id)
        {
            var success = await _healthProfileRepository.DeleteHealthProfile(id);
            if (!success)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status404NotFound.ToString(),
                    Message = "Không tìm thấy hồ sơ sức khỏe để xóa.",
                    Data = null
                };
            }
            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = "Xóa hồ sơ sức khỏe thành công.",
                Data = null
            };
        }

        // ✅ Lấy hồ sơ sức khỏe theo StudentId
        public async Task<BaseResponse?> GetHealthProfileByStudentIdAsync(int studentId)
        {
            var hp = await _healthProfileRepository.GetHealthProfileByStudentId(studentId);
            if (hp == null)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status404NotFound.ToString(),
                    Message = $"Không tìm thấy hồ sơ sức khỏe cho học sinh với ID {studentId}.",
                    Data = null
                };
            }

            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = "Lấy hồ sơ sức khỏe thành công.",
                Data = new ManagerHealthProfileResponse
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

        // ✅ Cập nhật hồ sơ sức khỏe theo StudentId
        public async Task<BaseResponse?> UpdateHealthProfileByStudentIdAsync(int studentId, UpdateHealthProfileRequest request)
        {
            var hp = await _healthProfileRepository.GetHealthProfileByStudentId(studentId);
            if (hp == null)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status404NotFound.ToString(),
                    Message = $"Không tìm thấy hồ sơ sức khỏe cho học sinh với ID {studentId}.",
                    Data = null
                };
            }

            hp.Height = request.Height ?? hp.Height;
            hp.Weight = request.Weight ?? hp.Weight;
            hp.ChronicDiseases = request.ChronicDiseases ?? hp.ChronicDiseases;
            hp.Allergies = request.Allergies ?? hp.Allergies;
            hp.GeneralNote = request.GeneralNote ?? hp.GeneralNote;
            hp.IsActive = request.IsActive ?? hp.IsActive;

            var updated = await _healthProfileRepository.UpdateHealthProfile(hp);

            if (updated == null)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status400BadRequest.ToString(),
                    Message = "Cập nhật hồ sơ sức khỏe thất bại.",
                    Data = null
                };
            }

            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = "Cập nhật hồ sơ sức khỏe thành công.",
                Data = new ManagerHealthProfileResponse
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
    }
}
