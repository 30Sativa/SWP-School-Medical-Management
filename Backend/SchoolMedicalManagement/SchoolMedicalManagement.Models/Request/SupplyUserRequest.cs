using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolMedicalManagement.Models.Request
{
    public class SupplyUserRequest
    {
        public int SupplyId { get; set; }
        public int QuantityUsed { get; set; }
        public string? Note { get; set; }
    }
}
