using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SchoolMedicalManagement.Models.Entity;

namespace SchoolMedicalManagement.Models.Request
{
    public class CreateMedicalEventRequest
    {
        public int StudentId { get; set; }
        public int EventTypeId { get; set; }
        public string Description { get; set; }
        public DateTime EventDate { get; set; }
        public int SeverityId { get; set; }
        public string Location { get; set; }
        public string Notes { get; set; }
        public Guid HandledByUserId { get; set; }

        public List<HandleRecordRequest> SuppliesUsed { get; set; } = new();
    }

    public class HandleRecordRequest
    {
        [Required]

        public int SupplyId { get; set; }
        [Range(1, int.MaxValue, ErrorMessage = "QuantityUsed phải lớn hơn 0")]
        public int QuantityUsed { get; set; }
        public string? Note { get; set; }
    }
}
