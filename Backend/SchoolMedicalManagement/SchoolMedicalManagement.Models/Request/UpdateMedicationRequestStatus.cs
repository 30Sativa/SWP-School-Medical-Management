using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolMedicalManagement.Models.Request
{
    public class UpdateMedicationRequestStatus
    {
        public int RequestID { get; set; }
        public int StatusID { get; set; }  // 2 = Đã duyệt, 3 = Từ chối
        public Guid NurseID { get; set; }  // Ai xử lý
    }
}
