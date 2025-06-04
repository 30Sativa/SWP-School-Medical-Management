using Microsoft.IdentityModel.Tokens;
using SchoolMedicalManagement.Models.Entity;
using SchoolMedicalManagement.Models.Request;
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

            var response = new StudentManagementResponse()
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

        //Create student
        public async Task<StudentManagementResponse> CreateStudent(CreateStudentRequest request)
        {
            var student = new Student
            {
                FullName = request.FullName,
                DateOfBirth = request.DateOfBirth,
                Gender = request.Gender,
                Class = request.Class,
                ParentId = request.ParentId
            };

            var createdStudent = await _studentReposioty.CreateStudent(student);

            if (createdStudent == null)
            {
                return null; // Xử lí trường hợp tạo hs ko thành công
            }

            return new StudentManagementResponse
            {
                StudentId = createdStudent.StudentId,
                FullName = createdStudent.FullName,
                DateOfBirth = createdStudent.DateOfBirth,
                Gender = createdStudent.Gender,
                Class = createdStudent.Class
            };
        }

        //Update student
        //sau khi suy nghĩ lại thì hàm update chỉ nên trả về bool thui nhỉ
        public async Task<bool> UpdateStudent(UpdateStudentRequest request)
        {
            // Tìm coi học sinh cần update có trong db không
            var studentToUpdate = await _studentReposioty.GetStudentById(request.StudentId);
            if (studentToUpdate == null) return false;


            studentToUpdate.FullName = string.IsNullOrEmpty(request.FullName) ? studentToUpdate.FullName : request.FullName;
            studentToUpdate.DateOfBirth = request.DateOfBirth == default ? studentToUpdate.DateOfBirth : request.DateOfBirth;
            studentToUpdate.Gender = string.IsNullOrEmpty(request.Gender) ? studentToUpdate.Gender : request.Gender;
            studentToUpdate.Class = string.IsNullOrEmpty(request.Class) ? studentToUpdate.Class : request.Class;
            studentToUpdate.ParentId = request.ParentId ?? studentToUpdate.ParentId;// cái này đang phân vân ko biết nên cho đổi phụ huynh ko :))
            

            return await _studentReposioty.SaveChangesAsync();
        }

        //Delete student
        public async Task<bool> DeleteStudent(int studentId)
        {
            return await _studentReposioty.DeleteStudent(studentId);
        }
    }
}