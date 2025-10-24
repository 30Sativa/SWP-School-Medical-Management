using System;

namespace SchoolMedicalManagement.Models.Request
{
    public class CreateNotificationRequest
    {
        public Guid ReceiverId { get; set; }
        public string? Title { get; set; }
        public string? Message { get; set; }
        public int TypeId { get; set; }
        public bool? IsRead { get; set; }
    }
} 