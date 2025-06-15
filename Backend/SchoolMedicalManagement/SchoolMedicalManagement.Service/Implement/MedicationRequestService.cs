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

namespace SchoolMedicalManagement.Service.Implement
{
    public class MedicationRequestService : IMedicationRequestService
    {

        private readonly MedicationRequestRepository _medicationRequestRepository;

        public MedicationRequestService(MedicationRequestRepository medicationRequestRepository)
        {
            _medicationRequestRepository = medicationRequestRepository;
        }


        public async Task<List<MedicationRequestResponse>> GetPendingRequestsAsync()
        {
            var list = await _medicationRequestRepository.GetPendingRequestsAsync();
            return list.Select(r => new MedicationRequestResponse
            {
                RequestID = r.RequestId,
                StudentName = r.Student?.FullName ?? "Unknown",
                MedicationName = r.MedicationName,
                Dosage = r.Dosage,
                Instructions = r.Instructions,
                Status = r.Status.StatusId == 1 ? "Chờ duyệt" : (r.Status.StatusId == 2 ? "Đã duyệt" : "Từ chối"),
                ImagePath = r.ImagePath,
                ReceivedByName = r.ReceivedByNavigation?.FullName,
                RequestDate = r.RequestDate
            }).ToList();
        }

        public async Task<BaseResponse> HandleMedicationRequest(UpdateMedicationRequestStatus request)
        {
            var entity = await _medicationRequestRepository.GetByIdMedical(request.RequestID);
            if (entity == null)
            {
                throw new Exception("Đơn thuốc không tồn tại");
            }
            entity.StatusId = request.StatusID;
            entity.ReceivedBy = request.NurseID;

            var repsone = await _medicationRequestRepository.UpdateStatusAsync(entity);

            if (repsone)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status200OK.ToString(),
                    Message = "Cập nhật trạng thái đơn thuốc thành công.",
                    Data = new MedicationRequestResponse
                    {
                        RequestID = entity.RequestId,
                        StudentName = entity.Student?.FullName ?? "Unknown",
                        MedicationName = entity.MedicationName,
                        Dosage = entity.Dosage,
                        Instructions = entity.Instructions,
                        Status = entity.Status.StatusId == 1 ? "Chờ duyệt" : (entity.Status.StatusId == 2 ? "Đã duyệt" : "Từ chối"),
                        RequestDate = entity.RequestDate,
                        ReceivedByName = entity.ReceivedByNavigation?.FullName // Thông tin y tá đã duyệt
                    }
                };
            }
            else
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status500InternalServerError.ToString(),
                    Message = "Lỗi khi cập nhật trạng thái đơn thuốc.",
                    Data = null
                };
            }
        }



        // ✅ Đã thêm imagePath
        public async Task<BaseResponse> CreateMedicationRequestAsync(CreateMedicationRequest request, Guid parentId, string? imagePath)
        {
            var newRequest = new MedicationRequest
            {
                StudentId = request.StudentID,
                ParentId = parentId,
                MedicationName = request.MedicationName,
                Dosage = request.Dosage,
                Instructions = request.Instructions,
                RequestDate = DateTime.Now,
                StatusId = 1,
                IsActive = true,
                ImagePath = imagePath,
            };

            var result = await _medicationRequestRepository.CreateMedicalRequestAsync(newRequest);

            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = "Tạo đơn thuốc thành công.",
                Data = new MedicationRequestResponse
                {
                    RequestID = newRequest.RequestId,
                    StudentName = newRequest.Student?.FullName ?? "Unknown",
                    MedicationName = newRequest.MedicationName,
                    Dosage = newRequest.Dosage,
                    Instructions = newRequest.Instructions,
                    Status = "Chờ duyệt",
                    RequestDate = newRequest.RequestDate,
                    ImagePath = newRequest.ImagePath
                }
            };
        }
    }
}