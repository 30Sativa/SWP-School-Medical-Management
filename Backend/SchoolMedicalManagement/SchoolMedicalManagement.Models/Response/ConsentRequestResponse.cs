using System;

namespace SchoolMedicalManagement.Models.Response
{
    public class ConsentRequestResponse
    {
        // ID của yêu cầu
        public int RequestId { get; set; }

        // ID của học sinh
        public int StudentId { get; set; }

        // Tên học sinh
        public string StudentName { get; set; }

        // ID của chiến dịch
        public int CampaignId { get; set; }

        // Tên chiến dịch
        public string CampaignName { get; set; }

        // ID của phụ huynh
        public Guid ParentId { get; set; }

        // Tên phụ huynh
        public string ParentName { get; set; }

        // Ngày gửi yêu cầu
        public DateTime RequestDate { get; set; }

        // ID trạng thái đồng ý
        public int? ConsentStatusId { get; set; }

        // Tên trạng thái đồng ý
        public string? ConsentStatusName { get; set; }

        // Ngày phụ huynh phản hồi
        public DateTime? ConsentDate { get; set; }
    }
} 