using SchoolMedicalManagement.Models.Response;
using SchoolMedicalManagement.Repository.Repository;
using SchoolMedicalManagement.Service.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolMedicalManagement.Service.Implement
{
    public class StudentService : IStudentService
    {
        private readonly StudentRepository _studentReposioty;

        public StudentService(StudentRepository studentRepository)
        {
            _studentReposioty = studentRepository;
        }

        //Get student by id
        public async Task<StudentManagementResponse> GetStudentById(int studentId)
        {
            var student = await _studentReposioty.GetStudentById(studentId);

            if (student == null)
            {
                return null;
            }

            var response =  new StudentManagementResponse()
            {
                StudentId = student.StudentId,
                FullName = student.FullName,
                DateOfBirth = student.DateOfBirth,
                Gender = student.Gender,
                Class = student.Class,
                Parent = student.Parent?.Username
            };
            return response;
        }

        //Get list student
        public async Task<List<StudentListResponse>> GetStudentList()
        {
            var students = await _studentReposioty.GetAllStudent();
            List<StudentListResponse> studentListResponses = new List<StudentListResponse>();
            foreach (var student in students)
            {
                studentListResponses.Add(new StudentListResponse()
                {
                    StudentId = student.StudentId,
                    FullName = student.FullName,
                    DateOfBirth = student.DateOfBirth,
                    Gender = student.Gender,
                    Class = student.Class,
                    Parent = student.Parent?.Username
                });
            }
            return studentListResponses;
        }
    }
}
