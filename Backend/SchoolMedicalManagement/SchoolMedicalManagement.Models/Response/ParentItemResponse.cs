using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolMedicalManagement.Models.Response
{
    public class ParentNotificationResponse
    {
        public string Id { get; set; } = null!;
        public string ItemType { get; set; } = null!;
        public string Title { get; set; } = null!;
        public string? Message { get; set; }
        public string Date { get; set; } = null!;
        public string? Status { get; set; }
        public string? NotificationType { get; set; }
    }
}
