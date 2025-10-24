using Microsoft.AspNetCore.Http;
using SchoolMedicalManagement.Models.Entity;
using SchoolMedicalManagement.Models.Request;
using SchoolMedicalManagement.Models.Response;
using SchoolMedicalManagement.Repository.Repository;
using SchoolMedicalManagement.Service.Interface;
using System.Text;

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

        // B1.5: Kiểm tra tiền sử bệnh (dị ứng) của học sinh với vật tư y tế được chọn
        if (request.StudentId != 0 && request.SuppliesUsed != null && request.SuppliesUsed.Any())
        {
            // Lấy danh sách tiền sử bệnh của học sinh
            var medicalHistories = await _medicalHistoryRepository.GetAllByStudentIdMedicalHistory(request.StudentId);
            
            // Chỉ kiểm tra nếu học sinh có tiền sử bệnh
            if (medicalHistories != null && medicalHistories.Any())
            {
                // Lấy thông tin chi tiết của các vật tư y tế được chọn
                var selectedSupplies = new List<MedicalSupply>();
                foreach (var item in request.SuppliesUsed)
                {
                    var supply = await _medicalEventRepository.GetSupplyById(item.SupplyId);
                    if (supply != null)
                    {
                        selectedSupplies.Add(supply);
                    }
                }

                // Kiểm tra xem có dị ứng với vật tư nào không
                var allergies = new List<string>();
                
                // Tìm các tiền sử dị ứng
                var allergyHistories = medicalHistories.Where(h => 
                    (!string.IsNullOrEmpty(h.DiseaseName) && h.DiseaseName.ToLower().Contains("dị ứng")) || 
                    (!string.IsNullOrEmpty(h.Note) && h.Note.ToLower().Contains("dị ứng"))
                ).ToList();
                
                if (allergyHistories.Any())
                {
                    // Trích xuất tên thuốc/vật tư gây dị ứng từ tiền sử
                    foreach (var history in allergyHistories)
                    {
                        // Trích xuất tên thuốc gây dị ứng từ DiseaseName hoặc Note
                        string allergyName = "";
                        
                        if (!string.IsNullOrEmpty(history.DiseaseName) && history.DiseaseName.ToLower().Contains("dị ứng"))
                        {
                            // Lấy phần sau "Dị ứng" nếu có
                            int index = history.DiseaseName.ToLower().IndexOf("dị ứng");
                            if (index >= 0 && index + 7 < history.DiseaseName.Length)
                            {
                                allergyName = history.DiseaseName.Substring(index + 7).Trim();
                            }
                        }
                        
                        // Nếu không tìm thấy trong DiseaseName, tìm trong Note
                        if (string.IsNullOrEmpty(allergyName) && !string.IsNullOrEmpty(history.Note))
                        {
                            // Tìm từ khóa trong Note
                            string[] keywords = { "dị ứng với", "dị ứng", "không dùng", "không được sử dụng" };
                            foreach (var keyword in keywords)
                            {
                                int index = history.Note.ToLower().IndexOf(keyword);
                                if (index >= 0 && index + keyword.Length < history.Note.Length)
                                {
                                    allergyName = history.Note.Substring(index + keyword.Length).Trim().Split(',')[0].Trim();
                                    break;
                                }
                            }
                        }
                        
                        // Nếu tìm được tên thuốc gây dị ứng, kiểm tra với các vật tư được chọn
                        if (!string.IsNullOrEmpty(allergyName))
                        {
                            foreach (var supply in selectedSupplies)
                            {
                                if (!string.IsNullOrEmpty(supply.Name) && 
                                    supply.Name.ToLower().Contains(allergyName.ToLower()))
                                {
                                    allergies.Add($"{supply.Name} (ID: {supply.SupplyId})");
                                    break;
                                }
                            }
                        }
                        else
                        {
                            // Nếu không thể trích xuất tên thuốc, kiểm tra trực tiếp với các vật tư phổ biến
                            string[] commonAllergens = { "paracetamol", "aspirin", "ibuprofen", "penicillin", "amoxicillin" };
                            foreach (var supply in selectedSupplies)
                            {
                                if (!string.IsNullOrEmpty(supply.Name))
                                {
                                    foreach (var allergen in commonAllergens)
                                    {
                                        if (supply.Name.ToLower().Contains(allergen))
                                        {
                                            // Kiểm tra xem allergen này có được đề cập trong tiền sử không
                                            if ((history.DiseaseName != null && history.DiseaseName.ToLower().Contains(allergen)) ||
                                                (history.Note != null && history.Note.ToLower().Contains(allergen)))
                                            {
                                                allergies.Add($"{supply.Name} (ID: {supply.SupplyId})");
                                                break;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                // Nếu có dị ứng với bất kỳ vật tư nào, trả về lỗi
                if (allergies.Any())
                {
                    var allergyList = string.Join(", ", allergies);
                    return new BaseResponse
                    {
                        Status = StatusCodes.Status400BadRequest.ToString(),
                        Message = $"Học sinh có tiền sử dị ứng với các vật tư y tế sau: {allergyList}",
                        Data = null
                    };
                }
            }
            // Nếu không có tiền sử bệnh, bỏ qua việc kiểm tra
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
                Message = "Lỗi tạo sự kiện y tế.",
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
                Message = "Không tìm thấy sự kiện y tế.",
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
            Message = "Lấy sự kiện y tế thành công.",
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
                    Unit = hr.Supply?.Unit ?? "(Không rõ)",
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
    public async Task<BaseResponse> GetAllMedicalEvent()
    {
        var listevent = await _medicalEventRepository.GetAllMedicalEvents();
        var responseList = listevent.Select(e => new CreateMedicalEventResponse
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
                Unit = hr.Supply?.Unit ?? "(Không rõ)",
                Note = hr.Note
            }).ToList() ?? new List<SupplyUserResponse>(),

            MedicalHistory = new List<MedicalHistoryResponse>() // optional: để rõ ràng
        }).ToList();
        return new BaseResponse
        {
            Status = StatusCodes.Status200OK.ToString(),
            Message = "Lấy danh sách sự kiện y tế thành công.",
            Data = responseList
        };
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

        // Kiểm tra tiền sử bệnh (dị ứng) của học sinh với vật tư y tế được chọn
        int studentId = request.StudentId == 0 ? existingEvent.StudentId.GetValueOrDefault() : request.StudentId;
        if (studentId != 0 && request.SuppliesUsed != null && request.SuppliesUsed.Any())
        {
            // Lấy danh sách tiền sử bệnh của học sinh
            var medicalHistories = await _medicalHistoryRepository.GetAllByStudentIdMedicalHistory(studentId);
            
            // Chỉ kiểm tra nếu học sinh có tiền sử bệnh
            if (medicalHistories != null && medicalHistories.Any())
            {
                // Lấy thông tin chi tiết của các vật tư y tế được chọn
                var selectedSupplies = new List<MedicalSupply>();
                foreach (var item in request.SuppliesUsed)
                {
                    var supply = await _medicalEventRepository.GetSupplyById(item.SupplyId);
                    if (supply != null)
                    {
                        selectedSupplies.Add(supply);
                    }
                }

                // Kiểm tra xem có dị ứng với vật tư nào không
                var allergies = new List<string>();
                
                // Tìm các tiền sử dị ứng
                var allergyHistories = medicalHistories.Where(h => 
                    (!string.IsNullOrEmpty(h.DiseaseName) && h.DiseaseName.ToLower().Contains("dị ứng")) || 
                    (!string.IsNullOrEmpty(h.Note) && h.Note.ToLower().Contains("dị ứng"))
                ).ToList();
                
                if (allergyHistories.Any())
                {
                    // Trích xuất tên thuốc/vật tư gây dị ứng từ tiền sử
                    foreach (var history in allergyHistories)
                    {
                        // Trích xuất tên thuốc gây dị ứng từ DiseaseName hoặc Note
                        string allergyName = "";
                        
                        if (!string.IsNullOrEmpty(history.DiseaseName) && history.DiseaseName.ToLower().Contains("dị ứng"))
                        {
                            // Lấy phần sau "Dị ứng" nếu có
                            int index = history.DiseaseName.ToLower().IndexOf("dị ứng");
                            if (index >= 0 && index + 7 < history.DiseaseName.Length)
                            {
                                allergyName = history.DiseaseName.Substring(index + 7).Trim();
                            }
                        }
                        
                        // Nếu không tìm thấy trong DiseaseName, tìm trong Note
                        if (string.IsNullOrEmpty(allergyName) && !string.IsNullOrEmpty(history.Note))
                        {
                            // Tìm từ khóa trong Note
                            string[] keywords = { "dị ứng với", "dị ứng", "không dùng", "không được sử dụng" };
                            foreach (var keyword in keywords)
                            {
                                int index = history.Note.ToLower().IndexOf(keyword);
                                if (index >= 0 && index + keyword.Length < history.Note.Length)
                                {
                                    allergyName = history.Note.Substring(index + keyword.Length).Trim().Split(',')[0].Trim();
                                    break;
                                }
                            }
                        }
                        
                        // Nếu tìm được tên thuốc gây dị ứng, kiểm tra với các vật tư được chọn
                        if (!string.IsNullOrEmpty(allergyName))
                        {
                            foreach (var supply in selectedSupplies)
                            {
                                if (!string.IsNullOrEmpty(supply.Name) && 
                                    supply.Name.ToLower().Contains(allergyName.ToLower()))
                                {
                                    allergies.Add($"{supply.Name} (ID: {supply.SupplyId})");
                                    break;
                                }
                            }
                        }
                        else
                        {
                            // Nếu không thể trích xuất tên thuốc, kiểm tra trực tiếp với các vật tư phổ biến
                            string[] commonAllergens = { "paracetamol", "aspirin", "ibuprofen", "penicillin", "amoxicillin" };
                            foreach (var supply in selectedSupplies)
                            {
                                if (!string.IsNullOrEmpty(supply.Name))
                                {
                                    foreach (var allergen in commonAllergens)
                                    {
                                        if (supply.Name.ToLower().Contains(allergen))
                                        {
                                            // Kiểm tra xem allergen này có được đề cập trong tiền sử không
                                            if ((history.DiseaseName != null && history.DiseaseName.ToLower().Contains(allergen)) ||
                                                (history.Note != null && history.Note.ToLower().Contains(allergen)))
                                            {
                                                allergies.Add($"{supply.Name} (ID: {supply.SupplyId})");
                                                break;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                // Nếu có dị ứng với bất kỳ vật tư nào, trả về lỗi
                if (allergies.Any())
                {
                    var allergyList = string.Join(", ", allergies);
                    return new BaseResponse
                    {
                        Status = StatusCodes.Status400BadRequest.ToString(),
                        Message = $"Học sinh có tiền sử dị ứng với các vật tư y tế sau: {allergyList}",
                        Data = null
                    };
                }
            }
            // Nếu không có tiền sử bệnh, bỏ qua việc kiểm tra
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
                    Unit = r.Supply?.Unit ?? "",
                    Note = r.Note
                }).ToList()
            }
        };
    }

    // =============================
    // XÓA MỀM SỰ KIỆN Y TẾ
    // =============================
    public async Task<BaseResponse> DeleteMedicalEvent(int eventId)
    {
        var affected = await _medicalEventRepository.DeleteMedicalEvent(eventId);
        if (affected <= 0)
        {
            return new BaseResponse { Status = StatusCodes.Status404NotFound.ToString(), Message = "Không tìm thấy sự kiện y tế để xóa.", Data = null };
        }
        return new BaseResponse { Status = StatusCodes.Status200OK.ToString(), Message = "Xóa sự kiện y tế thành công.", Data = null };
    }

    public async Task<BaseResponse?> GetMedicalEventsByStudentId(int studentId)
    {
        var events = await _medicalEventRepository.GetMedicalEventByStudentID(studentId);
        if (events == null)
        {
            return new BaseResponse
            {
                Status = StatusCodes.Status404NotFound.ToString(),
                Message = "Không tìm thấy sự kiện y tế cho học sinh này.",
                Data = null
            };
        }
        var histories = new List<MedicalHistory>();
        if (events.StudentId.HasValue)
        {
            histories = await _medicalHistoryRepository.GetAllByStudentIdMedicalHistory(events.StudentId.Value);
        }

        return new BaseResponse
        {
            Status = StatusCodes.Status200OK.ToString(),
            Message = "Lấy sự kiện y tế thành công.",
            Data = new CreateMedicalEventResponse
            {
                EventId = events.EventId,
                StudentId = events.Student?.StudentId ?? 0,
                StudentName = events.Student?.FullName ?? "(Không rõ)",
                ParentName = events.Student?.Parent?.FullName ?? "(Không rõ)",
                EventType = events.EventType?.EventTypeName ?? "(Không rõ)",
                EventDate = events.EventDate,
                Description = events.Description ?? string.Empty,
                HandledById = events.HandledBy,
                HandledByName = events.HandledByNavigation?.FullName ?? "(Không rõ)",
                SeverityLevelName = events.Severity?.SeverityName ?? "(Không rõ)",
                Location = events.Location ?? string.Empty,
                Notes = events.Notes ?? string.Empty,
                SuppliesUsed = events.HandleRecords?.Select(hr => new SupplyUserResponse
                {
                    SupplyId = hr.SupplyId,
                    SupplyName = hr.Supply?.Name ?? "(Không rõ)",
                    QuantityUsed = hr.QuantityUsed,
                    Unit = hr.Supply?.Unit ?? "(Không rõ)",
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
}
