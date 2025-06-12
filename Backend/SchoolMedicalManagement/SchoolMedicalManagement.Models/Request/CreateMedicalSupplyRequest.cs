using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolMedicalManagement.Models.Request
{
    public class CreateMedicalSupplyRequest
    {
        [Required(ErrorMessage = "Tên vật tư là bắt buộc.")]
        public string Name { get; set; } = string.Empty;

        [Range(0, int.MaxValue, ErrorMessage = "Số lượng phải >= 0.")]
        public int Quantity { get; set; }

        [Required(ErrorMessage = "Đơn vị tính là bắt buộc.")]
        public string Unit { get; set; } = string.Empty;

        [Required(ErrorMessage = "Ngày hết hạn là bắt buộc.")]
        public DateOnly? ExpiryDate { get; set; }
    }
}
