using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolMedicalManagement.Models.Response
{
    public class SupplyUserResponse
    {
        public int SupplyId { get; set; }
        public string SupplyName { get; set; } = string.Empty;
        public int? QuantityUsed { get; set; }
        public string? Note { get; set; }
    }
}
