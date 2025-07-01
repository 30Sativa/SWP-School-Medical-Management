using System;

namespace SchoolMedicalManagement.Models.Response
{
    public class VaccinationCampaignResponse
    {
        // ID của chiến dịch
        public int CampaignId { get; set; }

        // Tên vaccine
        public string? VaccineName { get; set; }

        // Ngày tiêm chủng
        public DateOnly? Date { get; set; }

        // Mô tả chiến dịch
        public string? Description { get; set; }

        // ID người tạo
        public Guid? CreatedBy { get; set; }

        // Tên người tạo
        public string? CreatedByName { get; set; }

        // ID trạng thái chiến dịch
        public int? StatusId { get; set; }

        // Tên trạng thái chiến dịch
        public string? StatusName { get; set; }

        // Tổng số yêu cầu đồng ý
        public int TotalConsentRequests { get; set; }

        // Tổng số bản ghi tiêm chủng
        public int TotalVaccinationRecords { get; set; }
    }
} 