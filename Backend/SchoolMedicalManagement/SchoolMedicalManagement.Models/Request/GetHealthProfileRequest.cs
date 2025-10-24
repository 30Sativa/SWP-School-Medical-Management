using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolMedicalManagement.Models.Request
{
    public class GetHealthProfileRequest
    {
        //public int ProfileId { get; set; }
        [Required]
        public int StudentId { get; set; }
    }
}
