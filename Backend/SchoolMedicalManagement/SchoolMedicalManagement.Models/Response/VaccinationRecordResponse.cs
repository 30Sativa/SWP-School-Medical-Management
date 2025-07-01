using System;

namespace SchoolMedicalManagement.Models.Response
{
    public class VaccinationRecordResponse
    {
        // ID của bản ghi
        public int RecordId { get; set; }

        // ID của học sinh
        public int? StudentId { get; set; }

        // Tên học sinh
        public string? StudentName { get; set; }

        // ID của chiến dịch
        public int? CampaignId { get; set; }

        // Tên chiến dịch
        public string? CampaignName { get; set; }

        // ID trạng thái đồng ý
        public int? ConsentStatusId { get; set; }

        // Tên trạng thái đồng ý
        public string? ConsentStatusName { get; set; }

        // Ngày phụ huynh đồng ý
        public DateTime? ConsentDate { get; set; }

        // Ngày tiêm chủng
        public DateTime? VaccinationDate { get; set; }

        // Kết quả tiêm chủng
        public string? Result { get; set; }

        // Ghi chú theo dõi
        public string? FollowUpNote { get; set; }

        // Trạng thái hoạt động
        public bool? IsActive { get; set; }
    }
} 