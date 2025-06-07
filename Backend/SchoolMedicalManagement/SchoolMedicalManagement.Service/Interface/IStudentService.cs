using SchoolMedicalManagement.Models.Request;
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
            Task<BaseResponse> GetStudentById(int studentId);
            Task<BaseResponse> CreateStudent(CreateStudentRequest request);
            Task<bool> UpdateStudent(UpdateStudentRequest request);
            Task<bool> DeleteStudent(int studentId);
            Task<BaseResponse> GetHealthProfileByStudentId(GetHealthProfileRequest request);
            
    }
    }
