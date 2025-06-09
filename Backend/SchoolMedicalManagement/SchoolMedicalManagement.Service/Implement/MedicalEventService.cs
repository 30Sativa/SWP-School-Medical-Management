using Microsoft.AspNetCore.Http;
using SchoolMedicalManagement.Models.Entity;
using SchoolMedicalManagement.Models.Request;
using SchoolMedicalManagement.Models.Response;
using SchoolMedicalManagement.Service.Interface;

public class MedicalEventService : IMedicalEventService
{
    private readonly MedicalEventRepository _medicalEventRepository;

    public MedicalEventService(MedicalEventRepository medicalEventRepository)
    {
        _medicalEventRepository = medicalEventRepository;
    }

    /// <summary>
    /// Tạo sự kiện y tế mới, có thể kèm theo danh sách vật tư sử dụng.
    /// Kiểm tra vật tư còn tồn kho, tạo bản ghi và ghi nhận HandleRecords.
    /// </summary>
    public async Task<BaseResponse?> CreateMedicalEventAsync(ManageMedicalEventRequest request)
    {
        // B1: Kiểm tra số lượng tồn kho đủ cho từng vật tư được khai báo
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

        // B2: Tạo sự kiện y tế mới
        var newEvent = new MedicalEvent
        {
            StudentId = request.StudentId,
            EventType = request.EventType,
            EventDate = request.EventDate,
            Description = request.Description,
            HandledBy = request.HandledBy,
            Notes = request.Note,
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

        // B3: Ghi nhận vật tư sử dụng & trừ kho
        if (request.SuppliesUsed != null && request.SuppliesUsed.Any())
        {
            var handleRecords = new List<HandleRecord>();
            foreach (var item in request.SuppliesUsed)
            {
                await _medicalEventRepository.UpdateSupplyQuantity(item.SupplyId, item.QuantityUsed);

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

        // B4: Trả kết quả chi tiết về sự kiện vừa tạo
        return new BaseResponse
        {
            Status = StatusCodes.Status200OK.ToString(),
            Message = "Đã xử lý sự kiện y tế thành công.",
            Data = new ManageMedicalEventResponse
            {
                StudentId = createdEvent.Student.StudentId,
                StudentName = createdEvent.Student?.FullName,
                ParentName = createdEvent.Student?.Parent?.FullName,
                EventType = createdEvent.EventType,
                EventDate = createdEvent.EventDate,
                Description = createdEvent.Description,
                HandledById = createdEvent.HandledBy,
                HandledByName = createdEvent.HandledByNavigation?.FullName,
                Note = createdEvent.Notes
            }
        };
    }

    /// <summary>
    /// Soft delete sự kiện y tế bằng cách set IsActive = false.
    /// </summary>
    public async Task<bool> DeleteMedicalEventAsync(int id)
    {
        var affected = await _medicalEventRepository.DeleteMedicalEvent(id);
        return affected > 0;
    }

    /// <summary>
    /// Trả danh sách tất cả sự kiện y tế còn hoạt động, kèm thông tin học sinh, phụ huynh và vật tư đã dùng.
    /// </summary>
    public async Task<List<ManageMedicalEventResponse>> GetAllMedicalEventsAsync()
    {
        var listevent = await _medicalEventRepository.GetAllMedicalEvents();

        var responseList = listevent.Select(e => new ManageMedicalEventResponse
        {
            StudentId = e.Student?.StudentId ?? 0,
            StudentName = e.Student?.FullName ?? "(Không rõ)",
            ParentName = e.Student?.Parent?.FullName ?? "(Không rõ)",

            EventType = e.EventType ?? "(Không rõ)",
            EventDate = e.EventDate ?? DateOnly.FromDateTime(DateTime.Today),
            Description = e.Description ?? string.Empty,
            Note = e.Notes ?? string.Empty,

            HandledById = e.HandledBy,
            HandledByName = e.HandledByNavigation?.FullName ?? "(Không rõ)",

            SuppliesUsed = e.HandleRecords?.Select(hr => new SupplyUserResponse
            {
                SupplyId = hr.SupplyId,
                SupplyName = hr.Supply?.Name ?? "(Không rõ)",
                QuantityUsed = hr.QuantityUsed ?? 0,
                Note = hr.Note
            }).ToList() ?? new List<SupplyUserResponse>()
        }).ToList();

        return responseList;
    }

    /// <summary>
    /// Lấy chi tiết một sự kiện y tế theo ID
    /// </summary>
    public async Task<BaseResponse?> GetMedicalEventByIdAsync(int id)
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
        return new BaseResponse
        {
            Status = StatusCodes.Status200OK.ToString(),
            Message = "Medical event retrieved successfully.",
            Data = new ManageMedicalEventResponse
            {
                StudentId = getid.Student.StudentId,
                StudentName = getid.Student?.FullName,
                ParentName = getid.Student?.Parent?.FullName,
                EventType = getid.EventType,
                EventDate = getid.EventDate,
                Description = getid.Description,
                HandledById = getid.HandledBy,
                HandledByName = getid.HandledByNavigation?.FullName,
                Note = getid.Notes,
            }
        };
    }

    /// <summary>
    /// Cập nhật thông tin sự kiện y tế và xử lý cập nhật vật tư: 
    /// Hoàn kho cũ → Xoá record cũ → Trừ kho mới → Ghi record mới
    /// </summary>
    public async Task<BaseResponse?> UpdateMedicalEventAsync(int id, ManageMedicalEventRequest request)
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

        // Cập nhật các trường cơ bản
        existingEvent.StudentId = request.StudentId == 0 ? existingEvent.StudentId : request.StudentId;
        existingEvent.EventType = string.IsNullOrEmpty(request.EventType) ? existingEvent.EventType : request.EventType;
        existingEvent.EventDate = request.EventDate == default ? existingEvent.EventDate : request.EventDate;
        existingEvent.Description = string.IsNullOrEmpty(request.Description) ? existingEvent.Description : request.Description;
        existingEvent.HandledBy = request.HandledBy ?? existingEvent.HandledBy;
        existingEvent.Notes = string.IsNullOrEmpty(request.Note) ? existingEvent.Notes : request.Note;

        // Nếu có cập nhật SuppliesUsed
        if (request.SuppliesUsed != null && request.SuppliesUsed.Any())
        {
            var oldRecords = existingEvent.HandleRecords.ToList();

            // Hoàn kho từ bản ghi cũ
            foreach (var old in oldRecords)
            {
                await _medicalEventRepository.UpdateSupplyQuantity(old.SupplyId, -old.QuantityUsed ?? 0);
            }

            // Xoá bản ghi cũ
            await _medicalEventRepository.RemoveHandleRecordsAsync(oldRecords);

            // Kiểm tra tồn kho vật tư mới
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

            // Trừ kho & tạo lại bản ghi mới
            var newRecords = new List<HandleRecord>();
            foreach (var item in request.SuppliesUsed)
            {
                await _medicalEventRepository.UpdateSupplyQuantity(item.SupplyId, item.QuantityUsed);
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

        // Cập nhật lại sự kiện
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

        // Trả dữ liệu sau cập nhật
        return new BaseResponse
        {
            Status = StatusCodes.Status200OK.ToString(),
            Message = "Đã cập nhật sự kiện y tế thành công.",
            Data = new ManageMedicalEventResponse
            {
                StudentId = updatedEvent.Student.StudentId,
                StudentName = updatedEvent.Student?.FullName ?? string.Empty,
                ParentName = updatedEvent.Student?.Parent?.FullName ?? string.Empty,
                EventType = updatedEvent.EventType ?? string.Empty,
                EventDate = updatedEvent.EventDate,
                Description = updatedEvent.Description ?? string.Empty,
                HandledById = updatedEvent.HandledBy,
                HandledByName = updatedEvent.HandledByNavigation?.FullName ?? string.Empty,
                Note = updatedEvent.Notes ?? string.Empty,
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
}
