using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolMedicalManagement.Models.Request
{
    public class UpdateMedicalSupplyRequest
    {
        public int SupplyId { get; set; }                       // ID vật tư cần sửa
        public string? Name { get; set; }                       // Cho phép null nếu không muốn cập nhật
        public int? Quantity { get; set; }                      // Có thể chỉ sửa số lượng
        public string? Unit { get; set; }                       // Đơn vị có thể thay đổi
        public DateOnly? ExpiryDate { get; set; }               // Có thể cập nhật hạn dùng
    }
}
