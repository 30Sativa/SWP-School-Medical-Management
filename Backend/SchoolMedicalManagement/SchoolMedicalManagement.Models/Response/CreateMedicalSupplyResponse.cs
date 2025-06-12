using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolMedicalManagement.Models.Response
{
    public class CreateMedicalSupplyResponse
    {
        public int SupplyId { get; set; }                        // ID vật tư (auto-increment từ DB)
        public string Name { get; set; } = string.Empty;         // Tên vật tư
        public int Quantity { get; set; }                        // Số lượng nhập kho ban đầu
        public string Unit { get; set; } = string.Empty;         // Đơn vị tính (hộp, viên, chai,...)
        public DateOnly? ExpiryDate { get; set; }                // Hạn sử dụng (nullable)
        public DateTime CreatedAt { get; set; }
    }
}
