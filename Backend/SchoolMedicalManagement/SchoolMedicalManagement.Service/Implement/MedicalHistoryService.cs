using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SchoolMedicalManagement.Models.Entity;
using SchoolMedicalManagement.Models.Request;
using SchoolMedicalManagement.Models.Response;
using SchoolMedicalManagement.Repository.Repository;
using SchoolMedicalManagement.Service.Interface;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace SchoolMedicalManagement.Service.Implement
{
    public class MedicalHistoryService : IMedicalHistoryService
    {
        private readonly MedicalHistoryRepository _medicalHistoryRepository;
        public MedicalHistoryService(MedicalHistoryRepository medicalHistoryRepository)
        {
            _medicalHistoryRepository = medicalHistoryRepository;
        }

        public async Task<List<MedicalHistoryResponse>> GetAllByStudentIdAsync(int studentId)
        {
            var list = await _medicalHistoryRepository.GetAllByStudentIdMedicalHistory(studentId);
            return list.Select(h => new MedicalHistoryResponse
            {
                HistoryId = h.HistoryId,
                StudentId = h.Student.StudentId,
                StudentName = h.Student.FullName,
                DiseaseName = h.DiseaseName,
                DiagnosedDate = h.DiagnosedDate,
                Note = h.Note
            }).ToList();
        }

        public async Task<BaseResponse> GetByIdAsync(int id)
        {
            var data = await _medicalHistoryRepository.GetByIdMedicalHistory(id);
            if (data == null)
                return new BaseResponse { Status = "404", Message = "Not found" };

            return new BaseResponse
            {
                Status = "200",
                Message = "Success",
                Data = new MedicalHistoryResponse
                {
                    HistoryId = data.HistoryId,
                    StudentId = data.Student.StudentId,
                    StudentName = data.Student.FullName,
                    DiseaseName = data.DiseaseName,
                    DiagnosedDate = data.DiagnosedDate,
                    Note = data.Note
                }
            };
        }

        public async Task<BaseResponse> CreateAsync(CreateMedicalHistoryRequest request)
        {
            var entity = new MedicalHistory
            {
                StudentId = request.StudentId,
                DiseaseName = request.DiseaseName,
                DiagnosedDate = request.DiagnosedDate,
                Note = request.Note,
                IsActive = true
            };

            var result = await _medicalHistoryRepository.CreateAsync(entity);
            return new BaseResponse
            {
                Status = "201",
                Message = "Created",
                Data = new MedicalHistoryResponse
                {
                    HistoryId = entity.HistoryId,
                    StudentId = entity.Student.StudentId,
                    StudentName = entity.Student.FullName,
                    DiseaseName = entity.DiseaseName,
                    DiagnosedDate = entity.DiagnosedDate,
                    Note = entity.Note
                }
            };
        }

        public async Task<BaseResponse> UpdateAsync(UpdateMedicalHistoryRequest request)
        {
            var entity = await _medicalHistoryRepository.GetByIdAsync(request.HistoryId);
            if (entity == null)
                return new BaseResponse { Status = "404", Message = "Not found" };

            entity.DiseaseName = request.DiseaseName;
            entity.DiagnosedDate = request.DiagnosedDate;
            entity.Note = request.Note;

            var updated = await _medicalHistoryRepository.UpdateMedicalHistory(entity);
            return new BaseResponse
            {
                Status = "200",
                Message = "Updated",
                Data = new MedicalHistoryResponse
                {
                    HistoryId = updated.HistoryId,
                    StudentId = updated.Student.StudentId,
                    StudentName = updated.Student.FullName,
                    DiseaseName = updated.DiseaseName,
                    DiagnosedDate = updated.DiagnosedDate,
                    Note = updated.Note
                }
            };
        }

        public async Task<BaseResponse> DeleteAsync(int id)
        {
            var result = await _medicalHistoryRepository.SoftDeleteMedicalHistory(id);
            if (result == 0)
                return new BaseResponse { Status = "404", Message = "Not found or failed to delete" };

            return new BaseResponse { Status = "200", Message = "Deleted" };
        }
    }
}
