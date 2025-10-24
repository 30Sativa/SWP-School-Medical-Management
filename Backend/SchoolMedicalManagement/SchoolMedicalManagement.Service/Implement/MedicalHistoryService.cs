using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
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

        public async Task<BaseResponse> GetAllByStudentIdAsync(int studentId)
        {
            var list = await _medicalHistoryRepository.GetAllByStudentIdMedicalHistory(studentId);
            var responseList = list.Select(h => new MedicalHistoryResponse
            {
                HistoryId = h.HistoryId,
                StudentId = h.StudentId,
                StudentName = h.Student?.FullName ?? string.Empty,
                DiseaseName = h.DiseaseName ?? string.Empty,
                DiagnosedDate = h.DiagnosedDate,
                Note = h.Note
            }).ToList();
            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = "Lấy danh sách lịch sử y tế thành công.",
                Data = responseList
            };
        }

        public async Task<BaseResponse> GetByIdAsync(int id)
        {
            var data = await _medicalHistoryRepository.GetByIdMedicalHistory(id);
            if (data == null)
                return new BaseResponse { Status = "404", Message = "Không tìm thấy" };

            return new BaseResponse
            {
                Status = "200",
                Message = "Thành công",
                Data = new MedicalHistoryResponse
                {
                    HistoryId = data.HistoryId,
                    StudentId = data.StudentId,
                    StudentName = data.Student?.FullName ?? string.Empty,
                    DiseaseName = data.DiseaseName ?? string.Empty,
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
                Note = request.Note
            };

            var result = await _medicalHistoryRepository.CreateMedicalHistory(entity);
            if (result == null)
                return new BaseResponse { Status = "400", Message = "Tạo lịch sử y tế thất bại" };

            return new BaseResponse
            {
                Status = "201",
                Message = "Đã tạo",
                Data = new MedicalHistoryResponse
                {
                    HistoryId = result.HistoryId,
                    StudentId = result.StudentId,
                    StudentName = result.Student?.FullName ?? string.Empty,
                    DiseaseName = result.DiseaseName ?? string.Empty,
                    DiagnosedDate = result.DiagnosedDate,
                    Note = result.Note
                }
            };
        }

        public async Task<BaseResponse> UpdateAsync(UpdateMedicalHistoryRequest request)
        {
            var entity = await _medicalHistoryRepository.GetByIdMedicalHistory(request.HistoryId);
            if (entity == null)
                return new BaseResponse { Status = "404", Message = "Không tìm thấy" };

            entity.DiseaseName = request.DiseaseName;
            entity.DiagnosedDate = request.DiagnosedDate;
            entity.Note = request.Note;

            var updated = await _medicalHistoryRepository.UpdateMedicalHistory(entity);
            if (updated == null)
                return new BaseResponse { Status = "400", Message = "Cập nhật lịch sử y tế thất bại" };

            return new BaseResponse
            {
                Status = "200",
                Message = "Đã cập nhật",
                Data = new MedicalHistoryResponse
                {
                    HistoryId = updated.HistoryId,
                    StudentId = updated.StudentId,
                    StudentName = updated.Student?.FullName ?? string.Empty,
                    DiseaseName = updated.DiseaseName ?? string.Empty,
                    DiagnosedDate = updated.DiagnosedDate,
                    Note = updated.Note
                }
            };
        }

        public async Task<BaseResponse> DeleteAsync(int id)
        {
            var result = await _medicalHistoryRepository.DeleteMedicalHistory(id);
            if (result == 0)
                return new BaseResponse { Status = "404", Message = "Không tìm thấy hoặc xóa thất bại" };

            return new BaseResponse { Status = "200", Message = "Đã xóa" };
        }
    }
}
