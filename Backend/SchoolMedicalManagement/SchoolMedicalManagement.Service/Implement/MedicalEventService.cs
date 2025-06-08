using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.IdentityModel.Tokens;
using SchoolMedicalManagement.Models.Entity;
using SchoolMedicalManagement.Models.Request;
using SchoolMedicalManagement.Models.Response;
using SchoolMedicalManagement.Repository.Repository;
using SchoolMedicalManagement.Service.Interface;

namespace SchoolMedicalManagement.Service.Implement
{
    public class MedicalEventService : IMedicalEventService
    {
        private readonly MedicalEventRepository _medicalEventRepository;

        public MedicalEventService(MedicalEventRepository medicalEventRepository)
        {
            _medicalEventRepository = medicalEventRepository;
        }

        public async Task<BaseResponse?> CreateMedicalEventAsync(ManageMedicalEventRequest medicalEvent)
        {
            var newEvent = new MedicalEvent
            {
                StudentId = medicalEvent.StudentId,
                EventType = medicalEvent.EventType,
                EventDate = medicalEvent.EventDate,
                Description = medicalEvent.Description,
                HandledBy = medicalEvent.HandledBy,
                Notes = medicalEvent.Note,
            };

            var creatnew = await _medicalEventRepository.CreateMedicalEvent(newEvent);
            if (creatnew == null)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status404NotFound.ToString(),
                    Message = "Failed to create medical event.",
                    Data = null
                };
            }
            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = "Medical event created successfully.",
                Data = new ManageMedicalEventResponse
                {
                    StudentID = creatnew.StudentId,
                    StudentName = creatnew.Student?.FullName,
                    ParentName = creatnew.Student.Parent.FullName,
                    EventType = creatnew.EventType,
                    EventDate = creatnew.EventDate,
                    Description = creatnew.Description,
                    HandledBy = creatnew.HandledBy,
                    HandledByName = creatnew.HandledByNavigation?.FullName,
                    Note = creatnew.Notes,
                }
            };
        }

        public async Task<bool> DeleteMedicalEventAsync(int id)
        {
            var delete = await _medicalEventRepository.DeleteMedicalEvent(id);
            if(delete == null)
            {
                return false;
            }
            return true;
        }

        public async Task<List<ManageMedicalEventResponse>> GetAllMedicalEventsAsync()
        {
            var listevent = await _medicalEventRepository.GetAllMedicalEvents();
            var responseList = listevent.Select(e => new ManageMedicalEventResponse
            {
                StudentID = e.StudentId,
                StudentName = e.Student?.FullName,
                ParentName = e.Student?.Parent?.FullName,
                EventType = e.EventType,
                EventDate = e.EventDate,
                Description = e.Description,
                HandledBy = e.HandledBy,
                HandledByName = e.HandledByNavigation?.FullName,
                Note = e.Notes,
            }).ToList();
            return responseList;
        }

        public async Task<BaseResponse?> GetMedicalEventByIdAsync(int id)
        {
            var getid = await _medicalEventRepository.GetMedicalEventById(id);
            if(getid == null)
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
                    StudentID = getid.StudentId,
                    StudentName = getid.Student?.FullName,
                    ParentName = getid.Student?.Parent?.FullName,
                    EventType = getid.EventType,
                    EventDate = getid.EventDate,
                    Description = getid.Description,
                    HandledBy = getid.HandledBy,
                    HandledByName = getid.HandledByNavigation?.FullName,
                    Note = getid.Notes,
                }
            };
        }

        public async Task<BaseResponse?> UpdateMedicalEventAsync(int id, ManageMedicalEventRequest request)
        {
            var getupdate = await _medicalEventRepository.GetMedicalEventById(id);
            if (getupdate == null)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status404NotFound.ToString(),
                    Message = "Medical event not found.",
                    Data = null
                };
            }
            // Fix: StudentId is int, so check for 0 (default) instead of string.IsNullOrEmpty
            getupdate.StudentId = request.StudentId == 0 ? getupdate.StudentId : request.StudentId;
            // EventType is string, so check for null or empty
            getupdate.EventType = string.IsNullOrEmpty(request.EventType) ? getupdate.EventType : request.EventType;
            // EventDate is DateOnly, so check for default
            getupdate.EventDate = request.EventDate == default ? getupdate.EventDate : request.EventDate;
            getupdate.Description = string.IsNullOrEmpty(request.Description) ? getupdate.Description : request.Description;
            getupdate.HandledBy = request.HandledBy == null ? getupdate.HandledBy : request.HandledBy;
            getupdate.Notes = string.IsNullOrEmpty(request.Note) ? getupdate.Notes : request.Note;
            var update = await _medicalEventRepository.UpdateMedicalEvent(getupdate);
            if (update == null)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status404NotFound.ToString(),
                    Message = "Failed to update medical event.",
                    Data = null
                };
            }
            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = "Medical event updated successfully.",
                Data = new ManageMedicalEventResponse
                {
                    StudentID = update.StudentId,
                    StudentName = update.Student?.FullName ?? string.Empty,
                    ParentName = update.Student?.Parent?.FullName ?? string.Empty,
                    EventType = update.EventType ?? string.Empty,
                    EventDate = update.EventDate,
                    Description = update.Description,
                    HandledBy = update.HandledBy,
                    HandledByName = update.HandledByNavigation?.FullName ?? string.Empty,
                    Note = update.Notes,
                }
            };
        }
    }
}
