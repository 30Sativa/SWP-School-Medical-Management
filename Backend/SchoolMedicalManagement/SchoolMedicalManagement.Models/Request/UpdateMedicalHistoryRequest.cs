using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolMedicalManagement.Models.Request
{
    public class UpdateMedicalHistoryRequest : CreateMedicalHistoryRequest
    {
        public int HistoryId { get; set; }
    }
}
