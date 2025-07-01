using System;

namespace SchoolMedicalManagement.Models.Request
{
    public class CreateMedicalEventTypeRequest
    {
        public string EventTypeName { get; set; } = null!;
    }
}