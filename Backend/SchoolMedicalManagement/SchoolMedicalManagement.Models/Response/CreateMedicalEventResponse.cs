using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SchoolMedicalManagement.Models.Entity;

namespace SchoolMedicalManagement.Models.Response
{
    public class CreateMedicalEventResponse
    {
        public int EventId { get; set; }

        // 👨‍🎓 Thông tin học sinh
        public int StudentId { get; set; }
        public string StudentName { get; set; } = string.Empty;
        public string ParentName { get; set; } = string.Empty;

        // 👩‍⚕️ Người xử lý
        public Guid? HandledById { get; set; }
        public string HandledByName { get; set; } = string.Empty;

        // 📄 Thông tin sự kiện
        public string EventType { get; set; } = string.Empty;
        public string SeverityLevelName { get; set; } = string.Empty;
        public DateTime? EventDate { get; set; }
        public string Location { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Notes { get; set; } = string.Empty;

        // 📦 Danh sách vật tư y tế đã sử dụng
        public List<SupplyUserResponse> SuppliesUsed { get; set; } = new();
        public List<MedicalHistoryResponse> MedicalHistory { get; set; } = new();




    }
}
