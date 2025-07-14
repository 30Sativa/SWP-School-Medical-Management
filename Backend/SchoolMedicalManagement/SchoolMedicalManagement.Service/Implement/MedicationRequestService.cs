using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Azure;
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
                ParentName = r.Parent?.FullName ?? "Unknown",
                MedicationName = r.MedicationName,
                Dosage = r.Dosage,
                Instructions = r.Instructions,
                Status = r.Status.StatusId == 1 ? "Chờ duyệt" : 
                         r.Status.StatusId == 2 ? "Đã duyệt" : 
                         r.Status.StatusId == 3 ? "Bị từ chối" : 
                         r.Status.StatusId == 4 ? "Đã lên lịch" :  
                         r.Status.StatusId == 5 ? "Đã hoàn thành" : "Đã hủy",
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
                throw new Exception("Không tồn tại đơn thuốc");
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
                        ParentName = entity.Parent?.FullName ?? "Unknown",
                        MedicationName = entity.MedicationName,
                        Dosage = entity.Dosage,
                        Instructions = entity.Instructions,
                        Status = entity.Status.StatusId == 1 ? "Chờ duyệt" :
                         entity.Status.StatusId == 2 ? "Đã duyệt" :
                         entity.Status.StatusId == 3 ? "Bị từ chối" :
                         entity.Status.StatusId == 4 ? "Đã lên lịch" :
                         entity.Status.StatusId == 5 ? "Đã hoàn thành" : "Đã hủy",
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
                    ParentName = newRequest.Parent?.FullName ?? "Unknown",
                    MedicationName = newRequest.MedicationName,
                    Dosage = newRequest.Dosage,
                    Instructions = newRequest.Instructions,
                    Status = "Chờ duyệt",
                    RequestDate = newRequest.RequestDate,
                    ImagePath = newRequest.ImagePath
                }
            };
        }

        public async Task<List<MedicationRequestResponse>> GetAllMedicalRequest()
        {
            var list = await _medicationRequestRepository.GetAllRequestsAsync();
            List<MedicationRequestResponse> responseList = new List<MedicationRequestResponse>();
            foreach (var item in list)
            {
                responseList.Add(new MedicationRequestResponse
                {
                    RequestID = item.RequestId,
                    StudentName = item.Student?.FullName ?? "Unknown",
                    ParentName = item.Parent?.FullName ?? "Unknown",
                    MedicationName = item.MedicationName,
                    Dosage = item.Dosage,
                    Instructions = item.Instructions,
                    Status = item.Status.StatusId == 1 ? "Chờ duyệt" :
                             item.Status.StatusId == 2 ? "Đã duyệt" :
                             item.Status.StatusId == 3 ? "Bị từ chối" :
                             item.Status.StatusId == 4 ? "Đã lên lịch" :
                             item.Status.StatusId == 5 ? "Đã hoàn thành" : "Đã hủy",
                    ImagePath = item.ImagePath,
                    ReceivedByName = item.ReceivedByNavigation?.FullName,
                    RequestDate = item.RequestDate
                });
            }
            return responseList; 
        }

        public async Task<BaseResponse> GetMedicalRequestByStudentId(string studentid)
        {
            var response = await _medicationRequestRepository.GetRequestByStudentIdAsync(studentid);

            if(response == null)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status404NotFound.ToString(),
                    Message = "Không tìm thấy yêu cầu thuốc cho học sinh này",
                    Data = null
                };
            }
            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = "Lấy thông tin yêu cầu thuốc thành công",
                Data = new MedicationRequestResponse
                {
                    RequestID = response.RequestId,
                    StudentName = response.Student?.FullName ?? "Unknown",
                    ParentName = response.Parent?.FullName ?? "Unknown",
                    MedicationName = response.MedicationName,
                    Dosage = response.Dosage,
                    Instructions = response.Instructions,
                    Status = response.Status.StatusId == 1 ? "Chờ duyệt" :
                             response.Status.StatusId == 2 ? "Đã duyệt" :
                             response.Status.StatusId == 3 ? "Bị từ chối" :
                             response.Status.StatusId == 4 ? "Đã lên lịch" :
                             response.Status.StatusId == 5 ? "Đã hoàn thành" : "Đã hủy",
                    ImagePath = response.ImagePath,
                    ReceivedByName = response.ReceivedByNavigation?.FullName,
                    RequestDate = response.RequestDate
                }
            };
        }

        public async Task<List<MedicationRequestResponse>> GetRequestsByParentIdAsync(Guid parentId)
        {
            var requests = await _medicationRequestRepository.GetRequestsByParentIdAsync(parentId);

            return requests.Select(r => new MedicationRequestResponse
            {
                RequestID = r.RequestId,
                StudentName = r.Student?.FullName ?? "Unknown",
                ParentName = r.Parent?.FullName ?? "Unknown",
                MedicationName = r.MedicationName,
                Dosage = r.Dosage,
                Instructions = r.Instructions,
                Status = r.Status.StatusId == 1 ? "Chờ duyệt" :
                          r.Status.StatusId == 2 ? "Đã duyệt" :
                          r.Status.StatusId == 3 ? "Bị từ chối" :
                          r.Status.StatusId == 4 ? "Đã lên lịch" :
                          r.Status.StatusId == 5 ? "Đã hoàn thành" : "Đã hủy",
                ImagePath = r.ImagePath,
                ReceivedByName = r.ReceivedByNavigation?.FullName,
                RequestDate = r.RequestDate
            }).ToList();
        }

        public async Task<BaseResponse> GetRequestByIdAsync(int requestId)
        {
            var request = await _medicationRequestRepository.GetByIdMedical(requestId);

            if (request == null)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status404NotFound.ToString(),
                    Message = "Không tìm thấy yêu cầu thuốc",
                    Data = null
                };
            }

            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = "Lấy thông tin yêu cầu thuốc thành công",
                Data = new MedicationRequestResponse
                {
                    RequestID = request.RequestId,
                    StudentName = request.Student?.FullName ?? "Unknown",
                    ParentName = request.Parent?.FullName ?? "Unknown",
                    MedicationName = request.MedicationName,
                    Dosage = request.Dosage,
                    Instructions = request.Instructions,
                    Status = request.Status.StatusId == 1 ? "Chờ duyệt" :
         request.Status.StatusId == 2 ? "Đã duyệt" :
         request.Status.StatusId == 3 ? "Bị từ chối" :
         request.Status.StatusId == 4 ? "Đã lên lịch" :
         request.Status.StatusId == 5 ? "Đã hoàn thành" : "Đã hủy",
                    ImagePath = request.ImagePath,
                    ReceivedByName = request.ReceivedByNavigation?.FullName,
                    RequestDate = request.RequestDate
                }
            };
        }

        public async Task<BaseResponse> UpdateMedicationRequestStatusAsync(int requestId, UpdateMedicationStatusDto dto)
        {
            var request = await _medicationRequestRepository.GetByIdAsync(requestId);
            if (request == null)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status404NotFound.ToString(),
                    Message = "Không tìm thấy yêu cầu thuốc.",
                    Data = null
                };
            }
            request.StatusId = dto.StatusId;
            await _medicationRequestRepository.UpdateAsync(request);
            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = "Cập nhật trạng thái thành công.",
                Data = null
            };
        }

        // ✅ Lấy danh sách đơn thuốc theo Id trạng thái
        public async Task<BaseResponse> GetRequestsByStatusIdAsync(int statusId)
        {
            var list = await _medicationRequestRepository.GetRequestsByStatusIdAsync(statusId);
            var data = list.Select(r => new MedicationRequestResponse
            {
                RequestID = r.RequestId,
                StudentName = r.Student?.FullName ?? "Unknown",
                ParentName = r.Parent?.FullName ?? "Unknown",
                MedicationName = r.MedicationName,
                Dosage = r.Dosage,
                Instructions = r.Instructions,
                Status = r.Status.StatusId == 1 ? "Chờ duyệt" :
         r.Status.StatusId == 2 ? "Đã duyệt" :
         r.Status.StatusId == 3 ? "Bị từ chối" :
         r.Status.StatusId == 4 ? "Đã lên lịch" :
         r.Status.StatusId == 5 ? "Đã hoàn thành" : "Đã hủy",
                ImagePath = r.ImagePath,
                ReceivedByName = r.ReceivedByNavigation?.FullName,
                RequestDate = r.RequestDate
            }).ToList();
            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = "Lấy danh sách đơn thuốc theo trạng thái thành công.",
                Data = data
            };
        }
    }
}
