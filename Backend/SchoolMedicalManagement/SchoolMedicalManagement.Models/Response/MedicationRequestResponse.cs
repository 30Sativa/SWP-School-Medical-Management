using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolMedicalManagement.Models.Response
{
    public class MedicationRequestResponse
    {
        public int RequestID { get; set; }
        public string StudentName { get; set; }
        public string ParentName { get; set; }
        public string MedicationName { get; set; }
        public string Dosage { get; set; }
        public string Instructions { get; set; }
        public string Status { get; set; }
        public DateTime RequestDate { get; set; }

        // ✅ thêm dòng này để trả về ảnh đơn thuốc
        public string? ImagePath { get; set; }

        // ✅ nếu dùng cho nurse hoặc admin
        public string? ReceivedByName { get; set; }  // ví dụ: "Nguyễn Thị Yến (YT01)"
    }
}
