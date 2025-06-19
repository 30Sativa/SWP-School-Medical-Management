using System;

namespace SchoolMedicalManagement.Models.Response
{
    public class MedicalEventTypeManagementResponse
    {
        public int EventTypeId { get; set; }
        public string EventTypeName { get; set; } = null!;
    }
}