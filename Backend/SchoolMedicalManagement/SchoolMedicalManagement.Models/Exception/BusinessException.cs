using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;


namespace SchoolMedicalManagement.Models.Exceptions
{
    public class BusinessException : Exception
    {
        public int StatusCode { get; }

        public BusinessException(string message, int statusCode = StatusCodes.Status400BadRequest)
            : base(message ?? string.Empty) 
        {
            StatusCode = statusCode;
        }
    }
}
