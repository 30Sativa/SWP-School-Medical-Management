using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolMedicalManagement.Models.Response
{
    public class ManagerHealthProfileResponse
    {
        public int ProfileId { get; set; }                 // ID hồ sơ sức khỏe
        public int? StudentId { get; set; }                 // ID học sinh

        public decimal? Height { get; set; }                // Chiều cao
        public decimal? Weight { get; set; }                // Cân nặng
        public string? ChronicDiseases { get; set; }       // Bệnh mãn tính
        public string? Allergies { get; set; }             // Dị ứng
        public string? GeneralNote { get; set; }           // Ghi chú tổng quan
        public bool? IsActive { get; set; }                // Trạng thái hoạt động
    }
}
