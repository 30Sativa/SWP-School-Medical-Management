using System;

namespace SchoolMedicalManagement.Models.Request
{
    public class CreateVaccinationRecordRequest
    {
        // ID của học sinh được tiêm chủng
        public int StudentId { get; set; }

        // ID của chiến dịch tiêm chủng
        public int CampaignId { get; set; }

        // ID của trạng thái đồng ý
        public int ConsentStatusId { get; set; }

        // Ngày tiêm chủng
        public DateTime? VaccinationDate { get; set; }

        // Kết quả tiêm chủng
        public string? Result { get; set; }

        // Ghi chú theo dõi
        public string? FollowUpNote { get; set; }

        // Trạng thái hoạt động của bản ghi
        public bool IsActive { get; set; } = true;
    }
} 