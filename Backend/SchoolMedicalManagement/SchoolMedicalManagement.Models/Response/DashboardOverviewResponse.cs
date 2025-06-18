using System;
using System.Collections.Generic;

namespace SchoolMedicalManagement.Models.Response
{
    public class DashboardOverviewResponse
    {
        // Tổng số học sinh trong hệ thống
        public int TotalStudents { get; set; }

        // Thống kê số lượng người dùng theo từng vai trò
        public UserCountResponse TotalUsers { get; set; } = new();

        // Tổng số sự kiện y tế trong khoảng thời gian được chọn
        public int TotalMedicalEvents { get; set; }

        // Tổng số yêu cầu dùng thuốc trong khoảng thời gian được chọn
        public int TotalMedicationRequests { get; set; }

        // Số lượng yêu cầu dùng thuốc đang chờ duyệt
        public int PendingMedicationRequests { get; set; }

        // Tổng số chiến dịch tiêm chủng
        public int TotalVaccinationCampaigns { get; set; }

        // Số lượng chiến dịch tiêm chủng đang diễn ra
        public int ActiveVaccinationCampaigns { get; set; }

        // Thống kê chi tiết chiến dịch tiêm chủng theo trạng thái
        public int NotStartedVaccinationCampaigns { get; set; }
        public int CompletedVaccinationCampaigns { get; set; }
        public int CancelledVaccinationCampaigns { get; set; }

        // Tổng số chiến dịch khám sức khỏe
        public int TotalHealthCheckCampaigns { get; set; }

        // Số lượng chiến dịch khám sức khỏe đang diễn ra
        public int ActiveHealthCheckCampaigns { get; set; }

        // Danh sách các sự kiện y tế gần đây nhất (mặc định 5 sự kiện)
        public List<RecentMedicalEventResponse> RecentMedicalEvents { get; set; } = new();

        // Danh sách các yêu cầu dùng thuốc gần đây nhất (mặc định 5 yêu cầu)
        public List<RecentMedicationRequestResponse> RecentMedicationRequests { get; set; } = new();
    }

    // Response class chứa thông tin số lượng người dùng theo từng vai trò
    public class UserCountResponse
    {
        // Số lượng người dùng có vai trò Admin
        public int Admin { get; set; }

        // Số lượng người dùng có vai trò Y tá
        public int Nurse { get; set; }

        // Số lượng người dùng có vai trò Phụ huynh
        public int Parent { get; set; }

        // Tổng số người dùng trong hệ thống
        public int Total { get; set; }
    }

    // Response class chứa thông tin về sự kiện y tế gần đây
    public class RecentMedicalEventResponse
    {
        // Mã định danh của sự kiện y tế
        public string EventId { get; set; } = null!;

        // Tên học sinh liên quan đến sự kiện
        public string StudentName { get; set; } = null!;

        // Loại sự kiện y tế (ví dụ: Sốt, Té ngã)
        public string EventType { get; set; } = null!;

        // Ngày xảy ra sự kiện
        public DateTime EventDate { get; set; }

        // Mức độ nghiêm trọng của sự kiện (Nhẹ, Trung bình, Nghiêm trọng)
        public string Severity { get; set; } = null!;
    }

    // Response class chứa thông tin về yêu cầu dùng thuốc gần đây
    public class RecentMedicationRequestResponse
    {
        // Mã định danh của yêu cầu dùng thuốc
        public string RequestId { get; set; } = null!;

        // Tên học sinh yêu cầu dùng thuốc
        public string StudentName { get; set; } = null!;

        // Tên thuốc được yêu cầu
        public string MedicationName { get; set; } = null!;

        // Ngày gửi yêu cầu
        public DateTime RequestDate { get; set; }

        // Trạng thái của yêu cầu (Chờ duyệt, Đã duyệt, Bị từ chối, Đã dùng)
        public string Status { get; set; } = null!;
    }
} 