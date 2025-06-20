using Microsoft.AspNetCore.Http;
using SchoolMedicalManagement.Models.Entity;
using SchoolMedicalManagement.Models.Request;
using SchoolMedicalManagement.Models.Response;
using SchoolMedicalManagement.Repository.Repository;
using SchoolMedicalManagement.Service.Interface;

public class MedicalEventService : IMedicalEventService
{
    private readonly MedicalEventRepository _medicalEventRepository;
    private readonly MedicalHistoryRepository _medicalHistoryRepository;

    public MedicalEventService(MedicalEventRepository medicalEventRepository, MedicalHistoryRepository medicalHistoryResponse)
    {
        _medicalEventRepository = medicalEventRepository;
        _medicalHistoryRepository = medicalHistoryResponse;
    }

    // =============================
    // TẠO MỚI SỰ KIỆN Y TẾ
    // =============================
    public async Task<BaseResponse?> CreateMedicalEvent(CreateMedicalEventRequest request)
    {
        // B1: Kiểm tra số lượng tồn kho của từng vật tư y tế yêu cầu sử dụng
        if (request.SuppliesUsed != null)
        {
            foreach (var item in request.SuppliesUsed)
            {
                var enough = await _medicalEventRepository.IsSupplyEnough(item.SupplyId, item.QuantityUsed);
                if (!enough)
                {
                    return new BaseResponse
                    {
                        Status = StatusCodes.Status400BadRequest.ToString(),
                        Message = $"Không đủ vật tư với ID {item.SupplyId} trong kho.",
                        Data = null
                    };
                }
            }
        }

        // B2: Tạo entity mới cho sự kiện y tế
        var newEvent = new MedicalEvent
        {
            StudentId = request.StudentId,
            EventTypeId = request.EventTypeId,
            EventDate = request.EventDate,
            Description = request.Description,
            HandledBy = request.HandledByUserId,
            SeverityId = request.SeverityId,
            Location = request.Location,
            Notes = request.Notes,
            IsActive = true
        };

        var createdEvent = await _medicalEventRepository.CreateMedicalEvent(newEvent);
        if (createdEvent == null)
        {
            return new BaseResponse
            {
                Status = StatusCodes.Status500InternalServerError.ToString(),
                Message = "Lỗi tạo Medical Event.",
                Data = null
            };
        }

        // B3: Ghi nhận vật tư nếu có
        if (request.SuppliesUsed != null && request.SuppliesUsed.Any())
        {
            var handleRecords = new List<HandleRecord>();
            foreach (var item in request.SuppliesUsed)
            {
                await _medicalEventRepository.AdjustSupplyQuantity(item.SupplyId, item.QuantityUsed);
                handleRecords.Add(new HandleRecord
                {
                    EventId = createdEvent.EventId,
                    SupplyId = item.SupplyId,
                    QuantityUsed = item.QuantityUsed,
                    Note = item.Note
                });
            }

            await _medicalEventRepository.AddHandleRecordsAsync(handleRecords);
        }

        // B4: Trả về sự kiện mới đã tạo
        return new BaseResponse
        {
            Status = StatusCodes.Status200OK.ToString(),
            Message = "Đã xử lý sự kiện y tế thành công.",
            Data = new CreateMedicalEventResponse
            {
                EventId = createdEvent.EventId, 
                StudentId = createdEvent.Student.StudentId,
                StudentName = createdEvent.Student?.FullName,
                ParentName = createdEvent.Student?.Parent?.FullName,
                EventType = createdEvent.EventType?.EventTypeName,
                EventDate = createdEvent.EventDate,
                Description = createdEvent.Description,
                HandledById = createdEvent.HandledBy,
                HandledByName = createdEvent.HandledByNavigation?.FullName,
                SeverityLevelName = createdEvent.Severity?.SeverityName,
                Location = createdEvent.Location,
                Notes = createdEvent.Notes,
                SuppliesUsed = request.SuppliesUsed.Select(s => new SupplyUserResponse
                {
                    SupplyId = s.SupplyId,
                    SupplyName = "", // frontend tự join nếu cần
                    QuantityUsed = s.QuantityUsed,
                    Note = s.Note
                }).ToList()
            }
        };
    }

    // =============================
    // LẤY CHI TIẾT 1 SỰ KIỆN
    // =============================
    public async Task<BaseResponse?> GetByIdMedicalEvent(int id)
    {
        var getid = await _medicalEventRepository.GetMedicalEventById(id);
        if (getid == null)
        {
            return new BaseResponse
            {
                Status = StatusCodes.Status404NotFound.ToString(),
                Message = "Medical event not found.",
                Data = null
            };
        }
        // kiểm tra xem StudentId có tồn tại không trước khi gọi method:
        var histories = new List<MedicalHistory>();
        if (getid.StudentId.HasValue)
        {
            histories = await _medicalHistoryRepository.GetAllByStudentIdMedicalHistory(getid.StudentId.Value);
        }

        return new BaseResponse
        {
            Status = StatusCodes.Status200OK.ToString(),
            Message = "Medical event retrieved successfully.",
            Data = new CreateMedicalEventResponse
            {
                EventId = getid.EventId,
                StudentId = getid.Student?.StudentId ?? 0,
                StudentName = getid.Student?.FullName ?? "(Không rõ)",
                ParentName = getid.Student?.Parent?.FullName ?? "(Không rõ)",
                EventType = getid.EventType?.EventTypeName ?? "(Không rõ)",
                EventDate = getid.EventDate,
                Description = getid.Description ?? string.Empty,
                HandledById = getid.HandledBy,
                HandledByName = getid.HandledByNavigation?.FullName ?? "(Không rõ)",
                SeverityLevelName = getid.Severity?.SeverityName ?? "(Không rõ)",
                Location = getid.Location ?? string.Empty,
                Notes = getid.Notes ?? string.Empty,
                SuppliesUsed = getid.HandleRecords?.Select(hr => new SupplyUserResponse
                {
                    SupplyId = hr.SupplyId,
                    SupplyName = hr.Supply?.Name ?? "(Không rõ)",
                    QuantityUsed = hr.QuantityUsed,
                    Note = hr.Note
                }).ToList() ?? new List<SupplyUserResponse>(),

                MedicalHistory = histories.Select(h => new MedicalHistoryResponse
                {
                    HistoryId = h.HistoryId,
                    StudentId = h.StudentId,
                    StudentName = h.Student?.FullName ?? "(Không rõ)",
                    DiseaseName = h.DiseaseName ?? "(Không rõ)",
                    DiagnosedDate = h.DiagnosedDate,
                    Note = h.Note ?? string.Empty
                }).ToList() 
            }
        };
    }

    // =============================
    // LẤY TẤT CẢ SỰ KIỆN Y TẾ
    // =============================
    public async Task<List<CreateMedicalEventResponse>> GetAllMedicalEvent()
    {
        var listevent = await _medicalEventRepository.GetAllMedicalEvents();

        return listevent.Select(e => new CreateMedicalEventResponse
        {
            EventId = e.EventId,    
            StudentId = e.Student?.StudentId ?? 0,
            StudentName = e.Student?.FullName ?? "(Không rõ)",
            ParentName = e.Student?.Parent?.FullName ?? "(Không rõ)",
            EventType = e.EventType?.EventTypeName ?? "(Không rõ)",
            EventDate = e.EventDate,
            Description = e.Description ?? string.Empty,
            Notes = e.Notes ?? string.Empty,
            Location = e.Location ?? string.Empty,
            SeverityLevelName = e.Severity?.SeverityName ?? "(Không rõ)",
            HandledById = e.HandledBy,
            HandledByName = e.HandledByNavigation?.FullName ?? "(Không rõ)",
            SuppliesUsed = e.HandleRecords?.Select(hr => new SupplyUserResponse
            {
                SupplyId = hr.SupplyId,
                SupplyName = hr.Supply?.Name ?? "(Không rõ)",
                QuantityUsed = hr.QuantityUsed,
                Note = hr.Note
            }).ToList() ?? new List<SupplyUserResponse>(),

            MedicalHistory = new List<MedicalHistoryResponse>() // optional: để rõ ràng
        }).ToList();
    }

    // =============================
    // CẬP NHẬT SỰ KIỆN Y TẾ
    // =============================
    public async Task<BaseResponse?> UpdateMedicalEvent(int id, CreateMedicalEventRequest request)
    {
        var existingEvent = await _medicalEventRepository.GetMedicalEventById(id);
        if (existingEvent == null)
        {
            return new BaseResponse
            {
                Status = StatusCodes.Status404NotFound.ToString(),
                Message = "Không tìm thấy sự kiện y tế.",
                Data = null
            };
        }

        // Cập nhật dữ liệu cơ bản (nếu request gửi lên không null)
        existingEvent.StudentId = request.StudentId == 0 ? existingEvent.StudentId : request.StudentId;
        existingEvent.EventTypeId = request.EventTypeId == 0 ? existingEvent.EventTypeId : request.EventTypeId;
        existingEvent.EventDate = request.EventDate == default ? existingEvent.EventDate : request.EventDate;
        existingEvent.Description = string.IsNullOrEmpty(request.Description) ? existingEvent.Description : request.Description;
        existingEvent.HandledBy = request.HandledByUserId == Guid.Empty ? existingEvent.HandledBy : request.HandledByUserId;
        existingEvent.Notes = string.IsNullOrEmpty(request.Notes) ? existingEvent.Notes : request.Notes;
        existingEvent.Location = string.IsNullOrEmpty(request.Location) ? existingEvent.Location : request.Location;
        existingEvent.SeverityId = request.SeverityId == 0 ? existingEvent.SeverityId : request.SeverityId;

        // Xử lý cập nhật lại danh sách vật tư đã dùng (nếu có)
        if (request.SuppliesUsed != null && request.SuppliesUsed.Any())
        {
            var oldRecords = existingEvent.HandleRecords.ToList();

            // Hoàn kho từ các vật tư cũ
            foreach (var old in oldRecords)
            {
                await _medicalEventRepository.AdjustSupplyQuantity(old.SupplyId, -old.QuantityUsed.GetValueOrDefault());
            }

            // Xoá bản ghi vật tư cũ
            await _medicalEventRepository.RemoveHandleRecordsAsync(oldRecords);

            // Kiểm tra tồn kho mới
            foreach (var item in request.SuppliesUsed)
            {
                var enough = await _medicalEventRepository.IsSupplyEnough(item.SupplyId, item.QuantityUsed);
                if (!enough)
                {
                    return new BaseResponse
                    {
                        Status = StatusCodes.Status400BadRequest.ToString(),
                        Message = $"Không đủ vật tư với ID {item.SupplyId}.",
                        Data = null
                    };
                }
            }

            // Trừ kho mới & thêm record mới
            var newRecords = new List<HandleRecord>();
            foreach (var item in request.SuppliesUsed)
            {
                await _medicalEventRepository.AdjustSupplyQuantity(item.SupplyId, item.QuantityUsed);
                newRecords.Add(new HandleRecord
                {
                    EventId = existingEvent.EventId,
                    SupplyId = item.SupplyId,
                    QuantityUsed = item.QuantityUsed,
                    Note = item.Note
                });
            }

            await _medicalEventRepository.AddHandleRecordsAsync(newRecords);
        }

        var updatedEvent = await _medicalEventRepository.UpdateMedicalEvent(existingEvent);
        if (updatedEvent == null)
        {
            return new BaseResponse
            {
                Status = StatusCodes.Status500InternalServerError.ToString(),
                Message = "Không thể cập nhật sự kiện y tế.",
                Data = null
            };
        }

        // Trả dữ liệu sau khi cập nhật
        return new BaseResponse
        {
            Status = StatusCodes.Status200OK.ToString(),
            Message = "Đã cập nhật sự kiện y tế thành công.",
            Data = new CreateMedicalEventResponse
            {
                StudentId = updatedEvent.Student.StudentId,
                StudentName = updatedEvent.Student?.FullName ?? string.Empty,
                ParentName = updatedEvent.Student?.Parent?.FullName ?? string.Empty,
                EventType = updatedEvent.EventType?.EventTypeName ?? string.Empty,
                EventDate = updatedEvent.EventDate,
                Description = updatedEvent.Description ?? string.Empty,
                HandledById = updatedEvent.HandledBy,
                HandledByName = updatedEvent.HandledByNavigation?.FullName ?? string.Empty,
                SeverityLevelName = updatedEvent.Severity?.SeverityName ?? string.Empty,
                Location = updatedEvent.Location ?? string.Empty,
                Notes = updatedEvent.Notes ?? string.Empty,
                SuppliesUsed = updatedEvent.HandleRecords.Select(r => new SupplyUserResponse
                {
                    SupplyId = r.SupplyId,
                    SupplyName = r.Supply?.Name ?? "",
                    QuantityUsed = r.QuantityUsed,
                    Note = r.Note
                }).ToList()
            }
        };
    }

    // =============================
    // XÓA MỀM SỰ KIỆN Y TẾ
    // =============================
    public async Task<bool> DeleteMedicalEvent(int eventId)
    {
        var affected = await _medicalEventRepository.DeleteMedicalEvent(eventId);
        return affected > 0;
    }
}
