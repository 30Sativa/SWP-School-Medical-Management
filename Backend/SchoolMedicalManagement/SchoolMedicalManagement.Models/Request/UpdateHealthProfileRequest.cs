using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolMedicalManagement.Models.Request
{
    public class UpdateHealthProfileRequest
    {
        public decimal? Height { get; set; }                // Chiều cao (có thể null nếu không cập nhật)
        public decimal? Weight { get; set; }                // Cân nặng (có thể null nếu không cập nhật)
        public string? ChronicDiseases { get; set; }       // Bệnh mãn tính
        public string? Allergies { get; set; }             // Dị ứng
        public string? GeneralNote { get; set; }           // Ghi chú tổng quan
        public bool? IsActive { get; set; }                // Cho phép soft delete hoặc khôi phục
    }
}
