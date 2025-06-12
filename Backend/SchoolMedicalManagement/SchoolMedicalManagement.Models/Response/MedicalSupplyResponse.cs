using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolMedicalManagement.Models.Response
{
    public class MedicalSupplyResponse
    {
        public int SupplyID { get; set; }                    // ID vật tư y tế
        public string Name { get; set; } = string.Empty;     // Tên vật tư y tế
        public int Quantity { get; set; }                    // Số lượng hiện có
        public string Unit { get; set; } = string.Empty;     // Đơn vị (vd: hộp, viên, chai)
        public DateOnly? ExpiryDate { get; set; }            // Hạn sử dụng (nullable nếu không có)
    }
}
