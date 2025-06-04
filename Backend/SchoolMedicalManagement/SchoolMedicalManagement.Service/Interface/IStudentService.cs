using SchoolMedicalManagement.Models.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolMedicalManagement.Service.Interface
{
    public interface IStudentService
    {
        Task<List<StudentListResponse>> GetStudentList();
        Task<StudentManagementResponse> GetStudentById(int studentId);
    }
}
