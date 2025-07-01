using System;

namespace SchoolMedicalManagement.Models.Response
{
    public class NotificationManagementResponse
    {
        public int NotificationId { get; set; }
        public Guid ReceiverId { get; set; }
        public string? ReceiverName { get; set; }
        public string? Title { get; set; }
        public string? Message { get; set; }
        public int TypeId { get; set; }
        public string? TypeName { get; set; }
        public bool? IsRead { get; set; }
        public DateTime? SentDate { get; set; }
    }
} 