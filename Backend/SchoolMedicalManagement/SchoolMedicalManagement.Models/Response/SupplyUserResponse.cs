using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolMedicalManagement.Models.Response
{
    public class SupplyUserResponse
    {
        public int SupplyId { get; set; }                          // ID vật tư
        public string SupplyName { get; set; } = string.Empty;     // Tên vật tư
        public int? QuantityUsed { get; set; }                     // Số lượng đã dùng (nullable)
        public string? Note { get; set; }                          // Ghi chú nếu có
    }
}
