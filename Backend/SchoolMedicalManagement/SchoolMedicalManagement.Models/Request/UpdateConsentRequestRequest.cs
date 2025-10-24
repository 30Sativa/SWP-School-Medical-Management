using System;

namespace SchoolMedicalManagement.Models.Request
{
    public class UpdateConsentRequestRequest
    {
        // ID của trạng thái đồng ý (1: Đồng ý, 2: Từ chối)
        public int ConsentStatusId { get; set; }

        // Thời gian phụ huynh phản hồi
        public DateTime ConsentDate { get; set; } = DateTime.UtcNow;
    }
} 