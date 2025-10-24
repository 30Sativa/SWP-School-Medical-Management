using System;
using System.Collections.Generic;

namespace SchoolMedicalManagement.Models.Response
{
    // Response chứa tất cả thông tin dashboard cho phụ huynh
    public class ParentDashboardOverviewResponse
    {
        // Tổng số con của phụ huynh này
        public int TotalChildren { get; set; }

        // Danh sách thông tin cơ bản từng con
        public List<ChildOverviewResponse> Children { get; set; } = new();

        // 5 sự kiện y tế gần đây nhất của các con
        public List<RecentMedicalEventResponse> RecentMedicalEvents { get; set; } = new();

        // 5 yêu cầu thuốc gần đây nhất của các con
        public List<RecentMedicationRequestResponse> RecentMedicationRequests { get; set; } = new();

        // 3 thông báo gần đây nhất dành cho phụ huynh
        public List<RecentNotificationResponse> RecentNotifications { get; set; } = new();
    }

    // Thông tin thông báo gần đây
    public class RecentNotificationResponse
    {
        public int NotificationId { get; set; }
        public string? Title { get; set; }
        public string? Message { get; set; }
        public DateTime CreatedDate { get; set; }
        public bool IsRead { get; set; }
    }

    // Thông tin tổng quan cơ bản về một đứa con
    public class ChildOverviewResponse
    {
        public int StudentId { get; set; }
        public string StudentName { get; set; } = null!;
        public string Class { get; set; } = null!;
        public DateOnly? DateOfBirth { get; set; }
        public string Gender { get; set; } = null!;
    }
}